import {
    ref,
    watch,
    reactive,
    computed,
} from 'vue';

export default function useSuperModal(props, emit) {
    const show = ref(false);
    const multiActions: any = computed(() => props.multiActions);
    watch(
        () => props.modelValue,
        (newValue, oldValue) => {
            if (newValue !== oldValue) {
                show.value = newValue;
            }
        }
    );

    watch(
        show,
        (newValue, oldValue) => {
            if (newValue !== oldValue) {
                emit('update:modelValue', newValue);
            }
        }
    );

    const actionBtnProps = reactive({
        rounded: true,
        unelevated: true,
        noCaps: true,
        class: 'btn-small',
    });

    const masterModalWidthSize = computed(() => ({
        '--modal-width-size': props.modalWidthSize
    }));

    return {
        show,
        actionBtnProps,
        masterModalWidthSize,
        multiActions,
    };
}
