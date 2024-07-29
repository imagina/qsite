<template>
  <div id="pageId">
    <q-table
      flat
      bordered
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort      
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          
          <!---right click --->
          <contextMenu
            :row="props.row"
            :actions="actions"
          />

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          > 
            <!--Actions column-->
            <div v-if="col.name == 'actions'">              
              <btn-menu
                :actions="actions"
                :action-data="props.row"
              />  
            </div>

            <!--cell content-->            
            <div v-else class="ellipsis-2-lines" style="max-width: 300px;" v-html="props.row[col.name]"></div>

            <!---quick click edit popup-->
            <editablePopup 
              :tableProps="props"
              :col="col"
              @updateRow="(value) =>updateRow(value)"
            />            
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dynamicTable/controller'
import editablePopup from 'modules/qsite/_components/master/dynamicTable/components/editablePopup.vue'
import contextMenu from 'modules/qsite/_components/master/dynamicTable/components/contextMenu.vue'


export default defineComponent({
  props: {    
    title: { default: ''},
    columns: {default: []},
    rows: {default: []},
    actions: {default: []}
  },
  components: {
    editablePopup,
    contextMenu
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
