<template>
  <div id="masterDrawers">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" ref="menuMaster"
              :mini="miniState" @click.capture="miniState ? $eventBus.$emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div class="q-pa-md" v-if="!miniState && drawer.menu">
        <q-img contain :src="logo" style="height: 120px; min-height: 120px"/>
      </div>
      <!--List iadmin-->
      <q-scroll-area
          :style="`height: calc(100vh - ${(miniState ? '50' : '202')}px`">
        <!--Menu-->
        <menu-list ref="menuList" group :menu="menu"/>
      </q-scroll-area>
      <!--== Button User ==-->
      <q-no-ssr>
        <div id="btnProfile" v-if="quserState.authenticated">
          <!--Content-->
          <div class="row items-center justify-between">
            <!--Title-->
            <div class="row items-center">
              <div id="profileImage" class="img-as-bg q-mr-sm items-center"
                   :style="`background-image: url('${quserState.userData.mainImage}')`"></div>
              <div class="q-ml-xs" v-if="!miniState">{{ quserState.userData.firstName }}</div>
            </div>
            <!--Icon-->
            <div v-if="!miniState" class="q-pr-md">
              <q-icon name="fas fa-chevron-up"/>
            </div>
          </div>
          <!--Actions-->
          <q-menu anchor="bottom right" self="top right">
            <div class="row no-wrap q-pa-md">
              <!--Left content-->
              <div class="column">
                <div style="max-width: 110px">
                  <!--Image profile-->
                  <div class="text-center">
                    <q-avatar size="72px" class="q-mx-auto">
                      <img :src="quserState.userData.mainImage">
                    </q-avatar>
                  </div>
                  <!--User Data-->
                  <div class="text-subtitle1 ellipsis q-mt-md">{{ quserState.userData.fullName }}</div>
                  <div class="ellipsis text-caption">
                    {{ quserState.userData.roles.map(role => role.name).join(', ') }}
                  </div>
                </div>
              </div>
              <!--Seaprator-->
              <q-separator vertical inset class="q-mx-lg"/>
              <!--Right content-->
              <div class="column">
                <!--Title-->
                <div class="text-h6 q-mb-xs text-blue-grey">{{ $tr('ui.label.profile') }}</div>
                <!--Actions-->
                <q-list>
                  <!--Profile-->
                  <q-item clickable v-close-popup :to="{name: 'user.profile.me'}" style="padding: 0; min-width: 130px">
                    <q-item-section>
                      <div class="row items-center text-blue-grey text-right">
                        <q-icon name="fas fa-user-circle" color="green" size="16px" class="q-mr-sm"/>
                        {{ $tr('quser.sidebar.panelProfile') }}
                      </div>
                    </q-item-section>
                  </q-item>
                  <!--Logout-->
                  <q-item clickable v-close-popup :to="{name: 'auth.logout'}" style="padding: 0; min-width: 130px">
                    <q-item-section>
                      <div class="row items-center text-blue-grey">
                        <q-icon name="fas fa-sign-out-alt" color="red" size="16px" class="q-mr-sm"/>
                        {{ $t('ui.configList.signOut') }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-menu>
        </div>
      </q-no-ssr>
    </q-drawer>

    <!--Master filter-->
    <q-drawer id="drawerFilterMaster" v-model="drawer.filter" side="right" v-if="filter.load">
      <master-filter/>
    </q-drawer>

    <!--checking-->
    <q-drawer id="drawerCheckinMaster" v-model="drawer.checkin" side="right"
              v-if="(appConfig.mode == 'ipanel') && $auth.hasAccess('icheckin.shifts.create')">
      <checkin/>
    </q-drawer>

    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>

    <!--Notification-->
    <q-drawer id="dawerNotificatiosMaster" v-model="drawer.notification" side="right"
              v-if="$auth.hasAccess('notification.notifications.manage')">
      <master-notifications/>
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
import masterNotifications from '@imagina/qnotification/_components/drawerNotifications'

export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleMasterDrawer')
    this.$eventBus.$off('openMasterDrawer')
  },
  props: {},
  components: {menuList, configList, chatList, masterFilter, checkin, masterRecommendation, masterNotifications},
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
        recommendation: false,
        notification: false
      },
      appConfig: config('app'),
      filter: this.$filter
    }
  },
  computed: {
    //Return menu
    menu() {
      let menu = config('sidebar').map(item => {
        //Add `toRoute` param to home page
        if (item.name == 'app.home') item.toRoute = this.$store.state.qsiteApp.baseUrl
        return item
      })
      //response
      return menu
    },
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    },
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
  .q-scrollarea
    padding-top 5px

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

  #btnProfile
    cursor pointer
    position absolute
    bottom 0
    left 0
    background-color $primary
    border-radius 0
    color white
    height 50px
    width 100%
    padding 7px 8.5px

    #profileImage
      height 36px
      width 36px
      border-radius 50%

#masterDrawers
  #drawerRecomendationMaster
    .q-drawer
      max-height max-content

    .q-drawer__content
      background #ebf1fa

</style>
