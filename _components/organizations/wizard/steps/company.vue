<template>
  <div class="step-company">
    <div v-if="stepContent">
      <h2 class="step-title">{{ stepContent.title }}</h2>
      <div class="tw-text-base tw-px-2 md:tw-px-14 tw-text-center tw-mb-10" v-html="stepContent.description"></div>
    </div>

    <div class="tw-px-2 md:tw-px-10 tw-mb-8">
      <dynamic-field v-model="name" :field="formFields.nameOrganizations"/>
    </div>

    <div v-if="stepContent" class="step-sidebar">
      <div class="select-company tw-max-w-md tw-w-full">
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
import {STEP_NAME_COMPANY} from './model/constant.js';

export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      name: '',
      stepContent: '',
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
      this.navNext();
      this.getStepInfo();
    })
  },
  watch: {
    name(newName, oldName) {
      this.navNext();
    }
  },
  computed: {
    formFields() {
      return {
        nameOrganizations: {
          type: "input",
          props: {
            icon: "corporate_fare",
            label: this.$tr('isite.cms.form.name'),
            color: "primary",
            rounded: true,
            dense: false
          },
        }
      };
    },
  },
  methods: {
    async getData() {

      if (this.infoBase && (this.infoBase.organization !== '')) {
        this.name = this.infoBase.organization;
      } else {
        // Sino hay nada es porque recargo entonces verifico que tiene cache
        const info = await this.$cache.get.item('org-wizard-data');
        if (info != null && info.organization !== '') {
          this.name = info.organization;
        } else {
          this.$emit("update", {active: false});
        }
      }

    },
    navNext() {
      if (this.name.length > 5) {
        this.$emit("update", {active: true, info: this.name});
      } else {
        this.$emit("update", {active: false});
      }
    },
    getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_COMPANY);
    },
  }
}
</script>
<style>
.select-company {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.step-company {
  @apply tw-flex tw-min-h-screen tw-flex-col tw-justify-center;
  margin-top: -95px;
}
</style>
