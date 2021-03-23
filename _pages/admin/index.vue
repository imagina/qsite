<template>
  <div id="indexMasterPage">
    <!--Logo-->
    <div v-if="!quickCards.list1.length" id="logoContent" class="flex flex-center">
      <img style="max-width: 40vw" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path">
    </div>

    <!--Quick cards-->
    <div id="quickCardsContent" v-if="quickCards.list1.length">
      <div class="row q-col-gutter-x-md">
        <div v-for="(groupQuickCard, key) in quickCards" :key="key" class="col-12 col-lg-6">
          <div class="row q-col-gutter-y-md full-width">
            <div v-for="(item, keyItem) in groupQuickCard" :key="keyItem" class="col-12">
              <component :is="item.component" :key="`component${keyItem}`" v-bind="item.props || {}"/>
            </div>
          </div>
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
      //Get quick cards
      let quickCards = []
      let mainConfigs = Object.values(config('main')).map(item => item.quickCards || [])
      mainConfigs.forEach(item => quickCards = quickCards.concat(item))
      //Validate Permissions
      let quickCardsToShow = []
      quickCards.forEach((card, index) => {
        if (!card.permission || this.$auth.hasAccess(card.permission)) quickCardsToShow.push(card)
      })
      //Divide quick cards
      let response = {
        list1: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice(0, (quickCardsToShow.length / 2)) : quickCardsToShow,
        list2: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice((quickCardsToShow.length / 2), quickCardsToShow.length) : []
      }
      //Response
      return response
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
.flex-break
  flex: 1 0 100% !important
  height: 0 !important

.example-container
  .example-cell
    margin: 1px
    padding: 4px 8px
    box-shadow: inset 0 0 0 2px $grey-6

#indexMasterPage
  #logoContent
    min-height calc(100vh - 200px)
</style>
