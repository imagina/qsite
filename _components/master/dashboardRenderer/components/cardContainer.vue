<script setup>
import { 
  defineProps, 
  computed, 
  ref, 
  defineEmits, 
  toRefs, 
} from 'vue'
import dynamicFilter from 'src/modules/qsite/_components/master/dynamicFilter'

const showDynamicFilterModal = ref(false)
const dynamicFilterValues = ref({})

const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
  header: {
    type: Object,
    default: null,
  },
  toolbox: {
    type: Object,
    default: () => ({}),
  },
})

const { toolbox, header } = toRefs(props)

const emit = defineEmits(['reloadData', 'updateFilters'])

const filters = computed(() => toolbox.value?.features?.filters || {})
const showDynamicFilters = computed(() => Object.keys(filters.value).length)
const systemName = computed(() => header.value.title.replace(/\s/g, '-').toLowerCase())

const toggleDynamicFilterModal = () => {
  showDynamicFilterModal.value = !showDynamicFilterModal.value;
}

const updateDynamicFilterValues = (filters) => {
  dynamicFilterValues.value = filters;
  emit('updateFilters', filters)
}

const reloadData = () => {
  emit('reloadData')
}

const tools = [
  ...toolbox.value?.tools || [],
  {
    name: 'filters',
    icon: 'fa-regular fa-filter',
    action: toggleDynamicFilterModal,
  },
  {
    name: 'reload',
    icon: 'fa-regular fa-rotate-right',
    action: reloadData,
  },
]
const toolsFilter = tools?.filter(tool => toolbox.value?.features[tool?.name])
</script>
<template>
  <div 
    class="
      tw-p-5 tw-rounded-2xl 
      tw-bg-white tw-border 
      tw-border-gray-100 
      tw-box-border
    "
    :class="className"
  >
    <div v-if="header" class="tw-mb-10">
      <q-skeleton 
        v-show="isLoading" 
        type="rect" 
        class="tw-w-52 tw-h-8 tw-rounded-2xl" 
      />
      <div class="tw-flex tw-justify-between tw-items-center">
        <section class="tw-flex tw-items-center">
          <i 
            v-if="header?.icon && !isLoading" 
            class="tw-text-xl tw-mr-2" 
            :class="header?.icon"
            :style="{ 
              color: header?.cssStyle?.color,
              fontSize: header?.cssStyle?.fontSize,
            }"
          />
          <h1 
            v-show="!isLoading" 
            class="tw-text-xl tw-font-bold"
            :style="header?.cssStyle"
          >
            {{ header.title }}
          </h1>
        </section>
        <section v-show="!isLoading && !isEmpty" class="tw-flex tw-items-center tw-gap-2.5">
          <template v-for="toolbox in toolsFilter">
            <q-btn
              @click="toolbox?.action"
              v-show="toolbox?.show || !toolbox?.show"
              unelevated
              outline
              dense
              text-color="primary"
              text
              size="md" 
              class=" 
                tw-w-7
                tw-h-7
                tw-text-base 
                tw-bg-white 
                tw-rounded-md 
                custom-border-color
              "
            >
              <i :class="toolbox?.icon" />
            </q-btn>
          </template>
        </section>
      </div>
      <dynamicFilter
        v-if="showDynamicFilters"
        v-show="!isLoading"
        :showSummary="false"
        :systemName="systemName"
        :modelValue="showDynamicFilterModal"
        :filters="filters"
        @showModal="showDynamicFilterModal = true"
        @hideModal="showDynamicFilterModal = false"
        @update:modelValue="filters => updateDynamicFilterValues(filters)"
      />
    </div>
    <slot />
  </div>
</template>
<style scoped>
.custom-border-color::before {
  @apply tw-border-neutral-200;
}
</style>