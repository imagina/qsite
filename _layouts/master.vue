<template>
  <q-layout id="layoutMaster" view="hHh LpR lFf">
    <!-- HEADER -->
    <header-component v-if="appState.loadPage"/>

    <!-- Drawers -->
    <drawers-component/>

    <!-- ROUTER VIEW -->
    <q-page-container>
      <router-view v-if="appState.loadPage" class="layout-padding"/>
    </q-page-container>

    <!-- FOOTER -->
    <footer-componen v-if="appState.loadPage"/>
  </q-layout>
</template>

<script>
/*Components*/
import headerComponent from '@imagina/qsite/_components/master/header'
import drawersComponent from '@imagina/qsite/_components/master/drawers'
import footerComponen from '@imagina/qsite/_components/master/footer'

export default {
  meta() {
    let routetitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
    if (this.$route.meta && this.$route.meta.headerTitle) routetitle = this.$route.meta.headerTitle
    let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
    let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
    let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

    return {
      title: `${this.$tr(routetitle)} | ${siteName}`,
      meta: {
        description: {name: 'description', content: siteDescription || siteName},
      },
      link: [{rel: 'icon', href: iconHref, id: 'icon'}],
    }
  },
  components: {headerComponent, drawersComponent, footerComponen},
  mounted() {
    this.$nextTick(async function () {
    })
  },
  data() {
    return {}
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp
    }
  },
  methods: {
    async refreshPage(done) {
      await this.$store.dispatch('qsiteApp/REFRESH_PAGE')
      done()
    }
  }
}
</script>

<style lang="stylus">
#layoutMaster
  background-color #eef5f9
</style>
