<template>
  <div id="masterFooter">
    <!-- === FOOTER === -->
    <q-footer class="bg-white">
      <!--Footer admin-->
      <div id="panelFooterContent" class="row q-md-hide items-center" v-if="appConfig.mode == 'iadmin'">
        <!-- Menu -->
        <div class="item-footer col cursor-pointer" @click="$eventBus.$emit('toggleMasterDrawer','menu')">
          <q-icon class="item-icon" name="fas fa-bars"/>
          <div>Menu</div>
        </div>
        <!-- Profile -->
        <div class="item-footer col cursor-pointer">
          <q-btn :to="{name: 'user.profile.me'}" flat no-caps v-if="quserState.authenticated"
                 class="item-icon" padding="none">
            <q-avatar size="20px">
              <img :src="profileImage.smallThumb">
            </q-avatar>
          </q-btn>
          <div>{{ $tr('isite.cms.label.profile') }}</div>
        </div>
        <!-- Main -->
        <div class="col" @click="doMainAction()">
          <div id="item-main" :class="`cursor-pointer row items-center justify-center bg-${mainAction.color}`">
            <q-icon class="item-icon" :name="mainAction.icon"/>
          </div>
        </div>
        <!-- Settings -->
        <div class="item-footer col cursor-pointer" @click="$eventBus.$emit('toggleMasterDrawer','config')">
          <q-icon class="item-icon" name="fas fa-cog"/>
          <div>{{ $tr('isite.cms.label.setting') }}</div>
        </div>
        <!-- Others -->
        <div class="item-footer col cursor-pointer" @click="modal.show = true">
          <q-icon class="item-icon" name="fas fa-ellipsis-h"/>
          <div>{{ $trp('isite.cms.label.other') }}</div>
        </div>
      </div>
      <!--Footer panel-->
      <div id="footerIpanel" v-else>
        <div id="webComponent">
          <embedded-footer-ipanel v-if="loadFooterIpanel"></embedded-footer-ipanel>
        </div>
      </div>
    </q-footer>
    <!--Dialog other actions-->
    <q-dialog v-model="modal.show" position="bottom" v-if="appConfig.mode == 'iadmin' ? true : false">
      <q-card style="width: 350px">
        <!--Toolbar-->
        <q-toolbar>
          <q-icon class="item-icon" name="fas fa-ellipsis-v"/>
          <q-toolbar-title> {{ $trp('isite.cms.label.other') }}</q-toolbar-title>
          <!--Close bottom-->
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>

        <!--Separator-->
        <q-separator/>

        <q-card-section class="row items-center no-wrap q-pa-none">
          <q-list separator class="full-width" v-close-popup>
            <!--Go to site action-->
            <q-item clickable v-ripple @click.native="$helper.openExternalURL($store.state.qsiteApp.baseUrl)">
              <q-item-section avatar>
                <q-icon color="primary" name="far fa-eye"/>
              </q-item-section>
              <q-item-section class="ellipsis">{{ $tr('isite.cms.configList.goToSite') }}</q-item-section>
            </q-item>
            <!--Chat action-->
            <q-item clickable v-ripple v-if="$auth.hasAccess('ichat.conversations.index')"
                    @click.native="$eventBus.$emit('toggleMasterDrawer','chat')">
              <q-item-section avatar>
                <q-icon color="primary" name="far fa-comment-alt"/>
              </q-item-section>
              <q-item-section class="ellipsis">Chat</q-item-section>
            </q-item>
            <!--Checking action-->
            <q-item clickable v-ripple @click.native="$eventBus.$emit('toggleMasterDrawer','checkin')"
                    v-if="$auth.hasAccess('icheckin.shifts.create')">
              <q-item-section avatar>
                <q-icon color="primary" name="fas fa-stopwatch"/>
              </q-item-section>
              <q-item-section class="ellipsis">{{ $tr('icheckin.cms.sidebar.checkin') }}</q-item-section>
            </q-item>
            <!--Recommendation action-->
            <q-item clickable v-ripple @click.native="$eventBus.$emit('toggleMasterDrawer','recommendation')"
                    v-if="params.recommendations ? true : false">
              <q-item-section avatar>
                <q-icon color="primary" name="fas fa-hat-wizard"/>
              </q-item-section>
              <q-item-section class="ellipsis">{{ $trp('isite.cms.label.recommendation') }}</q-item-section>
            </q-item>
            <!--Notification action-->
            <q-item clickable v-ripple @click.native="$eventBus.$emit('toggleMasterDrawer','notification')"
                    v-if="$auth.hasAccess('notification.notifications.manage')">
              <q-item-section avatar>
                <q-icon color="primary" name="fas fa-bell"/>
              </q-item-section>
              <q-item-section class="ellipsis">{{ $trp('isite.cms.label.notification') }}</q-item-section>
            </q-item>
            <!---->
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$eventBus.$off('setMobileMainAction')
  },
  props: {},
  components: {},
  watch: {
    $route: {
      deep: true,
      handler: function (newValue) {
        this.mainAction = config('app.mobilMainAction')
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      mainAction: config('app.mobilMainAction'),
      appConfig: config('app'),
      loadFooterIpanel: false,
      modal: {
        show: false
      }
    }
  },
  computed: {
    quserState() {
      return this.$store.state.quserAuth
    },
    routeSubHeader() {
      return this.$route.meta.subHeader || {}
    },
    currentRoute() {
      return this.$route
    },
    //Return params of subHeader
    params() {
      return this.currentRoute.meta.subHeader || {}
    },
    profileImage(){
      return this.$store.getters['quserAuth/profileImage']
    }
  },
  methods: {
    init() {
      this.$eventBus.$on('setMobileMainAction', (data) => {
        this.mainAction = {...this.mainAction, ...data}
      })
      //Get footer ipanel
      //this.getFooterIpanel()
    },
    getFooterIpanel() {
      if (config('app.mode') == 'ipanel') {
        this.$remember.async({
          key: 'footerIpanelHTML',
          seconds: (3600 * 3),
          refresh: false,
          callBack: () => {
            return new Promise((resolve, reject) => {
              let baseUrl = this.$store.state.qsiteApp.baseUrl
              this.$axios.get(baseUrl + '/isite/footer').then(response => {
                resolve(response)
              }).catch(error => {
                console.error('[FOOTER-IPANEL]', error.response)
                reject(error.response)
              })
            })
          }
        }).then(response => {
          //Define Template
          var template = document.createElement('template')
          template.innerHTML = response.data

          //Load weeb component
          window.customElements.define('embedded-footer-ipanel', class EmbeddedWebview extends HTMLElement {
              connectedCallback() {
                const shadow = this.attachShadow({mode: 'open'});
                shadow.appendChild(document.importNode(template.content, true))
              }
            }
          );

          //Allow load header web component
          this.loadFooterIpanel = true
        }).catch(error => {
          console.error('[FOOTER-IPANEL]', error)
        })
      }
    },
    //Do main action
    doMainAction() {
      //Do callback
      if (this.mainAction.callBack) this.mainAction.callBack()
      //Redirect
      else if (this.mainAction.route && (this.$route.name != this.mainAction.route)) {
        this.$router.push({name: this.mainAction.route})
      }
    }
  }
}
</script>
<style lang="stylus">
#panelFooterContent
  background-color white
  color $grey-7

  .item-footer
    text-align center
    font-size 11px
    padding 10px 0

    .item-icon
      font-size 20px
      margin-bottom 3px

  #item-main
    border-radius 50%
    width 50px
    height 50px
    margin auto
    font-size 26px
    color white

#footerIpanel
  background-color transparent
  border-top 1px solid $grey-4

  #webComponent
    all initial
</style>
