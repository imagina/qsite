<template>
  <div id="masterDrawers">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" bordered ref="menuMaster"
              :mini="miniState" @click.capture="miniState ? $eventBus.$emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div class="q-pa-md" v-if="!miniState && drawer.menu">
        <q-img contain :src="logo" style="height: 120px; min-height: 120px"/>
      </div>
      <!--List iadmin-->
      <q-scroll-area
        :style="`height: calc(100vh - ${this.windowSize == 'mobile' ? '152' : (miniState ? '100' : '252')}px`">
        <!--Menu-->
        <menu-list ref="menuList" group :menu="menu"/>
      </q-scroll-area>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" overlay v-model="drawer.config" side="right"
              v-if="appConfig.mode == 'iadmin' ? true : false">
      <config-list/>
    </q-drawer>

    <!-- Chat -->
    <q-drawer bordered id="chatMaster" overlay v-model="drawer.chat" side="right"
              v-if="$auth.hasAccess('ichat.conversations.index')">
      <chat-list/>
    </q-drawer>

    <!--Master filter-->
    <q-drawer bordered id="drawerFilterMaster" v-model="drawer.filter" side="right" v-if="filter.load" :overlay="false">
      <master-filter/>
    </q-drawer>

    <!--checking-->
    <q-drawer bordered id="drawerCheckinMaster" v-model="drawer.checkin" side="right" overlay
              v-if="(appConfig.mode == 'iadmin') && $auth.hasAccess('icheckin.shifts.create')">
      <checkin/>
    </q-drawer>

    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right" :overlay="false"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>
  </div>
</template>
<script>
//Components
import configList from '@imagina/qsite/_components/master/configList'
import chatList from '@imagina/qchat/_components/drawerChatList'
import menuList from '@imagina/qsite/_components/master/recursiveItem'
import masterFilter from '@imagina/qsite/_components/master/masterFilter'
import checkin from '@imagina/qcheckin/_components/checkin'
import masterRecommendation from '@imagina/qsite/_components/master/masterRecommendations'

export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleMasterDrawer')
    this.$eventBus.$off('openMasterDrawer')
  },
  props: {},
  components: {menuList, configList, chatList, masterFilter, checkin, masterRecommendation},
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
        chat: false,
        filter: false,
        checkin: false,
        recommendation: false
      },
      menu: config('sidebar'),
      appConfig: config('app'),
      filter: this.$filter
    }
  },
  computed: {
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
    routeSubHeader() {
      this.drawer.recommendation = false
      return this.$route.meta.subHeader || {}
    },
  },
  methods: {
    //init
    init() {
      this.handlerEvent()
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.windowWith = window.innerWidth
      })
    },
    handlerEvent() {
      //handler toggleMasterDrawer
      this.$eventBus.$on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //handler openMasterDrawer
      this.$eventBus.$on('openMasterDrawer', (drawerName) => this.drawer[drawerName] = true)
    },
    //Show drawer specific
    toggleDrawer(drawerName) {
      //Hidden all drawers
      for (var drawer in this.drawer) {
        if (drawer != drawerName) {
          if ((drawer == 'menu') && (this.windowSize != 'mobile')) {
            this.miniState = true
          } else if (drawer == 'recommendation') {
            this.drawer[drawer] = (this.windowSize == 'mobile') ? false : true
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
    padding-left 0
    min-height 40px
    color $blue-grey

    .q-item__section--avatar
      padding 0 18px !important

      .q-icon
        font-size 20px
        color $blue-grey

    &:hover
      background-color $grey-4
      color $primary

      .q-icon
        color $primary
        font-size 22px

    &.item-is-active
      background-color white

      .q-item__section, .q-icon
        color $primary

  .expansion-selected
    background-color $primary

#masterDrawers
  #drawerRecomendationMaster
    .q-drawer
      max-height max-content

    .q-drawer__content
      background #ebf1fa

</style>
