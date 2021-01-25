<template>
  <div id="quickCardComponent">
    <div class="box">
      <!--Title-->
      <div id="titleQuickCard" class="text-grey-7 text-subtitle1 text-uppercase">
        <b>{{ cardParams.title }}</b>
      </div>
      <!---Icon-->
      <q-icon id="iconQuickCard" v-if="cardParams.icon" :name="cardParams.icon"/>
      <!--Separator-->
      <q-separator class="q-my-md"/>
      <!--Content-->
      <div id="contentQuickCard" class="relative-position">
        <!--Items-->
        <div id="itemsContent" class="q-mb-md">
          <!--List-v-->
          <div id="itemsListV" v-if="cardParams.type == 'list-v'">
            <q-list v-for="(item, key) in items" :key="key">
              <q-item class="q-pa-none q-pb-lg">
                <!--Side content-->
                <q-item-section class="sideItem" side>
                  <!--Image-->
                  <div class="itemImage img-as-bg" v-if="getInformation(item,'image')"
                       :style="`background-image: url('${getInformation(item,'image')}')`"></div>
                  <!--Image-->
                  <q-icon class="itemIcon" v-if="!getInformation(item,'image') && cardParams.icon"
                          :name="cardParams.icon"/>
                </q-item-section>
                <!--Information-->
                <q-item-section>
                  <q-item-label caption class="ellipsis">{{ getInformation(item, 'text1') }}</q-item-label>
                  <q-item-label class="ellipsis text-grey-8 q-my-xs">
                    <b>{{ getInformation(item, 'text2') }}</b>
                  </q-item-label>
                  <q-item-label caption lines="2">{{ getInformation(item, 'text3') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!--List-h-->
          <div id="itemsListH" v-if="cardParams.type == 'list-h'">
            <div class="row q-col-gutter-md">
              <div v-for="(item, key) in items" :key="key" class="col-6 col-md-4">
                <!--Side item-->
                <div class="itemSide">
                  <!--Image-->
                  <div class="itemImage img-as-bg" v-if="getInformation(item,'image')"
                       :style="`background-image: url('${getInformation(item,'image')}')`"></div>
                  <!--Image-->
                  <q-icon class="itemIcon" v-if="!getInformation(item,'image') && cardParams.icon"
                          :name="cardParams.icon"/>
                </div>
                <!--Information-->
                <div class="itemInformation">
                  <q-item-label caption class="ellipsis q-my-sm">{{ getInformation(item, 'text1') }}</q-item-label>
                  <q-item-label class="ellipsis-2-lines text-grey-8">
                    <b>{{ getInformation(item, 'text2') }}</b>
                    <q-tooltip>{{ getInformation(item, 'text2') }}</q-tooltip>
                  </q-item-label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Empty results-->
        <div class="text-center" v-if="!items.length && !loading">
          <not-result/>
        </div>
        <!--Action to-->
        <div class="text-center">
          <q-btn v-if="items.length && cardParams.actionTo" unelevated :label="$tr('ui.label.showMore')" color="primary"
                 rounded :to="{name : cardParams.actionTo}"/>
        </div>
        <!--Inner Loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {
    params: {type: Object, default: false}
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
      items: []
    }
  },
  computed: {
    cardParams() {
      return {
        type: 'list-v',
        ...this.params,
        requestParams: {
          take: 3,
          page: 1,
          ...(this.params.requestParams || {})
        }
      }
    },
  },
  methods: {
    init() {
      //Get data
      this.getData()
      //Listen refresh page event
      this.$root.$on('page.data.refresh', () => this.getData())
    },
    //Get data
    getData() {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Request params
        let requestParams = {
          refresh: true,
          params: this.cardParams.requestParams || {}
        }
        //Request
        this.$crud.index(this.cardParams.apiRoute, requestParams).then(response => {
          this.items = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Get information
    getInformation(item, key) {
      let information = this.cardParams.information || {}//Get information
      if (!information[key]) return null//Validate item information
      //Get format
      if (information[key].format) {
        if (information[key].field)
          return information[key].format(item[information[key].field])
        else
          return information[key].format(item)
      } else return item[information[key].field]
    }
  }
}
</script>
<style lang="stylus">
#quickCardComponent
  position relative

  #iconQuickCard
    position: absolute
    top 28px
    right 5px
    background white
    border 2px solid $primary
    color $primary
    padding 10px
    border-radius 50%
    font-size 20px

  #contentQuickCard
    min-height 150px

  #itemsListV
    .itemImage, .itemIcon
      background-color $grey-4
      height 70px
      width 70px
      border-radius 10px

  #itemsListH
    .itemImage, .itemIcon
      background-color $grey-4
      height 180px
      width 100%
      border-radius 10px
      font-size 30px
      color $grey-7
</style>
