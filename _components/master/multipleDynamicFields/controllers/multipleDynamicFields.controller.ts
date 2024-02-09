import { ref, computed, onMounted, watch, nextTick } from "vue";
import reateEmptyObjectFromFields from '@imagina/qsite/_components/master/multipleDynamicFields/helpers/reateEmptyObjectFromFields.helper'
import _ from 'lodash'

export default function multipleDynamicFieldsController(props: any, emit: any) {
    const valueMultiple = computed(() => props.value || []);
    const fieldProps: any = computed(() => props.fieldProps);
    const defaultField = computed(() => props.fieldProps.fields);
    const fields: any = ref([]);
    const maxQuantity = computed(() => fields.value.length === (fieldProps.value?.maxQuantity || 5))
    const isMinQuantity = computed(() => fields.value.length === (fieldProps.value?.minQuantity || 0))
    const refDraggable: any = ref(null)

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

    onMounted(() => {
        const fromFields = reateEmptyObjectFromFields(defaultField.value)
        if(valueMultiple.value.length > 0) {
            fields.value = valueMultiple.value;  
        } else {
            const minQuantity = fieldProps.value?.minQuantity || 0;
            Array.from({ length: minQuantity }).forEach(() => {
                fields.value.push(fromFields);
            })
        }
        
    });
    watch(fields, (newField, oldField): void => {
        if(newField) {
            emit("input", _.cloneDeep(newField));
        }
    }, { deep: true });

    return {
        fields,
        fieldProps,
        defaultField,
        add,
        deleteItem,
        maxQuantity,
        isMinQuantity,
        refDraggable
    };
}