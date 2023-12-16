<template>
  <div 
    class="
      tw-space-y-2 
      tw-border 
      tw-border-gray-200
      tw-rounded-md
      tw-shadow-md"
    >
    <div 
      class="
       tw-w-full 
       tw-px-4
       tw-py-2 
       tw-text-lg 
       tw-font-semibold 
       tw-border-b
       tw-border-gray-200
       tw-text-gray-500"
    >
      {{ fieldProps.label }}
    </div>
    <div>
      <draggable 
        v-model="fields" 
        :animation="200"
        handle=".dot-vertical"
        class="tw-h-500"
        :class="{'tw-overflow-y-scroll': fields.length > 0}"
      >
        <div
          v-for="(field, keyField) in fields"
          :key="keyField"
          class="
           row 
           q-col-gutter-md 
           tw-mb-5 
           tw-border 
           tw-border-gray-200 
           tw-mx-5
           tw-px-2
           tw-rounded-md 
           tw-mt-3"
        >
         <div 
          class="tw-w-full"
          v-if="fieldProps.isDraggable"
        >
            <i class="
              tw-cursor-move
              fa-solid 
              fa-grip-dots
              dot-vertical 
              tw-text-lg 
              tw-text-gray-500" 
            />
         </div>
          <div
            v-for="key in Object.keys(field)"
            :key="key"
            :class="defaultField[key].colClass"
          >
            <dynamic-field
              v-model="fields[keyField][key]"
              :field="defaultField[key]"
            />
          </div>
          <div class="tw-w-full tw-text-right">
            <q-btn
              color="red"
              icon="fa-light fa-trash-can"
              size="sm"
              flat
              round
              @click="deleteItem(keyField)"
            >
              <q-tooltip>
                {{ $tr('isite.cms.label.delete') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div 
          v-if="fields.length === 0"
          class="
           tw-w-full 
           tw-text-center
           tw-text-7xl 
           tw-text-gray-500
           tw-py-16"
        >
          <div class="tw-mb-4">
            <i class="fa-light fa-face-thinking" />
          </div>
          No data
        </div>
      </draggable>
      <div 
        class="
         tw-my-4
         tw-px-4 
         tw-w-full 
         tw-text-right"
      >
        <q-btn
          color="primary"
          icon="fa-light fa-plus"
          @click="add"
          size="sm"
          round
          class="tw-ml-4"
          :disabled="maxQuantity"
        >
          <q-tooltip>
            {{$tr('isite.cms.label.add')}}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import multipleDynamicFieldsController from "../controllers/multipleDynamicFields.controller";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    draggable,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    fieldProps: {
      type: Object as any,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    return { ...multipleDynamicFieldsController(props, emit) };
  },
});
</script>

<style scoped src="../assets/styles/styles.css">
</style>