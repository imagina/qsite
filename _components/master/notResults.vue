<template>
  <div id="notResult" :class="`text-center text-${color}`">
    <q-icon name="fal fa-box-open" :color="color" size="20px" class="q-mr-sm"/>
    <label v-html="label || $tr('isite.cms.message.searchNotFound')"></label>
  </div>
</template>

<script>
  export default {
    name: 'notResult',
    props: {
      label: {default: false},
      color : {default : 'grey-6'}
    }
  }
</script>

<style lang="scss">
</style>
