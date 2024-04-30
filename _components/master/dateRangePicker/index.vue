<template>      
      <q-input 
        :model-value="`${dateRange?.from} - ${dateRange?.to}`"
        v-bind="fieldProps.field"
      >
        <template v-slot:prepend>
          <q-icon v-if="fieldProps.field.icon"
                    :name="fieldProps.field.icon"
                    size="18px"
                    class="cursor-pointer"
                    color="blue-grey">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateRange" range>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
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
    fieldProps: {}
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
