<template>
  <div id="dynamic-table">
    <q-table      
      :title="title"
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="name"
      class="stick-table"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          
          <!---right click --->
          <contextMenu
            :actions="actions"
            :action-data="props.row"
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
    loading: { default: false},
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
  #dynamic-table {
    .q-table__top, .q-table__middle, .q-table__bottom {
      border-radius: $custom-radius;
      //box-shadow: $custom-box-shadow;
    }

    th {
      color: $blue-grey;
      font-weight: bold;
      font-size: 13px !important;
    }

    //text-align: left !important;

    td {
      color: #222222;
    }

    .q-table__card {
      background-color: transparent !important;
      box-shadow: none !important;
    }

    .q-table th,
    .q-table td {
      border-color: $grey-2;
    }

    .q-table__middle {
      border-radius: $custom-radius;
      box-shadow: $custom-box-shadow;
      background-color: white;
    }

    .q-table__top {
      margin-bottom: 16px !important;
      padding: 12px 16px !important;
    }

    .q-table__middle {
      min-height: 0 !important;
      margin: 0 !important;
    }

    .q-table__bottom {
      border-top: 1px solid transparent !important;
      margin-top: 16px !important;
      padding: 12px 16px !important;
    }

    .stick-table {
      th:last-child, td:last-child {
        background-color: white;
        position: sticky;
        right: 0;
        z-index: 1;
      }

      th:first-child, td:first-child {
        background-color: white;
        position: sticky;
        left: 0;
        z-index: 1;
      }
    }

    .default-card-grid {
      .default-card-grid_item-image {
        width: 100%;
        height: 140px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: $custom-radius-items;
        margin: 10px 0 10px 0;
      }
    }

    #crudPaginationComponent {
      .q-btn {
        height: 30px;
        width: 30px;
        min-width: 30px !important;
      }
    }

    #collapseTable {
      padding: 0;
      background-color: $grey-1;

      #contentRelationData {
        min-height: 90px;
        position: relative;
        width: 100%;
      }

      .q-table, th:last-child, th:first-child, td:last-child, td:first-child {
        background-color: $grey-1;
      }

      .q-table__middle {
        padding: 0;
        box-shadow: none;
        border-radius: 0;
      }
    }

    #selectedRows {
      border-radius: $custom-radius;
    }  
}
</style>
