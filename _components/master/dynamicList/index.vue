<template>
  <div id="pageId">
    <dynamicTable 
     :title="title"
     :columns="columns"
     :rows="rows"
     :actions="actions"
    />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
//import controller from 'modules/qsite/_components/v3/demo/controller'
import dynamicTable from 'modules/qsite/_components/master/dynamicTable'

export default defineComponent({
  props: {    
    title: { default: ''},
    columns: {default: []},
    rows: {default: []},
    actions: {default: []}
  },
  components: {
    dynamicTable
  },
  setup(props, {emit}) {
    //return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
