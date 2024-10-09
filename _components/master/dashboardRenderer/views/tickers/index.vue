<script setup>
import { defineProps, onMounted, ref, toRefs } from 'vue'
import ticker from './components/ticker'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  tickers: {
    type: Array,
    default: () => []
  },
  filters: {
    required: false,
    type: Object,
    default: () => ({})
  },
  className: {
    type: String,
    default: '',
  },
})

const { tickers, filters, data } = toRefs(props)

const tickersData = ref([])

onMounted(async () => {
  tickersData.value = tickers.value
  if (data.value.length > 0) {
    tickersData.value = data.value
  }
})
</script>
<template>
  <div 
    class="tw-grid tw-grid-flow-col tw-gap-8 tw-overflow-x-auto tw-pb-2" 
    :class="className"
  >
    <template v-for="(ticker, index) in tickersData" :key="index">
      <ticker 
        :apiRoute="ticker?.apiRoute" 
        :permission="ticker?.permission" 
        :filters="filters" 
        :data="ticker"
      />
    </template>
  </div>
</template>