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
    isColId(col){
      return col.name == 'id'
    },
    isColTitle(col){
      return col.name == 'title'
    },
    isColActions(col){
      return col.name == 'actions'
    },
    isColMainimage(col){
      return col.name == 'mainImage'
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
    addDefaultContentType(col){
      if(!col.contentType && !methods.isColTitle(col)){

        col.contentType = (row) => {

          if (typeof col?.dynamicField == 'function') {
            const result = col.dynamicField(row)
            col.isEditable = result.vIf
          }

          return {
            template: 'cardField',
            props: {
              col,
              row
            }
          }
        }
      }
      return col
    },
    getMainImage(col, item) {
      let response = "";
      /*checks and returns  if col.field exist*/
      if(_.has(item, col.field)) response = `background-image: url('${_.get(item, col.field)}')`
      return response;
    },
    showAction(action, row){
      if(action?.vIf != undefined){
        if (typeof action.vIf == 'function') return action.vIf(row)
        return action.vIf
      }
      return true
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
