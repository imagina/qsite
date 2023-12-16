<template>
  <master-modal v-model="showModal" icon="fa-light fa-folder-tree" width="380px" :loading="loading"
                :title="modalTitle" @show="init()" custom-position>
    <!--Content of Modal-->
    <div class="relative-position" v-if="!loading">
      <div class="row q-col-gutter-md">
        <!--Generate File to Export-->
        <div id="createFileToExportContent" class="col-12" v-if="allowCreation">
          <!--Subtitle-->
          <div class="text-blue-grey q-mb-sm q-px-md">
            <b>{{ $tr('isite.cms.modal.welcomeMassiveSync') }}</b>
          </div>
          <!--Content of Creation-->
          <div class="text-caption q-mb-xs q-px-md">
            <p>{{ $tr('isite.cms.modal.integrateCloudFramework') }}</p>

            <br/>

            <q-list bordered class="rounded-borders">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-file-lock"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.generateStepOne') }}</q-item-label>
                  <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepOne') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced/>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-star"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.generateStepTwo') }}</q-item-label>
                  <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepTwo') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced/>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-table"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.generateStepThree') }}</q-item-label>
                  <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepThree') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced/>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-circle-exclamation"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.importantNote') }}</q-item-label>
                  <q-item-label caption>{{ $tr('isite.cms.modal.importantNoteBody') }}</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
          </div>
          <br/>
          <!--Create File-->
          <div class="text-left col-12 q-px-md">
            <dynamic-field v-model="enabledEmails" :field="emailsConfig"/>
            <br/>
            <q-btn :label="$tr('isite.cms.modal.activate')" color="green" rounded unelevated size="13px"
                   padding="xs sm" class="full-width" @click="generateFile"/>
          </div>
        </div>
        <div id="exportImportFileContent" v-if="!allowCreation" class="q-mb-md col-12">
          <div class="row text-blue-grey q-mb-sm q-px-md justify-between">
            <b>{{ $tr('isite.cms.modal.syncNow') }}</b>

            <q-btn rounded dense unelevated size="md" class="btn-small btn-outlined-custom"
                   icon="fa-light fa-rotate-right" @click="getData">
              <q-tooltip>{{ $tr('isite.cms.label.refresh') }}</q-tooltip>
            </q-btn>
          </div>

          <div class="text-left col-12 q-mb-sm q-px-md">
            <q-list bordered class="rounded-borders">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-file-lines"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.syncStepOne') }}</q-item-label>
                  <q-item-label caption>
                    {{ $tr('isite.cms.modal.syncBodyStepOne') }} <a class="text-primary" :href="linkToFile"
                                                                    target="_blank">{{
                      $tr('isite.cms.modal.syncBodyLinkStepOne')
                    }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-if="allowImport.moreInfoProducts" spaced/>
              <q-item v-if="allowImport.moreInfoProducts">
                <q-item-section avatar>
                  <q-icon name="fa-light fa-folder-arrow-up"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.syncStepTwo') }}</q-item-label>
                  <q-item-label caption>
                    <p>{{ $tr('isite.cms.modal.syncBodyStepTwo') }}</p>
                    <q-btn class="q-mt-sm" color="green" @click="synchronizableFile('export', 'Categories')" rounded
                           unelevated size="13px" padding="xs 18px" :disable="!canSyncData">
                      <div class="row items-center no-wrap">
                        <p>{{ $tr('isite.cms.label.export') }} {{ $tr('isite.cms.modal.categories') }}</p>
                        <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-down-to-line"/>
                      </div>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced/>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="fa-light fa-circle-exclamation"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $tr('isite.cms.modal.importantNote') }}</q-item-label>
                  <q-item-label caption>{{ $tr('isite.cms.modal.syncImportantNoteBody') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="text-left col-12 q-mt-lg q-mb-sm q-px-md">
            <b class="text-blue-grey">{{ $tr('isite.cms.modal.exportDataTitle') }}</b>
            <p class="q-my-sm">{{ $tr('isite.cms.modal.exportDataBody') }}</p>

            <q-btn color="green" @click="synchronizableFile('export')" rounded unelevated size="13px"
                   padding="xs 18px" :disable="!canSyncData">
              <div v-if="canSyncData || params.isRunning !== 'export'" class="row items-center no-wrap">
                <p>{{ $tr('isite.cms.label.export') }}</p>
                <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-down-to-line"/>
              </div>
              <div v-if="params.isRunning === 'export'" class="row items-center no-wrap">
                <p>{{ $tr('isite.cms.modal.inProgress') }}</p><q-spinner size="15px" class="q-ml-sm" />
              </div>
            </q-btn>

          </div>

          <div v-if="allowImport.exclude" class="text-left col-12 q-mt-lg q-mb-sm q-px-md">
            <b class="text-blue-grey">{{ $tr('isite.cms.modal.importDataTitle') }}</b>
            <p class="q-my-sm">{{ $tr('isite.cms.modal.importDataBody') }}</p>

            <q-btn  color="green" @click="synchronizableFile('import')" rounded unelevated size="13px" padding="xs 18px"
                   :disable="!canSyncData">
              <div v-if="canSyncData || params.isRunning !== 'import'" class="row items-center no-wrap">
                <p>{{ $tr('isite.cms.modal.import') }}</p>
                <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-up-to-line"/>
              </div>
              <div v-if="params.isRunning === 'import'" class="row items-center no-wrap">
                <p>{{ $tr('isite.cms.modal.inProgress') }}</p><q-spinner size="15px" class="q-ml-sm" />
              </div>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>
<script>
export default {
  beforeDestroy() {
  },
  props: {},
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
      enabledEmails: null,
      routeParams: this.$helper.getInfoFromPermission(this.$route.meta.permission),
      linkToFile: null,
      params: false,
      showModal: false,
    }
  },
  computed: {
    //Modal export title
    modalTitle() {
      //Get Title of the page
      const useLegacyStructure = parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0)
      const title = useLegacyStructure ? this.$tr(this.$route.meta.title) : this.$route.meta.title
      //Default response
      return `${this.$tr('isite.cms.label.massiveSynchronization')} - ${title}`
    },
    //Let's you know if the file exists or no
    allowCreation() {
      return !this.params.sheetId
    },
    //Configuration for the dynamic field
    emailsConfig() {
      return {
        value: [],
        type: 'select',
        props: {
          label: `${this.$trp('isite.cms.form.email')}*`,
          useInput: true,
          useChips: true,
          multiple: true,
          hideDropdownIcon: true,
          inputDebounce: "0",
          newValueMode: "add-unique"
        }
      }
    },
    //Allows to know who can have the import button and who will have additional information
    allowImport() {
      const entity = this.routeParams?.entity
      return {
        exclude: !['categories'].includes(entity),
        moreInfoProducts: ['products'].includes(entity)
      }
    },
    //Know if the process is running
    canSyncData() {
      return !this.params.isRunning || this.params.isRunning == 0
    }
  },
  methods: {
    init() {
      this.getData()
    },
    //Get data export config
    getData() {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.params = false//Reset params
        if (!this.routeParams) return resolve(false)

        //Get name of entity
        const entity = this.routeParams.entity
        // Get name of file to Export
        const nameFile = `${this.routeParams.module}_sync${entity[0].toUpperCase()}${entity.slice(1)}`;

        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              field: 'name'
            }
          }
        }

        //Request
        this.$crud.show('apiRoutes.qsite.synchronizables', nameFile, requestParams).then(response => {
          this.params = this.$clone(response.data)
          //Configure the link to access the file
          this.linkToFile = `https://docs.google.com/spreadsheets/d/${this.params.sheetId}`
          this.$emit('input', this.$clone(response.data))
          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
    },
    //Generate File To Export
    generateFile() {
      this.loading = true

      // Validate if is a valid email
      const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      const isCorrectEmail = this.enabledEmails.every(email => regex.test(email))

      if (!this.enabledEmails.length || !isCorrectEmail) {
        this.$alert.error({message: this.$tr('isite.cms.modal.registerEmails'), pos: 'bottom'})
      } else {
        //Create request
        const requestParams = {
          attributes: {
            module: this.routeParams.module,
            enabled_emails: this.enabledEmails
          }
        }

        // Info the user about the loading
        this.$alert.info({message: this.$tr('isite.cms.modal.generateFile')})

        this.$crud.post('apiRoutes.qsite.generateFile', requestParams).then(response => {
          this.$alert.success({message: this.$tr('isite.cms.modal.generateSuccess')})
          this.getData()
        }).catch(error => this.$alert.error({message: error}))
      }
    },
    //Sync file to export/import
    synchronizableFile(type, customEntity = '') {
      this.loading = true
      // Get name of file to Export
      let nameFile = `${this.routeParams.module}_sync${this.routeParams.entity[0].toUpperCase()}${this.routeParams.entity.slice(1)}`;
      // If a customEntity exists, modify the request to the custom
      if (customEntity.length) {
        nameFile = `${this.routeParams.module}_sync${customEntity}`
      }

      // Make request to Sync data
      const requestParams = {
        attributes: {
          name: nameFile,
          type: type,
          requestParams: {
            "filter": {},
            "include": {}
          }
        }
      }

      this.$crud.post('apiRoutes.qsite.sync', requestParams).then(response => {
        this.$alert.success({message: this.$tr('isite.cms.modal.syncSuccess')})
        this.getData()
      }).catch(error => {
        this.loading = false
        this.$alert.error({message: error})
      })

    },
    //Show modal
    show() {
      this.showModal = true
    },
  }
}
</script>
<style lang="stylus">
</style>