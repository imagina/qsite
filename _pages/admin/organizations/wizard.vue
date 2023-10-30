<template>
  <div id="wizardOrganization"
      class="tw-h-screen tw-overflow-auto"
      :class="{'page-full' : pace == welcome || pace == summary }"
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
      <q-linear-progress :value="progress" class="linear-progress-header"/>
    </div>

    <div class="step-loading">
      <div></div>
      <div></div>
    </div>
    <!-- keep-alive -->
    <div class="page-wizard tw-w-full tw-relative">
      <q-stepper
          v-model="pace"
          ref="stepper"
          v-if="dataText.length>0"
      >
        <q-step
            v-for="step in steps"
            :key="step.id"
            :name="step.id"
            :prefix="step.prefix"
            :title="step.title"
            :done="step.done"
        >
          <component ref="stepComponent" :is="step.component" @update="navNext" :info.async="dataText"/>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation v-if="pace > 2">
            <div class="tw-pt-3 md:tw-pt-4 tw-pb-1">
              <div class="row justify-between">
                <div class="col-4">
                  <q-btn rounded
                         no-caps
                         :disabled="!isActivePrevious"
                         unelevated
                         v-if="pace > 3"
                         color="blue-grey"
                         icon="fas fa-arrow-left tw-mr-0 sm:tw-mr-2"
                         @click="stepperPrevious()">
                    <div class="tw-hidden sm:tw-inline-block">
                      {{ $tr('isite.cms.label.previous') }}
                    </div>
                  </q-btn>
                </div>
                <div class="col-4 text-right">
                  <q-btn
                         rounded
                         no-caps
                         :disabled="!isActive"
                         icon-right="fas fa-arrow-right tw-ml-0 sm:tw-ml-2"
                         @click="stepperNext(pace)"
                         unelevated
                         color="green">
                    <div class="tw-hidden sm:tw-inline-block">
                      {{ pace === steps.length ? $tr('isite.cms.label.finalize') : $tr('isite.cms.label.continue') }}
                    </div>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>
<script>
import modelSteps from '@imagina/qsite/_components/organizations/wizard/steps/model/steps.js';
import storeStepWizard from '@imagina/qsite/_components/organizations/wizard/steps/store/index.ts';
import {
  STEP_WELCOME,
  STEP_REGISTER,
  STEP_TERMS,
  STEP_COMPANY,
  STEP_CATEGORIES,
  STEP_THEMES,
  STEP_PLANS,
  STEP_SUMMARY,
  STEP_AI,
  PLAN_BASE_ID
} from '@imagina/qsite/_components/organizations/wizard/steps/model/constant';

const infoMappings = {
  [STEP_COMPANY]: 'organization',
  [STEP_CATEGORIES]: 'category',
  [STEP_THEMES]: 'layout',
  [STEP_PLANS]: 'plan'
};

export default {
  beforeDestroy() {
  },
  props: {},
  components: {},
  watch: {},
  computed: {
    siteName() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      logo: this.$store.state.qsiteApp.logo,
      pace: null,
      progress: 0,
      steps: modelSteps,
      progressPercent: 0,
      isActive: false,
      isActivePrevious: true,
      urlBase: this.$store.state.qsiteApp.baseUrl,
      dataText: [],
      dataUrl: { // datos que vienen de la url
        planId: '',
        billingCycle: '',
        layoutId: '',
      },
      dataCheck: null,
      welcome: STEP_WELCOME,
      summary: STEP_SUMMARY
    }
  },
  provide() {
    return {
      infoBase: this.dataCheck
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.init();
    })
  },
  created() {
  },
  methods: {
    async init() {
      this.getInfo();
      this.configProgress();

    },
    async configProgress() {
      this.progressPercent = 1 / this.steps.length;
      const step = await this.$cache.get.item('org-wizard-step');
      this.progress = this.progressPercent * step;
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh
        }
        //Request
        this.$crud.index('apiRoutes', requestParams).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
          })
        })
      })
    },
    stepperPrevious() {
      this.verifyStep();
      this.progress = this.progress - this.progressPercent;
      this.$refs.stepper.previous();
    },
    async stepperNext(step) {
      try {
        // si llega al final y todo esta lleno envia la info
        if (this.pace === this.steps.length) {
          if ((this.dataCheck.user !== null) &&
              this.dataCheck.terms &&
              (this.dataCheck.category !== null) &&
              (this.dataCheck.layout !== null) &&
              (this.dataCheck.plan !== null) &&
              (this.dataCheck.organization !== '')) {
            // enviar a url de pago
            this.redirectAfterWizard();
          }
        } else {

          //console.log(this.pace,'-',STEP_AI,'-',this.dataCheck.form.check);
          if (this.pace == STEP_AI && this.dataCheck.form.check) {

            // averiguo si esta lleno el formulario
            let validate = await this.$refs['stepComponent'][0].verifyForm();
            if(validate){
              // si esta lleno quiere decir que puede avanzar
              this.progress = this.progress + this.progressPercent;
              this.setCacheInfo(this.dataCheck);
              this.setCacheStep(step + 1);
              this.$refs.stepper.next();
            }

          } else {

            this.progress = this.progress + this.progressPercent;
            this.setCacheInfo(this.dataCheck);
            this.setCacheStep(step + 1);
            this.$refs.stepper.next();
          }


        }

      } catch (error) {
        console.log(error);
      }
    },
    async navNext(value) {
      try {
        // locate the current step to activate the next button depending on the emit
        const current = this.steps.find((item) => item.id === this.pace);
        current.done = value.active;
        this.isActive = current.done;

        if (current.id == STEP_WELCOME) {
          this.progress = this.progress + this.progressPercent;
          this.$refs.stepper.next();
          this.setCacheStep(current.id + 1);
        }

        if (current.id == STEP_REGISTER) {
          this.dataCheck.user = value.info;
          this.stepperNext(current.id);
        }

        // if it is terms and conditions the value of the check updates the data
        if (current.id == STEP_TERMS) {
          this.dataCheck.terms.active = value.active;
          this.dataCheck.terms.info = value.info;
        }

        if (current.id == STEP_AI) {
          this.dataCheck.form.check = value.check;
          this.dataCheck.form.info = value.info;
        }

        if (value.info !== undefined) {
          const mappedProp = infoMappings[current.id];
          if (mappedProp) {
            this.dataCheck[mappedProp] = value.info;
            if (current.id != STEP_COMPANY) {
              this.setCacheInfo(this.dataCheck);
            }
          }
        }

      } catch (error) {
        console.log(error);
      }
    },
    verifyStep() {
      const current = this.steps.find((item) => item.id === this.pace);
      this.isActive = current.done;
      this.setCacheStep(current.id - 1);
    },
    async redirectAfterWizard() {
      //Instance the url
      let url = null
      //Get setting to know the wizard type
      const wizardType = this.$store.getters['qsiteApp/getSettingValueByName']('isite::wizardTenantType')
      //Instance the needed params
      const params = {
        billingcycle: this.dataCheck.plan.optionValue.toLowerCase(),
        layoutId: this.dataCheck.layout.entity.id,
        organizationName: this.dataCheck.organization,
        categoryId: this.dataCheck.category.id,
        email: this.dataCheck.user.email,
        planId: this.dataCheck.plan.product.entity.id, //Keep this to works with local type
        formIA: this.dataCheck.form.info //Keep this to works with local type
      }
      //Validate and get the url to redirect
      switch (wizardType) {
        case 'weygo':
          //Get the url to redirect from the product
          url = this.dataCheck.plan.planUrl
          //Add parameters to the url
          Object.keys(params).forEach(paramName => url += `&${paramName}=${params[paramName]}`)
          break
        default://Local
          this.isActive = false;
          this.isActivePrevious = false;
          //UX
          this.$alert.info({
            mode: 'modal',
            title: this.siteName,
            icon: 'fa-duotone fa-spinner-third fa-spin',
            message: this.$tr('isite.cms.message.creatingTenant'),
            actions: []
          })
          //Request
          const response = await this.$crud.create('apiRoutes.qplan.buy', params).catch(error => {
            this.isActive = true;
            this.isActivePrevious = true;
            this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoCreated')}`})
          })
          this.isActive = true;
          this.isActivePrevious = true;
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
    async getInfo() {
      this.dataText = await storeStepWizard().getInfoWizard();
      storeStepWizard().getCategories();
      storeStepWizard().getPlans(PLAN_BASE_ID);
      // verifico en que step se quedo antes de recargar
      const step = await this.$cache.get.item('org-wizard-step');
      // verifico que info tenia guardada antes de recargar
      const info = await this.$cache.get.item('org-wizard-data');
      if (step) {
        this.pace = step;
      } else {
        // importante sino hay data entonces si asignarle el valor
        this.pace = 1;
      }

      if (info != null) {
        this.dataCheck = info;
      } else {
        this.getUrl();
      }

    },
    async setCacheStep(step) {
      await this.$cache.set('org-wizard-step', step);
    },
    async setCacheInfo(data) {
      await this.$cache.set('org-wizard-data', data);
    },
    async getUrl() {
      // verifico que datos me trae la url
      this.dataUrl = {
        planId: this.$route.query.planId,
        billingCycle: this.$route.query.billingcycle,
        layoutId: this.$route.query.layoutId,
      };
      let layout = null;
      let planSelected = null;

      // datos bases del plan
      const plans = await storeStepWizard().getPlans(PLAN_BASE_ID);
      // si existe un layoutId es la prioridad
      if (this.dataUrl.layoutId) {
        // se revisa si el layoutId pertenece algun plan
        let planBase = plans.find((value, index) => {
          const related = value.relatedProducts.map((item) => ({
            ...item,
            planId: value.id
          }));
          layout = related.find((items) => items.id === parseInt(this.dataUrl.layoutId))
          if (layout) {
            return value
          } else {
            layout = null
          }
        });
        if (planBase) {
          if (this.dataUrl.billingCycle === undefined) {
            this.dataUrl.billingCycle = planBase.optionValues[0].optionValue;
          }
          planSelected = this.getFilterPlan(planBase, this.dataUrl.billingCycle);
        }
      } else {
        if (this.dataUrl.planId) {
          let plan = plans.find((items) => items.id === parseInt(this.dataUrl.planId))
          if (plan) {
            if (this.dataUrl.billingCycle === undefined) {
              this.dataUrl.billingCycle = plan.optionValues[0].optionValue;
            }
            planSelected = this.getFilterPlan(plan, this.dataUrl.billingCycle);
          }
        }
      }

      this.dataCheck = {
        user: null,
        terms: {active: false, info: false },
        category: null,
        layout: layout,
        plan: planSelected,
        organization: '',
        form: {active: false, check: false, info: {} },
      };
    },
    getFilterPlan(plan, billingCycle) {
      const option = plan.optionValues.filter((item, index) => item.optionValue.toLowerCase() == billingCycle.toLowerCase());
      // armo el plan
      let planFilter = option.map((item) => ({
        ...item,
        planId: plan.id,
        planName: plan.name,
        planSummary: plan.summary,
        planDescription: plan.description,
        planRelatedProducts: plan.relatedProducts,
        planUrl: plan.url,
        active: true,
      }));
      if(planFilter.length>0) {
        return planFilter[0]
      } else {
        return null
      }

    }
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

/*#wizardOrganization .page-wizard .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 95px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}*/

#wizardOrganization .page-wizard .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 190px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}

/*#wizardOrganization .page-wizard .q-stepper__nav {
  @apply tw-w-2/4 tw-z-10 tw-left-0 tw-bottom-0 tw-fixed tw-bg-white tw-border-t-2;
  @apply tw-border-gray-300 tw-border-opacity-50 tw-pb-3 md:tw-pb-4;
  transition: transform .4s ease-out, width .4s ease-out;
}*/

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
  color: var(--q-color-primary);
}

#wizardOrganization .selected-label:after {
  @apply tw-w-2.5 tw-h-2.5 tw-left-0 tw-absolute;
  content: "";
  bottom: -2px;
  z-index: -1;
  background: var(--q-color-primary);
}

#wizardOrganization .selected-box {
  @apply  tw-rounded tw-px-3 tw-py-1 tw-relative tw-mb-3 tw-text-xs md:tw-text-sm;
  border: 2px dashed var(--q-color-primary);
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
  border: 4px solid var(--q-color-primary);
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
