<template>
  <div id="siteActionscomponent">
    <div :class="`row q-gutter-${gutter}`">
      <!--Actions-->
      <q-btn v-for="(btn, keyAction) in actions.bottons" :key="keyAction" v-bind="btn.props"
             v-if="btn.vIf != undefined ? btn.vIf : true" @click="btn.action != undefined ? btn.action() : null">
        <q-tooltip>{{ btn.label }}</q-tooltip>
      </q-btn>
      <!--Auth section-->
      <q-btn v-if="quserState.authenticated && (configMode == 'iadmin')" rounded no-caps
             padding="2px 8px" color="white" unelevated>
        <div id="profileImage" class="img-as-bg"
             :style="`background-image: url('${quserState.userData.mainImage}')`"></div>
        <div class="q-ml-xs q-mr-sm text-blue-grey">{{ quserState.userData.firstName }}</div>
        <q-icon name="fas fa-chevron-down" size="14px" color="blue-grey"/>
        <!--Menu-->
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
            <q-separator vertical inset class="q-ml-lg q-mr-sm"/>
            <!--Right content-->
            <div class="column text-left">
              <q-btn v-for="(btn, keyAction) in actions.menu" :key="keyAction" v-bind="btn.props"
                     v-if="btn.vIf != undefined ? btn.vIf : true" v-close-popup padding="xs md"
                     @click="btn.action != undefined ? btn.action() : null"/>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage')
  },
  props: {
    gutter: {type: String, default: 'sm'},
    size: {type: String, default: 'small'},
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
      configMode : config('app.mode'),
      badge: {
        chat: false,
        notification: false
      }
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    },
    //Return params of subHeader
    params() {
      return this.$clone(this.$route.meta.subHeader || {})
    },
    //Site Actions
    actions() {
      //Default buttons props
      let defaultButtonProps = {
        round: true,
        dense: true,
        color: "white",
        unelevated: true,
        class: "btn-small",
        textColor: "blue-grey",
        noCaps: true
      }

      return {
        bottons: [
          //Go To Site
          {
            name: 'goToSite',
            label: this.$tr('ui.configList.goToSite'),
            props: {
              ...defaultButtonProps,
              label: this.$tr('qsite.layout.showSite'),
              type: 'a',
              href: this.$store.state.qsiteApp.baseUrl,
              target: '_blank',
              round: false,
              rounded: true,
              padding: 'xs md'
            }
          },
          //Chat
          {
            name: 'chat',
            label: 'Chat',
            vIf: (config('app.mode') == 'iadmin') && this.$auth.hasAccess('ichat.conversations.index'),
            props: {
              ...defaultButtonProps,
              icon: 'fas fa-comment-alt',
              class: `btn-small ${this.badge.chat ? 'active-badge' : ''}`
            },
            action: () => this.$eventBus.$emit('toggleMasterDrawer', 'chat')
          },
          //Notifications
          {
            name: 'notifications',
            label: this.$trp('ui.label.notification'),
            vIf: this.$auth.hasAccess('notification.notifications.manage'),
            props: {
              ...defaultButtonProps,
              icon: 'fas fa-bell',
              class: `btn-small ${this.badge.notification ? 'active-badge' : ''}`
            },
            action: () => this.$eventBus.$emit('toggleMasterDrawer', 'notification')
          },
        ],
        menu: [
          //Profile
          {
            name: 'profile',
            props: {
              ...defaultButtonProps,
              label: this.$tr('quser.sidebar.panelProfile'),
              icon: 'fas fa-user-circle',
              round: false,
              rounded: true,
              align: "left"
            },
            action: () => (this.$route.name != 'user.profile.me') ? this.$router.push({name: 'user.profile.me'}) : null
          },
          //Settings
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin'),
            props: {
              ...defaultButtonProps,
              label: this.$trp('ui.label.setting'),
              icon: 'fas fa-cog',
              round: false,
              rounded: true,
              align: "left"
            },
            action: () => this.$eventBus.$emit('toggleMasterDrawer', 'config')
          },
          //checking
          {
            name: 'checking',
            vIf: (config('app.mode') == 'ipanel') && this.$auth.hasAccess('icheckin.shifts.create'),
            props: {
              ...defaultButtonProps,
              label: this.$tr('qcheckin.sidebar.checkin'),
              icon: 'fas fa-stopwatch',
              round: false,
              rounded: true,
              align: "left"
            },
            action: () => this.$eventBus.$emit('toggleMasterDrawer', 'checkin')
          },
          //logout
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin'),
            props: {
              ...defaultButtonProps,
              label: this.$tr('ui.configList.signOut'),
              icon: 'fas fa-sign-out-alt',
              round: false,
              rounded: true,
              align: "left"
            },
            action: () => this.$router.push({name: 'auth.logout'})
          }
        ]
      }
    },
  },
  methods: {
    init() {
      //Manage badges to button actions
      this.$eventBus.$on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name])
      })
    }
  }
}
</script>
<style lang="stylus">
#siteActionscomponent
  #profileImage
    height 25px
    width 25px
    border-radius 50%
</style>
