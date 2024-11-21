<template>
  <div
    class="q-py-sm"
  >
    <div class="row col-12 row justify-between" style="min-height: 24px;">
        <div class="text-weight-bold text-subtitle2">{{ col.label }}:</div>
        <q-btn
          v-if="isColEditable"
          text-color="blue-grey"
          icon="fa-light fa-pencil"
          size="xs"
          flat
          round
        />
    </div>
    <div class="row col-12">
      <span class=" text-body2">{{ col.value }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    col: { default: null },
    row: { default: null },
  },
  computed: {
    isColEditable() {
      return this.col?.dynamicField && !this.row?.isLoading
    }
  }
})
</script>
<style lang="scss"></style>
