import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, useSlots} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";
import { store, i18n, clone, alert } from 'src/plugins/utils';

export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    //crudComponent: ref('crudComponent')
  }

  const slots = useSlots()

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    columns: [],
    rows: [],
    requestParams: {},
    showModal: false,
    expiresIn: null,
    /* dynamicFilter */
    showDynamicFilterModal: false,
    dynamicFilterValues: {},
    dynamicFilterSummary: {},
    /* dynamicFilter */
    pagination: {
      page: 1,
      rowsNumber: '',
      rowsPerPage: 10,
      descending: true,
      maxPages: 6
      //sortBy: 'desc',
    },
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    hasTopTableSlot: computed(() => !!slots['top-table']),
    hasPermission: computed(() =>
    {
      //Default permission
      return {
        create: props.listConfig?.permission ? store.hasAccess(`${props.listConfig?.permission}.create`) : true,
        index: props.listConfig?.permission ? store.hasAccess(`${props.listConfig?.permission}.index`) : true,
        edit: props.listConfig?.permission ? store.hasAccess(`${props.listConfig?.permission}.edit`) : true,
        destroy: props.listConfig?.permission ? store.hasAccess(`${props.listConfig?.permission}.destroy`) : true
      };
    }),
    beforeUpdate: computed(() => props.listConfig?.beforeUpdate || null),
    title: computed(() => props?.listConfig?.read?.title || ''),
    help: computed(() => props?.listConfig?.read?.help || false),
    actions: computed(() => props?.listConfig?.actions || false),
    tableProps: computed(() => props?.listConfig?.read?.tableProps || null),
    tableActions: computed(() =>
    {
      //Default response
      let response = []
      //Add search action
      if (props.listConfig.read?.search !== false) response.push('search')
      //Add create action
      if (computeds.hasPermission.value['create'])
      {
       response.push('new')
      }
      // extras for page action
      if (props.listConfig?.extraActions?.length > 0) response.push(...props.listConfig.extraActions)
      return response.filter((item) => !item.vIfAction)
    }),

    dynamicFilter: computed(() =>
    {
      if (props.listConfig.read?.filters)
      {
        if (Object.keys(props.listConfig.read?.filters).length > 0)
        {
          return props.listConfig.read?.filters;
        }
      }
      return {};
    }),

    systemName: computed(() =>
    {
      return props.listConfig.read?.systemName || props.listConfig?.permission || props.listConfig?.entityName;
    }),
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    async init ()
    {
      await methods.setColumns()

      if (!state.dynamicFilterValues)
      {
        methods.getData({pagination: {page: 1}}, true)
      }
    },
    search (val)
    {
      if (val)
      {
        state.requestParams.filter = {search: val}
      } else {
        state.requestParams = {...props.listConfig.read.requestParams}
      }
      state.requestParams['filter'] = {...state.requestParams['filter'], ...state.dynamicFilterValues}
      state.pagination.page = 1
      state.pagination.take = 10
      methods.getData()
    },
    setColumns ()
    {
      state.columns = props.listConfig.read.columns
      //set isEditable
      state.columns.forEach(col =>
      {
        col.align = col?.align || 'center'
        col['isEditable'] = computeds.hasPermission.value['edit'] && col.hasOwnProperty('dynamicField')
      });
    },

    setPagination (pagination)
    {
      if(pagination.rowsPerPage != state.pagination.rowsPerPage ) pagination.page = 1 //resets pagination
      state.pagination = pagination
      methods.getData()
    },

    async getData (pagination = false, refresh = false)
    {
      state.loading = true;

      //Instancre the requestParams
      state.requestParams = {
        order: {
          field: (state.pagination?.sortBy || 'id'),
          way: (state.pagination.descending != undefined) ? (state.pagination.descending ? 'desc' : 'asc') : 'desc'
        },
        ...(props.listConfig.read.requestParams ?? {}),
        filter: {
          ...state.requestParams?.filter || {},
          ...props.listConfig.read?.requestParams?.filter || {},
          ...state.dynamicFilterValues
        },
        page: pagination?.page || state.pagination.page,
        take: state.pagination.rowsPerPage
      };

      //Request data
      services.getData(props.listConfig.apiRoute, refresh, state.requestParams).then((response) =>
      {
        state.expiresIn = response?.expiresIn;
        if (response?.data)
        {
          state.rows = response.data
          state.loading = false

          state.pagination.page = clone(response?.meta.page.currentPage);
          state.pagination.rowsNumber = clone(response?.meta.page.total);
          state.pagination.rowsPerPage = clone(state.pagination.rowsPerPage);
          //state.pagination.sortBy = clone(state.pagination.sortBy);
          state.pagination.descending = clone(state.pagination.descending);
          emit('dataLoaded', response.data)
        }
      }).catch(error =>
      {
        state.loading = false
        alert.error({message: i18n.tr('isite.cms.message.errorRequest'), pos: 'bottom'})
      })
    },
    updateRow (row)
    {
      const foundIndex = state.rows.findIndex(r => r.id == row.id);
      state.rows[foundIndex]['isLoading'] = true

      services.updateItem(props.listConfig.apiRoute, row.id, row).then((response) =>
      {
        if (response?.data)
        {
          const requestParams = props.listConfig.read?.requestParams ? {...props.listConfig.read.requestParams} : {}

          services.showItem(props.listConfig.apiRoute, row.id, {
            params: requestParams,
            refresh: true
          }).then((response) =>
          {
            state.rows[foundIndex] = response.data
            state.rows[foundIndex]['isLoading'] = false
            emit('updatedRow', response.data)
          })
        }
      })
    },
    async reloadRow (row)
    {
      const foundIndex = state.rows.findIndex(r => r.id == row.id);
      state.rows[foundIndex]['isLoading'] = true

      const requestParams = props.listConfig.read?.requestParams ? {...props.listConfig.read.requestParams} : {}

      await services.showItem(props.listConfig.apiRoute, row.id, {
        params: requestParams,
        refresh: true
      }).then((response) =>
      {
        state.rows[foundIndex] = response.data
        state.rows[foundIndex]['isLoading'] = false
      })
      return state.rows[foundIndex]

    },
    toggleDynamicFilterModal ()
    {
      state.showDynamicFilterModal = !state.showDynamicFilterModal;
    },
    updateFilter (key, value)
    {
      state.dynamicFilterValues[key] = value;
    },
    updateDynamicFilterValues (filters)
    {
      state.dynamicFilterValues = filters;
      state.requestParams.filter = state.dynamicFilterValues
      state.pagination.page = 1
      methods.getData();
    },
    }

  // Mounted
  onMounted(() =>
  {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
