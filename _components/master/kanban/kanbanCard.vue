<template>
  <div
    class="
      tw-bg-white
      tw-shadow
      tw-rounded
      tw-px-3
      tw-pt-3
      tw-pb-2
      tw-border-l-2
      tw-my-2
      kb-card
    "
    :style="{ borderLeftColor: colorColumn }"
  >
    <div class="tw-flex tw-justify-between">
      <p
        class="
          tw-text-gray-700
          tw-font-semibold
          tw-font-sans
          tw-tracking-wide
          tw-text-sm
          tw-w-full
        "
      >
        <q-btn-dropdown
          round
          color="gray-4"
          flat
          size="10px"
          padding="5px 5px"
          class="
            kd-without-arrow
            tw-float-right 
            tw-cursor-pointer 
            tw-text-xs 
            tw-bg-gray-100
          "
          icon="fa-solid fa-ellipsis"
        >
          <q-list
            dense
            class="
              tw-p-2 
              kd-list-without-arrow 
              tw-bg-gray-100 
              tw-text-xs"
          >
            <q-item
              clickable
              v-close-popup
              v-for="(action, keyAction) in actionsAutomations"
              :key="keyAction"
              v-bind="action.props"
              v-if="action.vIf != undefined ? action.vIf : true"
              @click.native="runAction(action)"
            >
              <q-item-section avatar>
                <q-icon :name="action.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ action.label || action.tooltip }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

       ID:{{ cardData.id }} {{ cardData.title }}
      </p>
    </div>
    <div
      v-if="cardData.type"
      class="tw-flex tw-mt-1 tw-justify-between tw-items-center"
    >
      <span class="tw-text-xs tw-text-gray-600">
        <b>Tipo *</b> {{ cardData.type }}
      </span>
    </div>
    <div
      class="tw-flex tw-mt-1 tw-justify-between tw-items-center"
      v-for="field in cardData.fields"
      :key="field.id"
    >
      <span
        class="tw-text-xs tw-text-gray-600 tw-truncate"
        v-if="field.name && typeof field.value !== 'object'"
      >
        <b>{{ field.label || field.name }} *</b>
        <span class="tw-lowercase">{{ field.value }}</span>
      </span>
    </div>

    <div class="tw-flex tw-mt-4 tw-justify-between tw-items-center">
      <span class="tw-text-xs tw-text-gray-600">
        <b>{{ $tr('isite.cms.label.date') }} *</b> {{ cardData.createdAt }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  inject: {
    showRequestData: {
      type: Function,
      default: () => false,
    },
    update: {
      type: Function,
      default: () => false,
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
    crudfieldActions: {
      type: Function,
      default: () => false,
    },
    deleteKanbanCard:  {
      type: Function,
      default: () => false,
    },
    openFormComponentModal:  {
      type: Function,
      default: () => false,
    },
  },
  props: {
    cardData: {
      type: Object,
      default: () => {},
    },
    colorColumn: {
      type: String,
      default: () => "#00000",
    },
  },
  computed: {
    actions() {
      return this.crudfieldActions(this.cardData);
    },
    actionsAutomations() {
      let response = [
       //Delete action
        {
          icon: 'fas fa-trash-alt',
          color: 'red',
          label: this.$tr('isite.cms.label.delete'),
          action: (item) => {
            if(this.deleteKanbanCard) this.deleteKanbanCard(item);
          }
        },
        {
          icon: 'fas fa-pencil',
          color: 'red',
          label: this.$tr('isite.cms.label.edit'),
          action: (item) => {
            if(this.openFormComponentModal) this.openFormComponentModal(item.statusId, item.title, item.id);
          }
        }
      ];
      return this.automation ?  response : this.actionsData;
    },
    actionsData() {
      return this.actions.map((item) => {
        //Instance item props
        item.props = { tag: "a", key: this.$uid(), clickable: true };

        //Define external redirect
        if (item.toRoute) item.props.href = item.toRoute;

        //Instance vue route redirect
        if (item.route)
          item.props.to = {
            name: item.route,
            params: this.$clone(this.cardData || {}),
          };

        // Formatting all instances
        if (item.format)
          item = { ...item, ...(item.format(this.cardData) || {}) };

        //Return item
        return item;
      });
    },
  },
  methods: {
    openModal() {
      if (this.showRequestData) this.showRequestData(this.cardData);
    },
    openEdit() {
      if (this.update) this.update(this.cardData);
    },
    async runAction(action) {
      //Define action params
      let actionData = this.$clone(this.cardData || {});
      //Check if has action function
      if (action.action) await action.action(actionData);
    },
  },
};
</script>
<style>
.kd-without-arrow .q-btn-dropdown__arrow {
  @apply tw-hidden !important;
}
.kd-list-without-arrow .q-item__section--avatar {
  @apply tw-mx-1 tw-pr-1 !important tw-min-w-0 !important;
}
</style>