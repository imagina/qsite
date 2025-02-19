import { computed, reactive } from 'vue';

interface StateInterface {
  globalFilters: {
    [key: string]: any
  }
}

const state = reactive<StateInterface>({
  globalFilters: {}
})

export default computed(() => ({
  set globalFilters(val) {
    state.globalFilters = val
  },
  get globalFilters() {
    return state.globalFilters
  }
})).value
