<template>
  <div id="helpCenterComponent"></div>
</template>
<script>
import { eventBus } from 'src/plugins/utils'

export default {
  beforeUnmount() {
    eventBus.off('toggleHelpSection')
  },
  props: {
    btnProps: {type: Object}
  },
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
      eventBus.on('toggleHelpSection', (params) => {
        this.handleHelpCenter(params)
      })
    },
    //Handle the call of the help center by section
    handleHelpCenter(params) {
      switch (params.sectionName) {
        case 'faq':
          const hcFaqUrl = this.$getSetting('isite::hcFaqUrl')
          this.$helper.openExternalURL(hcFaqUrl)
          break
      }
    }
  }
}
</script>
<style lang="scss">
</style>
