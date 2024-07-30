import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

import services from "modules/qsite/_components/master/dynamicList/services";

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
    rows: [],
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init(){
      methods.getData(props.apiRoute, true)
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
