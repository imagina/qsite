import Vue, { 
    ref, 
    onMounted, 
    nextTick, 
    computed, 
    getCurrentInstance,
} from 'vue'
import { BulkActions } from './models/interfaces/bulkActionsController'
import { status, columns, initialPagination } from './models/defaultModels/constants'

export const bulkActionsController = (props, { expose, emit }) => {
    const loading = ref(false)
    const processing = ref(false)
    const bulkActions = ref<BulkActions[]>([])
    const paramsItem = ref({})
    const showModal = ref(false)
    const filters = ref({})
    const selectedAction = ref('')
    const warnings = ref([])
    const log = ref([])

    const proxy = (getCurrentInstance() as any).proxy;

        //Get export config
        const getExportConfig = async () => {
        try {
            bulkActions.value = [] //Reset bulkActions
            const routeParams = Vue.prototype.$helper.getInfoFromPermission(proxy.$route.meta.permission);
            if (!routeParams) return

            const configName = `${routeParams.module}.config.bulkActions.${routeParams.entity}`;

            //Request Params
            const requestParams = {
                refresh: true,
                params: {
                    filter: {
                        configName
                    }
                }
            };

            //Request
            const response = await proxy.$crud.index('apiRoutes.qsite.configs', requestParams)
            const dataCloned = Vue.prototype.$clone(response.data);
            bulkActions.value = dataCloned;
            emit('update:modelValue', dataCloned);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    //Get log data
    const getLog = async () => {
        try {
            const response = await proxy.$crud.index('apiRoutes.qsite.bulkActions', { refresh: true })
            console.log('getLog response', response)
            const data = response.data
            data.map(item => {
                item.icon = status[item.statusId].icon;
            })
            log.value = response.data;
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    //Get data
    const getData = async () => {
        loading.value = true;
        await getExportConfig();
        await getLog();
        loading.value = false;
    }

    const init = async () => {
        await getData()
    }

    onMounted(() => {
        nextTick(async () => {
            await init()
        })
    })

    //Page title
    const pageTitle = computed(() => {
        const settingValueByName = proxy.$store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0
        const useLegacyStructure = parseInt(settingValueByName)

        return useLegacyStructure ? Vue.prototype.$tr(proxy.$route.meta.title) : proxy.$route.meta.title
    })

    const warning = computed(() => {
        return warnings.value.length > 0
    })

    //Modal export title
    const modalTitle = computed(() => {
        return `Bulk Actions | ${pageTitle.value}`
    })

    const field = computed(() => {
        const options = bulkActions.value?.map(option => ({
            label: option.title,
            value: option.name
        }))

        return {
            name:"actionType",
            value:"postWorkOrders",
            type:"select",
            required: true,
            props: {
                label: "Report/Action Type",
                options
            }
        }
    })

    //Request new report
    const newReport = async (confirm=false) => {
        try {
            processing.value = true;
            const action = bulkActions.value.find(
                option => option.name === selectedAction.value
            )
            
            const requestParams = {
                bulkActionParams : {
                    ...action,
                    confirm
                },
                filter: {
                    ...Vue.prototype.$filter.values
                }
            };

            //Request
            const response = await Vue.prototype.$crud.post(action?.apiRoute, requestParams)
            const data = response.data;
            if (data?.warnings) warnings.value = data.warnings
            await getLog()
            processing.value = false;
            Vue.prototype.$alert.info(
                'Action triggered successfully'
            )
        } catch (error) {
            processing.value = false;
            console.error(error);
            Vue.prototype.$alert.error(
                'Failure to fire action'
            )
        }
    }

    //Show report
    const showReport = (customExport) => {
        showModal.value = true;
    }

    //Reset
    const reset = () => {
        loading.value = false;
        filters.value = {};
    }

    expose({
        showReport,
    })

    return {
        init,
        loading,
        processing,
        warning,
        warnings,
        paramsItem,
        showModal,
        pageTitle,
        modalTitle,
        field,
        log,
        columns,
        newReport,
        showReport,
        reset,
        initialPagination,
        selectedAction,
    }
}