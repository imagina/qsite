<template>
  <div v-show="showMenu">
    <div id="listMenu">
      <q-no-ssr v-for="(item,key) in menuData" :key="key" :class="`content-item ${inLine ? 'inline-block' : ''} ${showSelected ? 'select-items': ''}`">
        <!--ToolTip-->
        <q-tooltip v-if="withTooltip" v-bind="tooltipProps || {}">{{
            translatable ? $tr(item.label) : item.label
          }}
        </q-tooltip>
        <!--Single Item-->
        <q-item :id="`menuItem-${parseIdItem(item.name || key)}`" v-bind="item.itemProps"
                v-if="item?.itemProps?.vIf != undefined ? item?.itemProps?.vIf : true" @click.native="selectItem(item)">
          <q-item-section v-if="item.icon && showIcons" avatar>
            <q-icon :name="item.icon"/>
          </q-item-section>
          <q-item-section class="text-capitalize">
            <q-item-label>{{ translatable ? $tr(item.label) : item.label }}</q-item-label>
            <q-item-label caption lines="2">{{ translatable ? $tr(item.subLabel) : item.subLabel }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Dropdwon Item -->
        <q-expansion-item v-else-if="checkItemMultiple(item)" :icon="item.icon" :key="key"
                          :label="translatable ? $tr(item.label) : item.label"
                          v-bind="group ? {group : listUid} : {}"
                          :header-class="`${item.headerClass} ${selectedChildren(item)}`" :default-opened="selectedChildren(item) ? true : false"
                          :class="`${item.customClass} ${selectedChildren(item) ? 'expansion-selected' : ''}`">
          <!--Recursive item-->
          <recursive-menu :translatable="translatable" :show-icons="showIcons" :key="key" :menu="item.children"
                          :group="group" :right-icon="rightIcon" />
        </q-expansion-item>
      </q-no-ssr>
    </div>
  </div>
</template>
<script>
import controller from "modules/qsite/_components/v3/recursiveItem/controller";

export default {
  name: 'recursiveMenu',
  components: {},
  props: {
    withTooltip: {type: Boolean, default: false},
    menu: {type: Array, default: () => []},
    showIcons: {type: Boolean, default: true},
    translatable: {type: Boolean, default: true},
    inLine: {type: Boolean, default: false},
    group: {type: Boolean, defualt: false},
    tooltipProps: {type: Object, default: null},
    rightIcon: {type: Boolean, default: false},
    showSelected: {type: Boolean, default: true}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
}
</script>
<style lang="scss">
#listMenu {
  .q-expansion-item__container .q-expansion-item__content {
    padding: 0 0 0 15px;
  }

  .q-item {
    cursor: pointer;
    color: $grey-9;

    .q-icon {
      font-size: 12px;
    }

    .q-item__section--avatar {
      min-width: 20px;
      padding-right: 10px;
    }
  }

  .select-items {
    .q-expansion-item__container .q-expansion-item__content .q-item {
      cursor: pointer;
      color: $grey-9;

      .q-item__section--avatar {
        min-width: 20px;
        padding-right: 10px;

        .q-icon {
          font-size: 14px;
          color: $blue-grey;
        }
      }

      &:hover {
        background-color: $grey-4;
        color: $primary;

        .q-icon {
          color: $primary;
          font-size: 18px;
        }
      }

      &.item-is-active {
        background-color: $custom-accent-color;

        .q-item__section, .q-icon {
          color: $primary;
        }
      }

      .expansion-selected {
        background-color: $primary;
      }
    }
  }
}
</style>
