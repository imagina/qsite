import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";
import { store, i18n, clone } from 'src/plugins/utils';
import { permission } from "process";
import { before } from "node:test";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    dynamicTable: ref(),
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    columns: [],
    rows: [],
    loadPageActions: false,
    requestParams: {}, 
    showModal: false
    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    
    hasPermission: computed(() => {
      //Default permission
      return  {
        create: props.tableData?.permission ? store.hasAccess(`${props.tableData?.permission}.create`) : true,
        index: props.tableData?.permission ? store.hasAccess(`${props.tableData?.permission}.index`) : true,
        edit: props.tableData?.permission ? store.hasAccess(`${props.tableData?.permission}.edit`) : true,
        destroy: props.tableData?.permission ? store.hasAccess(`${props.tableData?.permission}.destroy`) : true
      };
    }), 
    beforeUpdate: computed(() => props.tableData?.beforeUpdate || false),
    title: computed(() => props?.tableData?.title || false),
    help: computed(() => props?.tableData?.read.help || false),
    actions: computed(() => props?.tableData?.actions || false),
    tableActions: computed(() => {
      //Default response
      let response = []      
      //Add search action
      if (props.tableData.read.search !== false) response.push('search')
      
      //Add create action
      if (props.tableData.create && computeds.hasPermission.value['create']) {         
       response.push('new')
      }
     
      // extras for page action
      if (props.tableData?.extraActions?.length > 0) response.push(...props.tableData.extraActions)      
      
      return response.filter((item) => !item.vIfAction)      
    }),    
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}
    async init(){
      state.requestParams = {...props.tableData.read.requestParams}
      await methods.setPageActions()
      await methods.setColumns()
      methods.getData(true)
    },
    setPageActions(){      
      if(props.tableData?.read.filters){
        state.loadPageActions = true
      }
    },
    search(val){
      if(val){
        state.requestParams.filter = {search: val} 
      } else {
        state.requestParams = {...props.tableData.read.requestParams}
      }
      methods.getData(true)
    },
    setColumns(){
      state.columns = props.tableData.read.columns      
      //set isEditable
      state.columns.forEach(col => {
        col['isEditable'] = computeds.hasPermission.value['edit'] && col.hasOwnProperty('dynamicField')
      });      
    },
    getRequestParams(){
      const requestParams =  clone({...props.tableData.read.requestParams, ...state.requestParams})      
      if(requestParams.search){
        console.log('delete')
        delete requestParams.filter.date
      }
      return requestParams
    },
    
    async getData(refresh = false){      
      state.loading = true
      services.getData(props.tableData.apiRoute, refresh,  state.requestParams).then((response) => {
        if(response?.data){
          state.rows = response.data
          state.loading = false
          emit('dataLoaded', response.data)
        }
      })
    },
    updateRow(row){
      state.loading = true
      services.updateItem(props.tableData.apiRoute, row.id, row).then((response) => {
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
