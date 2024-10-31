<script lang="ts">
import { defineComponent } from 'vue'
import VChart from 'vue-echarts'
import cardContainer from '../../components/cardContainer.vue'
import noData from '../../components/noData.vue'
import controller from './controller'

export default defineComponent({
  props: {
    apiRoute: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      default: {},
    },
    className: {
      type: String,
      default: '',
    },
    header: {
      type: Object,
      default: null,
    },
    toolbox: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    cardContainer,
    noData,
    VChart,
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<template>
  <card-container 
    :header="options?.header || header" 
    :className="className" 
    :isLoading="isLoading"
    :isEmpty="!thereAreData"
    :toolbox="{ tools, features: { download: true } }"
    @reloadData="reloadData"
  >
    <section 
      v-show="isLoading" 
      class="tw-flex tw-items-end tw-justify-center tw-gap-6"
    >
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-24" animated type="rect" />
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-32" animated type="rect" />
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-52" animated type="rect" />
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-44" animated type="rect" />
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-48" animated type="rect" />
      <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-72" animated type="rect" />
    </section>
    <no-data v-if="!thereAreData && !isLoading" class="tw-h-72" />
    <v-chart 
      v-show="thereAreData && !isLoading"
      ref="chartRef"
      class="tw-w-full tw-h-[337px]" 
      :option="options" 
      autoresize 
    />
  </card-container>
</template>