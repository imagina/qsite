<template>
  <div class="dashboard">
    <template v-for="quickCard in views">
      <component 
        :is="quickCard.component" 
        v-bind="quickCard" 
        :filters="filters"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    configName: {
      type: String,
      default: null
    },
    dynamicFilterValues: {
      required: false,
      type: Object,
      default: () => ({})
    },
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, 1fr);
  gap: 20px;
}
</style>
