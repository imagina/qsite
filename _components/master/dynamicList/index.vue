<template>
  <div id="componentCrudIndex">
    <!--Content-->
    <div id="backend-page">      
      <!--Page Actions-->      
      <div class="q-my-md">        
        <page-actions 
          v-if="loadPageActions"
          :title="title" 
          :help="help"
          @refresh="getData(true)"          
        />
        <!--table title-->
        <div v-if="!loadPageActions" :class="`row text-primary text-weight-bold ellipsis title-content items-center`">
          <label id="titleCrudTable" v-if="title">{{ title }}</label>          
        </div>
      </div>
      <slot name="top-table" >
      </slot>
      <div class="row">        
        <dynamicTable
          :columns="columns"
          :rows="rows"
          :actions="actions"
          :loading="loading"
          :beforeUpdate="beforeUpdate"
          ref="dynamicTable"
          @updateRow="(row) => updateRow(row)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dynamicList/controller'
import dynamicTable from 'modules/qsite/_components/master/dynamicTable'

export default defineComponent({
  props: {
    tableData: {
      apiRoute: { default: ''},
      title: { default: ''},
      columns: {default: []},
      actions: {default: []},
      permission: {default: ''}, 
      requestParams: {default: {}}, 
      filters: { default: {}},
      help: { default: {}},
      pageActions: {default: true},
      beforeUpdate: {        
        type: Function,
        default: () => {}
      }
    }
  },
  components: {
    dynamicTable
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#componentCrudIndex {
  .btn-menu-offline {
    @apply tw-bg-yellow-400;
  }

  #backend-page {
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

  #dialogFilters {
    min-height: max-content !important;
  }

  #titleCrudTable {
    font-size: 20px;
  }
}
</style>
