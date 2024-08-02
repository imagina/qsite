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
    async runBeforeUpdate(scope){      
      let response = true
      const tempRow = {...props.row}
      tempRow[props.col.name] = scope.value
      if(props.beforeUpdate){        
        await props.beforeUpdate(tempRow).then((val) => {
          scope.set()
          emit('updateRow', tempRow)
        }).catch(error => {
          scope.value = scope.initialValue
          response = false
        })
      }
      return response
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
