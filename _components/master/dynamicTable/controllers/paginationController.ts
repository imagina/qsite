import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";
import { i18n, clone, store, router } from 'src/plugins/utils';


export default function controller(props, emit) {  

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    countPage: computed(() => {
      const page = props.pagination.page
      const rowsPerPage = props.pagination.rowsPerPage
      const showTable = props.length > 0
      const totalPage = props.pagination.rowsNumber
      const start = page == 1 ? 1 : page * rowsPerPage - ((rowsPerPage - (page - 1)) <= 0 ? 1 : rowsPerPage - (page - 1))
      const end = showTable < rowsPerPage ? totalPage : page * showTable
      return `${start} - ${end} ${i18n.tr('isite.cms.label.of')} ${totalPage}`
    }),
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init() {    
    },
    
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
