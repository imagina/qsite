<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, GraphChart, MapChart, BarChart, LineChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import service from '../services'
import { eventBus } from 'src/plugins/utils.ts'
import cardContainer from '../components/cardContainer'
import noData from '../components/noData.vue'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components'
import { 
  onMounted, 
  provide, 
  ref, 
  toRefs, 
  watch, 
  onBeforeUnmount, 
  computed 
} from 'vue'

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
  DataZoomComponent,
  GridComponent,
  ToolboxComponent,
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
  header: {
    type: Object,
    default: null,
  },
});

const { apiRoute, filters, data, header } = toRefs(props)

const options = ref({})
const isLoading = ref(true)
const chartRef = ref(null)

const getData = async () => {
  return await service.getQuickCardData(apiRoute.value, filters.value)
}

provide(THEME_KEY, 'light')

const thereAreData = computed(() => (
  options.value?.series && options.value?.series[0]?.data.length
))

onMounted(async () => {
  isLoading.value = true
  if (apiRoute.value) {
    options.value = await getData()
  } else options.value = data.value
  isLoading.value = false

  eventBus.on('crud.data.refresh', async () => {
    isLoading.value = true
    if (apiRoute.value) options.value = await getData()
    isLoading.value = false
  })
})

onBeforeUnmount(() => {
  eventBus.off('crud.data.refresh')
})

watch(filters, async () => {
  isLoading.value = true
  if (apiRoute.value) options.value = await getData()
  isLoading.value = false
})

const downloadChart = () => {
  if (chartRef.value) {
    const chartInstance = chartRef.value.chart
    const title = options.value?.header?.title || header.value?.title
    const nameImage = title.replace(/\s+/g, '-').toLowerCase()
  
    const dataURL = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
      excludeComponents: ['toolbox'],
    })

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${nameImage}.png`
    link.click()
  }
}
</script>
<template>
  <card-container 
    :header="options?.header || header" 
    :className="className" 
    :isLoading="isLoading"
  >
    <template #toolbox>
      <q-btn
        v-show="thereAreData && !isLoading"
        @click="downloadChart" 
        unelevated
        outline
        dense
        size="md" 
        class="
          tw-py-1 
          tw-px-2 
          tw-text-base 
          tw-bg-white 
          tw-rounded-md 
          custom-border-color
        "
      >
        <i class="fa-regular fa-arrow-down-to-line tw-text-neutral-500"></i>
      </q-btn>
    </template>
    <template #default>
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
        class="tw-w-full tw-h-72" 
        :option="options" 
        autoresize 
      />
    </template>
  </card-container>
</template>
<style scoped>
.custom-border-color::before {
  @apply tw-border-neutral-200;
}
</style>