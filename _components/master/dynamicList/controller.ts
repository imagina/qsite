import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";
import { store, i18n } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    loading: false,
    columns: [],
    rows: [],
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
      await methods.setColumns()
      methods.getData(props.apiRoute, true)
    },
    setColumns(){
      state.columns = props.columns      
      //set isEditable
      state.columns.forEach(col => {
        col['isEditable'] = computeds.hasPermission.value['edit']
      });      
    },
    
    async getData(apiRoute, refresh = false, params = {}){
      state.loading = true
      services.getData(apiRoute, refresh, params).then((response) => {
        if(response?.data){
          state.rows = response.data
          state.loading = false
          emit('dataLoaded', response.data)
        }
      })
    },
    updateRow(row){
      console.dir(row)
      services.updateItem(props.apiRoute, row.id, row).then((response) => {
        if(response?.data){
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
