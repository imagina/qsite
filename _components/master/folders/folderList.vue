<template>
  <div>
    <q-card class="tw-shadow-none">
      <q-card-section class="list-report">
        <q-expansion-item
          v-model="folder.isCollapse"
          bordered
          expand-icon-toggle
          class="tw-shadow-lg tw-rounded-xl"
          @show="getRelation"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <i class="fa-solid fa-folder tw-text-base tw-text-blue-900" />
            </q-item-section>
            <q-item-section
              class="
               folder-title-drag
               tw-py-4
               f-cursor-grab"
              @mouseover="showCollapse"
            >
              <q-item-label
                class="
                  tw-text-base
                  tw-font-bold
                  tw-lowercase"
                lines="1"
              >
                <p class="capitalize-first">
                  {{ folder.title || folder.name || folder.id }}
                </p>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center">
                <btn-menu
                  :actions="fieldActions(folder)"
                  :action-data="folder"
                />
              </div>
            </q-item-section>
          </template>
          <q-list
            separator
            class="tw-pt-2 tw-rounded-b-xl"
            v-show="!folder.loading"
          >
            <reportList
              :folder="folder"
            />
          </q-list>
          <div
            v-show="folder.loading"
            class="
              tw-bg-gray-100
              tw-h-32
              tw-flex
              tw-inset-0
              tw-justify-center
              tw-py-8
              tw-rounded-b-md
            "
          >
            <q-spinner color="primary" size="3em" />
          </div>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import reportList from "./reportList";
import foldersStore from "./store/foldersStore.js";
export default {
  components: {
    reportList,
  },
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  inject: {
    getRelationData: {
      type: Function,
      default: () => false,
    },
    fieldActions: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    dragReports() {
      return foldersStore().getDragReports();
    },
  },
  methods: {
    async showCollapse() {
      if (this.dragReports) {
        await this.getRelation();
        this.folder.isCollapse = true;
      }
    },
    async getRelation() {
      if (this.folder.reportList.length === 0) {
        await this.getRelationData(this.folder);
      }
    },
  },
};
</script>
<style>
.f-cursor-grab {
  cursor: grab;
}
.capitalize-first:first-letter {
  text-transform: uppercase;
}
</style>
