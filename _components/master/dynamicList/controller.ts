import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";
import { store, i18n } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    dynamicTable: ref()
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    columns: [],
    rows: [],
    loadPageActions: false
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    getColumns: computed(() => state.columns),
    hasPermission: computed(() => {
      //Default permission
      return  {
        create: props?.permission ? store.hasAccess(`${props.permission}.create`) : true,
        index: props?.permission ? store.hasAccess(`${props.permission}.index`) : true,
        edit: props?.permission ? store.hasAccess(`${props.permission}.edit`) : true,
        destroy: props?.permission ? store.hasAccess(`${props.permission}.destroy`) : true
      };
    })
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}
    async init(){
      await methods.setPageActions()
      await methods.setColumns()
      methods.getData(true)
    },
    setPageActions(){
      props.pageActions
      if(props?.filters && props?.pageActions){
        state.loadPageActions = true
      }
    },
    setColumns(){
      state.columns = props.columns      
      //set isEditable
      state.columns.forEach(col => {
        col['isEditable'] = computeds.hasPermission.value['edit'] && col.hasOwnProperty('dynamicField')
      });      
    },
    
    async getData(refresh = false){
      state.loading = true
      services.getData(props.apiRoute, refresh, props.requestParams ).then((response) => {
        if(response?.data){
          state.rows = response.data
          state.loading = false
          emit('dataLoaded', response.data)
        }
      })
    },
    updateRow(row){
      state.loading = true
      services.updateItem(props.apiRoute, row.id, row).then((response) => {
        if(response?.data){
          state.loading = false          
          const foundIndex = state.rows.findIndex(r => r.id == row.id);
          //state.rows[foundIndex] 
          Object.keys(state.rows[foundIndex]).forEach((key) => {
            if(response.data[key]){
              state.rows[foundIndex][key] = response.data[key]
            }
          })
          
          emit('updatedRow', response.data)
        }
      })
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
