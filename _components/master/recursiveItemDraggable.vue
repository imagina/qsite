<template>
  <div id="recurisveItemDraggable">
    <!-- draggabel container -->
    <draggable
        tag="div"
        v-bind="dragOptions"
        :list="items"
        :group="{ name: 'g1' }">
      <div
          class="drag-group"
          v-for="(item, index) in items"
          :key="item.id">
        <!-- list -->
        <div class="row justify-between items-center q-mb-xs q-mt-xs">
          <!-- name -->
          <div class="col-10 row q-py-xs blue-green items-center">
            <div class="q-px-xs" :class="{'q-py-md': item.subTitle }">
              <q-icon class="cursor-pointer q-px-sm" color="blue-grey" name="fa-light fa-bars"/>
            </div>
            <div class="text-subtitle2 text-weight-light" :class="{'q-py-xs': item.subTitle}">
              {{ item.title }}
              <span v-if="!!item.subTitle" class="block text-caption text-grey-8">
                {{ item.subTitle }}
              </span>
            </div>
          </div>
          <!-- menu actions -->
          <div class="col-2 text-right q-py-xs relative-position">
            <btn-menu
                v-if="item.actions.length"
                :actions="item.actions"
                :action-data="item"
            />
          </div>
        </div>
        <!-- recursive dragabble -->
        <nestedDraggable
            :class="`${item.children.length} ?: q-mb-xs`"
            :items="item.children"
            v-if="nested"
        />
      </div>
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

<style lang="stylus">
#recurisveItemDraggable
  .drag-group
    margin-top 5px
    margin-bottom 5px
    cursor move
    display block
    padding 0 5px
    border lightgray 1px solid
    border-radius $custom-radius

</style>
