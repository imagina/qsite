import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";
import { store, i18n } from 'src/plugins/utils';
import { permission } from "process";
import { before } from "node:test";

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
    loadPageActions: false, 
    
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
      if(props.tableData?.read.filters){
        state.loadPageActions = true
      }
    },
    setColumns(){
      state.columns = props.tableData.read.columns      
      //set isEditable
      state.columns.forEach(col => {
        col['isEditable'] = computeds.hasPermission.value['edit'] && col.hasOwnProperty('dynamicField')
      });      
    },
    
    async getData(refresh = false){
      state.loading = true
      services.getData(props.tableData.apiRoute, refresh, props.tableData.read.requestParams ).then((response) => {
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
