<template>
  <div id="wizardOrganization"
      class="tw-h-screen 'overflow-auto"
      :class="{'page-full' : currentStep == welcome || currentStep == summary,  'overflow-hidden': currentStep == themes }"
      >
    <div class="page-header
                tw-border-b-2 tw-border-white tw-border-opacity-50
                tw-fixed
                tw-top-0
                tw-left-0
                tw-z-20
                tw-flex tw-justify-center tw-items-center
                tw-w-full
                tw-h-20
    ">
      <a :href="urlBase"> <img :src="logo" class="tw-h-20 tw-w-auto"/> </a>
      <q-linear-progress
        style="background-color: #ffff"
        size="md"
        track-color="white"
        :value="progress"
        class="linear-progress-header"
      />
    </div>
    <div class="step-loading" v-show="loading">
      <div></div>
      <div></div>
    </div>
    <!-- keep-alive -->
    <div class="page-wizard tw-w-full tw-relative">
      <q-stepper
        v-model="currentStep"
        ref="stepper"
      >
        <template v-slot:navigation>
          <q-stepper-navigation v-show="showStepperNavigation">
              <div class="tw-pt-3 md:tw-pt-4 tw-pb-1">
                <div class="row justify-between">
                  <div class="col-4">
                    <q-btn
                      rounded
                      no-caps
                      :disabled="!activatePreviousButton"
                      unelevated
                      color="blue-grey"
                      icon="fas fa-arrow-left tw-mr-0 sm:tw-mr-2"
                      @click="previousStep()"
                      v-show="!buttonLoading"
                    >
                      <div class="tw-hidden sm:tw-inline-block">
                        {{ $tr('isite.cms.label.previous') }}
                      </div>
                    </q-btn>
                  </div>
                  <div class="col-4 text-right">
                    <q-btn
                     rounded
                     no-caps
                     :disabled="!activateNextButton"
                     icon-right="fas fa-arrow-right tw-ml-0 sm:tw-ml-2"
                     @click="nextStep()"
                     unelevated
                     color="green"
                     :loading="buttonLoading"
                     >
                      <div class="tw-hidden sm:tw-inline-block">
                        {{ currentStep === summary ? $tr('isite.cms.label.finalize') : $tr('isite.cms.label.continue') }}
                      </div>
                    </q-btn>
                  </div>
                </div>
              </div>
          </q-stepper-navigation>
        </template>

        <q-step
          v-for="step in steps"
          :key="step.id"
          :name="step.id"
          :prefix="step.prefix"
          :title="step.title"
          :done="step.done"
          class="q-pb-xl"
          :style="(step.id == themes) ? 'max-height: calc(100vh - 180px);' : ''"
        >
          <component ref="stepComponent"
            :is="step.component"
            @updateData="updateData(data)"
            @nextStep="nextStep()"
            v-if="!loading"
          />
        </q-step>
      </q-stepper>
    </div>
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
import modelSteps from 'modules/qsite/_components/organizations/wizard/steps/model/steps.js';
import storeWizard from 'modules/qsite/_components/organizations/wizard/steps/store/index.ts';
import services  from 'modules/qsite/_components/organizations/wizard/steps/services/services.ts';

import {
  STEP_WELCOME,
  STEP_TERMS,
  STEP_COMPANY,
  STEP_THEMES,
  STEP_SUMMARY,
  STEP_AI,
  PLAN_BASE_ID
} from 'modules/qsite/_components/organizations/wizard/steps/model/constant';

export default {
  beforeUnmount() {},
  computed: {
    steps() {
      //Get setting to validate if show the IA step
      const contentGenerationWithAI = !!parseInt(this.$getSetting('isite::contentGenerationWithAI'))
      //Filter the steps
      return modelSteps.filter(step => {
        if(step.id == STEP_AI && !contentGenerationWithAI) return false
        return step
      })
    },
    siteName() {
      return this.$getSetting('core::site-name')
    },
    showStepperNavigation(){
      return  this.currentStep != STEP_WELCOME
    },
    activatePreviousButton(){
      return storeWizard.previousStepButton;
    },
    activateNextButton(){
      return storeWizard.nextStepButton;
    },
    getStep(){
      return storeWizard.step
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      logo: this.$store.state.qsiteApp.logo,
      currentStep: 0,
      progress: 0,
      progressPercent: 0,
      urlBase: this.$store.state.qsiteApp.baseUrl,
      dataUrl: { // datos que vienen de la url
        planId: '',
        billingCycle: '',
        layoutId: '',
      },
      welcome: STEP_WELCOME,
      summary: STEP_SUMMARY,
      themes: STEP_THEMES,
      terms: STEP_TERMS,
      buttonLoading: false,
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.init();
    })
  },
  methods: {
    async init() {
      await this.getInfo();
      await this.configProgress();
    },

    async getInfo() {
      this.loading = true
      try {
        storeWizard.data.user = this.$store.getters["quserAuth/user"]; //get user info after redirect
      } catch (error) {
        console.log(error);
      }


      /* check and get info */
      storeWizard.infoWizard = await services().getInfoWizard()

      /* check and get categories */
      let categories = await this.$cache.get.item('org-wizard-categories');
      if( !categories?.length>0){
        categories = await services().getCategories()
        this.$cache.set('org-wizard-categories', categories)
      }
      storeWizard.categories = categories

      /* check and get plans */
      let plans = await this.$cache.get.item('org-wizard-plans');
      if( !plans?.length>0){
        plans = await services().getPlans(PLAN_BASE_ID)
        this.$cache.set('org-wizard-plans', plans)
      }
      storeWizard.plans = plans

      /* check and set step */
      storeWizard.step = await this.$cache.get.item('org-wizard-step')
      storeWizard.step = storeWizard.step ?? STEP_WELCOME

      /* check and get user data */
      const data = await this.$cache.get.item('org-wizard-data')
      storeWizard.data.user = storeWizard.data.user ?? data?.user
      storeWizard.data.terms = data?.terms ? data.terms : storeWizard.data.terms
      storeWizard.data.organization = data?.organization ?? ''
      storeWizard.data.category = data?.category ?? false
      storeWizard.data.plan = data?.plan ?? false
      storeWizard.data.layout= data?.layout ?? false
      this.updateData()
      this.loading = false
    },

    async configProgress() {
      this.progressPercent = 1 / (this.steps.length - 1);
      this.currentStep = storeWizard.step
      this.progress = this.progressPercent * this.currentStep;
    },

    async nextStep(){
      // check organization name
      if(this.currentStep == STEP_COMPANY){
        this.buttonLoading = true;
        const companyExist = await this.$refs.stepComponent[0].checkOrganizationName(storeWizard.data.organization)
        this.buttonLoading = false;
        if(companyExist && companyExist?.title){
          this.$alert.info({
            mode: 'modal',
            title: this.siteName,
            message: this.$tr('isite.cms.alreadyInUse'),
            actions: []
          })
          return false
        }
      }

      /* validate Ai form */
      if(this.currentStep == STEP_AI){
        if(storeWizard.data.form.check){
          let validate = await this.$refs.stepComponent[0].verifyForm();
          if(!validate){
            return false;
          }
        }
      }

      /* submit wizard */
      if(this.currentStep == STEP_SUMMARY){
        this.redirectAfterWizard()
        return false
      }

      this.currentStep+= 1;
      storeWizard.step = this.currentStep;
      this.updateData()
      this.configProgress()
      this.$refs.stepper.next();

    },
    previousStep() {
      this.currentStep-=1;
      storeWizard.step = this.currentStep;
      this.updateData()
      this.configProgress()
      this.$refs.stepper.previous();
    },
    updateData(){
      this.$cache.set('org-wizard-step', this.$clone(storeWizard.step))
      this.$cache.set('org-wizard-data', this.$clone(storeWizard.data))
    },
    async redirectAfterWizard() {
      //Instance the url
      let url = null
      //Get setting to know the wizard type
      const wizardType = this.$getSetting('isite::wizardTenantType')
      //Instance the needed params
      const params = {
        billingcycle: storeWizard.data.plan.optionValue.toLowerCase(),
        layoutId: storeWizard.data.layout.entity.id,
        organizationName: storeWizard.data.organization,
        categoryId: storeWizard.data.category.id,
        email: storeWizard.data.user.email,
        planId: storeWizard.data.plan.product.entity.id, //Keep this to works with local type
        formIA: storeWizard.data.form.data //Keep this to works with local type
      }

      //Validate and get the url to redirect
      switch (wizardType) {
        case 'weygo':
          //Get the url to redirect from the product
          url = storeWizard.data.plan.planUrl
          //Add parameters to the url
          Object.keys(params).forEach(paramName => url += `&${paramName}=${params[paramName]}`)
          break
        default://Local

          this.$alert.info({
            mode: 'modal',
            title: this.siteName,
            icon: 'fa-duotone fa-spinner-third fa-spin',
            message: this.$tr('isite.cms.message.creatingTenant'),
            actions: []
          })
          //Request
          const response = await this.$crud.create('apiRoutes.qplan.buy', params).catch(error => {
            this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoCreated')}`})
          })
          if (response.data && response.data.redirectTo) url = response.data.redirectTo
          break
      }
      //Redirect
      if (url) {
        //Clear cache
        this.$cache.remove('org-wizard-data');
        this.$cache.remove('org-wizard-step');
        this.$cache.remove('org-wizard-categories');
        this.$cache.remove('org-wizard-plans');
        this.$helper.openExternalURL(url, false)
      }
    },

  }
}
</script>
<style>
#wizardOrganization {
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
}

#wizardOrganization .page-header {
  @apply tw-bg-white;
  transition: all .4s ease-out;
  box-shadow: 0 0 6px -2px #8d8d8d;
}

#wizardOrganization .page-wizard .q-stepper__header {
  @apply tw-hidden;
}

#wizardOrganization .page-wizard .q-stepper {
  @apply tw-rounded-none tw-shadow-none;
}


#wizardOrganization .page-wizard .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 190px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}

#wizardOrganization .page-wizard .q-stepper__nav {
  @apply tw-w-2/4 tw-z-50 tw-left-0  tw-fixed tw-bg-white tw-border-b-2;
  @apply tw-border-gray-300 tw-border-opacity-50 tw-pb-3 md:tw-pb-4;
  transition: transform .4s ease-out, width .4s ease-out;
  margin-top: -95px; top: 180px;
}

#wizardOrganization .page-wizard .q-stepper__nav .q-btn .q-icon {
  @apply tw-text-sm;
}

#wizardOrganization .page-wizard .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0 15px;
}

#wizardOrganization .page-wizard .step-sidebar {
  @apply tw-py-20 tw-flex tw-justify-center tw-items-center tw-flex-col;
  @apply tw-h-full tw-left-1/2 tw-right-0 tw-top-0 tw-fixed;
  contain: strict;
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right, #fff, #e4e2f2);
}

@media only screen and (max-width: 1439px) {
  #wizardOrganization .page-wizard .q-stepper__content,
  #wizardOrganization .page-wizard .q-stepper__nav {
    width: 50%;
  }

  #wizardOrganization .page-wizard .step-sidebar {
    @apply tw-left-auto;
    width: 50%;
  }
}

@media only screen and (max-width: 1023px) {
  #wizardOrganization .page-wizard .q-stepper__content {
    @apply tw-w-full tw-pb-24;
  }

  #wizardOrganization .page-wizard .step-sidebar {
    @apply tw-w-0 tw-p-0;
  }

  #wizardOrganization .page-wizard .q-stepper__nav {
    @apply tw-w-full;
  }
}

#wizardOrganization .page-wizard .q-slider__track-container--h {
  @apply tw-p-0;
}

#wizardOrganization .page-wizard .step-title {
  @apply tw-text-xl lg:tw-text-3xl tw-px-4 md:tw-px-12 tw-text-center tw-pb-4 lg:tw-pb-8 tw-font-bold;
}

#wizardOrganization .page-wizard .step-title-1 {
  @apply tw-text-xl lg:tw-text-2xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}

.page-register .q-stepper__content {
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right, #fff, #e4e2f2);
  width: 100% !important;
}

#wizardOrganization .linear-progress-header {
  @apply tw-absolute;
  bottom: -7px;
}

#wizardOrganization .q-dialog__message {
  @apply tw-text-base;
}

#wizardOrganization .selected-label {
  @apply tw-text-white tw-text-xs tw-relative tw-z-0 tw-font-bold tw-inline-block;
  padding: 0.125rem 1rem;
  border-radius: 0.9375rem;
  color: var(--q-primary);
}

#wizardOrganization .selected-label:after {
  @apply tw-w-2.5 tw-h-2.5 tw-left-0 tw-absolute;
  content: "";
  bottom: -2px;
  z-index: -1;
  background: var(--q-primary);
}

#wizardOrganization .selected-box {
  @apply  tw-rounded tw-px-3 tw-py-1 tw-relative tw-mb-3 tw-text-xs md:tw-text-sm;
  border: 2px dashed var(--q-primary);
}

#wizardOrganization .selected-box-m {
  @apply tw-mb-0 md:tw-mb-3
}

@-webkit-keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

#wizardOrganization .step-loading {
  @apply tw-absolute tw-w-20 tw-h-20 tw-top-1/2 tw-left-1/2;
  transform: translate(-50%, -50%);
}

#wizardOrganization .step-loading div {
  @apply tw-absolute tw-opacity-100 tw-rounded-full;
  border: 4px solid var(--q-primary);
  animation: step-loading 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

#wizardOrganization .step-loading div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes step-loading {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
#wizardOrganization .step-plan,
#wizardOrganization .step-categories,
#wizardOrganization .step-themes,
#wizardOrganization .step-ai {
  margin-top: 25px;
}
#wizardOrganization a:-webkit-any-link:focus-visible {
    outline-offset: 0 !important;
    outline: 0 !important;
}
</style>
