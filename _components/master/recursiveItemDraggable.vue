<template>
  <div id="recurisveItemDraggable">
    <!-- draggabel container -->
    <draggable
        tag="div"
        v-bind="dragOptions"
        :list="items"
        :group="{ name: 'g1' }"
        item-key="id"
    >
      <template #item="{ element }">
        <div
          class="drag-group"
          :key="element.id"
        >
          <!-- list -->
          <div class="row justify-between items-center q-mb-xs q-mt-xs">
            <!-- name -->
            <div class="col-10 row q-py-xs blue-green items-center">
              <div class="q-px-xs" :class="{'q-py-md': element.subTitle }">
                <q-icon class="cursor-pointer q-px-sm" color="blue-grey" name="fa-light fa-bars"/>
              </div>
              <div class="text-subtitle2 text-weight-light" :class="{'q-py-xs': element.subTitle}">
                {{ element.title }}
                <span v-if="!!element.subTitle" class="block text-caption text-grey-8">
                {{ element.subTitle }}
              </span>
              </div>
            </div>
            <!-- menu actions -->
            <div class="col-2 text-right q-py-xs relative-position">
              <btn-menu
                v-if="element.actions.length"
                :actions="element.actions"
                :action-data="element"
              />
            </div>
          </div>
          <!-- recursive dragabble -->
          <nestedDraggable
            :class="`${element.children.length} ?: q-mb-xs`"
            :items="element.children"
            v-if="nested"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'nestedDraggable',
  components: {
    draggable,
  },
  props: {
    items: {
      required: true,
      type: Array,
      default: () => []
    },
    deleteApi: {
      type: String
    },
    disabled: {
      required: false,
      type: Boolean,
      default: () => false,
    },
    nested: {type: Boolean, default: true}
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: this.disabled,
        ghostClass: "ghost"
      };
    },
  },
};
</script>

<style lang="scss">
#recurisveItemDraggable {
  .drag-group {
    margin-top: 5px;
    margin-bottom: 5px;
    cursor: move;
    display: block;
    padding: 0 5px;
    border: lightgray 1px solid;
    border-radius: $custom-radius;
  }
}
</style>
