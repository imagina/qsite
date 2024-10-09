import { computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef } from 'vue';


export default function controller (props, emit)
{

  // Refs
  const refs = {
    popupProxy: ref()
  };

  // States
  const state = reactive({
    // Key: Default Value
    responseValue: null,
    loading: false
  });

  // Computed
  const computeds = {
    //Get the dynamicField to edit
    dynamicField: computed(() =>
    {
      let field = props.col.dynamicField ?? null;
      // Validate if field is a function and format it
      if (typeof field == 'function') field = field(props.row);
      // Return field
      return field ? { name: props.col.name, maxWidth: '300px', ...field } : null;
    }),
    // Validate if edit is enable
    canEdit: computed(() =>
    {
      if (!computeds.dynamicField.value || !props.col.isEditable) return false;
      return true;
    })
  };

  // Methods
  const methods = {
    //Instance the default response value
    setInitialValue ()
    {
      if (computeds.canEdit.value)
      {
        //Get the scope
        const scope = props.row[props.col.field || props.col.name];
        const dynamicField = computeds.dynamicField.value;
        //Instance the initial response value
        if (dynamicField.type == 'select' && !dynamicField.props?.multiple)
        {
          state.responseValue = scope.id;
        } else state.responseValue = scope;
      }
    },
    // methodKey: () => {}
    async updateRow ()
    {
      state.loading = true;
      //Instance tmpRow with new value
      let tmpRow = {
        ...props.row,
        [computeds.dynamicField.value.name]: state.responseValue
      };
      //Emit the updateRow
      if (props.beforeUpdate)
      {
        await props.beforeUpdate({ val: state.responseValue, row: tmpRow })
          .then(val =>
          {
            state.loading = false;
            refs.popupProxy.value.hide();
            emit('updateRow', tmpRow);
          }).catch((val) => state.loading = false);
      } else emit('updateRow', tmpRow);
    }
  };

  // Mounted
  onMounted(() =>
  {
    methods.setInitialValue();
  });

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
