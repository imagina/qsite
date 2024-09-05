import Vue, { 
    ref, 
    onMounted, 
    nextTick, 
    computed, 
    getCurrentInstance,
} from 'vue'
import { BulkActions, Fields, SelectedAction, Message } from '@imagina/qsite/_components/master/bulkActions/models/interfaces'
import { constants } from '@imagina/qsite/_components/master/bulkActions/models/defaultModels/constants'
import { colors } from 'quasar'
import { sendReport } from '@imagina/qsite/_components/master/bulkActions/services/sendReport.service'

export const bulkActionsController = (props, { expose, emit }) => {
    const loading = ref(false)
    const processing = ref(false)
    const bulkActions = ref<BulkActions[]>([])
    const paramsItem = ref({})
    const showModal = ref(false)
    const selectedAction = ref<SelectedAction | null>(null)
    const optionsForBulkActions = ref<Fields | undefined>({})
    const optionsForSelectedBulkActions = ref({})
    const messages = ref([])
    const log = ref([])
    const rowIds = ref<number[]>([]);
    
    const proxy = (getCurrentInstance() as any).proxy;

    const { module, entity } = proxy.$helper.getInfoFromPermission(proxy.$route.meta?.permission)
    const permission = `${module}.${entity}`

    const { 
        status, 
        columns, 
        initialPagination, 
        typesOfMessages,
        fieldMassiveActions
    } = constants(Vue.prototype)

    //Get export config
    const getExportConfig = async () => {
        try {
            bulkActions.value = []
            if (!module || !entity) return

            const configName = `${module}.config.bulkActions.${entity}`;

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
            emit('bulkActionsConfig', Boolean(dataCloned))
            bulkActions.value = dataCloned;
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    //Get log data
    const getLog = async () => {
        try {
            const response = await proxy.$crud.index(
                'apiRoutes.qsite.bulkActions', 
                { 
                    refresh: true, 
                    params: { 
                        filter: { 
                            type: permission 
                        }
                    }
                }
            )
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

    const init = async () => {
        loading.value = true;
        await getExportConfig();
        await getLog();
        loading.value = false;
    }

    const handleChangeBulkActions = (value: BulkActions) => {
        optionsForBulkActions.value = value?.fields
        messages.value = []
    }

    const prepareMessageObject = (messages) => {
        const { getPaletteColor } = colors
        return messages.map((message: Message) => {
            if (typesOfMessages[message.type]) {
                return {
                    ...message,
                    icon: typesOfMessages[message.type].icon,
                    color: getPaletteColor(typesOfMessages[message.type].color)
                }
            }
        })
    }

    //Request new report
    const newReport = async (confirmed=false) => {
        processing.value = true;

        const response = await sendReport(
            confirmed, 
            selectedAction.value, 
            optionsForSelectedBulkActions.value,
            Vue.prototype,
            permission,
            rowIds.value,
        )
        const data = response.data;
        if (data?.messages) {
            messages.value = prepareMessageObject(data.messages)
        }
        if (confirmed) {
            await getLog()
            messages.value = []
            Vue.prototype.$alert.info(
                Vue.prototype.$tr('isite.cms.messages.actionSuccessfullyDispatched')
            )
        }
        
        processing.value = false;
        if(rowIds.value.length > 0) emit('refresh')
    }

    proxy.$eventBus.$on('bulkActionRefresh', async (response) => {
        await getLog()
    })

    //Show report
    const showReport = () => {
        showModal.value = true;
    }

    //Reset
    const reset = () => {
        loading.value = false;
        messages.value = [];
        selectedAction.value = null;
        optionsForSelectedBulkActions.value = {};
        rowIds.value = [];
        proxy.$eventBus.$off('bulkActionRefresh')
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

    const thereAreMessages = computed(() => {
        return messages.value.length > 0
    })

    //Modal export title
    const modalTitle = computed(() => {
        return `Bulk Actions | ${pageTitle.value}`
    })

    const field = computed(() => {
        if (bulkActions.value.length === 0) return fieldMassiveActions

        const filteredBulkActions = bulkActions.value?.filter(option => (
            option?.permission 
                ? Vue.prototype.$auth.hasAccess(option.permission) 
                : true
        ))

        const options = filteredBulkActions.map(option => ({
            label: option.title,
            value: option.name,
            apiRoute: option.apiRoute,
            fields: option?.fields,
        }))

        return {
            ...fieldMassiveActions,
            props: {
                ...fieldMassiveActions.props,
                options
            }
        }
    })

    expose({
        showReport,
    })

    return {
        loading,
        processing,
        thereAreMessages,
        messages,
        paramsItem,
        showModal,
        pageTitle,
        modalTitle,
        field,
        log,
        columns,
        initialPagination,
        selectedAction,
        optionsForBulkActions,
        optionsForSelectedBulkActions,
        init,
        newReport,
        showReport,
        reset,
        handleChangeBulkActions,
        bulkActions,
        rowIds
    }
}