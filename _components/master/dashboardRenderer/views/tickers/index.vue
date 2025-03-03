<script setup>
import { defineProps, onMounted, ref, toRefs } from 'vue'
import tickerChildren from './components/ticker'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  tickers: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: '',
  },
})

const { tickers, data } = toRefs(props)

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
    class="
      tw-whitespace-normal 
      scrollbar
      tw-overflow-x-auto
      md:tw-overflow-x-hidden
      md:hover:tw-overflow-x-auto
      hover:tw-pb-2
      tw--mb-2
      tw-h-[108px]
    " 
    :class="className"
  >
    <div class="tw-inline-flex tw-flex-nowrap tw-gap-8">
      <template v-for="(ticker, index) in tickersData" :key="index">
        <tickerChildren
          :apiRoute="ticker?.apiRoute" 
          :permission="ticker?.permission"
          :valueHidden="ticker?.valueHidden"
          :data="ticker"
        />
      </template>
    </div>
  </div>
</template>
<style scoped>
.scrollbar::-webkit-scrollbar {
  height: 6px;
}
</style>