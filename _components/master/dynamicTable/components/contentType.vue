<template>
  <!--cell content-->
  <div>
    <!-- custom component -->  
    <component 
      v-if="component"
      v-show="!isLoading" 
      :is="component" 
      :col="col"
      :row="row"
      :data="tableData"
    />
    <!-- default content -->
    <div v-if="!isComponent" v-show="!isLoading"  class="ellipsis-2-lines" style="max-width: 300px;" v-html="tableData"></div>
    <q-skeleton v-if="isLoading" animated type="text" />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dynamicTable/controllers/contentTypeController'

export default defineComponent({
  props: {
    col: {default: []},
    row: {default: []}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>