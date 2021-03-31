<template>
  <div id="masterExportComponent">
    <!--== Button export ==-->
    <q-btn icon="fas fa-file-download" unelevated rounded color="primary" class="btn-action"
           v-if="params" @click="showModal = true">
      <q-tooltip>{{ $tr('ui.label.export') }}</q-tooltip>
    </q-btn>

    <!--Content-->
    <q-dialog id="contentMasterExportComponent" @hide="reset()" @show="init()"
              v-model="showModal" persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card id="cardContent" style="max-width: 350px; background-color: #eef5f9">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <q-icon name="fas fa-file-download" color="white"/>
            {{ $tr('ui.label.export') }}
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <!--Content-->
        <q-card-section class="relative-position">
          <div class="row q-col-gutter-md">
            <!--Title-->
            <div class="col-12 text-blue-grey text-weight-bold text-center">
              <div class="box" style="min-height: auto">
                <q-icon :name="params.icon" class="q-mr-sm" size="16px"/>
                {{ $tr(params.title) }}
              </div>
            </div>
            <!--Generate new report-->
            <div id="newReportContent" class="col-12" v-if="!customExportData">
              <div class="box">
                <!--Title-->
                <div class="text-blue-grey q-mb-sm">
                  <b>{{ $tr('qsite.layout.messages.newReport') }}</b>
                </div>
                <!--Text help-->
                <div class="text-caption q-mb-xs"
                     v-html="$tr('qsite.layout.messages.newExportHelpText', {pageTitle: $tr($route.meta.title)})"></div>
                <!--Actions-->
                <div class="text-right q-mt-md">
                  <!--Extra filter fields-->
                  <q-form autocorrect="off" autocomplete="off" ref="formContent"
                          class="row full-width"
                          @submit="newReport()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
                    <!--Fields-->
                    <dynamic-field v-for="(field, keyField) in exportFields" :key="keyField" :field="field"
                                   class="col-12" v-model="filters[keyField]"/>
                    <!--Submit-->
                    <div class="text-right col-12">
                      <q-btn :label="$tr('ui.label.create')" color="green" rounded unelevated size="11px"
                             padding="xs sm" type="submit"/>
                    </div>
                  </q-form>
                </div>
              </div>
            </div>
            <!--Last Report information-->
            <div id="lastReportContent" v-if="fileExport && fileExport.path" class="q-mb-md col-12">
              <div class="box">
                <!--Title-->
                <div class="text-blue-grey q-mb-sm">
                  <b>{{ $tr('qsite.layout.messages.lastReport') }}</b>
                </div>
                <!--Date-->
                <div class="text-caption">
                  <label class="text-blue-grey">{{ $tr('ui.label.date') }}:</label>
                  {{ $trd(fileExport.lastModified, {type: 'long'}) }}
                </div>
                <!--Size-->
                <div class="text-caption">
                  <label class="text-blue-grey">{{ $tr('ui.label.size') }}:</label>
                  {{ $helper.formatBytes(fileExport.size) }}
                </div>
                <!--Action-->
                <div class="text-right q-mt-md">
                  <q-btn :label="$tr('ui.label.download')" color="green" rounded unelevated size="11px" padding="xs sm"
                         @click="$helper.downloadFromURL(fileExport.path)"/>
                </div>
              </div>
            </div>
          </div>
          <!--Inner laoding-->
          <inner-loading :visible="loading"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('export.data.refresh')
    this.$eventBus.$off('isite.export.ready')
  },
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
      //this.init()
    })
  },
  data() {
    return {
      loading: false,
      customExportData: false,
      showModal: false,
      fileExport: false,
      filters: {}
    }
  },
  computed: {
    //Return params of subHeader
    params() {
      let subHeader = this.$route.meta.subHeader
      let response = this.customExportData ? this.customExportData :
        ((subHeader && subHeader.export) ? subHeader.export : false)
      return response
    },
    //Fields
    exportFields() {
      let subHeader = this.$route.meta.subHeader
      let response = (subHeader && subHeader.exportFields) ? subHeader.exportFields : {}
      return response
    }
  },
  methods: {
    init() {
      //Get data
      this.getData()
      //Listen event to push new messages
      this.$eventBus.$on('isite.export.ready', (response) => {
        this.$alert.info({
          message: this.$tr('qsite.layout.messages.exportReady', {fileName: response.data.fileName}),
          timeOut: 12000,
          actions: [
            {
              label: this.$tr('ui.label.showMore'),
              icon: 'fas fa-file-download',
              color: 'white',
              handler: () => {
                this.showReport(response.data)
              }
            }
          ]
        })
      })
      //Listen refresh report
      this.$root.$on('export.data.refresh', () => this.getData(true))
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        if (!this.params) return resolve(false)
        this.loading = true

        //Request params
        let requestParams = {
          refresh: true,
          params: {
            exportParams: this.params,
            filter: this.$filter ? this.$filter.values : {}
          }
        }

        //Request
        this.$crud.index('apiRoutes.qsite.export', requestParams).then(response => {
          this.fileExport = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Request new report
    newReport() {
      return new Promise((resolve, reject) => {
        this.loading = true

        //Request params
        let requestParams = {
          exportParams: this.params,
          filter: {...(this.$filter ? this.$filter.values : {}), ...this.filters}
        }

        //Request
        this.$crud.post('apiRoutes.qsite.export', requestParams).then(response => {
          this.$alert.info(this.$tr('qsite.layout.messages.reportInProgress', {fileName: this.params.fileName}))
          this.showModal = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Show report
    showReport(customExportData) {
      this.customExportData = this.$clone(customExportData)
      this.showModal = true
    },
    //Reset
    reset() {
      this.loading = false
      this.customExportData = false
      this.fileExport = false
      this.filters = {}
    }
  }
}
</script>
<style lang="stylus">
#masterExportComponent
  .q-btn-dropdown
    .q-btn-dropdown__arrow
      display none
</style>
