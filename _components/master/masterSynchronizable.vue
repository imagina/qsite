<template>
  <template>
    <master-modal v-model="showModal" icon="fa-light fa-folder-tree" width="380px" :loading="loading"
                  :title="modalTitle" @show="init()" custom-position>
      <!--Content of Modal-->
        <div class="relative-position" v-if="!loading">
          <div class="row q-col-gutter-md">
            <dynamic-field v-if="hasNewUpdates" :field="bannerConfig"/>
            <!--Generate File to Export-->
            <div id="createFileToExportContent" class="col-12" v-if="allowCreation || hasNewUpdates">
              <!--Subtitle-->
              <div class="text-blue-grey q-mb-sm q-px-md">
                <b>{{ $tr('isite.cms.modal.welcomeMassiveSync') }}</b>
              </div>
              <!--Content of Creation-->
              <div class="text-caption q-mb-xs q-px-md">
                <p>{{ $tr('isite.cms.modal.integrateCloudFramework') }}</p>

                <br />

                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-file-lock" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.generateStepOne') }}</q-item-label>
                      <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepOne') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-star" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.generateStepTwo') }}</q-item-label>
                      <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepTwo') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-table" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.generateStepThree') }}</q-item-label>
                      <q-item-label caption>{{ $tr('isite.cms.modal.generateBodyStepThree') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-circle-exclamation" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.importantNote') }}</q-item-label>
                      <q-item-label caption>{{ $tr('isite.cms.modal.importantNoteBody') }}</q-item-label>
                    </q-item-section>
                  </q-item>

                </q-list>
              </div>
              <br />
              <!--Create File-->
              <div class="text-left col-12 q-px-md">
                <dynamic-field v-model="enabledEmails" :field="emailsConfig" />
                <br />
                <q-btn :label="$tr('isite.cms.modal.activate')" color="green" rounded unelevated size="13px"
                       padding="xs sm" class="full-width" @click="generateFile" />
              </div>
            </div>
            <!--Sync Data-->
            <div id="exportImportFileContent" v-if="!allowCreation && !hasNewUpdates" class="q-mb-md col-12">
              <!--Header title-->
              <div class="row text-blue-grey q-mb-sm q-px-md justify-between">
                <b>{{ $tr('isite.cms.modal.syncNow') }}</b>

                <!--Refresh info-->
                <q-btn rounded dense unelevated size="md" padding="sm" class="btn-small btn-outlined-custom"
                       icon="fa-light fa-rotate-right" @click="getData">
                  <q-tooltip>{{ $tr('isite.cms.label.refresh') }}</q-tooltip>
                </q-btn>
              </div>

              <!--Actions to Sync-->
              <div class="text-left col-12 q-mb-sm q-px-md">
                <q-list bordered class="rounded-borders">
                  <!--Get document-->
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-file-lines" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.syncStepOne') }}</q-item-label>
                      <!--Redirect to sheet-->
                      <q-item-label caption>
                        {{ $tr('isite.cms.modal.syncBodyStepOne') }} <a class="text-primary" :href="linkToFile"
                                                                        target="_blank">{{
                          $tr('isite.cms.modal.syncBodyLinkStepOne')
                        }}</a>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!--Export dependencies-->
                  <q-separator v-if="supportedActions.dependencies" spaced />
                  <q-item v-if="supportedActions.dependencies">
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-folder-arrow-up" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.syncStepTwo') }}</q-item-label>
                      <q-item-label caption>
                        <p>{{ $tr('isite.cms.modal.syncBodyStepTwo') }}</p>
                        <!--Action to export dependencies-->
                        <q-btn class="q-mt-sm" color="green" @click="synchronizableFile('export', true)" rounded
                               unelevated size="13px" padding="xs 18px" :disable="!canSyncData">
                          <div v-if="canSyncData || params.isRunning !== 'dependencies'" class="row items-center no-wrap">
                            <p>{{ $tr('isite.cms.label.export') }} {{ $tr('isite.cms.modal.dependencies') }}</p>
                            <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-down-to-line"/>
                          </div>
                          <div v-if="params.isRunning === 'dependencies'" class="row items-center no-wrap">
                            <p>{{ $tr('isite.cms.modal.inProgress') }}</p><q-spinner size="15px" class="q-ml-sm" />
                          </div>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced />
                  <!--Important Note-->
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="fa-light fa-circle-exclamation" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $tr('isite.cms.modal.importantNote') }}</q-item-label>
                      <q-item-label caption>{{ $tr('isite.cms.modal.syncImportantNoteBody') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!--Export Entity-->
              <div class="text-left col-12 q-mt-lg q-mb-sm q-px-md" v-if="supportedActions.export">
                <b class="text-blue-grey">{{ $tr('isite.cms.modal.exportDataTitle') }}</b>
                <p class="q-my-sm">{{ $tr('isite.cms.modal.exportDataBody') }}</p>

                <!--Action to export entity-->
                <q-btn color="green" @click="synchronizableFile('export')" rounded unelevated size="13px"
                       padding="xs 18px" :disable="!canSyncData">
                  <div v-if="canSyncData || params.isRunning !== 'export'" class="row items-center no-wrap">
                    <p>{{ $tr('isite.cms.label.export') }}</p>
                    <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-down-to-line" />
                  </div>
                  <div v-if="params.isRunning === 'export'" class="row items-center no-wrap">
                    <p>{{ $tr('isite.cms.modal.inProgress') }}</p>
                    <q-spinner size="15px" class="q-ml-sm" />
                  </div>
                </q-btn>

              </div>

              <!--Import Entity-->
              <div v-if="supportedActions.import" class="text-left col-12 q-mt-lg q-mb-sm q-px-md">
                <b class="text-blue-grey">{{ $tr('isite.cms.modal.importDataTitle') }}</b>
                <p class="q-my-sm">{{ $tr('isite.cms.modal.importDataBody') }}</p>

                <!--Action to import entity-->
                <q-btn color="green" @click="synchronizableFile('import')" rounded unelevated size="13px"
                       padding="xs 18px" :disable="!canSyncData">
                  <div v-if="canSyncData || params.isRunning !== 'import'" class="row items-center no-wrap">
                    <p>{{ $tr('isite.cms.modal.import') }}</p>
                    <q-icon class="q-ml-sm" size="15px" name="fa-light fa-arrow-up-to-line" />
                  </div>
                  <div v-if="params.isRunning === 'import'" class="row items-center no-wrap">
                    <p>{{ $tr('isite.cms.modal.inProgress') }}</p>
                    <q-spinner size="15px" class="q-ml-sm" />
                  </div>
                </q-btn>
            </div>
          </div>
        </div>
      </div>
    </master-modal>
  </template>
</template>
<script>
export default {
  emits: ['update:modelValue'],
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      enabledEmails: null,
      routeParams: this.$helper.getInfoFromPermission(this.$route.meta.permission),
      linkToFile: null,
      params: false,
      showModal: false
    };
  },
  computed: {
    //Modal export title
    modalTitle() {
      //Get Title of the page
      const title = this.$tr(this.$route.meta.title)
      //Default response
      return `${this.$tr('isite.cms.label.massiveSynchronization')} - ${title}`;
    },
    //Let's you know if the file exists or no
    allowCreation() {
      return !this.params.spreadsheetId
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
          inputDebounce: '0',
          newValueMode: 'add-unique'
        }
      };
    },
    //Allows the supported actions
    supportedActions() {
      const entity = this.routeParams?.entity;

      const configs = this.getConfigs();

      //Get name of {module}_syn{entity}
      const name = this.getName()

      // Get Config of specifyc sync
      const syncConfig = configs?.synchronizable?.entities[name];
      //Get supported actions of sync
      const actions = syncConfig.supportedActions;

      return {
        import: !!actions.includes('import'),
        export: !!actions.includes('export'),
        dependencies: !!syncConfig.dependencies
      }
    },
    //Know if the process is running
    canSyncData() {
      return !this.params.isRunning || this.params.isRunning == 0;
    },
    bannerConfig() {
      return {
        type: 'banner',
        props: {
          color: 'info',
          icon: 'fas fa-exclamation-triangle',
          message: this.$tr('isite.cms.modal.updateNewVersion')
        }
      }
    },
    //Check if exist a new version of template
    hasNewUpdates() {
      return this.params.baseTemplateId === null;
    },
  },
  methods: {
    init() {
      this.getData();
    },
    //Get data export config
    getData() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.params = false;//Reset params
        if (!this.routeParams) return resolve(false);

        //Get name of entity
        const entity = this.routeParams.entity;
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
        };

        //Request
        this.$crud.show('apiRoutes.qsite.synchronizables', nameFile, requestParams).then(response => {
          this.params = this.$clone(response.data);
          //Configure the link to access the file
          this.linkToFile = `https://docs.google.com/spreadsheets/d/${this.params.spreadsheetId}`;
          this.$emit('update:modelValue', this.$clone(response.data));
          this.loading = false;
          resolve(response.data);
        }).catch(error => {
          this.loading = false;
          reject(error);
        });
      });
    },
    //Generate File To Export
    generateFile() {
      this.loading = true;

      // Validate if is a valid email
      const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      const isCorrectEmail = this.enabledEmails.every(email => regex.test(email));

      if (!this.enabledEmails.length || !isCorrectEmail) {
        this.$alert.error({ message: this.$tr('isite.cms.modal.registerEmails'), pos: 'bottom' });
        this.loading = false;
      } else {
        //Create request
        const requestParams = {
          attributes: {
            module: this.routeParams.module,
            enabled_emails: this.enabledEmails,
            entity: this.routeParams.entity
          }
        };

        // Info the user about the loading
        this.$alert.info({ message: this.$tr('isite.cms.modal.generateFile') });

        this.$crud.post('apiRoutes.qsite.generateFile', requestParams).then(response => {
          this.$alert.success({ message: this.$tr('isite.cms.modal.generateSuccess') });
          this.getData();
        }).catch(error => {
          this.$alert.error({ message: error });
          this.loading = false;
        })
      }
    },
    //Sync file to export/import
    synchronizableFile(type, exportDependencies = false) {
      this.loading = true
      // Get name of file to Export
      let nameFile = this.getName();

      // Make request to Sync data
      const requestParams = {
        attributes: {
          name: nameFile,
          exportDependencies,
          type: type,
          requestParams: {
            'filter': {},
            'include': {}
          }
        }
      };

      this.$crud.post('apiRoutes.qsite.sync', requestParams).then(response => {
        this.$alert.success({ message: this.$tr('isite.cms.modal.syncSuccess') });
        this.getData();
      }).catch(error => {
        this.loading = false;
        this.$alert.error({ message: error });
      });

    },
    //Show modal
    show() {
      this.showModal = true;
    },
    //Get all configs of module
    getConfigs() {
      const moduleParam = this.routeParams?.module;
      const module = moduleParam[0].toUpperCase() + moduleParam.slice(1);

      return this.$store.state?.qsiteApp?.configs[module];
    },
    //Get current name for search in DB
    getName() {
      return `${this.routeParams.module}_sync${this.routeParams.entity[0].toUpperCase()}${this.routeParams.entity.slice(1)}`;
    }
  }
};
</script>
<style lang="scss">
</style>
