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
          <q-menu
            touch-position
            context-menu
            :transition-duration="100"
          >            
            <p>{{ actions }}</p>
          </q-menu>  

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >  
            <!--cell content-->
            <!--Actions column-->
            <div v-if="col.name == 'actions'">              
              <btn-menu
                :actions="actions"
                :action-data="props.row"
              />  
            </div>
            <div v-else class="ellipsis-2-lines" style="max-width: 300px;" v-html="props.row[col.name]"></div>        
            
            
            
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


export default defineComponent({
  props: {    
    title: { default: ''},
    columns: {default: []},
    rows: {default: []},
    actions: {default: []}
  },
  components: {
    editablePopup
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
