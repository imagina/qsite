//class
import AutoLoadSidebars from '@imagina/qsite/_config/master/application/menu'

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
      menuTranslatable:true,
      menuLocal: config('sidebar'),
    }
  },
  computed:{
    menuSelect() {
      // switch between new menuList or old menuList
      this.menuTranslatable = this.$store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') === 1 ? true : false 
      return this.menuTranslatable ? this.menuLocal : this.menu
    },
  }
}
