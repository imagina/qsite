<template>
  <div id="indexMasterPage">
    <!--Logo-->
    <div v-if="!quickCards.length" id="logoContent" class="flex flex-center">
      <img style="max-width: 40vw" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path">
    </div>
    <!--Quick cards-->
    <div id="quickCardsContent" v-if="quickCards.length">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-6" v-for="(item, key) in quickCards" :key="key">
          <component :is="item.component" :key="`component${key}`"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {}
  },
  computed: {
    //Return quick Cards of all modules
    quickCards() {
      let response = []
      let mainConfigs = Object.values(config('main')).map(item => item.quickCards || [])
      mainConfigs.forEach(item => response = response.concat(item))
      return response
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
#indexMasterPage
  #logoContent
    min-height calc(100vh - 200px)
</style>
