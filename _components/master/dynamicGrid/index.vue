<template>
  <div id="dynamic-grid">
    <q-table
      v-bind="tableProps"
      :title="title"
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:pagination="paginationModel"
      hide-pagination
      grid
      :visible-columns="visibleColumns"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-12 col-sm-6 col-lg-4 col-xl-3">
          <q-card class="box default-card-grid">
            <q-card-section>
              <!---right click --->
              <contextMenu
                :v-if="actions"
                :actions="actions"
                :action-data="props.row"
              />             

              <template
                v-for="col in props.cols"
                :key="col.name"
              >
                <!-- mainImage field-->
                <div
                  v-if="isColMainimage(col)"
                  class="default-card-grid_item-image"
                  :style="`${getMainImage(col, props.row)}`">
                </div>

                <!-- id field and actions button-->
                <div class="row justify-between q-py-sm"  v-if="isColId(col)">
                  <contentType                  
                      :col="col"
                      :row="props.row"
                      :val="`ID: ${col.value}`"
                      @click="onClick(col, props.row)"
                  />
                  <btn-menu
                    :actions="actions"
                    :action-data="props.row"
                  />
                </div>
              
                <q-separator v-if="isColId(col)" />              
                <!-- Keep this to allow unique elements-->
                <div
                  v-if="!isColActions(col) && !isColId(col) && !isColMainimage(col)"
                  :class="getCellClass(col, props.row)"
                  @click="onClick(col, props.row)"
                  :key="$uid()"
                >
                  <editablePopup
                    v-if="isColEditable(col, props.row)"
                    :row="props.row"
                    :col="col"
                    :beforeUpdate="beforeUpdate"
                    @updateRow="(row) => $emit('updateRow', row)"
                  />
                  <!-- dynamic content  -->                   
                  <contentType
                    :col="addDefaultContentType(col)"
                    :row="props.row"
                    :val="col.value"
                  />
                </div>
              </template>
            </q-card-section>
            <q-card-actions class="row" v-if="grid?.actions">
                <template
                  v-for="action in grid.actions"
                  :key="action.name"
                >
                  <q-btn
                    v-if="showAction(action, props.row)"
                    v-bind="action"
                    @click="action.action(props.row)"
                    rounded
                    no-caps
                    unelevated
                    class="col"
                  />
                </template>
              </q-card-actions>
            </q-card>
        </div>
      </template>

      <!-- pagination -->
      <template #bottom="props">
        <!--pagination-->
        <master-pagination
          v-model="paginationModel"
          :pagesNumber="props.pagesNumber"
          :isFirstPage="props.isFirstPage"
          :isLastPage="props.isLastPage"
          @update:modelValue="(val) => $emit('onPagination', val)"
        />

      </template>
    </q-table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from 'modules/qsite/_components/master/dynamicGrid/controller';
import editablePopup from 'modules/qsite/_components/master/editablePopup';
import contentType from 'modules/qsite/_components/master/contentType';
import contextMenu from 'modules/qsite/_components/master/contextMenu';
import masterPagination from 'modules/qsite/_components/master/masterPagination';


export default defineComponent({
  props: {
    grid: { default: {}},
    tableProps: { default: null },
    loading: { default: false },
    title: { default: '' },
    columns: { default: [] },
    rows: { default: [] },
    actions: { default: [] },
    pagination: { default: [] },
    beforeUpdate: {
      type: Function,
      default: false
    },
    visibleColumns: { default: [] }
  },
  components: {
    editablePopup,
    contextMenu,
    contentType,
    masterPagination
  },
  setup (props, { emit })
  {
    return controller(props, emit);
  },
  computed: {},
  methods: {}
});
</script>
<style lang="scss">
#dynamic-grid {

  .q-table {
    padding-bottom: 16px;
  }

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

  .sticky-actions {
    background-color: white;
    position: sticky;
    left: 0;
    z-index: 1;
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
