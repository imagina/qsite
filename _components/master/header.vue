<template>
  <div id="masterHeader">
    <!-- HEADER -->
    <q-header class="bg-white">
      <!-- Toolbar header -->
      <div class="q-hide q-md-show bg-primary">
        <q-toolbar id="toolbarTop" color="primary">
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
      </div>

      <!--Toolbar Sub header--->
      <div id="toolbarBottom">
        <q-toolbar id="contentSubHeader" class="q-pa-none row justify-between items-center">
          <!--Left content-->
          <div id="leftContent" class="row items-center">
            <!--== Menu Button ==-->
            <q-btn id="buttonToogleMenu" icon="fas fa-bars" unelevated flat color="primary"
                   class="q-mr-md q-hide q-md-show" @click="$eventBus.$emit('toggleMasterDrawer','menu')"/>
            <!--== Back Button ==-->
            <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-action q-mr-md"
                   @click="$helper.backHistory()">
              <q-tooltip>{{ $tr('ui.label.back') }}</q-tooltip>
            </q-btn>
            <!--Breadcrum-->
            <div id="breadCrumbContent" class="q-hide q-md-show">
              <q-breadcrumbs>
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
            <!--== Button filter ==-->
            <q-btn icon="fas fa-filter" unelevated round v-if="filter.load" color="primary" class="btn-action"
                   @click="$eventBus.$emit('toggleMasterDrawer','filter')">
              <q-tooltip>{{ $tr('ui.label.filter') }}</q-tooltip>
            </q-btn>
            <!--== Button refresh ==-->
            <q-btn icon="fas fa-redo" unelevated round v-if="params.refresh" color="primary" class="btn-action"
                   @click="$root.$emit('page.data.refresh')">
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
export default {
  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage')
  },
  props: {},
  components: {},
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
      badge: {
        chat: false
      }
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
        [config(`pages.app.home`), this.currentRoute.meta] : [config(`pages.app.home`)]

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
