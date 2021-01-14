<template>
  <div id="masterDrawers">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" bordered ref="menuMaster"
              :mini="miniState" @click.capture="miniState = false">
      <!--Logo-->
      <div class="q-pa-md" v-if="!miniState && drawer.menu">
        <q-img contain :src="logo" style="height: 120px; min-height: 120px"/>
      </div>
      <!--List-->
      <q-scroll-area :style="`height: calc(100vh - ${this.windowSize == 'mobile' ? '152' : '250'}px`">
        <menu-list ref="menuList" group :menu="menu"/>
      </q-scroll-area>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" overlay v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>

    <!--Master filter-->
    <q-drawer bordered id="menu_master" v-model="drawer.filter" side="right" v-if="filter.load" overlay>
      <master-filter/>
    </q-drawer>
  </div>
</template>
<script>
//Components
import configList from '@imagina/qsite/_components/master/configList'
import menuList from '@imagina/qsite/_components/master/recursiveItem'
import masterFilter from '@imagina/qsite/_components/master/masterFilter'

export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleMasterDrawer')
  },
  props: {},
  components: {menuList, configList, masterFilter},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWith: window.innerWidth,
      projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
      logo: this.$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path,
      miniState: this.windowSize == 'mobile' ? false : true,
      drawer: {
        menu: this.windowSize == 'mobile' ? false : true,
        config: false,
        filter: false
      },
      menu: config('sidebar'),
      filter: this.$filter
    }
  },
  computed: {
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    }
  },
  methods: {
    //init
    init() {
      this.$eventBus.$on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.windowWith = window.innerWidth
      })
    },
    //Show drawer specific
    toggleDrawer(drawerName) {
      //Hidden all drawers
      for (var drawer in this.drawer) {
        if (drawer != drawerName) {
          if ((drawer == 'menu') && (this.windowSize != 'mobile')) {
            this.miniState = true
          } else this.drawer[drawer] = false
        }
      }
      //Toogle drawer
      if (drawerName == 'menu') {
        if (this.windowSize == 'mobile') {
          this.miniState = false
          this.drawer.menu = !this.drawer.menu
        } else {
          this.drawer.menu = true
          this.miniState = !this.miniState
        }
      } else {
        this.drawer[drawerName] = !this.drawer[drawerName]
      }
    }
  }
}
</script>
<style lang="stylus">
.q-layout-drawer-delimiter
  box-shadow $shadow-1

.q-drawer--mini
  width 57px !important

  .q-item__section
    padding 0px 20px !important

#menuMaster
  hr
    background-color $grey-3

  .q-expansion-item
    background-color $grey-3

  .q-expansion-item__container
    .q-expansion-item__content
      padding 0 0 0 1px
      border-left 15px solid white

  .q-item
    padding-left 0px
    min-height 40px

    .q-item__section--avatar
      padding 0 8px 0 20px

    &:hover
      background-color $grey-4
      color $primary

      .q-icon
        color $primary

    &.item-is-active
      background-color white

      .q-item__section, .q-icon
        color $primary

  .expansion-selected
    background-color $primary
</style>
