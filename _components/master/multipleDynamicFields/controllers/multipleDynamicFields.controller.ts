import { ref, computed, onMounted, watch } from "vue";
import reateEmptyObjectFromFields from '@imagina/qsite/_components/master/multipleDynamicFields/helpers/reateEmptyObjectFromFields.helper'

export default function multipleDynamicFieldsController(props: any, emit: any) {
    const valueMultiple = computed(() => props.value);
    const fieldProps: any = computed(() => props.fieldProps);
    const defaultField = computed(() => props.fieldProps.fields);
    const fields: any = ref([]);
    const maxQuantity = computed(() => fields.value.length === (fieldProps.value?.maxQuantity || 5))
    function add(): void {
        const fromFields = reateEmptyObjectFromFields(defaultField.value);
        if(maxQuantity.value) return;
        fields.value.push(fromFields);
    }
    function deleteItem(index: number): void {
        fields.value.splice(index, 1);
    }

    onMounted(() => {
        const fromFields = reateEmptyObjectFromFields(defaultField.value)
        if(valueMultiple.value.length > 0) {
            fields.value = valueMultiple;  
        } else {
          fields.value.push(fromFields);
        }
        
    });
    watch(fields.value, (newField, oldField): void => {
        if(newField) {
            emit("input", fields.value);
        }
    }, { deep: true });
    return {
        fields,
        fieldProps,
        defaultField,
        add,
        deleteItem,
        maxQuantity,
    };
}