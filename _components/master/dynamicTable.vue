<template>
  <div id="componentCrudIndex">
    <!--Content-->
    <div class="backend-page">
      <!--Data-->
      <div class="relative-position col-12" v-if="success">
        <!--Table-->
        <q-table
          :grid="table.grid"
          :rows="table.data"
          :columns="tableColumns"
          :pagination.sync="table.pagination"
          :rows-per-page-options="rowsPerPageOption"
          @request="getData"
          class="stick-table"
          ref="tableComponent"
          card-container-class="q-col-gutter-md"
        >
          <!--Slot Top-->
          <template slot="top" v-if="showSlotTable.header">
            <!--Page Actions-->
            <page-actions
              :extra-actions="tableActions"
              :excludeActions="params.read.noFilter ? ['filter'] : []"
              :title="
                title || params.read.title ? title || params.read.title : ''
              "
              @search="
                (val) => {
                  table.filter.search = val;
                  getDataTable();
                }
              "
              @new="handlerActionCreate()"
            />
          </template>

          <!--Custom columns-->
          <template v-slot:body-cell="props">
            <!-- actions columns -->
            <q-td v-if="props.col.name == 'actions'" :props="props">
              <btn-menu
                :actions="fieldActions(props)"
                :action-data="props.row"
              />
            </q-td>
            <!-- status columns -->
            <q-td
              v-else-if="
                ['status', 'active'].indexOf(props.col.name) != -1 ||
                props.col.asStatus
              "
              :props="props"
              class="text-left"
            >
              <!--Action-->
              <q-btn-dropdown
                :color="props.value ? 'green' : 'red'"
                flat
                padding="sm none"
                class="text-caption"
                :label="
                  props.value
                    ? $tr('isite.cms.label.enabled')
                    : $tr('isite.cms.label.disabled')
                "
                no-caps
                v-if="permitAction(props.row).edit"
              >
                <!--Message change to-->
                <q-item
                  class="q-pa-sm cursor-pointer"
                  @click.native="updateStatus(props)"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      name="fas fa-pen"
                      class="q-mr-sm"
                      :color="!props.value ? 'green' : 'red'"
                    />
                    {{
                      $tr("isite.cms.message.changeTo", {
                        text: props.value
                          ? $tr("isite.cms.label.disabled")
                          : $tr("isite.cms.label.enabled"),
                      })
                    }}
                  </div>
                </q-item>
              </q-btn-dropdown>
              <!--Label-->
              <label v-else>{{
                props.value
                  ? $tr("isite.cms.label.disabled")
                  : $tr("isite.cms.label.enabled")
              }}</label>
            </q-td>
            <!--Default columns-->
            <q-td v-else :props="props" :title="props.value">
              {{ props.value }}
            </q-td>
          </template>

          <!--Custom cards-->
          <template v-slot:item="props">
            <div :class="`${gridParams.colClass}`">
              <!--Card Component-->
              <component
                v-if="gridParams.component"
                :is="gridParams.component"
                :row="props.row"
                :permit-action="permitAction(props.row)"
                :field-actions="fieldActions(props)"
                @update="params.update.to ? false : $emit('update', props.row)"
                @delete="deleteItem(props.row)"
              />
              <!--Default Card -->
              <q-card
                v-else
                flat
                class="box default-card-grid"
                style="padding-top: 5px"
              >
                <!--item image-->
                <div
                  class="default-card-grid_item-image"
                  v-if="itemImage(props.row)"
                  :style="`background-image: url('${itemImage(props.row)}')`"
                ></div>
                <!--Fields-->
                <q-list dense>
                  <template
                      v-for="col in props.cols"
                      :key="col.name"
                  >
                    <q-item
                      style="padding: 3px 0"
                      v-if="col.name != 'actions'"
                    >
                      <q-item-section>
                        <!--Field name-->
                        <q-item-label class="ellipsis">
                          <div
                            v-if="col.name != 'actions'"
                            class="row justify-between items-center"
                          >
                            <!--Label-->
                            <div>
                              {{ col.label }}
                              {{ col.name == "id" ? col.value : "" }}
                            </div>
                            <!--Actions-->
                            <btn-menu
                              v-if="col.name == 'id'"
                              :actions="fieldActions(props)"
                              :action-data="props.row"
                            />
                          </div>
                          <q-separator
                            v-if="['id'].indexOf(col.name) != -1"
                            class="q-mt-sm"
                          />
                        </q-item-label>
                        <!--Field value-->
                        <q-item-label
                          v-if="col.name != 'id'"
                          class="ellipsis text-grey-6"
                        >
                          <!-- status columns -->
                          <div
                            v-if="
                            ['status', 'active'].includes(col.name) ||
                            col.asStatus
                          "
                            class="text-left"
                          >
                            <q-btn-dropdown
                              :color="col.value ? 'green' : 'red'"
                              flat
                              padding="sm none"
                              :label="
                              col.value
                                ? $tr('isite.cms.label.enabled')
                                : $tr('isite.cms.label.disabled')
                            "
                              class="text-caption"
                              no-caps
                            >
                              <!--Message change to-->
                              <q-item
                                class="q-pa-sm cursor-pointer"
                                v-close-popup
                                @click.native="
                                updateStatus({ ...props, col: col })
                              "
                              >
                                <div class="row items-center">
                                  <q-icon
                                    name="fas fa-pen"
                                    class="q-mr-sm"
                                    :color="!col.value ? 'green' : 'red'"
                                  />
                                  {{
                                    $tr("isite.cms.message.changeTo", {
                                      text: col.value
                                        ? $tr("isite.cms.label.disabled")
                                        : $tr("isite.cms.label.enabled"),
                                    })
                                  }}
                                </div>
                              </q-item>
                            </q-btn-dropdown>
                          </div>
                          <!--Default columns-->
                          <div v-else>{{ col.value }}</div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>
        <!--Loading-->
        <inner-loading :visible="loading" />
      </div>
    </div>
    <!-- Export Component -->
    <master-export v-model="exportParams" ref="exportComponent" export-item />
  </div>
</template><template>
  <div id="componentCrudIndex">
    <!--Content-->
    <div class="backend-page">
      <!--Data-->
      <div class="relative-position col-12" v-if="success">
        <!--Table-->
        <q-table
          :grid="table.grid"
          :rows="table.data"
          :columns="tableColumns"
          :pagination.sync="table.pagination"
          :rows-per-page-options="rowsPerPageOption"
          @request="getData"
          class="stick-table"
          ref="tableComponent"
          card-container-class="q-col-gutter-md"
        >
          <!--Slot Top-->
          <template slot="top" v-if="showSlotTable.header">
            <!--Page Actions-->
            <page-actions
              :extra-actions="tableActions"
              :excludeActions="params.read.noFilter ? ['filter'] : []"
              :title="
                title || params.read.title ? title || params.read.title : ''
              "
              @search="
                (val) => {
                  table.filter.search = val;
                  getDataTable();
                }
              "
              @new="handlerActionCreate()"
            />
          </template>

          <!--Custom columns-->
          <template v-slot:body-cell="props">
            <!-- actions columns -->
            <q-td v-if="props.col.name == 'actions'" :props="props">
              <btn-menu
                :actions="fieldActions(props)"
                :action-data="props.row"
              />
            </q-td>
            <!-- status columns -->
            <q-td
              v-else-if="
                ['status', 'active'].indexOf(props.col.name) != -1 ||
                props.col.asStatus
              "
              :props="props"
              class="text-left"
            >
              <!--Action-->
              <q-btn-dropdown
                :color="props.value ? 'green' : 'red'"
                flat
                padding="sm none"
                class="text-caption"
                :label="
                  props.value
                    ? $tr('isite.cms.label.enabled')
                    : $tr('isite.cms.label.disabled')
                "
                no-caps
                v-if="permitAction(props.row).edit"
              >
                <!--Message change to-->
                <q-item
                  class="q-pa-sm cursor-pointer"
                  @click.native="updateStatus(props)"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      name="fas fa-pen"
                      class="q-mr-sm"
                      :color="!props.value ? 'green' : 'red'"
                    />
                    {{
                      $tr("isite.cms.message.changeTo", {
                        text: props.value
                          ? $tr("isite.cms.label.disabled")
                          : $tr("isite.cms.label.enabled"),
                      })
                    }}
                  </div>
                </q-item>
              </q-btn-dropdown>
              <!--Label-->
              <label v-else>{{
                props.value
                  ? $tr("isite.cms.label.disabled")
                  : $tr("isite.cms.label.enabled")
              }}</label>
            </q-td>
            <!--Default columns-->
            <q-td v-else :props="props" :title="props.value">
              {{ props.value }}
            </q-td>
          </template>

          <!--Custom cards-->
          <template v-slot:item="props">
            <div :class="`${gridParams.colClass}`">
              <!--Card Component-->
              <component
                v-if="gridParams.component"
                :is="gridParams.component"
                :row="props.row"
                :permit-action="permitAction(props.row)"
                :field-actions="fieldActions(props)"
                @update="params.update.to ? false : $emit('update', props.row)"
                @delete="deleteItem(props.row)"
              />
              <!--Default Card -->
              <q-card
                v-else
                flat
                class="box default-card-grid"
                style="padding-top: 5px"
              >
                <!--item image-->
                <div
                  class="default-card-grid_item-image"
                  v-if="itemImage(props.row)"
                  :style="`background-image: url('${itemImage(props.row)}')`"
                ></div>
                <!--Fields-->
                <q-list dense>
                  <template
                    v-for="col in props.cols"
                    :key="col.name"
                  >
                    <q-item
                      style="padding: 3px 0"
                      v-if="col.name != 'actions'"
                    >
                      <q-item-section>
                        <!--Field name-->
                        <q-item-label class="ellipsis">
                          <div
                            v-if="col.name != 'actions'"
                            class="row justify-between items-center"
                          >
                            <!--Label-->
                            <div>
                              {{ col.label }}
                              {{ col.name == "id" ? col.value : "" }}
                            </div>
                            <!--Actions-->
                            <btn-menu
                              v-if="col.name == 'id'"
                              :actions="fieldActions(props)"
                              :action-data="props.row"
                            />
                          </div>
                          <q-separator
                            v-if="['id'].indexOf(col.name) != -1"
                            class="q-mt-sm"
                          />
                        </q-item-label>
                        <!--Field value-->
                        <q-item-label
                          v-if="col.name != 'id'"
                          class="ellipsis text-grey-6"
                        >
                          <!-- status columns -->
                          <div
                            v-if="
                            ['status', 'active'].includes(col.name) ||
                            col.asStatus
                          "
                            class="text-left"
                          >
                            <q-btn-dropdown
                              :color="col.value ? 'green' : 'red'"
                              flat
                              padding="sm none"
                              :label="
                              col.value
                                ? $tr('isite.cms.label.enabled')
                                : $tr('isite.cms.label.disabled')
                            "
                              class="text-caption"
                              no-caps
                            >
                              <!--Message change to-->
                              <q-item
                                class="q-pa-sm cursor-pointer"
                                v-close-popup
                                @click.native="
                                updateStatus({ ...props, col: col })
                              "
                              >
                                <div class="row items-center">
                                  <q-icon
                                    name="fas fa-pen"
                                    class="q-mr-sm"
                                    :color="!col.value ? 'green' : 'red'"
                                  />
                                  {{
                                    $tr("isite.cms.message.changeTo", {
                                      text: col.value
                                        ? $tr("isite.cms.label.disabled")
                                        : $tr("isite.cms.label.enabled"),
                                    })
                                  }}
                                </div>
                              </q-item>
                            </q-btn-dropdown>
                          </div>
                          <!--Default columns-->
                          <div v-else>{{ col.value }}</div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>
        <!--Loading-->
        <inner-loading :visible="loading" />
      </div>
    </div>
    <!-- Export Component -->
    <master-export v-model="exportParams" ref="exportComponent" export-item />
  </div>
</template>

<script>
export default {
  emits: ['updated']
};
</script>

<style lang="scss">
#componentCrudIndex {
  th {
    color: $blue-grey;
    font-weight: bold;
    font-size: 13px !important;
  }

  // text-align left !important
  td {
    color: #222222;
  }

  .q-table__card {
    background-color: transparent !important;
    box-shadow: none !important;
  }

  .q-table__top, .q-table__middle, .q-table__bottom {
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
}

#dialogFilters {
  min-height: max-content !important;
}
</style>
