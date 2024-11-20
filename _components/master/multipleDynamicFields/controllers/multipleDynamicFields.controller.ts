import { ref, computed, onMounted, watch, nextTick, provide } from "vue";
import reateEmptyObjectFromFields from 'modules/qsite/_components/master/multipleDynamicFields/helpers/reateEmptyObjectFromFields.helper'
import _ from 'lodash'

export default function multipleDynamicFieldsController(props: any, emit: any) {
    const valueMultiple = ref(props.modelValue || []);
    const fieldProps: any = computed(() => props.fieldProps);
    const defaultField = computed(() => props.fieldProps.fields);
    const fields: any = ref([]);
    const maxQuantity = computed(() => fields.value.length === (fieldProps.value?.maxQuantity || 5))
    const isMinQuantity = computed(() => fields.value.length === (fieldProps.value?.minQuantity || 0))
    const refDraggable: any = ref(null)
    const loading = ref(false);
    function add(): void {
        const fromFields = reateEmptyObjectFromFields(defaultField.value);
        if(maxQuantity.value) return;
        fields.value.push(fromFields);
        //There is a small delay when adding a new item,
        //so a small delay is added for the
        //scroll is executed correctly
        nextTick(() => {
            setTimeout(() => {
                const element = refDraggable.value.$el;
                const height = element.scrollHeight;
                element.scrollTo({
                    top: height,
                    behavior: 'smooth'
                });
            }, 100)
        });
    }
    function deleteItem(index: number): void {
        fields.value.splice(index, 1);
    }
    function summary(item = null, index = null) {
        if (typeof fieldProps.value?.summary === 'function') {
          return fieldProps.value?.summary(item, index);
        } else if (typeof fieldProps.value?.summary === 'string') {
          return fieldProps.value?.summary;
        }
        return null;
    }

    watch(fields, (newField, oldField): void => {
        if(newField) {
            emit('update:modelValue', _.cloneDeep(newField));
        }
    }, { deep: true });

    watch(
      () => props.modelValue,
      (newValue) => {
        // Solo actualizar si el nuevo valor es diferente
        if (!_.isEqual(valueMultiple.value, newValue)) {
          valueMultiple.value = newValue || [];
          updateFieldsFromValueMultiple()
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      init()
    });
    function updateFieldsFromValueMultiple() {
      const fromFields = reateEmptyObjectFromFields(defaultField.value)
      const multipleValue = valueMultiple.value
      if (multipleValue.length > 0) {
        fields.value = multipleValue.map(value => {
          return {
            ...fromFields,
            ...value
          }
        });
      } else {
        const minQuantity = fieldProps.value?.minQuantity || 0;
        Array.from({length: minQuantity}).forEach(() => {
          fields.value.push(fromFields);
        })
      }
    }
    function init() {
      nextTick(() => {
        loading.value = true;
        setTimeout(() => {
          updateFieldsFromValueMultiple();
          loading.value = false;
        }, 2000);
      })
    }
    return {
        fields,
        fieldProps,
        defaultField,
        add,
        deleteItem,
        maxQuantity,
        isMinQuantity,
        refDraggable,
        summary,
        loading,
    };
}
