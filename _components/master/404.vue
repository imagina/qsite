<template>
  <div id="notFoundComponent" class="text-center">
    <q-icon name="fa-light fa-plug-circle-xmark" color="grey-7" size="100px"/>
    <p class="text-faded">{{labelText}}<strong>(404)</strong></p>
    <q-btn color="primary" style="width:200px;" @click="$router.push({name : routeName})"
           v-if="showButton" :label="buttonText" rounded unelevated/>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    props: {
      showButton: {default: true},
      routeName: {default: 'app.home'},
      label: {default: false},
      buttonLabel: {default: false},
    },
    computed: {
      labelText() {
        return this.label || `${this.$tr('isite.cms.message.notFound')}...`
      },
      buttonText() {
        return this.buttonLabel || this.$tr('isite.cms.message.goToHome')
      }
    }
  }
</script>

<style lang="scss">
</style>
