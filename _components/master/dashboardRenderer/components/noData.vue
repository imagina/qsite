<script setup>
import { i18n } from 'src/plugins/utils.ts'
</script>
<template>
  <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
    <i class="fa-solid fa-folder-open tw-text-7xl tw-text-gray-300"></i>
    <p class="tw-text-base tw-font-bold tw-mt-4 tw-text-gray-500">
      {{ i18n.tr('isite.cms.message.notFound') }}
    </p>
  </div>
</template>