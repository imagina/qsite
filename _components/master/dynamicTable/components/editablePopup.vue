<template>    
    <q-popup-edit
      v-if="col?.isEditable && col?.dynamicField || false"
      v-model="tableProps.row[col.name]"
      v-slot="scope"              
      no-caps
      @update:model-value="(value) => $emit('updateRow', tableProps.row)"
    >    
      <p>Update {{ col.label }} Id: {{tableProps.row.id}} </p>
      <div class="q-py-sm">
        <dynamic-field
          v-model="scope.value"
          :field="col['dynamicField']"
        />
        <div class="row justify-center q-gutter-sm">
          <q-btn
            label="Close"
            no-caps
            unelevated
            rounded            
            @click.stop.prevent="scope.cancel"
          />
          <q-btn
            label="Update"
            no-caps
            unelevated
            rounded
            @click.stop.prevent="scope.set"
            :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
          />
        </div>
      </div>
    </q-popup-edit>            
  </template>
  <script lang="ts">
  import {defineComponent} from 'vue'
  import controller from 'modules/qsite/_components/master/dynamicTable/controllers/editablePopupController'
  
  export default defineComponent({
    props: {    
      tableProps: {type: Object, default: null},    
      col: {type: Object, default: null},
      beforeUpdate: {        
        type: Function,
        default: () => {}
      }
    },
    setup(props, {emit}) {
      return controller(props, emit)
    },
    components: {}
  })
  </script>
  <style lang="scss">
  </style>
  