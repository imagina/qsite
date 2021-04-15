<template>
  <div id="settingPage" class="relative-position">
    <!--Empty result-->
    <not-result class="q-my-md" v-if="!loading && !dataSettings"/>
    <!--Content-->
    <div class="row q-col-gutter-md" v-else>
      <!--Menu settings-->
      <div id="menuContent" class="col-12 col-md-3">
        <div class="box" style="padding: 15px 0 !important;">
          <!--Title-->
          <div class="text-primary text-subtitle1 row items-center q-mb-sm q-px-md">
            <q-icon name="fas fa-boxes" class="q-mr-sm"/>
            {{ $trp('ui.label.module') }}
          </div>
          <!--List Modules-->
          <q-list separator>
            <q-expansion-item v-for="(item, moduleName) in settingsGroup" :key="moduleName" expand-separator
                              :label="moduleName" header-style="min-height: 38px" group="menuSettings"
                              :header-class="`q-pr-sm q-pl-md ${moduleSelected == moduleName ? 'q-item--active' : ''}`">
              <q-list separator class="q-pl-md">
                <q-item v-for="(group, groupName) in settingsGroup[moduleName]" :key="groupName" clickable v-ripple
                        :active="groupSelected == groupName && moduleSelected == moduleName" class="q-pl-sm q-pr-md"
                        @click.native="moduleSelected = moduleName, groupSelected = groupName, setLocaleConfig()"
                        dense v-if="Object.keys(group).length">
                  <q-item-section>{{ groupName }}</q-item-section>
                  <q-item-section side> {{ Object.keys(group).length }}</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
      <!--Form-->
      <div class="col-12 col-md-9">
        <div class="box">
          <!--Title-->
          <div class="text-primary text-subtitle1 row items-center q-mb-sm">
            <q-icon name="fas fa-cog" class="q-mr-sm"/>
            {{ moduleSelected || '' }} - {{ groupSelected || '' }}
          </div>
          <!--Language-->
          <locales v-model="locale" class="q-mb-md" ref="localesComponent"
                   v-show="locale.fieldsTranslatable && Object.keys(locale.fieldsTranslatable).length"/>
          <!--Fields content-->
          <div class="row full-width q-mb-md q-col-gutter-sm" v-if="locale.success && settingsGroup[moduleSelected]">
            <div v-for="(field, key) in settingsGroup[moduleSelected][groupSelected]" :key="key" :ref="key"
                 :class="field.columns || 'col-12'">
              <!--Dynamic field-->
              <dynamic-field v-if="!field.fakeFieldName && !field.children" :field="field" :language="locale.language"
                             :item-id="getSettingId(field,key)" v-model="locale.formTemplate[field.name || key]"/>
              <!--Dynamic fake field-->
              <dynamic-field v-else-if="field.fakeFieldName"
                             :language="locale.language" :field="field" :item-id="getSettingId(field,key)"
                             v-model="locale.formTemplate[field.fakeFieldName][field.name || key]"/>
              <!--Dynamic Children fields-->
              <div v-else-if="field.children">
                <!--Title-->
                <div class="text-grey-8">{{ field.label }}</div>
                <!---Child fields-->
                <div class="row full-width">
                  <div v-for="(chieldField, childKey) in field.children" :key="childKey" :ref="childKey"
                       :class="chieldField.columns || 'col-12'">
                    <!--Dynamic field-->
                    <dynamic-field v-if="!chieldField.fakeFieldName" :field="chieldField"
                                   :language="locale.language" :item-id="getSettingId(field,key)"
                                   v-model="locale.formTemplate[field.name || key][chieldField.name || childKey]"/>
                    <!--Dynamic fake field-->
                    <dynamic-field
                      v-else-if="chieldField.fakeFieldName"
                      :language="locale.language" :field="chieldField" :item-id="getSettingId(field,key)"
                      v-model="locale.formTemplate[field.name || key][chieldField.fakeFieldName][chieldField.name || childKey]"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Actions-->
          <div class="full-width text-right">
            <!--Save button-->
            <q-btn :label="$tr('ui.label.save')" icon="fas fa-save" unelevated rounded color="positive"
                   @click="saveSettings()"/>
          </div>
        </div>
      </div>
    </div>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
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
      locale: {fields: {}, fieldsTranslatable: {}},
      dataSettings: false,
      moduleSelected: false,
      groupSelected: false
    }
  },
  computed: {
    //Return settings group
    settingsGroup() {
      let settings = this.$clone(this.dataSettings)
      let response = {} //Default response

      //Group fields
      Object.keys(settings).forEach(moduleName => {
        response[moduleName] = {General: {}}//Default module
        Object.keys(settings[moduleName]).forEach(fieldName => {
          let field = settings[moduleName][fieldName]//Get field
          //Create group fields
          if (!response[moduleName][field.group || 'General']) response[moduleName][field.group || 'General'] = {}
          //Add field
          response[moduleName][field.group || 'General'][fieldName] = field
        })
      })

      //Response
      return response
    }
  },
  methods: {
    //Init method
    init() {
      this.getData()//Get data
      this.$root.$on('page.data.refresh', () => this.getData())//Listen refresh event
    },
    //Get Data
    async getData() {
      this.loading = true
      await Promise.all([
        this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS'),//Get settings
        this.getSettingFields()//Get setting fields
      ])
      //Set Default selected
      if (!this.moduleSelected && this.dataSettings) {
        this.moduleSelected = Object.keys(this.settingsGroup)[0]//Set module selected
        //Set group selected
        if (!this.groupSelected) this.groupSelected = Object.keys(this.settingsGroup[this.moduleSelected])[0]
      }
      this.$store.dispatch('qsiteApp/SET_SITE_COLORS')//Set colors
      this.setLocaleConfig()//Set locale data
      this.loading = false
    },
    //Get settings Fields
    getSettingFields() {
      return new Promise((resolve, reject) => {
        this.dataSettings = false//Reset data settings
        //Request Params
        let requestParams = {
          refresh: true,
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
          this.$alert.error(this.$tr('ui.message.errorRequest'))
          resolve([])
        })
      })
    },
    //Set locale configuration
    setLocaleConfig() {
      let formData = {}//Default form data
      let fieldLocale = {fields: {}, fieldsTranslatable: {}}//Default field locale
      let settingValues = this.$clone(this.$store.state.qsiteApp.settings)//Get all setting values
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      selectedLocales.forEach(item => formData[item] = {})//set locales to formData
      this.$refs.localesComponent.vReset()//Reset locale component

      //Set field to locale
      if (this.moduleSelected) {
        //Get fields
        let fields = this.$clone(this.settingsGroup[this.moduleSelected][this.groupSelected])
        //Order fields
        Object.values(fields).forEach(field => {
          //Get setting value
          let settingValue = settingValues.find(item => item.name == (field.fakeFieldName || field.name))

          if (field.isTranslatable) {//Set translatables fields
            fieldLocale.fieldsTranslatable[field.name] = field.value//Set translatable field
            //Set translatables values to formData
            selectedLocales.forEach(lang => {
              let langValue = settingValue ? settingValue.translations.find(item => item.locale == lang) : false
              formData[lang][field.name] = langValue ? langValue.value : field.value//Set value per locale
            })
          } else {//Set plain fields
            if (field.fakeFieldName || field.children) {//Set fake fields
              let fakeFieldName = field.fakeFieldName || field.name
              if (!fieldLocale.fields[fakeFieldName]) fieldLocale.fields[fakeFieldName] = {}//Create fake field
              if (!formData[fakeFieldName]) formData[fakeFieldName] = {}//Create child fake field in formData
              //Add child fake field
              if (field.children) {
                Object.values(field.children).forEach(childField => {
                  let childSettingValue = settingValue ? settingValue.value : null
                  // add child fake field
                  if (childField.fakeFieldName) {
                    let childFakeField = childField.fakeFieldName
                    //Create child fake field if not exist
                    if (!fieldLocale.fields[fakeFieldName][childFakeField])
                      fieldLocale.fields[fakeFieldName][childFakeField] = {}
                    //Create child fake field in form data
                    if (!formData[fakeFieldName][childFakeField]) formData[fakeFieldName][childFakeField] = {}
                    //Set child field value
                    fieldLocale.fields[fakeFieldName][childFakeField][childField.name] = childField.value
                    //Set child field value to form data
                    formData[fakeFieldName][childFakeField][childField.name] = (!childField.type || !childSettingValue) ? childField.value :
                      ((childSettingValue && childSettingValue[childFakeField]) ?
                        childSettingValue[childFakeField][childField.name] : childField.value)
                  } else {//Add field
                    fieldLocale.fields[fakeFieldName][childField.name] = childField.value//Set child fake field
                    //Set child fake field value to formData
                    formData[fakeFieldName][childField.name] = (!childField.type || !childSettingValue) ? childField.value :
                      (childSettingValue[childField.name] || childField.value)
                  }
                })
              } else {
                fieldLocale.fields[fakeFieldName][field.name] = field.value//Set fake field
                //Set fake field value to formData
                formData[fakeFieldName][field.name] = !field.type ? field.value :
                  (settingValue ? (settingValue.value[field.name] || field.value) : field.value)
              }
            } else {//Set plain field
              fieldLocale.fields[field.name] = field.value//Set plain field
              //Set field value to formData
              formData[field.name] = !field.type ? field.value : (settingValue ? settingValue.value : field.value)
            }
          }
        })
      }

      //Set data
      this.locale.form = this.$clone(formData)
      this.locale.fields = this.$clone(fieldLocale.fields)
      this.locale.fieldsTranslatable = this.$clone(fieldLocale.fieldsTranslatable)
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
    //Get dataForm. order data to backend
    getDataForm() {
      let formData = this.$clone(this.locale.form)//Get form data
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      let response = {}//Default response

      Object.keys(formData).forEach(fieldName => {
        //Set no translatable fields
        if (selectedLocales.indexOf(fieldName) == -1) response[fieldName] = formData[fieldName]
        else {//Set translatables values. Order translate values
          Object.keys(formData[fieldName]).forEach(transfieldName => {
            if (!response[transfieldName]) response[transfieldName] = {}
            response[transfieldName][fieldName] = formData[fieldName][transfieldName]
          })
        }
      })

      //Response
      return response
    },
    //Save settings
    saveSettings() {
      this.loading = true
      //Request
      this.$crud.post('apiRoutes.qsite.settings', {attributes: this.getDataForm()}).then(async response => {
        this.$alert.info(this.$tr('ui.message.recordUpdated'))
        this.getData()
      }).catch(error => {
        this.$alert.error(this.$tr('ui.message.recordNoUpdated'))
        console.error('[UPDATE-SETTINGS]::error:', error)
        this.loading = false
      })
    }
  }
}
</script>
<style lang="stylus">
#settingPage
  .q-item
    font-size 14px
    color $grey-9

    &.q-item--active
      color $primary

      .q-icon
        color $primary
</style>
