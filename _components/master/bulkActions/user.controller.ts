import Vue, { 
    ref, 
    onMounted, 
    nextTick, 
    computed, 
    getCurrentInstance,
} from 'vue'
import { BulkActions, SelectedAction, Message } from '@imagina/qsite/_components/master/bulkActions/models/interfaces'
import { 
    status, 
    columns, 
    initialPagination, 
    typesOfMessages,
    fieldMassiveActions
} from './models/defaultModels/constants'
import { colors } from 'quasar'

export const bulkActionsController = (props, { expose, emit }) => {
    const loading = ref(false)
    const processing = ref(false)
    const bulkActions = ref<BulkActions[]>([])
    const paramsItem = ref({})
    const showModal = ref(false)
    const selectedAction = ref<SelectedAction | null>(null)
    const optionsForBulkActions = ref<object | undefined>({})
    const optionsForSelectedBulkActions = ref({})
    const messages = ref([])
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
                { refresh: true }
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

    const handleChangeBulkActions = (value: BulkActions) => {
        optionsForBulkActions.value = value?.fields
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
        try {
            processing.value = true;

            const payload = {
                apiRoute: selectedAction.value?.apiRoute,
                title: selectedAction.value?.label,
                name: selectedAction.value?.value,
            }
            
            const requestParams = {
                bulkAction : {
                    ...payload,
                    fields: {
                        ...optionsForSelectedBulkActions.value
                    },
                },
                confirmed,
                filter: {
                    ...Vue.prototype.$filter.values
                }
            };

            //Request
            const response = await Vue.prototype.$crud.post(
                payload?.apiRoute, 
                requestParams
            )
            const data = response.data;
            if (data?.messages) {
                messages.value = prepareMessageObject(data.messages)
            }
            await getLog()
            processing.value = false;
            Vue.prototype.$alert.info(
                Vue.prototype.$tr('isite.cms.messages.actionSuccessfullyDispatched')
            )
        } catch (error) {
            processing.value = false;
            console.error(error);
            Vue.prototype.$alert.error(
                Vue.prototype.$tr('isite.cms.messages.errorDispatchingAction')
            )
        }
    }

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
    }

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
    }
}