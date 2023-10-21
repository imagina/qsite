<template>
  <div class="step-terms">
    <div class="step-loading" v-if="loading">
      <div></div>
      <div></div>
    </div>
    <div v-else>
      <h2 v-if="stepContent" class="step-title">{{ stepContent.title }}</h2>
      <div class="tw-mx-auto tw-text-base tw-max-w-sm">
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
          <q-checkbox dense v-model="buttonEmail" color="primary"/>
          <div class="tw-pl-3 text-justify">
            Sí, quiero recibir correos electrónicos con consejos prácticos, novedades y ofertas especiales para mi
            página web.
          </div>
        </div>
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
          <q-checkbox dense v-model="buttonTerms" color="primary"/>
          <div class="tw-pl-3 text-justify" v-html="termsAndConditions"></div>
        </div>
      </div>
    </div>
    <div v-if="stepContent" class="step-sidebar">
      <div class="terms-text tw-max-w-sm tw-w-full">
        <div class="tw-text-base tw-mb-8 text-center" v-html="stepContent.description"></div>
        <q-img v-if="stepContent.mediaFiles" contain
               :src="stepContent.mediaFiles.mainimage.extraLargeThumb"
               :ratio="1/1"
        />
      </div>
    </div>
  </div>
</template>
<script>
import storeStepWizard from './store/index.ts';
import {STEP_NAME_TERMS} from './model/constant.js';

export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      buttonEmail: false,
      buttonTerms: false,
      stepContent: '',
      urlBase: this.$store.state.qsiteApp.baseUrl,
    }
  },
  inject: {
    infoBase: {
      type: Object,
      default: () => {
      },
    },
  },
  mounted() {
    this.$nextTick(async function () {
      this.getStepInfo();
      this.getData();
    })
  },
  watch: {
    buttonTerms(newTerms, oldTerms) {
      this.$emit("update",  { active: newTerms, info: this.buttonEmail });
    },
    buttonEmail(newTerms, oldTerms) {
      this.$emit("update",  { active: this.buttonTerms, info: newTerms });
    }
  },
  computed: {
    termsAndConditions() {
      let settings = {
        politics: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithPoliticsOfPrivacy') ??
            `${this.urlBase}/politica-de-privacidad`,
        terms: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithTermsAndConditions') ??
            `${this.urlBase}/terminos-y-condiciones`,
      }

      //Add links to terms and conditions
      let concatData = ''
      if (settings.politics)
        concatData += `<a href="${settings.politics}" target="_blank" class="text-green"><b>${this.$tr('iprofile.cms.message.privacyPolicy')}</b></a>,`
      if (settings.terms)
        concatData += `<a href="${settings.terms}" target="_blank" class="text-green"><b>${this.$tr('iprofile.cms.message.termsAndConditions')}</b></a>,`

      //Response
      return this.$tr('iprofile.cms.message.privacyData', {
        concatData: concatData,
        siteName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
      })
    },
  },
  methods: {
    async getData() {
      if (this.infoBase && this.infoBase.terms.active) {
        this.buttonTerms = this.infoBase.terms.active;
        this.buttonEmail = this.infoBase.terms.info;
      } else {
        // Sino hay nada es porque recargo entonces verifico que tiene cache
        const info = await this.$cache.get.item('org-wizard-data');
        if (info != null && info.terms.active) {
          this.buttonTerms = info.terms.active;
          this.buttonEmail = info.terms.info;
          this.$emit("update",  { active: info.terms.active, info: info.terms.info });
        } else {
          this.$emit("update", {active: false});
        }
      }

    },
    async getStepInfo() {
      this.stepContent = await this.info.find((item) => item.systemName === STEP_NAME_TERMS);
    },
  }
}
</script>
<style>
.step-terms .terms-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.step-terms {
  @apply tw-flex tw-min-h-screen tw-flex-col tw-justify-center;
  margin-top: -95px;
}
</style>
