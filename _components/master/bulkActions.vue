<template>
    <master-modal 
        v-model="showModal" 
        icon="fa-solid fa-boxes-packing"
        width="380px" 
        :loading="loading"
        :title="modalTitle" 
        @hide="reset()" 
        @show="init()" 
        custom-position
    >
        <div v-if="!loading">
            <!--Generate new report-->
            <div 
                class="col-12" 
                v-if="allowCreation"
            >
                <!--Title-->
                <span class="text-blue-grey">
                    <b>{{ $tr('isite.cms.label.bulkAction') }}</b>
                </span>
                <h4
                    class="tw-mb-2 tw-mt-3.5 tw-text-sm"
                    v-html="$tr('isite.cms.messages.dispatchBulkAction', { pageTitle })"
                />
                <!--Actions-->
                <div class="text-right">
                    <!--Extra filter fields-->
                    <q-form 
                        autocorrect="off" 
                        autocomplete="off" 
                        ref="formContent" 
                        class="row tw-w-full"
                        @submit="newReport()" 
                        @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
                    > 
                        <!--Fields-->
                        <dynamic-field
                            class="col-12"
                            :field="field" 
                            v-model="selectedAction"
                        />
                        <div class="text-right col-12">
                            <q-btn 
                                v-if="!warning"
                                :disable="processing"
                                label="Dispatch" 
                                color="secondary" 
                                rounded unelevated 
                                size="13px"
                                padding="xs sm"
                                :loading="processing"
                                type="submit" 
                            >
                                <template v-slot:loading>
                                    <i class="fa-solid fa-spinner-third fa-spin"></i>
                                </template>
                            </q-btn>
                        </div>
                    </q-form>
                </div>
            </div>

            <section v-if="warning" class="tw-w-full tw-mt-4">
                <!-- Warnings -->
                <div
                    class="
                        tw-max-h-64
                        tw-overflow-auto
                        tw-mb-3.5
                    "
                >
                    <div class="tw-gap-3 tw-flex tw-flex-col">
                        <!-- Alert -->
                        <div
                            v-for="warn in warnings"
                            class="
                                alert
                                tw-flex 
                                tw-item-center
                                tw-border
                                tw-border-solid
                                tw-rounded-xl
                                tw-p-3
                            "
                        >
                            <!--Icon-->
                            <q-icon
                                name='fa-solid fa-triangle-exclamation'
                                color='warning'
                                size="20px"
                            />
                            <!--message-->
                            <p class="tw-ml-2">
                                {{ warn.message }}
                            </p>
                        </div>
                    </div>
                </div>
                    
                <div class="tw-w-full tw-flex tw-justify-end">
                    <q-btn
                        :label="$tr('isite.cms.label.continue')"
                        color="secondary" 
                        rounded 
                        unelevated 
                        size="13px"
                        class="tw-mr-3.5"
                        :loading="processing"
                        :disable="processing"
                        @click="newReport(true)"
                    />

                    <q-btn 
                        :label="$tr('isite.cms.label.cancel')"
                        rounded 
                        unelevated
                        size="13px"
                        class="tw-bg-gray-200 tw-text-gray-700"
                        @click="warning = false"
                    >
                        <template v-slot:loading>
                            <i class="fa-solid fa-spinner-third fa-spin"></i>
                        </template>
                    </q-btn>
                </div>
            </section>

            <section class="tw-w-full tw-mt-8">
                <h4 class="tw-font-medium">Logs</h4>
                <!-- card-class="bg-amber-5 text-brown"
                table-class="text-grey-8" -->
                <q-table
                    table-header-class="tw-bg-gray-100"
                    :data="log"
                    :columns="columns"
                    row-key="id"
                    flat
                    style="height: 350px"
                    virtual-scroll
                    :pagination="initialPagination"
                >
                    <template v-slot:header="props">
                        <q-tr :props="props" class="tw-bg-gray-100">
                            <q-th
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                <b class="tw-text-gray-500 tw-text-sm">
                                    {{ col.label }}
                                </b>
                            </q-th>
                        </q-tr>
                    </template>
                    <template v-slot:body-cell-icon="props">
                        <q-td :props="props">
                            <q-icon 
                                :name="props.row.icon.name" 
                                :color="props.row.icon.color" 
                                size="16px"
                            />
                        </q-td>
                    </template>
                </q-table>
            </section>
        </div>
    </master-modal>
  </template>
<script lang="ts">
import Vue, { 
    ref, 
    onMounted, 
    nextTick, 
    computed, 
    getCurrentInstance, 
    toRefs 
} from 'vue'

export default {
    beforeDestroy() {
        this.$root.$off('export.data.refresh')
        this.$eventBus.$off('isite.export.ready')
    },
    props: {
        exportItem: {
            type: Boolean, 
            default: false
        }
    },
    setup(props, { expose, emit }) {
        const loading = ref(false)
        const processing = ref(false)
        const bulkActions = ref(false)
        const paramsItem = ref({})
        const showModal = ref(false)
        const filters = ref({})
        const selectedAction = ref('')
        const warnings = ref([])
        const log = ref([])
        const status = { 
            1: {
                label: 'Pending',
                icon: {
                    name: 'fa-solid fa-clock',
                    color: 'warning'
                },
            },
            2: {
                label: 'In progress',
                icon: {
                    name: 'fa-duotone fa-spinner-third fa-spin',
                    color: 'primary'
                }
            },
            3: {
                label: 'Failed',
                icon: {
                    name: 'fa-solid fa-circle-exclamation',
                    color: 'negative'
                }
            },
            4: {
                label: 'Success',
                icon: {
                    name: 'fa-solid fa-circle-check',
                    color: 'positive'
                }
            }
        }
        const columns = [
            { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
            { 
                name: 'action', 
                label: 'Action', 
                align: 'left', 
                field: 'action', 
                sortable: true, 
            },
            { name: 'createdAt', label: 'Date', align: 'left', field: 'createdAt', sortable: true },
            { 
                name: 'statusId', 
                label: 'Status', 
                align: 'left', 
                field: 'statusId', 
                sortable: true,
                format: (val) => status[val].label,
                style: 'width: 64px'
            },
            { 
                name: 'icon', 
                label: '', 
                align: 'center', 
                field: 'statusId',
                format: (val) => status[val].icon,
                style: 'padding: 0; width: 20px' 
            },
        ]
        const initialPagination = {
            sortBy: 'id',
            descending: true,
            rowsPerPage: 10
        }
        const proxy = getCurrentInstance().proxy;

        const { exportItem, dynamicFilterValues } = toRefs(props)

         //Get export config
         const getExportConfig = async () => {
            try {
                bulkActions.value = false;//Reset bulkActions
                const routeParams = Vue.prototype.$helper.getInfoFromPermission(proxy.$route.meta.permission);
                if (!routeParams) return

                const configName = `${routeParams.module}.config.bulkActions.${routeParams.entity}${exportItem.value ? 'Item' : ''}`;

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
                if (!bulkActions.value) return

                const response = await proxy.$crud.index('apiRoutes.qsite.bulkActions')
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
            //Default response
            let response = `Bulk Actions | `;
            //Extra titel
            if (exportItem.value)
                response += `${Vue.prototype.$tr('isite.cms.label.record')} ID: ${paramsItem.value.item ? paramsItem.value.item.id : ''}`;
            else
                response += pageTitle.value;
            //Response
            return response;
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
                props: {
                    label: "Report/Action Type",
                    options
                }
            }
        })

        //Allow Downloads from custom config
        const allowCreation = computed(() => {
            const allowCreation = bulkActions.value.allowCreation
            return allowCreation !== undefined ? allowCreation : true;
        })

        //Request new report
        const newReport = async (confirm=false) => {
            try {
                processing.value = true;
                //Instance de apiRoute
                const action = bulkActions.value.find(
                    option => option.name === selectedAction.value
                )
                const filter = dynamicFilterValues;
                
                //Request params
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
            } catch (error) {
                processing.value = false;
                console.error(error);
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
            allowCreation,
            log,
            columns,
            newReport,
            showReport,
            reset,
            initialPagination,
            selectedAction,
        }

    }
}
</script>
<style lang="scss" scoped>
    .alert {
        background-color: var(--q-color-warning) + '1A';
        border-color: var(--q-color-warning);
    }

    .q-table tbody tr.q-tr--hoverable:hover {
        background-color: inherit !important;
    }
</style>

