<template>
  <div id="masterHeader">
    <!-- HEADER -->
    <q-header class="bg-white">
      <!-- Toolbar header -->
      <div :class="'q-hide q-md-show bg-primary'">
        <!--Toolbar admin-->
        <q-toolbar id="toolbarTop" color="primary" v-if="appConfig.mode == 'iadmin'">
          <!--Logo-->
          <div id="logoImage" :style="`background-image: url('${logo}')`"
               class="img-as-bg"></div>
          <!--Project name-->
          <q-toolbar-title>{{ projectName }}</q-toolbar-title>
          <!--Actions-->
          <div class="row q-gutter-x-sm items-center">
            <!--== Button User ==-->
            <q-no-ssr>
              <q-btn :to="{name: 'user.profile.me'}" flat no-caps v-if="quserState.authenticated" padding="5px"
                     rounded>
                <div id="profileImage" :style="`background-image: url('${quserState.userData.mainImage}')`"
                     class="img-as-bg"></div>
                <div class="q-ml-xs">{{ quserState.userData.firstName }}</div>
              </q-btn>
            </q-no-ssr>
            <!--== Button checking ==-->
            <q-btn icon="fas fa-stopwatch" unelevated round color="white" text-color="primary" class="btn-action"
                   @click="$eventBus.$emit('toggleMasterDrawer','checkin')"
                   v-if="$auth.hasAccess('icheckin.shifts.create')">
              <q-tooltip>{{ $tr('qcheckin.sidebar.checkin') }}</q-tooltip>
            </q-btn>
            <!--== Button Go to site ==-->
            <q-btn round dense icon="far fa-eye" color="white" unelevated class="btn-action"
                   type="a" :href="$store.state.qsiteApp.baseUrl" target="_blank" text-color="primary">
              <q-tooltip>{{ $tr('ui.configList.goToSite') }}</q-tooltip>
            </q-btn>
            <!--== Button Chat ==-->
            <q-btn v-if="$auth.hasAccess('ichat.conversations.index')" color="white" unelevated
                   :class="`btn-action ${badge.chat ? 'active-badge' : ''}`" round dense icon="far fa-comment-alt"
                   @click="$eventBus.$emit('toggleMasterDrawer','chat')" text-color="primary">
              <q-tooltip>Chat</q-tooltip>
            </q-btn>
            <!--== Button Config ==-->
            <q-btn round dense icon="fas fa-cog" color="white" unelevated class="btn-action" text-color="primary"
                   @click="$eventBus.$emit('toggleMasterDrawer','config')" size="14px">
              <q-tooltip>{{ $trp('ui.label.setting') }}</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
        <!--Toolbar panel-->
        <q-toolbar v-else id="toolbarTop" color="primary">
          <!--Logo-->
          <div id="logoImage" :style="`background-image: url('${logo}')`"
               class="img-as-bg"></div>
          <!--Project name-->
          <q-toolbar-title>{{ projectName }}</q-toolbar-title>
          <!--Actions-->
          <div class="row q-gutter-x-sm items-center">
            <!--== Button User ==-->
            <q-no-ssr>
              <!--Drop down button-->
              <q-btn-dropdown color="primary" rounded unelevated padding="xs sm">
                <!--Top Slot-->
                <template v-slot:label>
                  <div id="profileImage" :style="`background-image: url('${quserState.userData.mainImage}')`"
                       class="img-as-bg"></div>
                  <div class="q-ml-xs">{{ quserState.userData.firstName }}</div>
                </template>
                <!--Actions-->
                <q-list dense>
                  <!--Go to profile-->
                  <q-item clickable v-close-popup :to="{name: 'user.profile.me'}">
                    <q-item-section>
                      <q-item-label>
                        <div class="row items-center text-blue-grey">
                          <q-icon name="fas fa-user-circle" class="q-mr-sm" size="16px"/>
                          {{ $tr('quser.sidebar.panelProfile') }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!--Log out-->
                  <q-item clickable v-close-popup :to="{name: 'auth.logout'}">
                    <q-item-section>
                      <q-item-label>
                        <div class="row items-center text-blue-grey">
                          <q-icon name="fas fa-sign-out-alt" class="q-mr-sm" size="16px"/>
                          {{ $tr('ui.configList.signOut') }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-no-ssr>
          </div>
        </q-toolbar>
        <!--<div v-else id="headerIpanel">
          <div id="webComponent">
            <embedded-header-ipanel v-if="loadHeaderIpanel"></embedded-header-ipanel>
          </div>
        </div>-->
      </div>

      <!--Toolbar Sub header--->
      <div id="toolbarBottom">
        <q-toolbar id="contentSubHeader" class="q-pa-none row justify-between items-center">
          <!--Left content-->
          <div id="leftContent" class="row items-center">
            <!--== Menu Button ==-->
            <q-btn id="buttonToogleMenu" icon="fas fa-bars" unelevated flat color="primary"
                   :class="appConfig.mode == 'iadmin' ? 'q-mr-md q-hide q-md-show' : 'q-mr-md'"
                   @click="$eventBus.$emit('toggleMasterDrawer','menu')"/>
            <!--== Back Button ==-->
            <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-action q-mr-md"
                   v-if="appConfig.mode == 'iadmin'" @click="$helper.backHistory()">
              <q-tooltip>{{ $tr('ui.label.back') }}</q-tooltip>
            </q-btn>
            <!--Breadcrum-->
            <div id="breadCrumbContent" class="q-hide q-md-show">
              <q-breadcrumbs class="text-blue-grey">
                <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label" :icon="item.icon"
                                  :to="item.to ? {name : item.to} : false"/>
              </q-breadcrumbs>
            </div>
          </div>
          <!--Center content-->
          <div id="centerContent" class="q-md-hide text-white text-h6 ellipsis">
            {{ breadcrumbs[breadcrumbs.length - 1].label }}
          </div>
          <!--Right content-->
          <div id="rightContent" class="row items-center q-gutter-x-sm">
            <!--== Button export ==-->
            <master-export/>
            <!--== Button filter ==-->
            <q-btn icon="fas fa-filter" unelevated round v-if="filter.load" color="primary" class="btn-action"
                   @click="$eventBus.$emit('toggleMasterDrawer','filter')">
              <q-tooltip>{{ $tr('ui.label.filter') }}</q-tooltip>
            </q-btn>
            <!--== Button refresh ==-->
            <q-btn icon="fas fa-redo" unelevated round v-if="params.refresh" color="primary" class="btn-action"
                   @click="$root.$emit('page.data.refresh'), $root.$emit('crud.data.refresh'), $root.$emit('export.data.refresh')">
              <q-tooltip>{{ $tr('ui.label.refresh') }}</q-tooltip>
            </q-btn>
          </div>
          <!--Message if page has filter-->
          <div id="messageFilter" class="cursor-pointer text-caption" v-if="filter.hasValues"
               @click="$eventBus.$emit('toggleMasterDrawer','filter')">
            <q-icon name="fas fa-exclamation" size="12px" color="warning"/>
            {{ $tr('ui.message.pageDataWithFilter') }}
          </div>
        </q-toolbar>
      </div>
    </q-header>
  </div>
</template>
<script>
//Components
import masterExport from "@imagina/qsite/_components/master/masterExport"

export default {
  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage')
  },
  props: {},
  components: {masterExport},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
      logo: this.$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path,
      filter: this.$filter,
      appConfig: config('app'),
      badge: {
        chat: false
      },
      loadHeaderIpanel: false
    }
  },
  computed: {
    quserState() {
      return this.$store.state.quserAuth
    },
    //Current route
    currentRoute() {
      return this.$route
    },
    //Return all data in extra state store "subHeaderData" merged with currernt data
    subHeaderData() {
      return this.$clone(this.$store.getters['qsiteApp/getExtra']('subHeaderData') || {})
    },
    //Return params of subHeader
    params() {
      return this.currentRoute.meta.subHeader || {}
    },
    //Return data breadcrumd
    breadcrumbs() {
      let response = []
      //Get breadcrumbs from params
      let breadcrumbs = this.params.breadcrumb ? this.$clone(this.params.breadcrumb) : []
      breadcrumbs = this.$clone(breadcrumbs.reverse())

      //Set Home page and current page
      let pages = (this.currentRoute.name.indexOf('app.home') == -1) ?
        [config(`pages.mainqsite.home`), this.currentRoute.meta] : [config(`pages.mainqsite.home`)]

      //Get page from breadcrum
      breadcrumbs.forEach(pageName => pages.splice(1, 0, config(`pages.${pageName}`)))

      //Format all routes to breadcrum
      pages.forEach(page => {
        if (page.activated && this.$auth.hasAccess(page.permission))
          response.push({
            label: this.$tr(page.headerTitle || page.title),
            icon: page.icon,
            to: page.name
          })
      })

      //Response
      return response
    }
  },
  methods: {
    init() {
      //Manage badges to button actions
      this.$eventBus.$on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name])
      })
      //Get header ipanel
      //this.getHeaderIpanel()
    },
    //Get html header ipanel
    getHeaderIpanel() {
      if (config('app.mode') == 'ipanel') {
        this.$remember.async({
          key: 'headerIpanelHTML',
          seconds: (3600 * 3),
          refresh: false,
          callBack: () => {
            return new Promise((resolve, reject) => {
              let baseUrl = this.$store.state.qsiteApp.baseUrl
              this.$axios.get(baseUrl + '/isite/header').then(response => {
                resolve(response)
              }).catch(error => {
                console.error('[HEADER-IPANEL]', error.response)
                reject(error.response)
              })
            })
          }
        }).then(response => {
          //Define Template
          var template = document.createElement('template')
          template.innerHTML = response.data

          //Load weeb component
          window.customElements.define('embedded-header-ipanel', class EmbeddedWebview extends HTMLElement {
              connectedCallback() {
                const shadow = this.attachShadow({mode: 'closed'});
                shadow.appendChild(document.importNode(template.content, true))
              }
            }
          );

          //Allow load header web component
          this.loadHeaderIpanel = true
        }).catch(error => {
          console.error('[HEADER-IPANEL]', error)
        })
      }
    }
  }
}
</script>
<style lang="stylus">
#masterHeader
  #toolbarTop
    padding-left 8px
    padding-right 10px

    #logoImage
      height 40px
      width 40px
      border-radius 5px

    #profileImage
      height 30px
      width 30px
      border-radius 50%

  #headerIpanel
    background-color transparent
    border-bottom 1px solid $grey-4

    #webComponent
      all initial

  #toolbarBottom
    width 100%
    color $grey-9
    position relative

  #contentSubHeader
    padding 5px 10px 5px 70px
    border-bottom 1px solid $grey-4
    width 100%
    min-height 48px
    position relative
    background-color white

    @media screen and (max-width: $breakpoint-md)
      padding 5px 10px
      background-color $primary


    #buttonToogleMenu
      position absolute
      left 0
      top 0
      height 48px
      width 57px
      border-radius 0
      background-color white
      border-right 1px solid $grey-4

    .q-breadcrumbs
      .q-breadcrumbs__el
        font-size 14px

      .q-icon
        font-size 15px

    #messageFilter
      background white
      border 2px solid $warning
      border-top none
      border-radius 0 0 10px 10px
      padding 0 6px 1px 6px
      position absolute
      margin-right auto
      margin-left auto
      left 0
      right 0
      bottom -23px
      width max-content

  .btn-action
    .q-btn__wrapper
      min-height 30px !important
      min-width 30px !important
      padding 5px

      .q-icon
        font-size 16px !important

    &.active-badge
      &:after
        position absolute
        content ''
        height 12px
        width 12px
        background red
        border-radius 50%
        right -2px
        top -2px
</style>
