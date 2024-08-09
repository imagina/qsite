import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'


export default function controller(props, emit) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    pagination:  ref({
      pagination: {
        page: 1,
        rowsNumber: '',
        rowsPerPage: 10,
        descending: true, 
        //sortBy: 'desc',
  
      },
    }),
  }
  

  // States
  const state = reactive({
    // Key: Default Value
  })

  // Computed
  const computeds = {
    // key: computed(() => {})    

    //pagination: computed(() => props.pagination),

    

    rowsPerPageOption: computed(() => [3, 5, 10, 20, 50, 100, 300, 500]),
    /*
    windowSize: computed(() => props.window >= '500' ? 'desktop' : 'mobile'),
     //showPagination
    showPagination: computed(() => computeds.windowSize == 'desktop' && props.pagination.pagesNumber > 1)
    //showPagination: computed(() => true)
    */
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}    
    countPage(value){
      console.log(props.rows.length)
      const page = value.pagination.page;
      const rowsPerPage = value.pagination.rowsPerPage;
      const showTable = props.rows.length;
      const totalPage = value.pagination.rowsNumber;
      const start = page == 1 ? 1 : page * rowsPerPage - ((rowsPerPage - (page - 1)) <= 0 ? 1 : rowsPerPage - (page - 1));
      const end = showTable < rowsPerPage ? totalPage : page * showTable;
      return `${start} - ${end} ${i18n.tr('isite.cms.label.of')} ${totalPage}`
    },
  }

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
