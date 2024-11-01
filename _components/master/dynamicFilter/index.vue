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
              <div class="text-subtitle1 row items-center text-blue-grey">
                <q-icon name="fa-light fa-filter" size="20px" class="q-mr-sm"/>
                <label class="text-weight-bold">{{ $trp('isite.cms.label.filter', {capitalize: true}) }}</label>
              </div>
              <!-- Close icon -->
              <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer" @click="hideModal()"/>
            </div>
            <q-separator class="tw-h-0.5" />
          </div>

          <!--Filters-->
          <q-scroll-area id="contentMasterField" class="tw-mt-3.5" style="height: calc(100vh - 253px)">              
            <div id="filtersContent" class="q-px-sm" style="height: calc(100vh - 253px)">                  
              <!--Fields-->
              <template v-for="(field, key) in filter.fields" :key="key">
                <dynamic-field  
                  v-model="filterValues[field.name || key]"                      
                  :field="field"
                  class="q-mb-sm"
                  :enableCache="dynamicFieldCache" 
                  @inputReadOnly="data => setInputReadOnly((field.name || key), data)"
                />
              </template>                                 
            </div>
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
    <!-- modal -->

    <!-- show only on mobile -->
    <div class="row col-12 q-pt-md" v-if="!showFilters && hasAppliedFilters">
      <q-btn flat no-caps bordered  @click="showModal()" class="full-width">
        <span class="text-blue-grey">
          <q-icon name="fa-light fa-filter" color="amber" size="18px" />
          &nbsp;
          {{ $tr('isite.cms.label.appliedFilters') }}
        </span>
      </q-btn>
    </div>

    <!-- summary --->
    <div class="col-12 tw-mt-1" v-if="(Object.keys(readValues).length > 0) || (Object.keys(quickFilters).length > 0)" >
      <!-- show only desktop -->
      <div class="text-blue-grey ellipsis text-caption items-center row" v-if="showFilters">
        <q-btn flat no-caps @click="showModal()">
          <q-icon name="fa-light fa-filter" class="q-mr-xs" color="amber" size="18px" />
          <b>{{ $trp('isite.cms.label.filter') }}:</b>
        </q-btn>          
        <template v-for="(item, itemKey) in readValues"  :key="itemKey">
          <q-chip
            v-if="item.label !== ''"
            class="tw-pr-5 tw-bg-gray-100"
            removable 
            text-color="primary"
            @remove="removeReadValue(itemKey)" 
          >
            <span class="text-weight-bold">{{ item.label }}</span>
            &nbsp;
            <span class="tw-mr-1">{{ item.option }}</span>
          </q-chip>
        </template>
      </div>        
      <!-- Hiden Filters -->
      <div v-if="Object.keys(hidenFields).length" v-show="false">
        <dynamic-field v-for="(field, keyField) in hidenFields" :key="keyField" :field="field" :keyField="keyField"/>    
      </div>
      <!-- Quick Filters-->
      <div v-if="Object.keys(quickFilters).length" class="row q-col-gutter-md q-pt-sm" v-show="showFilters">
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
    modelValue: { default: false},
    showOnMobile: { default: false}
  },
  emits:['update:modelValue', 'hideModal', 'showModal', 'update:summary'],
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="stylus">
</style>
