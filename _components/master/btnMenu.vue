<template>
  <q-btn
    class="btn-menu-component"
    color="grey-1"
    text-color="blue-grey"
    icon="fas fa-ellipsis-v"
    round
    unelevated
    size="sm"
    style="font-size: 8px; padding: 6px"
    v-if="showBtnMenu"
  >
    <q-menu
      class="btn-menu-component__menu tw-shadow-lg"
      anchor="bottom right"
      self="top right"
    >
      <q-list dense>
        <template v-for="(action, keyAction) in actionsData">
          <q-item
            :key="keyAction"
            v-bind="action.props"
            v-close-popup
            v-if="showActionMenu(action)"
            @click.native="runAction(action)"
            class="tw-rounded-lg"
          >
            <q-item-section>
              <div class="row items-center text-blue-grey">
                <q-icon :name="action.icon" color="blue-grey" size="16px" />
                {{ action.label || action.tooltip }}
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  props: {
    actions: { default: false },
    actionData: { default: false },
  },
  mounted() {
    this.$nextTick(function () {});
  },
  data() {
    return {};
  },
  computed: {
    actionsData() {
      return this.actions
        .map((item) => {
          //Instance item props
          item.props = { tag: "a", key: this.$uid(), clickable: true };

          //Define external redirect
          if (item.toRoute) item.props.href = item.toRoute;

          //Instance vue route redirect
          if (item.route) {
            item.props.to = {
              name: item.route,
              params: this.$helper.getRouteParams(
                this.$router.getRoutes().find(route => route.name === item.route),
                this.actionData
              ),
            };
          }
          // Formatting all instances
          if (item.format)
            item = { ...item, ...(item.format(this.actionData, item) || {}) };

          //Return item
          return item;
        })
        .filter((item) => item.vIf !== "" && item.vIf !== false);
    },
    showBtnMenu() {
      return this.actions && this.actions.length && this.actionsData.length;
    },
    showActionMenu() {
      return (action) => (action?.vIf != undefined ? action?.vIf : true);
    },
  },
  methods: {
    //Call custom action
    async runAction(action) {
      //Define action params
      let actionData = this.$clone(this.actionData || {});
      //Check if has action function
      if (action.action) await action.action(actionData);
    },
  },
};
</script>
<style lang="scss">
.btn-menu-component__menu {
  padding: 8px;
  min-width: auto;
  border-radius: 8px;

  .q-list {
    min-width: 150px;
  }

  .q-item {
    padding: 8px;

    .q-icon {
      margin-right: 10px;
    }
  }
}
</style>
