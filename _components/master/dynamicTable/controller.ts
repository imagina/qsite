import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'


export default function controller(props, emit) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }
  

  // States
  const state = reactive({
    // Key: Default Value    
    paginationModel: {
      page: 1,
      rowsNumber: null,
      rowsPerPage: 10,
      descending: true,
      maxPages: 6
    }    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})    
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}   
    init(){
      state.paginationModel = props.pagination
    },
    isColActions(col){
      return col.name == 'actions'
    },
    isColEditable(col, row){
      return col?.dynamicField && !row?.isLoading
    },
    onClick(col, row){
      if(col?.onClick) col.onClick(col.value, row)
    },    
    getCellClass(col, row){
      return (col?.dynamicField || col?.onClick) && !row?.isLoading ? 'cursor-pointer' : ''
    },
    filterActions(actions, row){
      return actions.filter((action) => {
        if(action?.vIf == undefined) return action
        if ((typeof action?.vIf == 'function') && action.vIf(row)) return action
      })
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
   watch(props, (newField, oldField): void => {
     state.paginationModel = newField.pagination
  
   }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
