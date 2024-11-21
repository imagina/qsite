<template>
  <div class="q-py-sm">
    <div class="row col-12 row justify-between">
      <div>
        <span class="text-weight-bold text-subtitle2">{{ col.label }}:</span>
      </div>
      <div v-if="isColEditable">
        <i class="fa-light fa-pen"></i>
      </div>
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
