<template>
  <q-btn size="xs"
         :style="btnStyle"
         round :color="defaultColor"
         :icon="defaultIcon"
         style="z-index: 4"
         unelevated
         outline
  >
    <q-menu id="helpTextMenu" anchor="top right" self="top right">
      <!--Close actions-->
      <div class="text-right">
        <q-btn icon="fas fa-times" v-close-popup color="blue-grey" size="8px" unelevated
               round padding="xs" flat/>
      </div>
      <!--Icon and title-->
      <div class="text-center">
        <q-icon :name="icon || defaultIcon" :color="defaultColor" size="25px" class="q-mb-sm"/>
        <div v-if="title" class="q-mb-sm text-blue-grey text-weight-bold">{{ title }}</div>
      </div>
      <q-separator class="q-my-xs"/>
      <!--description-->
      <div id="contentHelp" v-html="description"/>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  props: {
    icon: {default: null},
    title: {type: String, default: null, required: true},
    description: {type: String, required: true},
    btnStyle: {type: String, default: ''}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      defaultIcon: 'fa-light fa-info',
      defaultColor: 'light-blue-8'
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="stylus">
#helpTextMenu
  border 2px solid $info
  padding 10px 15px
  border-radius $custom-radius-items

  #contentHelp
    max-width 20em
    line-height 1.3
    color $blue-grey
    text-align justify
</style>
