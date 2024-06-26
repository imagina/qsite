<template>
  <div id="settingPage" class="relative-position">
    <!--Page Actions-->
    <div class="q-mb-md">
      <div class="box box-auto-height">
        <page-actions :title="$tr(mainConfig.perzonalizationPage.title)"
                      :description="$tr(mainConfig.perzonalizationPage.description)"
                      @refresh="getData(true)"/>
      </div>
    </div>
    <!--Empty results-->
    <not-result class="box box-auto-height" v-if="!loading && !formBlocks.length"/>
    <!--Content-->
    <div v-if="!loading && formBlocks.length" class="row q-col-gutter-md">
      <!--Quick settings-->
      <div id="quickSettingsContent" class="col-12 col-xl-4" v-if="Object.keys(quickSettings).length">
        <div class="block box box-auto-height">
          <!--Icon-->
          <q-icon name="fas fa-bolt" class="block__icon q-mr-sm"/>
          <!--Title-->
          <div class="block__title-content row items-center q-mb-md">
            <div class="block__title ellipsis-2-lines">{{ $tr('isite.cms.quickSettings') }}</div>
          </div>
          <!--Group-->
          <div class="block__content">
            <dynamic-form v-model="form" :blocks="quickSettings" form-type="grid"
                          ref="settingsForm" @submit="saveSettings()" :loading="loading"/>
          </div>
        </div>
      </div>
      <!--Group settings-->
      <div class="col-12 col-xl">
        <div class="row q-col-gutter-md">
          <!--Block targets-->
          <div v-for="(block, keyBlock) in formBlocks" :key="keyBlock"
               class="col-12 col-sm-6 col-lg-4">
            <div class="block box box-auto-height" @click="block.action ? block.action(block) : null">
              <!--Icon-->
              <q-icon :name="block.icon || 'fas fa-paint-brush'" class="block__icon q-mr-sm"/>
              <!--Title-->
              <div class="block__title-content row items-center">
                <div class="block__title ellipsis-2-lines">{{ block.title }}</div>
              </div>
              <!--Description-->
              <div class="block__description ellipsis-3-lines"> {{ block.description || '...' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Form modal-->
    <master-modal v-model="formModal.show" v-bind="formModal.props">
      <dynamic-form v-model="form" :blocks="formModal.blocks" form-type="grid" no-actions
                    ref="settingsForm" @submit="saveSettings()" :loading="loading"/>
    </master-modal>
    <!--Crud - Organization-->
    <crud-component v-if="organization && (mainConfig.moduleName == 'isite')" module="isite" entity="organization"
                    @obtained="crudData => cruds.push(crudData)" ref="crud-isite-organization"/>
    <!--Crud - Domains-->
    <crud-component v-if="organization && (mainConfig.moduleName == 'isite')" module="isite" entity="domain"
                    @obtained="crudData => cruds.push(crudData)" ref="crud-isite-domain"/>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {
    '$route.name'(newValue) {
      this.init()
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
      form: {},
      locale: {fields: {}, fieldsTranslatable: {}},
      dataSettings: false,
      moduleSelected: false,
      groupSelected: false,
      settingsToEdit: {},
      deprecatedSettings: [],
      groupsName: {},
      formModal: {
        show: false,
        blocks: null
      },
      cruds: [],
      settingGroupLabels: null
    }
  },
  computed: {
    //Organization
    organization() {
      let organizationId = this.$store.state.quserAuth.organizationId
      let organizations = this.$store.state.quserAuth.organizations

      if (!organizationId) return null

      return organizations.find(item => item.id == organizationId)
    },
    //Return main config from current route
    mainConfig() {
      return {
        perzonalizationPage: {
          otherModules: [],
          cruds: []
        },
        ...this.$route.meta.mainConfig
      }
    },
    //Return setting assigned settings
    assignedSettings() {
      let userSettings = this.$store.state.quserAuth.settings || {}
      let assignedSettings = userSettings.assignedSettings || []
      return Array.isArray(assignedSettings) ? assignedSettings : []
    },
    //Return settings group
    settingsGroup() {
      let response = {} //Default response
      this.groupsName = {}// reset group names
      let settings = this.$clone(this.dataSettings)

      //Group fields
      Object.keys(settings).forEach(moduleName => {
        response[moduleName] = {General: {}}//Default module
        Object.keys(settings[moduleName]).forEach(fieldName => {
          let field = settings[moduleName][fieldName]//Get field
          //Create group fields
          //Set group name
          if (!this.groupsName[moduleName]) this.groupsName[moduleName] = {}
          this.groupsName[moduleName][field.groupName || 'General'] = (field.groupTitle || 'General')
          //validate ig group already exist
          if (!response[moduleName][field.groupName || 'General']) response[moduleName][field.groupName || 'General'] = {}
          //Add field
          if (!this.deprecatedSettings.includes(field.name) && !this.deprecatedSettings.includes(field.fakeFieldName))
            response[moduleName][field.groupName || 'General'][fieldName] = field
        })
      })

      //Validate assigned settings
      if (this.assignedSettings.length) {
        Object.keys(response).forEach(moduleName => {
          Object.keys(response[moduleName]).forEach(moduleGroupName => {
            Object.keys(response[moduleName][moduleGroupName]).forEach(settingName => {
              let setting = response[moduleName][moduleGroupName][settingName]
              if (!this.assignedSettings.includes(setting.fakeFieldName || setting.name))
                delete response[moduleName][moduleGroupName][settingName]
            })
          })
        })
      }

      //Validate empty groups
      Object.keys(response).forEach(moduleName => {
        let keepModule = false
        //Validate if some child group has settings
        Object.keys(response[moduleName]).forEach(moduleGroupName => {
          if (Object.keys(response[moduleName][moduleGroupName]).length) keepModule = true
        })
        //Delete module from data
        if (!keepModule) delete response[moduleName]
      })

      //Response
      return response
    },
    //Return form fields settings to edit
    formBlocks() {
      let blocks = []

      //Custom settings fields
      if (Object.keys(this.settingsToEdit).length) {
        blocks.push({title: 'General', groupName: 'general', fields: this.$clone(this.settingsToEdit)})
      } else {//Get module settgins
        //Get module name
        let modulesToLoadSettings = [
          this.mainConfig.moduleName,
          ...(this.mainConfig.perzonalizationPage?.otherModules || [])
        ]
        //Get settings
        Object.keys(this.settingsGroup).forEach(moduleName => {
          if (modulesToLoadSettings.includes(moduleName.toLowerCase())) {
            Object.keys(this.settingsGroup[moduleName]).forEach(groupName => {
              //Search by group in blocks
              let groupIndex = blocks.findIndex(item => item.groupName == groupName)
              //Merge fields at same group
              if (groupIndex >= 0) {
                blocks[groupIndex].fields = {
                  ...blocks[groupIndex].fields,
                  ...this.settingsGroup[moduleName][groupName]
                }
              } else {//Add new group
                blocks.push({
                  groupName: groupName,
                  title: this.groupsName[moduleName][groupName],
                  fields: this.settingsGroup[moduleName][groupName]
                })
              }
            })
          }
        })
      }

      //Set extra data to every field
      blocks.forEach((block, keyBlock) => {
        //Set action to block
        blocks[keyBlock].action = this.openBlock
        //Set title and description
        let groupLabel = this.groupsLabel[block.groupName.toLowerCase()]
        if (groupLabel) {
          blocks[keyBlock].icon = groupLabel.icon
          blocks[keyBlock].title = groupLabel.title || blocks[keyBlock].title
          blocks[keyBlock].description = groupLabel.description
        }
        //Add field id by fiedl
        Object.keys(block.fields).forEach(fieldName => {
          blocks[keyBlock].fields[fieldName] = {
            ...block.fields[fieldName],
            fieldItemId: this.getSettingId(block.fields[fieldName], fieldName)
          }
        })
      })

      //Add cruds cards
      if (this.organization && (this.mainConfig.moduleName == 'isite')) {
        blocks = [...blocks, ...this.cruds.map(crud => {
          return {
            ...crud.projectCrud, action: () => {
              //Organization crud
              if (crud.entity == 'organization')
                this.$refs[`crud-${crud.module}-${crud.entity}`].initUpdate(
                    this.organization.id,
                    {include: 'fields,schedule.workTimes'}
                )
              //Domains crud
              if (crud.entity == 'domain')
                this.$refs[`crud-${crud.module}-${crud.entity}`].initUpdate(
                    this.organization.id,
                    {filter: {field: 'organization_id'}}
                )
            }
          }
        })]
      }

      //response
      return blocks
    },
    //Quick settings
    quickSettings() {
      //Instance response
      let response = []
      //Get blocks
      let blocks = this.$clone(this.formBlocks)

      //Set extra data to every field
      blocks.forEach((block, keyBlock) => {
        //Add field id by fiedl
        if (block.fields) {
          //Keep only quickSettings fields
          Object.keys(block.fields).forEach(fieldName => {
            blocks[keyBlock].fields[fieldName].colClass = 'col-12'
            if (!blocks[keyBlock].fields[fieldName].quickSetting) delete blocks[keyBlock].fields[fieldName]
          })
          //Add blocks with quickFields to response
          if (Object.keys(blocks[keyBlock].fields).length) response.push(blocks[keyBlock])
        }
      })

      //Response
      return response
    },
    //return module settings label
    groupsLabel() {
      let response = {}
      if (!this.settingGroupLabels) return response
      Object.keys(this.settingGroupLabels).forEach(moduleName => {
        if (moduleName.toLowerCase() == this.mainConfig.moduleName.toLowerCase()) {
          Object.keys(this.settingGroupLabels[moduleName]).forEach(itemName => {
            response[itemName.toLowerCase()] = this.$clone(this.settingGroupLabels[moduleName][itemName])
          })
        }
      })
      return response
    }
  },
  methods: {
    //Init method
    async init() {
      await this.getData()//Get data
      this.openSettingName()//Open default group
    },
    //Get Data
    getData(refresh = false) {
      return new Promise(async resolve => {
        this.loading = true
        await Promise.all([
          this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS', {refresh: refresh}),//Get settings
          this.getSettingGroupConfig(refresh),//Get setting fields
          this.getSettingFields(refresh),//Get setting fields
          this.getDeprecatedSettings(refresh)//Get seprecated settings
        ])
        //Set Default selected
        if (!this.moduleSelected && this.dataSettings) {
          this.moduleSelected = Object.keys(this.settingsGroup)[0]//Set module selected
          //Set group selected
          if (!this.groupSelected) this.groupSelected = Object.keys(this.settingsGroup[this.moduleSelected])[0]
        }
        this.$store.dispatch('qsiteApp/SET_SITE_COLORS')//Set colors
        this.setFormData()//Set form data
        this.loading = false
        resolve(true)
      })
    },
    //Get config from modules
    getSettingGroupConfig(refresh = false) {
      return new Promise((resolve, reject) => {
        this.dataSettings = false//Reset data settings
        //Request Params
        let requestParams = {
          refresh: true,
          params: {filter: {allTranslations: true, configNameByModule: 'config.settingGroups'}}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          this.settingGroupLabels = this.$clone(response.data)
          resolve(true)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error)
          })
        })
      })
    },
    //Get settings Fields
    getSettingFields(refresh = false) {
      return new Promise((resolve, reject) => {
        this.dataSettings = false//Reset data settings
        //Request Params
        let requestParams = {
          refresh: refresh,
          params: {filter: {allTranslations: true, configNameByModule: 'settings-fields'}}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          //Default settings fields
          let settingsFields = {}

          //Get only settings fields from configs
          if (response.data) {
            for (var moduleName in response.data) {
              let fields = response.data[moduleName]
              if (fields && Object.keys(fields).length) settingsFields[moduleName] = fields
            }
          }

          //Set settings fields
          if (Object.keys(settingsFields).length) this.dataSettings = settingsFields
          resolve(response.data)
        }).catch(e => {
          this.$apiResponse.handleError(error, () => {
            this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
            resolve([])
          })
        })
      })
    },
    //Get deprecate settings config
    getDeprecatedSettings(refresh = false) {
      return new Promise((resolve, reject) => {
        //Request Params
        let requestParams = {
          refresh: refresh,
          params: {filter: {configName: 'isite.deprecated-settings'}}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          this.deprecatedSettings = this.$clone(response.data)
          resolve(response.data)
        }).catch(e => {
          this.$apiResponse.handleError(error, () => {
            this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
            resolve([])
          })
        })
      })
    },
    //Set form Data
    setFormData() {
      let formData = {}//instance form data
      let settingValues = this.$clone(this.$store.state.qsiteApp.settings)//Get all setting values
      let defaultLocale = this.$clone(this.$store.state.qsiteApp.defaultLocale)//Get selected locales
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      selectedLocales.forEach(item => formData[item] = {})//set locales to formData

      //Get all formFields from blocks
      let formFields = []
      this.formBlocks.forEach(item => formFields = {...formFields, ...item.fields})

      //Format settings
      Object.values(formFields).forEach(field => {
        //Get setting field
        let setting = settingValues.find(item => item.name == (field.fakeFieldName || field.name))//Get setting value
        //Set by language
        if (field.isTranslatable) {
          selectedLocales.forEach(lang => {
            let value = setting.translations ? setting.translations.find(item => item.locale == lang) : null
            try {
              formData[lang][setting.name] = value ? JSON.parse(value.value) : setting.value
            } catch (err) {
              formData[lang][setting.name] = value ? value.value : setting.value
            }
          })
        } else formData[setting.name] = setting.value
      })

      //Set form data
      setTimeout(() => this.form = this.$clone(formData), 50)
    },
    //Return item Id to field
    getSettingId(field, key) {
      //Get setting name
      let settingName = field.fakeFieldName || field.name || key
      //Get all setting values
      let settingValue = this.$store.state.qsiteApp.settings.find(item => item.name == settingName)
      //Response
      return settingValue ? settingValue.id : null
    },
    //Get dataForm. order settings data to backend
    getDataForm() {
      let formData = this.$clone(this.form)//Get form data
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      let response = {}//Default response

      Object.keys(formData).forEach(fieldName => {
        //Set no translatable fields
        if (selectedLocales.indexOf(fieldName) == -1) response[fieldName] = formData[fieldName]
        else {//Set translatables values. Order translate values
          Object.keys(formData[fieldName]).forEach(transfieldName => {
            if (!response[transfieldName]) response[transfieldName] = {}
            response[transfieldName][fieldName] = (typeof formData[fieldName][transfieldName] == 'string') ?
                formData[fieldName][transfieldName] : JSON.stringify(formData[fieldName][transfieldName])

          })
        }
      })

      //Response
      return response
    },
    //Save settings
    saveSettings() {
      this.loading = true
      //Request data
      let requestData = {attributes: this.getDataForm()}
      //Request
      this.$crud.post('apiRoutes.qsite.settings', requestData).then(async response => {
        this.getData(true)
        this.formModal.show = false
        this.$alert.info(this.$tr('isite.cms.message.recordUpdated'))
      }).catch(error => {
        this.$alert.error(this.$tr('isite.cms.message.recordNoUpdated'))
        console.error('[UPDATE-SETTINGS]::error:', error)
        this.loading = false
      })
    },
    //Open setting name
    openSettingName() {
      let settingsToEdit = {}//Reset settings module
      let moduleName = this.$route.query.module//Get setting from URL
      let settingsName = this.$route.query.settings//Get settings name from url

      //Get settings by module name
      let moduleSettings = this.$clone(this.settingsGroup[this.$helper.toCapitalize(moduleName || '')])

      if (moduleSettings) {
        //Search by setting name
        if (settingsName) {
          //Add module name to every setting name
          settingsName = settingsName.split(',').map(item => `${moduleName.toLowerCase()}::${item}`)
          //Search setting by name
          Object.keys(moduleSettings || []).forEach(moduleGroupName => {
            Object.keys(moduleSettings[moduleGroupName]).forEach(settingName => {
              let setting = moduleSettings[moduleGroupName][settingName]
              if (settingsName.includes(setting.name) || settingsName.includes(setting.fakeFieldName)) {
                settingsToEdit[settingName] = setting
              }
            })
          })
        }
      }

      //Set settings to Edit
      this.settingsToEdit = this.$clone(settingsToEdit)
      //Open group settings
      if (Object.keys(this.settingsToEdit).length) this.openBlock(this.formBlocks[0])
    },
    //Open block form
    openBlock(block) {
      this.formModal = {
        show: true,
        blocks: [block],
        props: {
          title: block.title,
          customPosition: true,
          actions: [
            {
              props: {
                label: this.$tr('isite.cms.label.save'),
                color: 'green',
              },
              action: () => {
                if (this.$refs.settingsForm) {
                  this.$refs.settingsForm.changeStep('next', true)
                }
              }
            }
          ]
        }
      }
    }
  }
}
</script>
<style lang="scss">
#settingPage {
  #quickSettingsContent {
    .block__content {
      .box {
        box-shadow: none;
        border: 1px solid $grey-3;
        border-radius: $custom-radius;
      }
    }
  }

  .block {
    position: relative;
    cursor: pointer;

    &__icon {
      position: absolute;
      left: 15px;
      top: 15px;
      background-color: $primary;
      border-radius: 50%;
      padding: 6px;
      color: white;
      font-size: 16px;
    }

    &__title-content {
      height: 28px;
      max-height: 28px;
    }

    &__title {
      padding-left: 35px;
      line-height: 1;
      color: $blue-grey;
      font-weight: bold;
    }

    &__description {
      line-height: 1;
      color: $grey-8;
      font-size: 14px;
      padding-top: 8px;
      height: 50px;
      max-height: 50px;
    }
  }
}
</style>
