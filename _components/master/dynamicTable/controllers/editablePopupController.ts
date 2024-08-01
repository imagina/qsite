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
    runBeforeUpdate(scope){
      const tempRow = {...props.row}
      tempRow[props.col.name] = scope.value
      
        if(props.beforeUpdate){        
          props.beforeUpdate(tempRow).then((response) => {ç
            scope.set
            console.warn('solved', response)                      
          }).catch(error => {
            
            console.log('run no update')
            console.log(error)
            return false
          })
        }
      emit('updateRow', tempRow)
      return true
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
