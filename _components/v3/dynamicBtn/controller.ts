import {computed, reactive, toRefs} from "vue";

export default function controller(props: any, emit: any) {
  // States
  const state = reactive({
    defaultProps: {},
    showTooltip: false
    // Key: Default Value
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
  }

  return {...(toRefs(state)), ...computeds, ...methods}
}
