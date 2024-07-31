import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";


export default function controller(props, emit) {  

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    dynamicModel: null
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    checkBeforeUpdate(val){
      if(props.beforeUpdate){
        props.beforeUpdate(val)
      }
    }
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
