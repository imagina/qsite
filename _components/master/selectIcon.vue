<template>
  <div id="iconSelectComponent">
    <!--Input selected-->
    <q-input v-model="selectedIcon" bg-color="white" outlined dense clearable :label="label || $tr('isite.cms.form.icon')"
             class="cursor-pointer" :rules="rules">
      <template v-slot:append v-if="selectedIcon">
        <q-icon :name="selectedIcon" color="blue-grey" @click="modal.show = true"/>
      </template>
    </q-input>

    <!--Dielog with list icons-->
    <q-dialog id="modalIconListContent" v-model="modal.show" class="q-mb-lg">
      <q-card class="bg-grey-1 backend-page row">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ `${$tr('isite.cms.label.select')} ${$tr('isite.cms.form.icon')}` }}</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="fa fa-close"/>
        </q-toolbar>

        <!--Content-->
        <q-card-section class="relative-position col-12">
          <!--Search-->
          <q-input v-model="searchIcon" bg-color="white" outlined dense clearable :label="$tr('isite.cms.label.search')"
                   class="q-mb-md">
            <template v-slot:append>
              <q-icon name="fas fa-search"/>
            </template>
          </q-input>
          <!--Icon categories-->
          <q-select v-model="selectedCategory" :options="categoryOptions" emit-value map-options outlined dense
                    :label="$tr('isite.cms.label.category')" use-input @filter="filterCategoryOptions" v-if="!searchIcon"
                    bg-color="white" style="width: 100%" behavior="menu" class="q-mb-md"/>
          <!--Icon list-->
          <div class="icon-list-content row q-col-gutter-xs">
            <!--Remove icon-->
            <div class="remove-icon col-4 col-md-3">
              <div class="icon-content" @click="selectedIcon = null; modal.show = false">
                <div class="empty-icon q-mb-xs"></div>
                <div class="ellipsis text-caption text-grey-7">{{ $tr('isite.cms.message.withoutIcon') }}</div>
              </div>
            </div>
            <!--Icons-->
            <div v-for="(icon, keyIcon) in showIconsData" :key="keyIcon" class="col-4 col-md-3">
              <div class="icon-content" @click="selectedIcon = icon.className; modal.show = false">
                <q-icon :name="icon.toLoad" color="blue-grey" size="35px"/>
                <div class="ellipsis text-caption text-grey-7">{{ icon.name }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import iconsFontaweson5 from 'modules/qsite/_resources/icons/fontAweson5'
import iconsFontaweson4 from 'modules/qsite/_resources/icons/fontAweson4'

export default {
  props: {
    modelValue: {default: null},
    label: {default: false},
    rules: {
      default: () => {
        return []
      }
    },
    version: {default: '5'}
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue(newValue, oldValue) {
      if (newValue != oldValue) this.selectedIcon = newValue
    },
    selectedIcon(newValue) {
      this.$emit('update:modelValue', newValue)
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      modal: {
        show: false
      },
      rootCategoryOptions: [],
      categoryOptions: [],
      searchIcon: null,
      selectedCategory: 'accessibility',
      selectedIcon: null
    }
  },
  computed: {
    //Icons data
    iconsData() {
      if (this.version == '4') return iconsFontaweson4
      else return iconsFontaweson5
    },
    //show icons result
    showIconsData() {
      let response = []

      //by search
      if (this.searchIcon && (this.searchIcon.length >= 2)) {
        let allIcons = []
        //Get all icons
        Object.values(this.iconsData).forEach(categoryIcons => allIcons = [...allIcons, ...categoryIcons])
        //Filter by search
        let filtered = allIcons.filter(icon => icon.includes(this.searchIcon))
        //Get unic icons
        filtered.forEach(icon => {
          if (!response.includes(icon)) response.push(icon)
        })
      } else {//by category
        response = this.$clone(this.iconsData[this.selectedCategory])
      }

      //Set iconLoad name
      response.forEach((icon, key) => {
        //Map icon data
        let iconFormat = {
          className: icon,
          toLoad: icon,
          name: icon.substr((this.version == '4' ? 6 : 7), icon.length)
        }

        //change icon data
        response[key] = this.$clone(iconFormat)
      })

      //response
      return response
    }
  },
  methods: {
    init() {
      this.selectedIcon = this.$clone(this.modelValue)
      this.setRootCategoryOptions()
    },
    //Set root options
    setRootCategoryOptions() {
      //Map options
      let response = Object.keys(this.iconsData).map((key) => {
        return {label: `${this.$tr(`isite.cms.label.${key}`)} (${this.iconsData[key].length})`, value: key}
      })

      //Sort by label
      response.sort((a, b) => (a.label > b.label) ? 1 : -1)

      //Repsonse
      this.rootCategoryOptions = this.$clone(response)
    },
    //Filter category Options
    filterCategoryOptions(val, update) {
      update(async () => {
        this.categoryOptions = this.$helper.filterOptions(val, this.rootCategoryOptions, this.selectedCategory)
      })
    }
  }
}
</script>
<style lang="scss">
#modalIconListContent {
  .icon-list-content {
    max-height: 500px;
    overflow-y: scroll;

    .remove-icon {
      text-align: center;

      .empty-icon {
        width: 35px;
        height: 35px;
        border: dashed $blue-grey 1px;
        margin: auto;
      }
    }

    .icon-content {
      text-align: center;
      cursor: pointer;
      padding: 10px;

      &:hover {
        background-color: $grey-3;
      }
    }
  }
}
</style>
