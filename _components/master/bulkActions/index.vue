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
            <div class="col-12">
                <!--Title-->
                <span class="text-blue-grey">
                    <b>{{ $tr('isite.cms.label.newBulkAction') }}</b>
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
                            @input="handleChangeBulkActions"
                            v-model="selectedAction"
                        />
                        <dynamic-field
                            v-if="optionsForBulkActions"
                            v-for="(field, key) in optionsForBulkActions"
                            :key="key"
                            class="col-12"
                            :field="field"
                            v-model="optionsForSelectedBulkActions[key]"
                        />
                        <div class="text-right col-12">
                            <q-btn 
                                v-if="!thereAreMessages"
                                :disable="processing"
                                label="Dispatch" 
                                color="secondary" 
                                rounded unelevated 
                                size="13px"
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

            <section v-if="thereAreMessages" class="tw-w-full tw-mt-4">
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
                            v-for="message in messages"
                            class="
                                tw-flex 
                                tw-item-center
                                tw-rounded-xl
                                tw-p-3
                            "
                            :style="{ backgroundColor: `${message.color}2a`}"
                        >
                            <!--Icon-->
                            <q-icon
                                :name="message.icon"
                                :style="{ color: message.color }"
                                size="20px"
                            />
                            <!--message-->
                            <p class="tw-ml-2" v-html="message.message" />
                        </div>
                    </div>
                </div>
                    
                <div class="tw-w-full tw-flex tw-justify-end">
                    <q-btn
                        :label="$tr('isite.cms.label.confirm')"
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
                        @click="messages = []"
                    >
                        <template v-slot:loading>
                            <i class="fa-solid fa-spinner-third fa-spin"></i>
                        </template>
                    </q-btn>
                </div>
            </section>

            <section class="tw-w-full tw-mt-5">
                <h4 class="tw-font-bold tw-text-sm text-blue-grey tw-mb-3.5">
                    {{ $tr('isite.cms.label.history') }}
                </h4>
                <q-table
                    card-class="tw-rounded-xl"
                    :data="log"
                    :columns="columns"
                    row-key="id"
                    flat
                    virtual-scroll
                    :pagination="initialPagination"
                    separator="none"
                >
                    <template v-slot:header="props">
                        <q-tr 
                            :props="props" 
                            class="tw-bg-gray-100 tw-z-10 tw-sticky tw-top-0"
                        >
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
                                :class="props.row.icon.color"
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
import { bulkActionsController } from './user.controller'

export default {
    emits: ['bulkActionsConfig'],
    setup(props, { expose, emit }) {
        return { ...bulkActionsController(props, { expose, emit }) }
    }
}
</script>
<style>
</style>