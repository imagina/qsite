import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";


export default function controller(props, emit) {  

  // Refs
  const refs = {
    // refKey: ref(defaultValue)    
  }

  // States
  const state = reactive({
    // Key: Default Value
    dynamicModel: null,    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    isSelectField: computed(() => props.col.dynamicField.type == 'select'), 
    fieldName: computed(() => props.col.dynamicField?.name ? props.col.dynamicField.name : props.col.name) //field to update
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    async runBeforeUpdate(scope){      
      let response = true
      const tempRow = {...props.row}
      
      tempRow[computeds.fieldName.value] = computeds.isSelectField.value ? scope.value.id : scope.value
      
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
