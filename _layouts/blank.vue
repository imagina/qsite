<template>
  <q-layout view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <drawersBlank />
    <q-page-container>
      <router-view/>
    </q-page-container>

    <!---Cropper-->
    <cropper-component ref="cropperComponent"/>
  </q-layout>
</template>

<script>
  import drawersBlank from '@imagina/qsite/_components/admin/theme2/drawersBlank.vue'
  import cropperComponent from "@imagina/qsite/_components/master/cropper.vue";
  export default {
    components: {
      cropperComponent,
      drawersBlank
    },
    meta () {
      let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
      if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle
      let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
      let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
      let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

      return {
        title: `${this.useLegacyStructure ? this.$tr(routeTitle) : routeTitle} | ${siteName}`,
        meta : {
          description: { name: 'description', content: (siteDescription || siteName) },
        },
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    async mounted () {
    },
    computed: {
      useLegacyStructure() {
      const legacyStructure = parseInt(this.$store.getters["qsiteApp/getSettingValueByName"]("isite::legacyStructureCMS") || 0)
      return legacyStructure === 1 || false
    },
    }
  }
</script>
