<template>
  <!--cell content-->
  <div>
    <!--custom html content -->
    <div v-if="isContent" v-html="htmlContent"></div>
    
    <!-- custom component -->  
    <component 
      v-if="isComponent && component" 
      :is="component" 
      :col="col"
      :row="row"
      :data="tableData"
    /> 
    
    <!-- default content -->
    <div v-if="!isContent && !isComponent" class="ellipsis-2-lines" style="max-width: 300px;" v-html="tableData"></div>
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