<template>
  <div id="notFoundComponent" class="text-center">
    <q-icon name="fas fa-user-lock" color="grey-7" size="80px"/>
    <p class="text-faded">{{ labelText }}<strong>(401)</strong></p>
    <q-btn color="primary" style="width:200px;" @click="$helper.openExternalURL($store.state.qsiteApp.baseUrl, false)"
           v-if="showButton" :label="buttonText" rounded unelevated/>
  </div>
</template>

<script>
export default {
  name: 'Error401',
  props: {
    showButton: {default: true},
    routeName: {default: 'app.home'},
    label: {default: false},
    buttonLabel: {default: false},
  },
  computed: {
    labelText() {
      return this.label || `${this.$tr('isite.cms.message.notAuthorized')}...`
    },
    buttonText() {
      return this.buttonLabel || this.$tr('isite.cms.message.backToSite')
    }
  }
}
</script>

<style lang="scss">
</style>
