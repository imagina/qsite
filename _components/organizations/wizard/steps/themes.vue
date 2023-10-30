<template>
  <div class="
    step-themes
    md:tw-overflow-y-auto
    md:tw-h-screen
   ">
    <h2 v-if="stepContent" class="step-title">{{stepContent.title}}</h2>

    <div class="step-loading" v-if="loading"><div></div><div></div></div>
    <div class="row tw-justify-center tw-px-2 md:tw-px-4 tw-mb-6" v-else>
      <div class="col-12 tw-text-xs tw-mt-2 tw-px-3" v-show="selected">
        {{ $tr('isite.cms.message.selectedTemplate') }} : <span class="tw-font-bold"> {{selected.name}}</span>
      </div>
      <div class="col-12" v-if="themes.length>0">
        <div class="row">
          <div class="col-6 col-sm-3  tw-mb-2 tw-p-3 tw-cursor-pointer"
              v-for="(item, index) in themes">
            <div class="item-theme"
                :class="{ activeClass : item.id === selected.id }"
                @click="selectData(item)">
              <q-img contain
                    :src="item.mediaFiles.mainimage.smallThumb"
                    :ratio="1/1"
                    class="tw-rounded tw-border tw-w-full tw-bg-white"/>
              <div class="item-theme-name tw-text-xs text-center text-weight-bold">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 tw-text-base" v-else>
        {{ $tr('isite.cms.message.noTemplates') }}
      </div>
    </div>

    <div v-if="stepContent" class="step-sidebar">
      <div class="select-card tw-max-w-md tw-w-full text-center" v-if="selected">
        <q-img class="img-themes" contain
                :src="selected.mediaFiles.mainimage.extraLargeThumb"
        />
        <div class="select-name text-center text-weight-bold tw-mt-2 text-primary text-h6">
          {{ selected.name }}
        </div>
        <div class="select-description text-caption text-center tw-mb-3" v-html="selected.description"></div>
        <q-btn outline :label="$tr('isite.cms.message.showDemo')" color="primary" rounded
               :href="selected.url" target="_blank"  />
      </div>
      <div class="select-card tw-max-w-md tw-w-full" v-else>
        <div class="tw-text-base tw-mb-8 text-center" v-html="stepContent.description"></div>
        <q-img v-if="stepContent.mediaFiles" contain
                :src="stepContent.mediaFiles.mainimage.extraLargeThumb"
          />
      </div>
    </div>
  </div>
</template>
<script>
import { STEP_NAME_THEMES } from './model/constant.js';
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
      stepContent: '',
      selected: '',
      themes: [],
    }
  },
  inject: {
    infoBase: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext();
      this.getThemeSelected();
      this.getThemes();
      this.getStepInfo();
    })
  },
  methods: {
    selectData(item) {
      this.selected= item;
      this.navNext(this.infoBase);
    },
    navNext() {
      if(this.selected!==''){
        this.$emit("update", { active: true, info: this.selected });
      }else {
        this.$emit("update", { active: false });
      }
    },
    async getThemeSelected() {
      try {
        this.loading = true;
        if(this.infoBase && (this.infoBase.layout !== null)) {
          if(this.infoBase.layout.planId == this.infoBase.plan.planId) {
            this.selected=this.infoBase.layout;
            this.$emit("update", { active: true, info: this.selected});
          }
          this.loading = false;
        } else {
          // Sino hay nada es porque recargo entonces verifico que tiene cache
          const info = await this.$cache.get.item('org-wizard-data');
          if(info != null && info.layout !== null) {
            if(info.layout.planId == info.plan.planId) {
              this.selected=info.layout;
              this.$emit("update", { active: true, info: this.selected});
            }
          } else {
            this.$emit("update",  { active: false });
          }
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getThemes() {
      try {
       if(this.infoBase && this.infoBase.plan !== null) {
          let themes = this.infoBase.plan.planRelatedProducts;
          this.themes = themes.map((item) => ({
            ...item,
            planId: this.infoBase.plan.planId
          }));
       } else {
        // Sino hay nada es porque recargo entonces verifico que tiene cache
        const info = await this.$cache.get.item('org-wizard-data');
        if(info != null && info.plan !== null) {
          let themes = info.plan.planRelatedProducts;
          this.themes = themes.map((item) => ({
            ...item,
            planId: info.plan.planId
          }));
        }
       }

      } catch (error) {
        console.log(error);
      }
    },
    getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_THEMES);
    }
  }
}
</script>
<style>
.step-themes .select-card {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-themes .item-theme  {
  @apply tw-relative;
  transition: all .1s;
}
.step-themes .item-theme-name {
  @apply tw-p-1 tw-mt-1;
}
.step-themes .item-theme:hover .item-theme-name,
.step-themes  .activeClass .item-theme-name {
  background-color: var(--q-color-primary);
  color: #fff;
}
.step-themes .activeClass .tw-border {
  @apply tw-shadow-lg;
}
.step-themes .item-theme:after {
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent tw-rounded;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-themes .activeClass:after, .step-themes .item-theme:hover:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  background-color: var(--q-color-primary); z-index:-1;
}
.step-themes .step-sidebar-stretch {
  @apply tw-items-stretch !important;
}
.step-themes .img-themes {
  object-fit: contain;
  height: 50vh;
}
.step-themes .select-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
