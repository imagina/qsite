<template>
  <div>
    <div v-if="folderList.length > 0">
      <draggable
        :list="folderList"
        class="
            tw-grid tw-grid-cols-1
            md:tw-grid-cols-2
            xl:tw-grid-cols-3
            tw-overflow-hidden
            group-list-report
            tw-pb-8
        "
        :animation="300"
        ghostClass="ghost"
        handle=".folder-title-drag"
        @change="saveOrderFolders"
        item-key="id"
      >
        <template #item="{ element }">
          <folder
            :key="element.id"
            :folder="element"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import reportList from './reportList.vue';
import folder from './folderList.vue';
import foldersStore from './store/foldersStore.js';
import { cache } from 'src/plugins/utils';

export default {
  props: {
    folderList: {
      type: Array,
      default: () => [],
    },
    apiRouteOrderFolders: {
      type: String,
      default:() => null,
    },
  },
  data() {
    return {
      dragReport: false,
    };
  },
  components: {
    draggable,
    reportList,
    folder,
  },
  methods: {
    async saveOrderFolders() {
      try {
        if(!this.apiRouteOrderFolders) return;
        await foldersStore().saveOrderFolders(this.apiRouteOrderFolders, this.folderList);
        await cache.restore(config('app.saveCache.refresh'))//Reset cache
      } catch (error) {
        console.error(error)
      }
    },
  },
};
</script>

<style>
.list-report-menu > .q-item {
  @apply tw-px-4 !important;
}
.list-report-menu > .q-item .q-item__section--avatar {
  @apply tw-pr-0 !important;
  min-width: 30px !important;
}
.list-report-menu > .q-item .q-icon {
  color: var(--q-primary);
}
.group-list-report {
  @apply tw--mx-4;
}
.group-list-report .q-item__section--side > .q-icon {
  @apply tw-text-sm;
  color: var(--q-primary);
}
.group-list-report .q-expansion-item__container > .q-item {
  @apply tw-pr-5 tw-py-0 tw-rounded-xl;
  box-shadow: 0px 16px 24px rgb(3 27 102 / 6%), 0px 2px 6px rgb(3 27 102 / 4%),
    0px 0px 1px rgb(3 27 102 / 4%);
}
.group-list-report
  .q-expansion-item--expanded
  > .q-expansion-item__container
  > .q-item {
  @apply tw-rounded-b-none !important;
}
.group-list-report .q-item__section--avatar {
  min-width: 40px;
}
.group-list-report .q-item__section--avatar .q-icon {
  color: #8a98c3;
}
</style>
