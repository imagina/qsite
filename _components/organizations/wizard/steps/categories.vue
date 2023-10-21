<template>
  <div class="step-categories">

    <h2 v-if="stepContent" class="step-title">{{stepContent.title}}</h2>
    <div class="tw-px-2 md:tw-px-6 tw-pb-6 tw-mt-4 tw-mb-2">
      <dynamic-field v-model="name" :field="formFields.category" @input="getCategoriesSearch"/>
      <div class="tw-text-xs tw-mt-2" v-show="selected">
        {{ $tr('isite.cms.message.selectedCategory') }}: <span class="tw-font-bold"> {{selected.title}}</span>
      </div>
    </div>
    <div class="stepp-loading" v-if="loading"><div></div><div></div></div>
    <div v-else>
    <div class="tw-px-2 md:tw-px-6" v-if="categories.length>=1">
      <div class="row q-gutter-sm items-stars justify-between tw-mb-4">
        <div class="col-auto tw-mb-3"
            v-for="(item, index) in categories" v-show="(pag - 1) * limitPage <= index  && pag * limitPage > index"
            @click="selectData(item)">
          <div class="text-category
                      tw-text-sm
                      tw-rounded-lg
                      tw-px-3
                      tw-py-1
                      tw-cursor-pointer"
              :class="{ 'text-active-cate' : item.id === selected.id }">
              {{item.title}}
          </div>
        </div>
      </div>
      <div class="row q-gutter-sm justify-center">
        <div class="col-12" v-show="pag != 1">
          <hr class="tw-my-3 tw-w-1/2 tw-mx-auto">
        </div>
        <div class="col-auto">
          <q-btn padding="none" round flat color="primary" icon="arrow_circle_left" v-show="pag != 1" @click.prevent="pag -= 1" />
        </div>
        <div class="col-auto">
          <q-btn padding="none" round flat color="primary" icon="arrow_circle_right" v-show="pag * limitPage / categories.length < 1" @click.prevent="pag += 1"/>
        </div>
      </div>
    </div>
    <div class="tw-px-2 md:tw-px-6" v-else>
      {{ $tr('isite.cms.message.noCategories') }} 
    </div>
  </div>

    <!--
    <div class="tw-px-6 row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-2 tw-cursor-pointer" v-for="(item, index) in filteredCategories" @click="selectData(item)">
        <div class="item-category" :class="{ activeClass : item.id === selected.id }">
          <q-img
                 :src="item.mediaFiles.mainimage.smallThumb"
                 :ratio="4/3"
                 class="tw-rounded-md tw-w-full"
          >
            <div class="item-category-name absolute-bottom tw-text-xs text-center tw-truncate">
              {{item.title}}
              <q-tooltip>
                {{item.title}}
              </q-tooltip>
            </div>
          </q-img>
        </div>
      </div>

    </div>-->

    <div v-if="stepContent" class="step-sidebar">
      <div class="categories-text tw-max-w-sm tw-w-full">
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
import {
  LIMIT_PAGE,
  STEP_NAME_CATEGORIES } from './model/constant.js';
import { urlToHttpOptions } from 'url';
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
      limitPage: LIMIT_PAGE,
      pag: 1,
      stepContent: '',
      name:'',
      selected: '',
      categories: [],
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.getDataBase();
      this.getCategorySelected();
      this.navNext();
      this.getStepInfo();
    })
  },
  inject: {
    infoBase: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
    formFields() {
      return {
        category: {
          value: "",
          type: "search",
          props: {
            label: this.$tr('isite.cms.label.search'),
            color: "primary",
            rounded: true,
            dense: false
          }
        },
      };
    },
  },
  methods: {
    selectData(item) {
      this.selected=item;
      this.navNext();
    },
    navNext() {
      if(this.selected){
        this.$emit("update",  { active: true, info: this.selected});
      }else {
        this.$emit("update", { active: false});
      }
    },
    async getCategorySelected() {
      try {
        this.loading = true;
        if(this.infoBase && this.infoBase.category !== null) {
          this.selected=this.infoBase.category;
          this.loading = false;
        } else {
          // Sino hay nada es porque recargo entonces verifico que tiene cache
          const info = await this.$cache.get.item('org-wizard-data');
          if(info != null && info.category !== null) {
            this.selected=info.category;
            this.$emit("update", { active: true, info: this.selected});
          } else {
            this.$emit("update",  { active: false });
          }
          this.loading = false;
        }

      } catch (error) {
        console.log(error);
      }
    },
    async getDataBase() {
      try {
        const categories = await this.$cache.get.item('org-wizard-categories');
        if(categories.length>0){
          this.categories= categories;
        } else {
          // por si borraron el cache
          this.categoryCache()
        }

      } catch (error) {
        console.log(error);
      }
    },
    async getCategoriesSearch() {
      try {
        if((this.name!==null) && this.name.length>3) {
          this.deselectCategory(this.name);
          this.loading = true;
          const categories = await storeStepWizard().getCategoriesSearch(this.name);
          this.loading = false;
          this.categories = categories;

        } else {
          this.getDataBase();
        }

      } catch (error) {
        console.log(error);
      }
    },
    deselectCategory(value) {
      this.selected="";
      this.name=value;
      this.navNext();
    },
    async getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_CATEGORIES);
    },
    async categoryCache(){
      const categoriesNew  = await storeStepWizard().getCategories();
      await this.$cache.set('org-wizard-categories',  categoriesNew );
      this.categories= categoriesNew;
    }
  }
}
</script>
<style>
.step-categories .item-category  {
  @apply tw-relative;
  transition: all .1s;
}
.step-categories .item-category-name {
  @apply tw-p-1;
}
.step-categories  .activeClass .item-category-name {
  background-color: var(--q-color-primary);
}
.step-categories .activeClass .tw-border {
  @apply tw-shadow-lg;
}
.step-categories .item-category:after {
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent tw-rounded-md;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-categories .activeClass:after, .step-categories .item-category:hover:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  border-color: var(--q-color-primary);
}
.step-categories .select-category, .step-categories .categories-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-categories .text-category {
  @apply tw-relative;
  border-width: 1px; border-color: var(--q-color-primary);
}

.step-categories .text-category:after {
  @apply tw-rounded-lg tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  z-index: -1;
  content: "";
}
.step-categories .text-active-cate,
.step-categories .text-category:hover {
  @apply tw-text-white;
}
.step-categories .text-active-cate:after,
.step-categories .text-category:hover:after {
  @apply tw--top-1 tw--right-1 tw--bottom-1 tw--left-1;
  background: var(--q-color-primary);
}

.step-categories .stepp-loading {
  @apply tw-absolute tw-w-20 tw-h-20 tw-top-3/4 tw-left-1/2;
  transform: translate(-75%, -75%);
}

.step-categories .stepp-loading div {
  @apply tw-absolute tw-opacity-100 tw-rounded-full;
  border: 4px solid var(--q-color-primary);
  animation: step-loading 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.step-categories .stepp-loading div:nth-child(2) {
  animation-delay: -0.5s;
}
</style>
