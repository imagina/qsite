<template>
  <q-dialog id="alertModalComponent" ref="alertModalComponent" persistent
            transition-show="slide-up" transition-hide="slide-down">
    <q-card id="cardContent">
      <!--Header-->
      <q-toolbar :class="`bg-${paramsModal.color} text-white`">
        <q-toolbar-title>
          <q-icon :name="paramsModal.icon"/>
          {{ paramsModal.title }}
        </q-toolbar-title>
      </q-toolbar>

      <!--Content-->
      <q-card-section class="relative-position col-12">
        <!--Message-->
        <div v-html="paramsModal.message" class="q-mb-lg"></div>
        <!--button Actions-->
        <div id="actions" class="row justify-end q-gutter-sm">
          <q-btn v-for="(actionProps, keyAction) in actionsModal" :key="keyAction" v-bind="actionProps" v-close-popup
                 @click="actionProps.toUrl ? $helper.openExternalURL(actionProps.toUrl, false) : false"/>
        </div>
      </q-card-section>
    </q-card>
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
        actions: [{label: this.$tr('ui.label.accept')}],
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
          toUrl: action.toUrl || false
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
  }
}
</script>
<style lang="stylus">
#alertModalComponent
  #cardContent
    min-width 400px
</style>
