<template>
  <q-layout id="layoutMaster" :view="(appConfig.mode == 'iadmin') ? 'hHh LpR lFf' : 'hhh LpR fff'">
    <!-- HEADER -->
    <header-component v-if="appState.loadPage"/>

    <!-- Drawers -->
    <drawers-component v-if="appState.loadPage"/>

    <!-- ROUTER VIEW -->
    <q-page-container>
      <router-view v-if="appState.loadPage" class="layout-padding"/>
    </q-page-container>

    <!---Cropper-->
    <cropper-component ref="cropperComponent"/>

    <!-- FOOTER -->
    <footer-component v-if="appState.loadPage"/>
  </q-layout>
</template>

<script>
/*Components*/
import headerComponent from '@imagina/qsite/_components/master/header'
import drawersComponent from '@imagina/qsite/_components/master/drawers'
import footerComponent from '@imagina/qsite/_components/master/footer'
import Vue from 'vue'
import notificationPlugin from '@imagina/qnotification/_plugins/notification'
import cropperComponent from '@imagina/qsite/_components/master/cropper'

export default {
  meta() {
    let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
    if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle
    let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
    let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
    let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

    return {
      title: `${this.$tr(routeTitle)} | ${siteName}`,
      meta: {
        description: {name: 'description', content: siteDescription || siteName},
      },
      link: [{rel: 'icon', href: iconHref, id: 'icon'}],
    }
  },
  components: {headerComponent, drawersComponent, footerComponent, cropperComponent},
  mounted() {
    this.$nextTick(async function () {
      this.init()
    })
  },
  data() {
    return {
      appConfig: config('app'),
    }
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp
    }
  },
  methods: {
    init() {
      Vue.prototype.$notification = new notificationPlugin(this.$store)//Echo plugin
    },
    //Refresh page
    async refreshPage(done) {
      await this.$store.dispatch('qsiteApp/REFRESH_PAGE')
      done()
    }
  }
}
</script>

<style lang="stylus">
#layoutMaster
  background-color $custom-accent-color
</style>
