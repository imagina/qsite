import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import {debounce} from 'quasar';
import handleGrid from '@imagina/qsite/_components/v3/handleGrid/index.vue';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    refHandleGrid: ref<InstanceType<typeof handleGrid>>(),
  }

  interface StateProps {
    items: any[]
  }

  // States
  const state = reactive<StateProps>({
    items: []
  })

  // Computed
  const computeds = {
    actionButtonProps: computed(() => ({
      icon: 'fa-regular fa-objects-column',
      outline: true,
      round: true,
      color: 'cyan',
      size: '10px'
    }))
  }

  // Methods
  const methods = {
    orderedItems(data) {
      let tmpItems = data
      if (props.orderBy) {
        tmpItems.sort((a, b) => a[props.orderBy] - b[props.orderBy])
      }
      return tmpItems
    },
    updateSortOrder() {
      // Update sort_order based on the new position in the array
      const orderedItems = !props.orderBy ? state.items : state.items.map((item, index) => ({
        ...item,
        [props.orderBy]: index + 1
      }));
      // Emit an event to notify the parent component about the change
      emit('input', orderedItems);
    },
    addItem(currentItem) {
      const index = state.items.findIndex(i => i.id === currentItem.id);
      emit('create', {index, parentId: 0, onCreate: (val) => methods.onCreate(index, val)})
    },
    onCreate(index, newItem) {
      if (index >= 0) {
        const newArray = proxy.$clone(state.items)
        newArray.splice(index + 1, 0, newItem)
        // Insert the new object at the specified position
        state.items = newArray;
      } else {
        state.items.push(newItem)
      }

      methods.updateSortOrder();
    },
    setState(items = null) {
      const data = items ?? props.value
      state.items = methods.orderedItems(data)
      if(refs.refHandleGrid.value) {
        refs.refHandleGrid.value.forEach(ref => {
          proxy.$nextTick(() => {
            ref?.setState()
          })
        })
      }
    },
    //Updated Item
    updateItem(newValue, keySearch = 'id') {
      //Search if exist the item
      const itemIndex = state.items.findIndex(i=> i[keySearch] === newValue.id);

      //If exist replace the item with the new item value
      if(itemIndex >= 0) {
        state.items.splice(itemIndex, 1, newValue)
      }
    },
    //Check if exist key in the element
    verifyKeys(element, key) {
      const arrayKeys = Object.keys(element);
      return arrayKeys.includes(key)
    },
    //Update when change grid
    saveGrid: debounce(() => methods.updateSortOrder(), 1000),
    //Add child in Grid
    addedChildItem(index, parentId, childObj) {
      let response = childObj
      if(response.parentId == 0) {
        response.parentId = parentId
      }

      emit('create', response)
    },
  }

  // Mounted
  onMounted(() => {
    methods.setState()
  })

  // Watch
  // watch(() => props.value, (newField, oldField): void => {
  //   console.warn(">>>>>>>> Watch")
  //   state.items = computeds.orderedItems
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
