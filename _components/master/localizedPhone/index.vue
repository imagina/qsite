<template>
  <div class="tw-flex">
    <div class="tw-w-full">
      <q-input
        ref="inputKey"
        v-model="inputDataComputed"
        v-bind="field"
        outlined
        class="tw-bg-white"
        @click="getNativeElement"
        dense
      >
        <template v-slot:prepend>
          <q-btn-dropdown flat size="md" v-model="isDrop" id="localized-phone-dropdown">
            <template v-slot:label>
              <div class="text-blue-grey text-weight-medium">
                {{ seletdCountry.name }} (+{{ seletdCountry.callingCode }})
              </div>
            </template>
            <div>
              <div class="tw-p-4 tw-mb-3 tw-border tw-border-gray-200">
                <q-input
                  v-model="searchTerm"
                  outlined
                  class="tw-bg-white"
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="fas fa-search" />
                  </template>
                </q-input>
              </div>
              <div class="tw-px-4">
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="(country, index) in filteredCountries"
                    :key="index"
                    @click="setSeletdCountry(country)"
                  >
                    <q-item-section
                      class="tw-px-3"
                      :class="{
                        'tw-bg-blue-100 tw-opacity-90 tw-rounded-lg':
                          seletdCountry.iso3 === country.iso3,
                      }"
                    >
                      <q-item-label>
                        {{ country.name }} (+{{ country.callingCode }})
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div
                  v-if="filteredCountries.length === 0"
                  class="tw-py-12 tw-text-center"
                >
                  No Data
                </div>
              </div>
            </div>
          </q-btn-dropdown>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useLocalizedPhone from "./useLocalizedPhone";
export default defineComponent({
  props: {
    value: null,
    fieldProps: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    return {
      ...useLocalizedPhone(props, emit),
    };
  },
});
</script>
<style lang="scss">
#localized-phone-dropdown {
  border-right: 1px solid;
  border-color: #E5E7EB;

  .q-btn__wrapper {
    padding: 0px;
  }
}
</style>
