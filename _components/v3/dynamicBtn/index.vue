<template>
  <div>
    <q-btn
      v-if="btnProps?.props?.vIf != undefined ? btnProps?.props?.vIf : true"
      v-bind="{...defaultProps, ...(btnProps?.props || {})}"
      @click="btnProps?.action ? btnProps?.action() : null"
      :loading="btnProps?.props?.loading || false"
    >
      <q-badge v-if="btnProps?.badge?.vIf" v-bind="{...(btnProps?.badge || {}) }" />
      <q-tooltip v-if="btnProps?.label" v-model="showTooltip" class="tw-z-10" v-bind="{...(btnProps?.tooltip || {})}">{{ btnProps?.tooltip?.label ?? btnProps?.label }}</q-tooltip>
    </q-btn>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'src/modules/qsite/_components/v3/dynamicBtn/controller'

export default defineComponent({
  props: {
    btnProps: { default: null },
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
