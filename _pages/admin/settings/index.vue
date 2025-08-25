<template>
  <div id="pageId" class="relative">
    <div class="row q-col-gutter-md">
      <!--Page Actions-->
      <div class="col-xs-12">
        <div class="box box-auto-height">
          <page-actions :title="$tr(this.$route.meta.title)" @refresh="init" />
        </div>
      </div>
      <!-- Nav -->
      <div class="col-3">
        <div class="box">
          <q-tabs
            v-model="moduleSelected"
            vertical
            @update:model-value="setFormSettings"
            active-color="primary"
            indicator-color="primary"
          >
            <template v-for="(module, key) in nameModules" :key="`tab-${key}`">
              <q-tab :name="module" :label="module" no-caps />
            </template>
          </q-tabs>
        </div>
      </div>
      <!-- Form -->
      <div class="col-9">
        <dynamic-form
          :key="formKey"
          v-model="formSettings"
          :blocks="[{ fields: this.$clone(fieldSettings) }]"
          :title="moduleSelected"
          @submit="saveSettings()"
        />
      </div>
    </div>
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      settings: [],
      moduleSelected: null,
      formSettings: {},
      fieldSettings: [],
      formKey: this.$uid(),
      selectedLocales: this.$clone(this.$store.state.qsiteApp.selectedLocales),
    };
  },
  computed: {
    nameModules() {
      let settingsWithField = this.settings.filter(
        (item) => item.dataConfig && item.dataConfig.dynamicField
      );
      return [
        ...new Set(settingsWithField.map((item) => item.systemName.split('::')[0])),
      ].sort();
    },
  },
  methods: {
    async init() {
      await this.getData();
      this.moduleSelected = this.nameModules[0];
      this.setFormSettings();
    },
    //Get data
    async getData() {
      this.loading = true;
      await this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS', {
        refresh: true,
      });
      this.settings = this.$store.state.qsiteApp.settings;
      this.loading = false;
    },
    //set form settings
    setFormSettings() {
      let formSettings = {};
      let fieldSettings = [];
      this.selectedLocales.forEach((item) => (formSettings[item] = {})); //set locales to formData

      const moduleSettings = this.settings.filter((item) =>
        item.systemName.startsWith(this.moduleSelected)
      );

      moduleSettings.forEach((setting) => {
        //set field
        if (setting.dataConfig.dynamicField) {
          fieldSettings.push({
            ...setting.dataConfig.dynamicField,
            name: setting.systemName,
            isTranslatable: setting.isTranslatable ?? false,
            fieldItemId: setting.id,
          });
        }
        // set setting value
        if (setting.isTranslatable) {
          this.selectedLocales.forEach((lang) => {
            formSettings[lang][setting.systemName] = setting[lang].value;
          });
        } else formSettings[setting.systemName] = setting.plainValue;
      });
      //set to data
      this.formSettings = formSettings;
      this.fieldSettings = fieldSettings;
      this.formKey = this.$uid();
    },
    //Save settings
    async saveSettings() {
      let settings = this.$clone(this.formSettings);

      // Handle locales first
      const locales = this.selectedLocales;
      const localeValues = {};

      const result = Object.keys(settings).reduce((acc, key) => {
        if (locales.includes(key)) {
          for (const locale of locales) {
            for (const settingKey in settings[locale]) {
              acc[settingKey] = acc[settingKey] || {};
              acc[settingKey][locale] = settings[locale][settingKey];
            }
          }
        } else {
          const val = settings[key];
          acc[key] =
            val && typeof val === 'object' && 'mainimage' in val
              ? { medias_single: { mainimage: val.mainimage } }
              : val;
        }
        return acc;
      }, {});

      this.$crud
        .post('apiRoutes.qsite.settingsSet', { attributes: result })
        .then(() => {
          this.$alert.success({
            message: this.$tr('isite.cms.message.recordUpdated'),
          });
        })
        .catch((error) => {
          this.$alert.error({
            message: this.$tr('isite.cms.message.recordNoUpdated'),
          });
        });
    },
  },
};
</script>
<style lang="stylus"></style>
