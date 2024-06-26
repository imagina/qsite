<template>
  <div id="quickCardComponent">
    <div class="box">
      <!--Title-->
      <div class="box-title">
        <q-icon v-if="cardParams.icon" :name="cardParams.icon" class="q-mr-sm"/>
        {{ cardParams.title }}
      </div>
      <!--Separator-->
      <q-separator class="q-my-md"/>
      <!--Content-->
      <div id="contentQuickCard" class="relative-position"> 
        <!--Items-->
        <div  
          v-if="!loading"
          id="itemsContent" 
          class="q-mb-md"
        >
          <!--List-v-->
          <div id="itemsListV" v-if="cardParams.type == 'list-v'">
            <q-scroll-area style="height: 260px; width: 100%">
              <q-list v-for="(item, key) in items" :key="key">
                <q-item class="q-px-none"
                        @click.native="cardParams.itemAction ? cardParams.itemAction(item) : false"
                        :clickable="(cardParams.itemAction ? true : false)"
                        :v-ripple="(cardParams.itemAction ? true : false)">
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
            </q-scroll-area>
          </div>
          <!--List-h-->
          <div id="itemsListH" v-if="cardParams.type == 'list-h'">
            <div class="row q-col-gutter-md">
              <div v-for="(item, key) in items" :key="key"
                   :class="`col-6 col-md-4 ${(cardParams.itemAction ? 'cursor-pointer' : '')}`"
                   @click="cardParams.itemAction ? cardParams.itemAction(item) : false">
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
          <!--list-ranking-->
          <div id="itemsListRankin" v-if="cardParams.type == 'list-ranking'">
            <q-scroll-area v-if="!loading && items && items.length" style="height: 350px">
              <q-list bordered separator>
                <q-item v-for="(item, keyItem) in items" :key="keyItem" class="bg-grey-2">
                  <!--Text 1-->
                  <q-item-section>{{ getInformation(item, 'text1') }}</q-item-section>
                  <!--Text 2-->
                  <q-item-section side>
                    <q-chip :label="getInformation(item, 'text2')"
                            color="white" text-color="blue-grey" class="text-weight-bold"/>
                  </q-item-section>
                  <!--Percentage-->
                  <q-linear-progress v-if="getInformation(item, 'percentage')" color="green"
                                     :value="getInformation(item, 'percentage')"/>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
        <!--Empty results-->
        <div class="text-center" v-if="showNotResult">
          <not-result/>
        </div>
        <!-- chart -->
        <div v-if="cardParams.type === 'chart'">
          <QCharts :chartsData="items" v-if="!loading && typeof items === 'object'" />
          <section v-if="loading">
            <q-skeleton type="QChip" class="tw-mb-4 tw-mx-auto" />
            <div class="tw-flex tw-items-end tw-justify-center tw-gap-6">
              <q-skeleton animated type="rect" height="220px" width="75px" />
              <q-skeleton animated type="rect" height="280px" width="75px" />
              <q-skeleton animated type="rect" height="250px" width="75px" />
              <q-skeleton animated type="rect" height="310px" width="75px" />
              <q-skeleton animated type="rect" height="350px" width="75px" />
            </div>
          </section>
        </div>
        <!-- percentage -->
        <div v-if="cardParams.type === 'percentage'">
          <div class="tw-flex" v-if="!loading && typeof items === 'object'">
              <div class="text-center">
                <q-circular-progress
                  show-value
                  font-size="40px"
                  :value="items.value"
                  size="200px"
                  :thickness="0.22"
                  track-color="grey-3"
                  class="q-ma-md tw-text-center colorPercentage"
                >
                {{ items.value || 0 }}%
                </q-circular-progress>
              </div>
              <div>
                <p
                  class="
                    tw-font-semibold
                    tw-py-5
                    tw-text-base
                    tw-text-justify
                    tw-break-normal"
                    v-html="items.description"
                />
              </div>
          </div>
        </div>
         <!-- custom card -->
         <div v-if="cardParams.type === 'custom'">
          <component
            :is="cardParams.component"
            :cardParams="{...cardParams}"
            :items="{...items}"
            :loading="loading"
          />
        </div>
        <!--Action to-->
        <div class="text-center">
          <q-btn v-if="items.length && cardParams.actionTo" unelevated :label="$tr('isite.cms.label.showMore')" color="primary"
                 rounded :to="{name : cardParams.actionTo}"/>
        </div>

        <!--Inner Loading-->
        <q-skeleton 
          v-if="loading && cardParams.type !== 'chart'" 
          type="rect"
          height="350px"
          width="100%"
          class="tw-mt-4" 
        />
      </div>
    </div>
  </div>
</template>
<script>
import QCharts from 'modules/qsite/_components/master/charts.vue';
import { eventBus } from 'src/plugins/utils'

export default {
  beforeUnmount() {
    eventBus.off('page.data.refresh')
  },
  props: {
    params: {type: Object, default: false}
  },
  components: {QCharts},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      items: [],
      filterValues: false
    }
  },
  computed: {
    showNotResult() {
      if(this.cardParams.type === 'custom') return false
      if(this.cardParams.type === 'percentage' || this.cardParams.type === 'chart') {
        if(typeof this.items === 'object') {
          return Object.keys(this.items).length === 0 && !this.loading;
        }
      }
      return !this.items.length && !this.loading;
    },
    cardParams() {
      let response = {
        type: 'list-v',
        ...this.params,
        requestParams: {
          take: (this.params.type == 'list-v') ? 10 : 6,
          page: 1,
          ...(this.params.requestParams || {})
        }
      }

      //Set filters
      if (this.params.filters && this.filterValues) {
        response.requestParams.filter = {...(response.requestParams.filter || {}), ...this.filterValues}
      }

      //Response
      return response
    },
  },
  methods: {
    async init() {
      if (this.params.filters) this.setFilters()//Set filters
      else this.getData()//Get data
      //Listen refresh page event
      eventBus.on('page.data.refresh', () => this.getData())
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
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            resolve(error)
          })
        })
      })
    },
    //Set filters
    setFilters() {
      return new Promise(async resolve => {
        //Set filters
        await this.$filter.setFilter({
          name: this.$route.name,
          fields: this.$clone(this.params.filters || {}),
          callBack: () => {
            this.filterValues = this.$clone(this.$filter.values)
            this.getData()//Get data
          }
        })
        //Resolve
        resolve(true)
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
<style lang="scss">
#quickCardComponent {
  position: relative;

  #iconQuickCard {
    position: absolute;
    top: 28px;
    right: 5px;
    background: white;
    border: 2px solid $primary;
    color: $primary;
    padding: 10px;
    border-radius: 50%;
    font-size: 20px;
  }

  #contentQuickCard {
    min-height: 150px;
  }

  #itemsListV {
    .itemImage, .itemIcon {
      background-color: $grey-4;
      height: 70px;
      width: 70px;
      border-radius: 10px;
    }
  }

  #itemsListH {
    .itemImage, .itemIcon {
      background-color: $grey-4;
      height: 180px;
      width: 100%;
      border-radius: 10px;
      font-size: 30px;
      color: $grey-7;
    }
  }

  #itemsListRankin {
    .q-item {
      position: relative;

      .q-linear-progress {
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }

  .colorPercentage {
    color: $primary;
  }
}
</style>
