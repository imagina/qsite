<template>      
  <q-input
    @update:model-value="(value) => updateDateRange(value)"
    :model-value="inputRange"
    v-bind="fieldProps.field"
    :label="label"
    :class="class"
    debounce="600"
    :clearable="true"
  >
    <template v-slot:prepend>
      <q-icon 
        v-if="fieldProps.field.icon"
        :name="fieldProps.field.icon"
        class="cursor-pointer"
        color="blue-grey"
      >            
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <div class="dateRangePickerModal">
            <div class="dateRangePickerSelector">
              <dynamic-field v-model="type" class="q-ma-0 q-pa-0" :field="fieldsConfig.type"/>
            </div>
            <q-date 
              v-model="dateRange" 
              range
              flat
              :mask="mask"
              :subtitle="inputRange"
              color="primary"              
              @update:model-value="(value) => changeType(value)"
            >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
            </q-date>            
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dateRangePicker/controller'

export default defineComponent({
  props: {
    modelValue: {      
      type: null,
      from: null, 
      to: null
    }, 
    fieldProps: {},
    label: '',
    class: '',
  },
  emits:['update:modelValue'],
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
.dateRangePickerModal {
  background-color: #ffffff;
}

.dateRangePickerSelector {
  max-width: 290px;
  padding-top: 16px;
  padding-left: 8px;
  padding-right: 8px;
}
</style>
