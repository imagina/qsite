<template>
  <div id="helpCenterComponent"></div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleHelpSection')
  },
  props: {
    btnProps: {type: Object}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {},
  methods: {
    init() {
      this.$eventBus.$on('toggleHelpSection', (params) => {
        this.handleHelpCenter(params)
      })
    },
    //Handle the call of the help center by section
    handleHelpCenter(params) {
      switch (params.sectionName) {
        case 'faq':
          const hcFaqUrl = this.$store.getters['qsiteApp/getSettingValueByName']('isite::hcFaqUrl')
          this.$helper.openExternalURL(hcFaqUrl)
          break
      }
    }
  }
}
</script>
<style lang="stylus">
</style>
