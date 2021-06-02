<template>
  <q-dialog id="alertModalComponent" ref="alertModalComponent" persistent
            transition-show="slide-up" transition-hide="slide-down">
    <div id="cardContent" class="box">
      <!--Header-->
      <q-toolbar :class="`bgg-${paramsModal.color} q-px-none`" style="min-height: auto">
        <q-toolbar-title class="box-title row items-center">
          <q-icon size="25px" :name="paramsModal.icon" :color="paramsModal.color"/>
          {{ paramsModal.title }}
        </q-toolbar-title>
        <q-btn size="sm" icon="fas fa-times" round color="blue-grey-5" text-color="white" v-close-popup unelevated
               v-if="!actionsModal || !actionsModal.length">
          <q-tooltip>{{ $tr('ui.label.close') }}</q-tooltip>
        </q-btn>
      </q-toolbar>

      <!--Separator-->
      <q-separator class="q-mt-sm"/>

      <!--Content-->
      <q-card-section class="relative-position col-12 q-px-none q-pb-none">
        <!--Message-->
        <div v-html="paramsModal.message" class="q-mb-lg"></div>
        <!--button Actions-->
        <div id="actions" class="row justify-end q-gutter-sm">
          <q-btn v-for="(actionProps, keyAction) in actionsModal" :key="keyAction" v-bind="actionProps" v-close-popup
                 @click="callBack(actionProps)"/>
        </div>
      </q-card-section>
    </div>
  </q-dialog>
</template>
<script>
export default {
  props: {
    params: {default: false}
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
      loading: false,
      data: []
    }
  },
  computed: {
    paramsModal() {
      return {
        icon: 'fas fa-bell',
        color: 'cyan',
        title: this.$tr('ui.label.notification'),
        message: 'Message...',
        actions: [{label: this.$tr('ui.label.ok')}],
        ...this.params
      }
    },
    //Return Actions modal as props to q-btn
    actionsModal() {
      return this.paramsModal.actions.map(action => {
        let response = {
          unelevated: true,
          rounded: true,
          color: action.color || 'green',
          toUrl: action.toUrl || false,
          handler: action.handler || false
        }
        //Dynamics props
        if (action.label) response.label = action.label
        if (action.icon) response.icon = action.icon
        if (action.to) response.to = action.to
        //Repsonse
        return response
      })
    }
  },
  methods: {
    init() {
    },
    //show method
    show() {
      this.$refs.alertModalComponent.show()
    },
    //Hide method
    hide() {
      this.$refs.alertModalComponent.hide()
    },
    //Callback
    callBack(action) {
      if (action.toUrl) return this.$helper.openExternalURL(action.toUrl, false)
      if (action.handler) return action.handler()
    }
  }
}
</script>
<style lang="stylus">
#alertModalComponent
  #cardContent
    width 400px
    max-width 99%
</style>
