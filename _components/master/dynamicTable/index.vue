<template>
  <div id="pageId">
    <p>test</p>
    <q-table
      flat bordered
      title="DynamicTable"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort      
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >  
            <!--cell content-->
            <div class="ellipsis-2-lines" style="max-width: 300px;" v-html="props.row[col.name]"></div>        
            
            <q-popup-edit
              v-if="col?.isEditable || false"
              v-model="props.row[col.name]"
              v-slot="scope"              
              no-caps
              @update:model-value="(value) => updateRow({col: col, row: props.row})"
            >
            <p>Update {{ col.label }} :</p>
            <div class="q-py-sm">
              <dynamic-field v-model="scope.value" :field="col['dynamicField']"/>
              <q-btn
                label="Close"
                no-caps
                flat dense
                @click.stop.prevent="scope.cancel"
              />

              <q-btn
                label="Update"
                no-caps
                flat dense
                @click.stop.prevent="scope.set"
                :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
              />
            </div>
            
            </q-popup-edit>
          </q-td>        
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dynamicTable/controller'

export default defineComponent({
  props: {},
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
