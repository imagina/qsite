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
      />
    </div>
    <div class="tw-py-1">
      <q-btn icon="fa-light fa-ellipsis-vertical" size="sm" round unelevated>
        <q-menu>
          <q-list class="tw-w-full">
            <q-item
              clickable
              v-close-popup
              v-for="(item, index) in optionsList"
              :key="index"
              @click.prevent="selectKeyFromOptions(item.value)"
            >
              <q-item-section class="tw-px-2">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-tooltip >
          {{ $tr('isite.cms.message.configureThisSection') }}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import useExpressionField from "./useExpressionField.js";
export default defineComponent({
  props: {
    value: null,
    fieldProps: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    return {
      ...useExpressionField(props, emit),
    };
  },
});
</script>