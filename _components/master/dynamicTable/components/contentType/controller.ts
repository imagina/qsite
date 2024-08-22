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
    data: computed(() => { 
      const data = props.col?.notDeleteHtml ? props.row[props.col.name] : methods.deleteHtml(props.row[props.col.name])
      return props.col?.format ? props.col.format({val: data, col: props.col, row: props.row}) : data
      //return props.col?.format ? props.col.format(props.row[props.col.name]) : props.row[props.col.name]
    }),
    onClick: computed(() => props.col?.onClick ? props.col.onClick : () => {}),
    isComponent: computed(() => props.col?.component || false ),
    isLoading: computed(() => props.row?.isLoading || false),
    showOnLoading: computed(() =>  computeds.isLoading.value && props.col.name != 'id')
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init() {
      methods.loadComponent();
    },
    loadComponent(){
      if(computeds.isComponent.value){        
        state.component = markRaw(props.col.component)
      }
    },
    deleteHtml(data) {
      if (!data) return '';
      return typeof data === 'string' ? data.replace(/<[^>]+>/g, '') : data
    }
    ,
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
