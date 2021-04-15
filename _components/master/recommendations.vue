<template>
  <div id="recommendationsComponent">
    <!--Setting Crud-->
    <crud v-bind="crudSettingsParams" v-if="false && settingName"/>
    <!--Recommendations content-->
    <div class="box relative-position" v-if="settingName">
      <!--Top Content-->
      <div class="row justify-between items-center">
        <!--Title-->
        <div class="text-ellipsis box-title text-teal">
          <q-icon name="fas fa-hat-wizard"/>
          {{ $trp('ui.label.recommendation') }}
        </div>
        <!--Btn to create-->
        <q-btn icon="fas fa-plus" round unelevated size="10px" color="positive" @click="$refs.settingsCrud.create()"
               v-if="false">
          <q-tooltip>{{ $tr('ui.label.add') }}</q-tooltip>
        </q-btn>
      </div>
      <q-separator class="q-my-sm"/>
      <!--Items-->
      <q-list>
        <q-item class="q-px-none q-py-md" v-for="item in 7" :key="item">
          <q-item-section avatar>
            <q-avatar size="40px" font-size="17px" color="teal" text-color="white" icon="fas fa-magic"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">Single line item</q-item-label>
            <q-item-label caption lines="2">
              Secondary line text. Lorem ipsum dolor sit amet, text text text.
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    settingName: {default: false}
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
    }
  },
  computed: {
    setting() {
      return this.$store.state.qsiteApp.settings.find(setting => setting.name == this.settingName)
    },
    crudSettingsParams() {
      return {
        crudData: import('@imagina/qsite/_crud/settings'),
        type: "only-create",
        ref: "settingsCrud",
        customData: {
          create: {method: this.createRecommendation}
        }
      }
    }
  },
  methods: {
    init() {
      this.getSettings(true)
    },
    //Get data
    getSettings(refresh = false) {
      return new Promise(async (resolve, reject) => {
        this.loading = true
        await this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS')
        this.loading = false
      })
    },
    //Create recommendation
    createRecommendation(recommendationData) {
      return new Promise(resolve => {
        //Get setting data
        let settingData = {...(this.setting || {}), ...recommendationData}
        //Request data
        let requestData = {attributes: {}}
        requestData.attributes[this.settingName] = settingData
        console.warn(requestData)

        this.$crud.post('apiRoutes.qsite.settings', requestData).then(response => {
          console.warn(response)
        })

        resolve(true)
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
