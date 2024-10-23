<script setup>
import { defineProps } from 'vue'

defineProps({
  className: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  header: {
    type: Object,
    default: null,
  },
})
</script>
<template>
  <div 
    class="
      tw-p-5 tw-rounded-2xl 
      tw-bg-white tw-border 
      tw-border-gray-100 
      tw-box-border
    "
    :class="className"
  >
    <div v-if="header" class="tw-mb-10">
      <q-skeleton 
        v-show="isLoading" 
        type="rect" 
        class="tw-w-52 tw-h-8 tw-rounded-2xl" 
      />
      <div class="tw-flex tw-justify-between tw-items-center">
        <section class="tw-flex tw-items-center">
          <i 
            v-if="header?.icon && !isLoading" 
            class="tw-text-xl tw-mr-2" 
            :class="header?.icon"
            :style="{ 
              color: header?.cssStyle?.color,
              fontSize: header?.cssStyle?.fontSize,
            }"
          />
          <h1 
            v-show="!isLoading" 
            class="tw-text-xl tw-font-bold"
            :style="header?.cssStyle"
          >
            {{ header.title }}
          </h1>
        </section>
        <section class="tw-flex tw-items-center tw-gap-3">
          <slot name="toolbox" />
        </section>
      </div>
    </div>
    <slot />
  </div>
</template>