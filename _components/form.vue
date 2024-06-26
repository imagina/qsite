<template>
  <div id="siteForm" class="position-relative">
    <locales v-model="locale" ref="locales" class="q-my-md"
             @validate="$v.$touch()" v-show="hasTranslatables" />
    <template v-for="(setting, index) in module" :key="index">
      <div v-if="locale.success">
        <field :key="index" :setting="setting" v-model="locale.formTemplate[setting.name]" :label="label(setting)"/>
      </div>
    </template>

    <div class="col-12 text-right">
      <q-btn color="green" :label="$tr('isite.cms.label.save')" icon="fas fa-save" @click="submit" class="q-mt-sm"/>
    </div>

    <inner-loading :visible="submitModule"/>
  </div>
</template>
<script>
  /*Plugins*/

  /*Components*/
  import field from 'modules/qsite/_components/field'

  /*Services*/
  import siteService from 'modules/qsite/_services/index'

  export default {
    props: {
      module: {
        type: Object,
        default: () => {
          return {}
        }
      },
      moduleName: {
        type: String,
        default: ''
      },
    },
    emits: ['getData'],
    components: {
      field
    },
    computed: {
      hasTranslatables() {
        for (const setting in this.module) {
          if (this.module[setting].translatable)
            return true
        }
        return false
      },
      hasNoTranslatables() {
        for (const setting in this.module) {
          if (!this.module[setting].translatable)
            return true
        }
        return false
      }
    },
    watch: {
      module() {
        this.transformToFrontData();
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.transformToFrontData();
      })
    },
    data() {
      return {
        locale: {},
        translatableCollapse: true,
        noTranslatableCollapse: true,
        submitModule: false,
        selectedLocales: this.$getSetting('core::locales'),
        defaultLocale: this.$store.getters['qsiteApp/getDefaultLocale']
      }
    },
    methods: {

      submit() {
        this.submitModule = true
        let data = this.transformToBackData();
        siteService.updateOrCreate('apiRoutes.qsite.settings', data).then(response => {
          this.$alert.success({message: this.$tr('isite.cms.message.recordUpdated')})
          this.submitModule = false
          this.$emit('getData', true)
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.submitModule = false
        })
      },
      transformToBackData() {
        let data = {}

        for (const field in this.locale.fields) {
          data[field] = this.locale.form[field]

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            for (const fieldTrans in this.locale.form[locale]) {
              if (!data[fieldTrans])
                data[fieldTrans] = {}

              data[fieldTrans][locale] = this.locale.form[locale][fieldTrans]

            }
          })
        }

        return data
      },

      transformToFrontData() {
        let form = {}
        let fields = {}
        let fieldsTranslatable = {}

        for (const settingKey in this.module) {

          let setting = this.module[settingKey];

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            if (setting[locale]) {
              if (!form[locale])
                form[locale] = {}
              form[locale][setting.name] = setting[locale].value;
            }
          })

          // generating transtalable and not translatable fields
          if (setting.translatable) {
            fieldsTranslatable[setting.name] = setting.value
          } else {
            fields[setting.name] = setting.value
          }
        }

        this.locale.form = form
        this.locale.fields = fields
        this.locale.fieldsTranslatable = fieldsTranslatable
      },

      label(setting) {
        if (setting.translatable)
          return setting.description + ' (' + this.locale.language + ')';
        else
          return setting.description;
      }
    }
  }
</script>
<style lang="scss">
</style>
