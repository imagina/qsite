<template>      
  <q-input 
    :model-value="`${dateRange?.from} - ${dateRange?.to}`"
    v-bind="fieldProps.field"
    :label="label"
    :class="class"
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
          <div style="padding: 14px;max-width: 360px;">
            <div class="tw-flex tw-flex-row tw-gap-4">
              <div>
                From {{ dateRange?.from }} To {{ dateRange?.to }}
              </div>
              <div>
                <dynamic-field v-model="type" class="q-mb-md" :field="fieldsConfig.type"/>
              </div>
            </div>
            <q-date v-model="dateRange" 
                    range
                    minimal 
                    flat
                    @update:model-value="changeType()"
            >
            
            </q-date>
            <div class="row items-center justify-end"></div>
            <q-btn v-close-popup label="Close" color="primary" flat />
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
