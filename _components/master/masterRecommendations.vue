<template>
  <div id="recommendationsComponent">
    <!--Setting Crud-->
    <crud v-bind="crudRecommendationParams" @created="getData()" @updated="getData()" @deleted="getData()"/>
    <!--Recommendations content-->
    <div class="relative-position" v-if="recommendationName">
      <!--Top Content-->
      <div class="box row justify-between items-center">
        <!--Title-->
        <div class="text-ellipsis text-subtitle1 row items-center">
          <q-icon class="q-mr-sm" size="20px" color="primary" name="fas fa-hat-wizard"/>
          {{ $trp('isite.cms.label.recommendation') }}
        </div>
        <!--Btn to create-->
        <q-btn icon="fas fa-plus" round unelevated size="10px" color="green" @click="$refs.recommendations.create()"
               v-if="($hasAccess('isite.recommendations.create') && (appConfig.mode != 'ipanel'))">
          <q-tooltip>{{ $tr('isite.cms.label.add') }}</q-tooltip>
        </q-btn>
      </div>
      <q-separator class="q-my-sm"/>
      <!--Items-->
      <q-scroll-area :thumb-style="thumbStyle" v-if="items.length" style="height: calc(100vh - 167px)">
        <div class="box item q-px-none q-py-md" v-for="item in items" :key="item.id">
          <!--Content-->
          <div class="ellipsis relative-position">
            <div class="text-subtitle2 q-pr-lg">
              <!--Icon-->
              <q-icon size="20px" class="q-mr-sm" color="primary" name="fas fa-magic"/>
              <!--Title-->
              <div class="ellipsis">
                {{ item.title }}
              </div>
              <q-tooltip>{{ item.title }}</q-tooltip>
            </div>
            <!--Button action-->
            <q-btn class="file-card__bottom_actions absolute-right" icon="fas fa-ellipsis-v" unelevated round size="sm"
                   color="blue-grey" flat padding="sm"
                   v-if="($hasAccess('isite.recommendations.manage') && (appConfig.mode != 'ipanel'))">
              <!---Menu actions-->
              <q-menu anchor="bottom left" self="bottom end">
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup v-for="(action, itemKey) in fileActions" :key="itemKey"
                          @click.native="action.action(item)">
                    <q-item-section>
                      <div class="row items-center">
                        <q-icon :name="action.icon" class="q-mr-sm" color="blue-grey" size="18px"/>
                        {{ action.label }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <!--Line separator-->
          <q-separator class="q-my-xs"/>
          <div class="text-caption text-justify">
            {{ item.description }}
          </div>
        </div>
      </q-scroll-area>
      <div class="box item q-px-none q-py-md" v-else>
        {{ $trp('isite.cms.message.notFound') }}
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {
    '$route.name': {
      deep: true,
      handler: function (newValue) {
        this.init()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      recommendationName: false,
      items: false,
      windowWith: window.innerWidth,
      appConfig: config('app'),
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '$custom-accent-color',
        width: '5px',
        opacity: 0.1
      },
    }
  },
  computed: {
    crudRecommendationParams() {
      return {
        crudData: import('modules/qsite/_crud/recommendations'),
        type: "only-create",
        ref: "recommendations",
        customData: {
          formLeft: {name: {value: this.recommendationName}}
        }
      }
    },
    //File Actions
    fileActions() {
      return [
        {
          label: this.$tr('isite.cms.label.edit'),
          icon: 'fas fa-pen',
          color: 'green',
          action: (item) => {
            this.$refs.recommendations.update(item)
          }
        },
        {
          label: this.$tr('isite.cms.label.delete'),
          icon: 'fas fa-trash',
          color: 'red',
          action: (item) => {
            this.$refs.recommendations.delete(item)
          }
        }
      ]
    },
    //size window
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
  },
  methods: {
    init() {
      this.resetData()
      this.getData()
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowWith = window.innerWidth
      })
    },
    //reset data
    resetData() {
      // Validate recommendation name from route
      if (this.$route.meta.subHeader && this.$route.meta.subHeader.recommendations)
        this.recommendationName = this.$route.meta.subHeader.recommendations.name
      else this.recommendationName = false
      //Reset items
      this.items = false
    },

    getData() {
      return new Promise((resolve, reject) => {
        //validate recomedation name
        if (!this.recommendationName) return reject(false)

        this.loading = true
        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {name: this.recommendationName}
          }
        }

        //Get recommendation
        this.$crud.index('apiRoutes.qsite.recommendations', requestParams).then(response => {
          this.loading = false
          this.items = response.data
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
          })
        })
      })
    },
  }
}
</script>
<style lang="scss">
#recommendationsComponent {
  padding: 16px;
  background: $custom-accent-color;
  height: 100%;

  .item {
    margin: 0 0 8px 0;

    .text-subtitle2 {
      height: 31px;
      display: flex;
      align-items: center;
    }
  }

  .content-avatar {
    max-width: 45px;
    min-width: 45px;
    padding: 0;
  }

  .box {
    min-height: auto;
  }
}

@media (max-width: $breakpoint-lg-max) {
  #recommendationsComponent {
    padding: 30px 8px 30px 8px;
  }
}
</style>
