<template>
  <div class="tw-overflow-y-auto">
    <draggable
      :id="folder.id"
      :list="folder.reportList"
      :animation="300"
      group="data"
      ghost-class="ghostCard"
      drag-class="dragCard"
      filter=".ignoreItem"
      handle=".drag_handle"
      :force-fallback="true"
      @start="dragReports = true"
      @end="dragReports = false"
      :style="{ height: heightDrag }"
      :move="move"
      item-key="id"
    >
      <template #item="{ element }">
        <q-item
          clickable
          class="
            tw-py-3
            tw-border-b
            tw-bg-white
            folder-item
          "
        >
          <q-item-section
            avatar
            class="f-cursor-grab"
          >
            <i class="fa-solid fa-grip-lines drag_handle tw-text-blue-900 tw-text-base"/>
          </q-item-section>
          <q-item-section>
            <q-item-label
              class="tw-font-bold folder-title"
              lines="1"
            >
              <span
                class="tw-cursor-pointer"
                @click="show(element)"
              >
                {{ element.title || element.id }}
              </span>
            </q-item-label>
            <q-item-label caption lines="1">
              {{ element.name || element.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              color="tw-gray-300"
              size="sm"
              icon="fa-light fa-ellipsis-vertical"
            >
              <q-menu>
                <q-list class="list-report-menu" separator>
                  <template
                    v-for="(item, index) in fieldRelationActions"
                    :key="index"
                  >
                    <q-item
                      clickable
                      v-close-popup
                      @click="item.action(element)"
                      v-if="item.vIf !== undefined ? item.vIf : true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          :class="item.icon"
                          color="primary"
                          size="xs"
                        />
                      </q-item-section>
                      <q-item-section>
                        {{  item.label  }}
                      </q-item-section>
                    </q-item>
                  </template>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
      </template>
    </draggable>
    <div
      v-if="!dragReports && folder.reportList.length === 0"
      class="
        tw-py-8
        tw-text-center
        tw-text-5xl"
      >
        <div class="fa-light fa-folder-xmark" />
        <div class="tw-text-base tw-py-2">
         {{ $tr('isite.cms.message.searchNotFound') }}
        </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import foldersStore from './store/foldersStore.js';
import _ from "lodash";

export default {
  components: {
    draggable,
  },
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      toFolderId: null,
    };
  },
  inject: {
    updateRelationData: {
      type: Function,
      default: () => false,
    },
    getFieldRelationActions: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    dragReports: {
      get() {
        return foldersStore().getDragReports();
      },
      set(value) {
        foldersStore().setDragReports(value);
      },
    },
    fieldRelationActions() {
      return this.getFieldRelationActions();
    },
    heightDrag() {
      if(this.dragReports && this.folder.reportList.length === 0) {
        return '100px';
      }
      return this.folder.reportList.length <= 5 ? 'auto' : '300px';
    },
  },
  methods: {
    async move(elm) {
      if (elm.from.id === elm.to.id) return;
      const reportList = elm.draggedContext.element;
      reportList.folderId = Number(elm.to.id);
      this.toFolderId = reportList.folderId;
      await this.updateRelationData(reportList);
    },
    uniqBy(data){
      return _.uniqBy(data, 'id');
    },
    show(report) {
      const action = this.fieldRelationActions.find(item => item.name =='Show');
      if(action) {
        action.action(report)
      }
    },
  },
};
</script>
<style>
.folder-item:hover .folder-title {
  color: var(--q-primary);
}
.folder-item .q-focus-helper:before,
.folder-item .q-focus-helper:after,
.list-report-menu .q-focus-helper:before,
.list-report-menu .q-focus-helper:after {
    background: var(--q-primary) !important;
    opacity: 1 !important;
}
.list-report-menu .q-item {
    min-height: 46px;
}
.folder-item .q-item__section--avatar .q-icon {
  color: var(--q-primary);
  background: var(--q-primary);
  opacity: .5;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
