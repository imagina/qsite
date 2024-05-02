<template>      
  <q-input
    @update:model-value="(value) => updateDateRange(value)"
    :model-value="inputRange"
    v-bind="fieldProps.field"
    :label="label"
    :class="class"
    debounce="500"
  >
    <template v-slot:prepend>
      <q-icon 
        v-if="fieldProps.field.icon"
        :name="fieldProps.field.icon"
        size="18px"
        class="cursor-pointer"
        color="blue-grey"
      >            
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <div style="padding: 14px;max-width: 300px;">                        
            <div>
              <dynamic-field v-model="type" class="q-ma-0 q-pa-0" :field="fieldsConfig.type"/>
            </div>
            <div>
              {{ inputRange }}              
            </div>
            <q-date 
              v-model="dateRange" 
              range
              minimal 
              flat
              mask="YYYY/MM/DD"
              @update:model-value="(value) => changeType(value)"
            >            
            </q-date>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
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
</style>
