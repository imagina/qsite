//class
import AutoLoadSidebars from 'src/setup/menu'
import sidebar from 'src/setup/sidebar'

export default {
  created() {
    this.menu = AutoLoadSidebars.getMenu(
      this.$clone(this.$store.getters['qsiteApp/getMenu']),
      this.$clone(this.$store.state.qsiteApp.pages)
    )
  },
  data() {
    return {
      menu: [],
      menuTranslatable: false,
      menuLocal: sidebar,
    }
  },
  computed: {
    menuSelect() {
      // switch between new menuList or old menuList
      const useLegacyStructure = parseInt(this.$getSetting('isite::legacyStructureCMS') || 0)
      this.menuTranslatable = useLegacyStructure ? true : false
      return this.menuTranslatable ? this.menuLocal : this.menu
    },
  }
}
