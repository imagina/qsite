<template>
  <div class="step-ai tw-overflow-y-hidden" >
    <div v-if="stepContent" class="tw-max-w-xl tw-mx-auto" :class="{'form-inactive' : !activeForm }">

      <h2 class="step-title">{{ stepContent.title  }}</h2>

      <div class="tw-flex tw-items-center tw-justify-center tw-mb-3">
        <q-toggle v-model="activeForm" color="primary"/>
        <div class="tw-pl-2 tw-text-xs md:tw-text-base text-justify">
          Usar Inteligencia Artificial para sugerencias de contenido en mi sitio web.
        </div>
      </div>
      <div class="tw-mt-6" v-if="activeForm">
        <div class="tw-pl-4 tw-text-xs">Completa el siguiente formulario </div>
          <dynamic-form
            v-model="form"
            :form-id="formId"
            formType="grid"
            no-actions
            ref="ai-form"
            default-col-class="col-6"
          />
      </div>
    </div>

    <div v-if="stepContent" class="step-sidebar">
      <div class="select-ai tw-max-w-md tw-w-full">
        <div class="tw-text-base  tw-text-center tw-mb-10" v-html="stepContent.description"></div>
        <q-img v-if="stepContent.mediaFiles" contain
               :src="stepContent.mediaFiles.mainimage.extraLargeThumb"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {STEP_NAME_AI} from './model/constant.js';

export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeForm: false,
      stepContent: '',
      form: {},
      formId: '',
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
      this.getData();
      this.verifyNext();
      this.getStepInfo();
    })
  },
  watch: {
    activeForm(newName, oldName) {
      this.verifyNext();
    }
  },
  methods: {
    async getData() {
      if (this.infoBase && this.infoBase.form) {
        this.activeForm = this.infoBase.form.check;
        this.form = this.infoBase.form.info;
      } else {
        // Sino hay nada es porque recargo entonces verifico que tiene cache
        const info = await this.$cache.get.item('org-wizard-data');
        if (info != null && info.form) {
          this.activeForm = info.form.check;
          this.form = info.form.info;
        } 
      }

    },
    async verifyForm(){
      try {
        let resp = false;
        if(this.$refs['ai-form']){
          let validate = await this.$refs['ai-form'].validateCompleteForm();
          if(validate){
            this.$emit("update", {active: true, check: this.activeForm, info: this.form});
            resp = true;
          } else {
            this.$emit("update", {active: true, check: this.activeForm, info: ''});
          }
        } else {
          this.$emit("update", {active: true, check: this.activeForm, info: ''});
        }
        return resp
      } catch (error) {
        console.log(error);
      }
    },
    verifyNext() {
      if(this.activeForm) {
        //  quiere decir que tiene que llenar el formulario
        this.verifyForm();
      } else {
        // quiere decir que puede pasar sin llenar el formulario
        this.$emit("update", {active: true, check: this.activeForm, info: ''});
      }
    },
    async getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_AI);
      this.formId = this.stepContent.formId;
    }
  }
}
</script>
<style>
.select-ai {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-ai > .form-inactive {
  @apply tw-flex tw-min-h-screen tw-flex-col tw-justify-center;
  margin-top: -95px;
}
.step-ai #dynamicFormComponent .box {
  @apply tw-shadow-none !important;
}
</style>
