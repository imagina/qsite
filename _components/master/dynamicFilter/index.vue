<template>
  <div id="dynamicFilter">
    <!-- modal -->
    <q-dialog
        id="drawerFilterMaster"
        v-model="model"
        persistent
        maximized
        position="right"
    >
      <q-card style="width: 350px;" v-if="filter">
        <div id="masterFilterComponent" >
          <!-- Header -->
          <div id="masterFilterContent">
            <!--Title-->            
            <div class="row justify-between items-center q-pa-md">
              <div class="text-subtitle1 row items-center">
                <q-icon name="fa-regular fa-filter" color="primary" size="20px" class="q-mr-sm"/>
                <label class="text-primary text-weight-bold">{{ $trp('isite.cms.label.filter', {capitalize: true}) }}</label>
              </div>
              <!-- Close icon -->
              <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
                      @click="hideModal()"/>
            </div>

            <!--Tabs-->
            <q-separator class="q-mb-md" inset/>
            <div id="tabsContent" class="full-width" v-if="false">
              <q-tabs v-model="tabName" dense class="text-grey" active-color="primary" indicator-color="primary"
                      align="justify" v-if="filter.hasValues" :breakpoint="0">
                <q-tab name="tabForm" :label="$tr('isite.cms.label.filter')"/>
              </q-tabs>
            </div>
          </div>

          <!--Content-->
          <q-scroll-area id="contentMasterField" class="q-pm-md" style="height: calc(100vh - 253px)">
            <!--Tab panels-->
            <q-tab-panels v-model="tabName" animated keep-alive>
              <!--Tab form-->
              <q-tab-panel name="tabForm" class="q-pa-none q-px-xs">
                <div id="filtersContent" class="q-px-sm" style="height: calc(100vh - 253px)">
                  <!--Search-->
                  <div v-if="filter.fields && filter.fields.search" class="q-mb-sm">
                    <!--Label-->
                    <div class="full-width text-primary q-mb-xs">
                      <q-icon name="fas fa-search" class="q-mr-xs"/>
                      {{ $tr('isite.cms.label.search', {capitalize: true}) }}
                    </div>
                    <!--Input search-->
                    <dynamic-field v-model="filterValues.search"
                                   :field="{...filter.fields.search, props : {debounce : '0'}}" :enableCache="dynamicFieldCache" />
                  </div>
                  <!--Date-->
                  <div v-if="filter.fields && filter.fields.date" class="q-mb-sm">
                    <!--Fields date-->
                  </div>
                  <!--Pagination-->
                  <div v-if="filter.fields && filter.fields.pagination" class="q-mb-sm">
                    <!--Label-->
                    <div class="full-width text-primary q-mb-xs">
                      <q-icon name="fab fa-buffer" class="q-mr-xs"/>
                      {{ $tr('isite.cms.label.pagination', {capitalize: true}) }}
                    </div>
                    <!--Fields pagination-->
                    <dynamic-field v-for="(fieldPagination, key) in paginationFields" :field="fieldPagination" class="q-mb-sm"
                                   v-model="pagination[fieldPagination.name || key]" :key="key" :enableCache="dynamicFieldCache" />
                  </div>
                  <!--others Fields-->
                  <template v-for="(field, key) in filter.fields" :key="key">
                    <dynamic-field  
                      v-model="filterValues[field.name || key]"
                      v-if="['search','pagination'].indexOf(key) == -1" 
                      class="q-mb-sm" :field="field"
                      :enableCache="dynamicFieldCache" 
                      @inputReadOnly="data => setInputReadOnly((field.name || key), data)"
                    />
                  </template>                                 
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-scroll-area>

          <!--footer -->
          <div class="absolute-bottom text-center bg-white tw-p-3" ref="footerContent">
            <q-separator class="tw-mb-3"/>
            <q-btn :label="$tr('isite.cms.label.search')" unelevated color="primary" no-caps class="tw-w-full" rounded
                   @click="emitValues(true)"/>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <!-- quick filters --->
      <div class="col-12 tw-mt-3" v-if="(Object.keys(readValues).length > 0) || (Object.keys(quickFilters).length > 0)">
      <!--<q-separator class="q-mb-sm"/>-->
        <div class="text-blue-grey ellipsis text-caption items-center row">          
          <q-btn flat no-caps @click="showModal()">
            <q-icon name="fa-light fa-filter" class="q-mr-xs" color="amber" size="18px" />
            <b>{{ $trp('isite.cms.label.filter') }}:</b>
          </q-btn>          
          <template v-for="(item, itemKey) in readValues"  :key="itemKey" >
            <q-chip
              v-if="item.label !== ''"
              removable
              color="primary" 
              text-color="white"
              outline
              square
              @remove="removeReadValue(itemKey)" 
            >
              <span class="text-weight-bold">{{ item.label }}</span>
              &nbsp;
              <span>{{ item.option }}</span>
            </q-chip>
        </template>
        </div>
        <!-- Hiden Filters -->
        <div v-if="Object.keys(hidenFields).length" v-show="false">
          <dynamic-field v-for="(field, keyField) in hidenFields" :key="keyField" :field="field" :keyField="keyField"/>    
        </div>
        <!-- Quick Filters-->
        <div v-if="Object.keys(quickFilters).length" class="row q-col-gutter-md q-pt-sm">
          <dynamic-field v-for="(field, keyField) in quickFilters" :key="keyField" :field="field"
                         v-model="quickFilterValues[keyField]"
                         class="col-12 col-md-4 col-xl-3"
                         @update:modelValue="quickFilterHandler(keyField)"
                         :keyField="keyField"
         />    
        </div>
      </div>
    
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from '@imagina/qsite/_components/master/dynamicFilter/controller'

export default defineComponent({
  props: {    
    systemName: {default: ''},
    filters: {type: Object, default: null},    
    modelValue: { default: false}
  },
  emits:['update:modelValue', 'hideModal', 'showModal'],
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="stylus">
</style>
