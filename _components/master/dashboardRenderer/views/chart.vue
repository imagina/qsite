<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, GraphChart, MapChart, BarChart, LineChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import service from '../services'
import { eventBus } from 'src/plugins/utils.ts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { onMounted, provide, ref, toRefs, watch, nextTick } from 'vue'

use([
  CanvasRenderer,
  PieChart,
  GraphChart,
  MapChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const props = defineProps({
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
});

const { apiRoute, filters, data } = toRefs(props)

const options = ref({})
const isLoading = ref(true)

const getData = async () => {
  return await service.getQuickCardData(apiRoute.value, filters.value)
}

provide(THEME_KEY, 'light')

onMounted(async () => {
  isLoading.value = true
  if (apiRoute.value) {
    options.value = await getData()
  } else options.value = data.value
  isLoading.value = false

  eventBus.on('crud.data.refresh', async () => {
    isLoading.value = true
    if (apiRoute.value) await getData()
    isLoading.value = false
  })
})

watch(filters, async () => {
  isLoading.value = true
  if (apiRoute.value) options.value = await service.getQuickCardData()
  isLoading.value = false
})
</script>
<template>
    <div 
      class="tw-p-5 tw-bg-white tw-rounded-2xl tw-border tw-border-gray-100" 
      :class="className"
    >
      <section v-show="isLoading">
        <q-skeleton type="rect" class="tw-mb-4 tw-w-52 tw-h-9" />
        <div class="tw-flex tw-items-end tw-justify-center tw-gap-6">
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-24" animated type="rect" />
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-32" animated type="rect" />
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-52" animated type="rect" />
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-44" animated type="rect" />
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-48" animated type="rect" />
          <q-skeleton class="tw-rounded-2xl tw-w-16 tw-h-72" animated type="rect" />
        </div>
      </section>
      <v-chart v-show="!isLoading" class="tw-w-full tw-h-96" :option="options" autoresize />
  </div>
</template>