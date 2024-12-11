<template>
  <div
    class="q-py-sm"
  >
    <div class="row col-12 row justify-between" style="min-height: 24px;">
        <div class="text-weight-bold text-subtitle2">
          <span v-if="col?.icon" :class="col.icon"></span>
          {{ col.label }}:
        </div>
    </div>
    <div class="row col-12 q-pl-sm">
      <span class="text-body2" v-html="col.value"></span>
      <q-btn
        v-if="isColEditable"
        text-color="blue-grey"
        icon="fa-light fa-pencil"
        size="xs"
        flat
        round
        class="q-ml-xs"
      />
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
      return this.col?.dynamicField && this.col?.isEditable && !this.row?.isLoading
    }
  }
})
</script>
<style lang="scss"></style>
