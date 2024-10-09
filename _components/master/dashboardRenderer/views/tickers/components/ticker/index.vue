<script lang="ts">
import { defineProps, defineComponent } from 'vue'
import controller from './controller'

export default defineComponent({
    props: {
      apiRoute: {
      type: String,
      default: null
    },
    permission: {
      type: String,
      default: null
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    },
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<template>
  <div
    class="
      tw-flex 
      tw-justify-between
      tw-gap-5
      tw-w-min
      tw-min-w-52
      tw-h-28
      tw-rounded-2xl 
      tw-p-5 
      tw-bg-white
      tw-border
      tw-border-gray-100
    "
  >
    <section 
      class="tw-flex tw-w-full tw-flex-col tw-gap-2" 
      :class="{ 'tw-items-center tw-justify-center': !ticker?.icon }"
    >
      <div>
        <div v-if="ticker.title">
          <q-skeleton v-show="isLoading" class="tw-w-14 tw-mb-1" type="QBadge"/>
          <div 
            v-show="!isLoading" 
            class="tw-text-gray-400 tw-text-xs tw-font-semibold"
            v-html="ticker.title"
          />
        </div>
        <section class="tw-flex tw-gap-2 tw-items-center tw-h-auto">
          <template v-for="(body, index) in ticker.body" :key="index">
            <div class="tw-flex tw-flex-col tw-justify-center" :class="body.className">
              <div v-if="body.title">
                <q-skeleton v-show="isLoading" class="tw-w-14 tw-mb-1" type="QBadge"/>
                <div 
                  v-show="!isLoading" 
                  class="tw-text-gray-400 tw-text-xs tw-font-semibold"
                  v-html="body.title"
                />
              </div>
              <div v-if="body.value">
                <q-skeleton v-show="isLoading" class="tw-w-20 tw-h-7" type="rect"/>
                <div 
                  v-show="!isLoading" 
                  class="tw-text-2xl tw-font-bold" 
                  v-html="body.value" 
                />
              </div>
              <div v-if="body.footer">
                <q-skeleton v-show="isLoading" class="tw-w-24" type="QBadge"/>
                <div 
                  v-show="!isLoading"
                  class="tw-text-xs" 
                  v-html="body.footer" 
                />
              </div>
            </div>
            <hr class="tw-h-12 tw-w-px tw-bg-gray-200 hr-separator tw-mx-5"/>
          </template>
        </section>
      </div>
      <div v-if="ticker.footer">
        <q-skeleton v-show="isLoading" class="tw-w-24" type="QBadge"/>
        <div 
          v-show="!isLoading"
          class="tw-text-xs" 
          v-html="ticker.footer" 
        />
      </div>
    </section>
    <section
      v-if="ticker?.icon"
      class="tw-flex tw-items-center tw-text-2xl"
      :class="ticker.icon?.className"
    >
      <q-skeleton v-show="isLoading" class="tw-w-6 tw-h-6" type="circle"/>
      <i v-show="!isLoading" :class="ticker.icon?.name"></i>
    </section>
  </div>
</template>
<style scoped>
.hr-separator:last-child {
  display: none;
}
</style>