import {reactive,  onMounted, toRefs, nextTick} from "vue";
import { clone } from 'src/plugins/utils'

interface StateProps {
  loading: Boolean,
  count: number,
  actionUrl: any,
  inputsForm: HTMLInputElement[]
}
export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive<StateProps>({
    loading: false,
    count: 0,
    actionUrl: null,
    inputsForm: []
  })

  // Computed
  const computeds = {
  }

  // Methods
  const methods = {
    loadIframe(actionUrl, attributes) {
      state.loading = true
      state.actionUrl = clone(actionUrl)
      let newInputsForm: HTMLInputElement[] = []
      Object.keys(attributes).forEach(field => {
        const input = document.createElement("input");
        input.name = field;
        input.value = JSON.stringify(attributes[field]);
        input.type = "hidden";
        newInputsForm.push(input);
      });
      state.inputsForm = newInputsForm
      //Submit the form
      nextTick(() => {
        const submitFormFunction = Object.getPrototypeOf(document.forms["formPostIframe"]).submit;
        submitFormFunction.call(document.forms["formPostIframe"]);
      })
    },
    handleIframeLoad() {
      //Update the count
      state.count += 1;
      // When the count is 2 mean that iframe is mounted and render all info
      if(state.count === 2) {
        state.loading = false
        //Set the count in 1 because the component is alredy mounted
        state.count = 1
      }
    },
  }

  // Mounted
  onMounted(() => {
    window.addEventListener('message', function (event) {
      const data = event.data
      const elementId = data.elementId
      const iframe = document.getElementById(elementId);
      if (iframe) {
        iframe.style.height = `${data.clientHeight}px`;
      }
    })
  })

  // Watch
  // watch(() => props.value, (newField, oldField): void => {
  //   console.warn(">>>>>>>> Watch")
  //   state.items = computeds.orderedItems
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
