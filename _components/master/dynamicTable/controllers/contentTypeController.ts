import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";


export default function controller(props, emit) {  

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    component: shallowRef()
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    //data to display
    tableData: computed(() => props.col?.format ? props.col.format(props.row[props.col.name]) : props.row[props.col.name]),    
    isContent: computed(() => props.col?.contentType?.content || false),
    // returns the html the data, col and row
    htmlContent: computed(() => computeds.isContent ? props.col?.contentType?.content(props.row[props.col.name], {col: props.col, row: props.row}) : 'no'),
    isComponent: computed(() => props.col?.contentType?.component || false ),
    
    
    
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init() {
      methods.loadComponent();
    },
    loadComponent(){
      if(props.col?.contentType?.component){        
        state.component = markRaw(props.col.contentType.component)
      }
    }
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
