<script lang="ts">
import { defineComponent } from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    apiRoute: {
      type: String,
      default: null,
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: {},
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<template>
  <div 
    class="tw-p-5 tw-rounded-2xl tw-bg-white tw-border tw-border-gray-100"
    :class="className"
  >
    <div v-if="tableData.title">
      <q-skeleton 
        v-show="isLoading" 
        type="rect" 
        class="tw-mb-4 tw-w-52 tw-h-9" 
      />
      <h1 
        v-show="!isLoading" 
        class="tw-text-base tw-font-bold tw-text-center tw-mb-5"
      >
        {{ tableData.title }}
      </h1>
    </div>
    <div class="table tw-overflow-y-auto tw-max-h-[340px]">
      <div 
        v-for="column in tableData.columns"
        :class="{
          'tw-text-center': column?.align === 'center',
          'tw-text-right': column?.align === 'right',
          'tw-text-left': column?.align === 'left',
        }"
      >
      <!-- Header -->
        <section 
          class="
            show-filter-hover 
            tw-h-7 
            tw-text-sm 
            tw-font-semibold 
            tw-sticky 
            tw-top-0 
            tw-bg-white 
            tw-z-10
            tw-mb-3.5
          "
        >
          <q-skeleton v-show="isLoading" type="QChip" class="tw-h-7" />
          <span v-show="!isLoading" :class="column.headerClass">
            {{ formatted(column?.label) }}
          </span>
          <q-btn
            v-if="column?.sortable"
            v-show="!isLoading"
            unelevated 
            size="xs" 
            class="tw-p-1 tw-text-sm tw-bg-neutral-200 tw-hidden tw-ml-2"
            @click="sort(column)"
          >
            <i 
              class="tw-text-sm tw-text-neutral-500" 
              :class="`fa-solid fa-arrow-${column.asc ? 'up' : 'down'}-wide-short`"
            />
          </q-btn>
        </section>
        <!-- Skeleton body -->
        <section 
          v-for="row in tableData.rows" 
          v-show="isLoading" 
          class="tw-flex tw-items-center tw-h-12 tw-my-3.5 tw-mr-3.5" 
        >
          <q-skeleton v-show="isLoading" type="QChip" class="tw-w-full tw-h-12" />
        </section>
        <!-- Body -->
        <section class="tw-flex tw-flex-col tw-gap-3.5">
          <section 
            v-for="row in tableData.rows" 
            v-show="!isLoading"
            class="
              tw-flex 
              tw-items-center 
              tw-h-12
              tw-font-medium
              rows
            " 
            :class="{
              'tw-justify-center': column?.align === 'center',
              'tw-justify-end': column?.align === 'right',
              'tw-justify-start': column?.align === 'left',
            }, pickColor(row), column?.bodyClass"
          >
            <span v-if="!column?.progress">
              {{ formatted(row[column.name]) }}
            </span>
            <q-linear-progress 
              v-if="column?.progress"
              size="22px" 
              :value="row[column.name]" 
              :color="column.progress.barColor"
              class="tw-rounded-full"
            >
              <div 
                v-if="column.progress?.badge" 
                class="absolute-full flex flex-center"
              >
                <q-badge 
                  :color="column.progress.badge.bgColor || 'white'" 
                  :text-color="column.progress.badge?.textColor || 'black'" 
                  :label="formatPercentage(row[column.name])" 
                />
              </div>
            </q-linear-progress>
          </section>
        </section>
      </div>
    </div>
  </div>
</template>
<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.table::-webkit-scrollbar {
  @apply tw-w-1 tw-h-80;
}

.table > div:first-child > section > .rows {
  @apply tw-rounded-l-2xl tw-pl-5;
}

.table > div:last-child > section > .rows {
  @apply tw-rounded-r-2xl tw-pr-5;
}

.show-filter-hover:hover > button {
  display: inline-flex;
}
</style>