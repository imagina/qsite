import { reactive, onMounted, toRefs } from "vue";
import { uid } from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {}

  // States
  const state = reactive({
    uId: uid(),
  })

  // Computed
  const computeds = {}

  // Methods
  const methods = {
    //Return the default actions props by action
    getActionsButtonProps: (action = {}) => ({
      icon: 'fa-regular fa-objects-column',
      outline: true,
      round: true,
      color: 'cyan',
      size: '10px',
      ...action,
      label: ''
    }),
    //Add element
    emitCreateElement(parent = null) {
      emit('create', parent || props.parent)
    },
    //Check if exist key in the element
    verifyKeys(element: any, key: string) {
      const arrayKeys = Object.keys(element);
      return arrayKeys.includes(key)
    }
  }

  // Mounted
  onMounted(() => {})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
