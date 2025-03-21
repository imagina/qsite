import { 
    ref,
    toRefs,
    onMounted, 
    nextTick, 
    computed,
    onBeforeUnmount,
} from 'vue'
import { useRoute } from 'vue-router'
import { 
    BulkActions, 
    Fields, 
    SelectedAction, 
    Message, 
    Filters 
} from './models/interfaces'
import { constants, initialPagination } from './models/defaultModels/constants'
import { prepareMessageObject } from './helpers'
import { sendReport, getDataLog, getConfig } from './services'
import { helper, i18n, store, eventBus } from 'src/plugins/utils'

export const bulkActionsController = (props, { expose, emit }) => {
    const loading = ref(false)
    const processing = ref(false)
    const bulkActions = ref<SelectedAction[]>([])
    const paramsItem = ref({})
    const showModal = ref(false)
    const selectedAction = ref<SelectedAction | null>(null)
    const optionsForBulkActions = ref<Fields | undefined>({})
    const optionsForSelectedBulkActions = ref({})
    const messages = ref<Message[] | []>([])
    const log = ref([])
    const route = useRoute()
    const token = ref('')
    const path = ref('')

    const { dynamicFilterValues, dynamicFilterSummary } = toRefs(props)

    const { module, entity } = helper.getInfoFromPermission(route.meta?.permission) || {}
    const permission = module && entity ? `${module}.${entity}` : null

    const { 
        status, 
        columns, 
        typesOfMessages,
        fieldMassiveActions,
    } = constants()

    const pagination = ref({
        ...initialPagination,
    })

    const helpText = computed(() => {
        return {
            title: 'Bulk Actions',
            description: `
                Need help? See the documentation for more information on Bulk actions.
                ${helper.documentationLink(`/docs/agione/bulk-actions`, token.value)}
            `,
        }
    })

    const filterAndSortBulkActions = (bulkActions: BulkActions[]) => {
        if (!bulkActions) return []
        return bulkActions
            .filter(option => (
                option?.permission 
                    ? store.hasAccess(option.permission) 
                    : true
            ))
            .map(option => ({
                label: option.title,
                value: option.name,
                apiRoute: option.apiRoute,
                fields: option?.fields,
                ...(option?.help && {
                    help: {
                        title: option?.title,
                        description: `
                            ${option?.help?.description}
                            ${helper.documentationLink(option?.help?.url, token.value, false)}
                        `,
                    }
                })
            }))
    }

    //Get export config
    const getExportConfig = async () => {
        bulkActions.value = []
        const data = await getConfig(route, helper)
        emit('bulkActionsConfig', Boolean(data))
        bulkActions.value = filterAndSortBulkActions(data)
    }

    const fetchDataLog = async ({ page=1 } = {}) => {
        const response = await getDataLog(permission, page)
        if (response?.meta) {
			const total = response.meta.page.total
			const pagesNumber = Math.ceil(total / pagination.value.rowsPerPage)
			pagination.value.pagesNumber = pagesNumber
		}
        const data = response?.data
        data.map(item => {
            item.icon = status[item.statusId].icon;
        })
        log.value = data;
    }

    const init = async () => {
        loading.value = true;
        await getExportConfig();
        await fetchDataLog();
        loading.value = false;
    }

    const handleChangeBulkActions = (value: SelectedAction) => {
        selectedAction.value = value
        optionsForBulkActions.value = value?.fields
        messages.value = []
    }

    const updateOptionsBulkActions = ({ key, value }) => {
        optionsForSelectedBulkActions.value[key] = value;
    }

    const generateDescriptionFromFilters = (filters: Filters) => {
        let description = ''

        Object.keys(filters).map(key => {
            const label = filters[key].label 
            const option = filters[key].option

            description += `
                <span class="tw-bg-gray-100 tw-rounded-lg tw-p-1 tw-mr-1">
                    <b>${label}</b> ${option}
                </span>
            `
        })

        return description
    }

    const newReport = async (confirmed=false) => {
        processing.value = true;
        
        try {
            const description = generateDescriptionFromFilters(dynamicFilterSummary.value)
            const response = await sendReport(
                confirmed, 
                selectedAction.value, 
                optionsForSelectedBulkActions.value,
                dynamicFilterValues.value,
                permission,
                description
            )

            const data = response?.data;
            if (data?.messages) {
                messages.value = prepareMessageObject(data.messages, typesOfMessages)
            }
            if (confirmed) {
                await fetchDataLog()
                messages.value = []
            }
        } finally {
            processing.value = false;
        }
    }

    eventBus.on('bulkActionRefresh', async (response) => {
        await fetchDataLog()
    })

    const showReport = () => {
        showModal.value = true;
    }

    const reset = () => {
        loading.value = false;
        messages.value = [];
        selectedAction.value = null;
        optionsForSelectedBulkActions.value = {};
    }

    onMounted(() => {
        nextTick(async () => {
            await init()
            token.value = await helper.getToken()
        })
    })

    onBeforeUnmount(() => {
        eventBus.off('bulkActionRefresh')
    })

    //Page title
    const pageTitle = computed(() => {
        const settingValueByName = store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0
        const useLegacyStructure = parseInt(settingValueByName)

        return useLegacyStructure ? i18n.tr(route.meta.title) : route.meta.title
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

        return {
            ...fieldMassiveActions,
            props: {
                ...fieldMassiveActions.props,
                options: bulkActions.value,
            },
            help: selectedAction.value?.help
        }
    })

    const isDynamicFilterSummary = computed(() => {
        return Object.keys(dynamicFilterSummary.value).length > 0
    })

    expose({ showReport })

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
        pagination,
        selectedAction,
        optionsForBulkActions,
        optionsForSelectedBulkActions,
        i18n,
        dynamicFilterSummary,
        isDynamicFilterSummary,
        helpText,
        init,
        newReport,
        showReport,
        reset,
        handleChangeBulkActions,
        updateOptionsBulkActions,
        fetchDataLog,
    }
}