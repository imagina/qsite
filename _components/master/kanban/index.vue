<template>
  <div class="tw-py-2">
    <div
      :id="`kanbanCtn${uId}`"
      v-if="checkIfFunnelExists"
      @mouseover="hoverArrow = true"
      @mouseleave="hoverArrow = false"

    >
      <draggable
        :id="`columnKanban${uId}`"
        :list="kanbanColumns"
        :animation="200"
        group="columns"
        ghost-class="ghostCard"
        drag-class="dragCard"
        filter=".ignoreItem"
        draggable=".notMoveBetweenColumns"
        class="tw-p-3 tw-h-auto tw-flex tw-space-x-4 tw-overflow-x-auto"
        @change="reorderColumns"
        :disabled="disabledDragStatuses"
      >
        <template v-show="!loading">
          <div  v-for="(column, index) in kanbanColumns" 
          :class="{'notMoveBetweenColumns': column.type !== 1}"
          >        
            <kanbanColumn
              :key="index"
              :column-data="column"
              :columnIndex="index"
              :totalColumns="kanbanColumns.length"
              :ref="`kanbanColumn-${column.id}`"
              class="
                tw-flex-none tw-space-y-0
                w-h-auto
                tw-bg-gray-100 tw-rounded-lg tw-shadow
              "
            />
            
          </div>
        </template>
        <q-skeleton
          animation="blink"
          height="700px"
          width="450px"
          v-if="loading"
          v-for="(item, index) in 5"
          :key="index"
        />
        <div class="tw-text-center tw-w-full" v-if="!loading && kanbanColumns.length === 0">
          <i class="fa-duotone fa-face-pleading tw-text-9xl colorTextPrimary"></i>
          <p class="tw-text-xl tw-font-semibold tw-py-4">No tiene estados creados en esta categoría</p>
        </div>
        <div
          v-if="!loading && hoverArrow && scrollTotal > 0"
          class="
            tw-absolute
            tw-left-0
            tw-cursor-pointer
            tw-bg-white
            tw-shadow-lg
            tw-rounded-full
            tw-p-1
            tw-z-20
            tw-border
            tw-border-gray-200
            icon-left"
            style="top: 35%"
            @click="scrollLeft"
          >
            <i class="fa-light fa-arrow-left tw-text-4xl tw-text-gray-300"></i>
        </div>
        <div
          v-if="!loading && hoverArrow && kanbanColumns.length !== 0"
          class="
            tw-absolute
            tw-right-0
            tw-cursor-pointer
            tw-bg-white
            tw-shadow-lg
            tw-rounded-full
            tw-p-1
            tw-z-20
            tw-border
            tw-border-gray-200
            icon-right"
            style="top: 35%"
            @click="scrollRight"
          >
            <i class="fa-light fa-arrow-right tw-text-4xl tw-text-gray-300"></i>
        </div>
      </draggable>
    </div>
    <div v-else>
      <i class="fa-regular fa-square-kanban" />
      No has selecionado ningun funnel
    </div>
    <automationRules
      ref="automationRules"
      :funnelId="funnelSelectedComputed"
    />
    <formComponent
      ref="formComponent"
      :funnelId="funnelSelectedComputed"
      :filterName="routes.column ? routes.column.filter.name : null"
    />
    <formRules
        ref="formRules"
        :funnelId="funnelSelectedComputed"
        :filterName="routes.column ? routes.column.filter.name : null"
    />
    <modalStatus />
    <modalAnalytics />
  </div>
</template>

<script>
import kanbanColumn from "@imagina/qsite/_components/master/kanban/kanbanColumn.vue";
import kanbanStore from "@imagina/qsite/_components/master/kanban/store/kanbanStore.js";
import automationRules from "./automationRules/index.vue";
import draggable from "vuedraggable";
import formComponent from './modals/form.vue';
import formRules from './modals/formRules';
import modalStatus from './modals//statusModal/index.vue'
import modalAnalytics from './modals/analytics/index.vue'
import showaAnalytics from './modals/analytics/actions/show.ts';
import storeAnalytics from './modals/analytics/store/index.ts';

const modelPayload = {
  id: null,
  title: null,
  color: null,
  value: 1,
};
const modelColumn = {
  id: null,
  title: null,
  color: null,
  data: [],
  loading: false,
  page: 1,
  total: 0,
  new: true,
};
export default {
  props: {
    routes: {
      type: Object,
      default: () => ({}),
    },
    heightColumn: {
      type: Number,
      default: () => 235,
    },
    showFunnel: {
      type: Boolean,
      default: () => false,
    },
    funnelId: {
      type: String,
      default: () => null,
    },
    dragColumn: {
      type: Boolean,
      default: () => true,
    },
    disableCrud: {
      type: Boolean,
      default: () => false,
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
    fieldActions: {
      type: Function,
      default: () => false,
    },
  },
  provide() {
    return {
      saveStatusOrdering: this.saveStatusOrdering,
      addKanbanCard: this.addKanbanCard,
      deleteColumn: this.deleteColumn,
      saveColumn: this.saveColumn,
      updateColumn: this.updateColumn,
      setPayloadStatus: this.setPayloadStatus,
      addColumn: this.addColumn,
      heightColumn: this.heightColumn,
      uId: this.uId,
      init: this.init,
      disableCrud: this.disableCrud,
      routes: this.routes,
      automation: this.automation,
      openFormComponentModal: this.openFormComponentModal,
      addCard: this.addCard,
      countTotalRecords: this.countTotalRecords,
      crudfieldActions: this.crudfieldActions,
      deleteKanbanCard: this.deleteKanbanCard,
      updateCardColumn: this.updateCard,
      getStatus: this.getStatus,
    };
  },
  inject:['funnelPageAction', 'fieldActions', 'filterPlugin'],
  components: {
    kanbanColumn,
    draggable,
    automationRules,
    formComponent,
    formRules,
    modalStatus,
    modalAnalytics,
  },
  data() {
    return {
      routeCreate: {
        name: "qrequestable.main.requestables.create",
      },
      kanbanColumns: [],
      funnelList: [],
      funnelSelected: null,
      loading: false,
      payloadStatus: { ...modelPayload },
      uId: this.$uid(),
      search: null,
      hoverArrow: false,
      scrollTotal: 0,
    };
  },
  mounted() {
    this.$nextTick(async function () {
      await this.init();
      if(this.checkIfFunnelExists) {
        const elementColumnKanban = document.getElementById(`columnKanban${this.uId}`);
        if (elementColumnKanban) {
          elementColumnKanban.addEventListener("scroll", evt =>
              this.scrollTotal = evt.target.scrollLeft
          )
        }
      }
    });
  },
  computed: {
    extraPageActions() {
      return [
        {
          vIf: this.$auth.hasAccess('requestable.automationrules.manage'),
          label: this.$tr('requestable.cms.label.analytics'),
          props: {
            padding: "3px 15px",
            icon: 'fa-duotone fa-chart-mixed'
          },
          action: this.openAnalytics,
        },
        {
          vIf: this.$auth.hasAccess('requestable.automationrules.manage'),
          label: this.$tr('requestable.cms.label.automationRules'),
          props: {
            icon: 'fa-duotone fa-ruler',
            padding: "3px 15px",
          },
          action: this.openAutomationRulesModal,
        },
        {
          vIf: this.$auth.hasAccess('requestable.statuses.manage'),
          label: this.$tr('isite.cms.form.status'),
          props: {
            icon: 'fa-duotone fa-swap-arrows',
            padding: "3px 15px",
          },
          action: () => { 
            kanbanStore().setModalStatus(true) 
          },
        }];
    },
    funnel() {
      return {
        value: null,
        type: "select",
        props: {
          label: "Funnel",
        },
        loadOptions: {
          apiRoute: this.routes.funnel ? this.routes.funnel.apiRoute : null,
        },
      };
    },
    funnelSelectedComputed: {
      get() {
        return this.funnelSelected;
      },
      set(value) {
        this.setResetPage();
        this.funnelSelected = value;
      },
    },
    checkIfFunnelExists() {
      return (this.funnelId || this.funnelPageAction);
    },
    scroll() {
      return document.getElementById(`columnKanban${this.uId}`);
    },
    disabledDragStatuses() {
      if(this.$auth.hasAccess('requestable.statuses.edit')) {
        return this.loading || 
        !this.dragColumn || 
        this.kanbanColumns.length === 0
      }
      return true;
    },
  },
  methods: {
    async init(refresh = false, isModal = false) {
      this.kanbanColumns = [];
      await this.getFunnel();
      await this.getColumns(refresh, isModal);
    },
    async getFunnel() {
      try {
        if(this.checkIfFunnelExists) {
          this.funnelSelectedComputed = this.funnelPageAction || this.funnelId;
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    setResetPage() {
      this.kanbanColumns.forEach((item) => {
        item.page = 1;
      });
    },
    addColumn() {
      try {
        const counter = `kanban-${state.kanbanColumn.length + 1}`;
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const column = { ...modelColumn };
        column.id = counter;
        column.color = `#${randomColor}`;
        state.kanbanColumn.splice(index + 1, 0, column);
      } catch (error) {
        console.log(error);
      }
    },
    async reorderColumns() {
      this.reorder("kanbanColumns");
      await this.saveStatusOrdering();
    },
    reorder(type) {
      this[type].forEach((item, index) => {
        item.position = index;
      });
    },
    async getStatus(refresh = false) {
      if(!this.routes.column) return;
        const route = this.routes.column;
        const parameters = { params: {}, refresh };
        parameters.params.include = route.include;
        const id =  { id: this.filterPlugin.values.statusId } || {};
        parameters.params.filter = {
          [route.filter.name]: this.funnelSelectedComputed, ...id,
        };
        const response = await this.$crud.index(route.apiRoute, parameters);
        return response;
    },
    async getColumns(refresh = false, isModal = false) {
      try {
        if(!this.routes.column) return;
        this.loading = true;
        const response = await this.getStatus(isModal ? !refresh : refresh);
        const kanbanColumn = this.getKanbanColumns(response.data, refresh);
        this.kanbanColumns = kanbanColumn;
        setTimeout(() => {
          this.loading = false;
        }, 100);
        
      } catch (error) {
        this.loading = false;
        this.kanbanColumns = [];
        console.log(error);
      }
    },
    getKanbanColumns(data, refresh = false) {
      const kanbanColumn = data.map((item, index) => {
        return {
          id: item.id,
          title: item.title,
          color: item.color,
          data: [],
          page: 1,
          total: 0,
          loading: false,
          new: false,
          position: index,
          type: item.type
        };
      });
      kanbanColumn.forEach(async (column) => {
        const kanbanCard = await this.getKanbanCard(column, 1 ,refresh);
        column.data = kanbanCard.data;
        column.loading = false;
        column.total = kanbanCard.total;
      });
      return kanbanColumn;
    },
    async addCard(columnId) {
      const column = this.kanbanColumns.find(item => item.id === columnId);
      if(column) {
        const kanbanCard = await this.getKanbanCard(column, 1, true);
        column.data = kanbanCard.data;
        column.loading = false;
        column.total = kanbanCard.total;
      }
    },
    async getKanbanCard(column, page = 1, refresh = false) {
      try {
        column.loading = true;
        return await this.getKanbanCardList(column, page, refresh);
      } catch (error) {
        column.loading = false;
        console.log(error);
      }
    },
    async getKanbanCardList(column, page, refresh = false) {
      try {
        const nameRoute = this.automation ? 'automation' : 'card';
        if(!this.routes[nameRoute]) {
          return { total: 0, data: [] };
        }
        const route = this.routes[nameRoute];
        const parameters = { params: {}, refresh };
        const search = this.automation && !this.search ? {} : { search: this.search };
        parameters.params.include = route.include;
        parameters.params.filter = { 
          [route.filter.name]: column.id, 
          ...this.filterPlugin.values, 
          ...search,
          order: {way: 'desc'}
        };
        parameters.params.page = page;
        parameters.params.take = 10;
        const response = await this.$crud.index(route.apiRoute, parameters);
        return this.getCardList(response);
      } catch (error) {
        column.loading = false;
        console.log(error);
      }
    },
    getCardList(response) {
      return {
        total: response.meta.page.total,
        data: response.data.map((card) => {
          const nameCreator = card.creator 
            ? `${card.creator.firstName} ${card.creator.lastName}` 
            : null;
          return { 
            title: card.name || nameCreator || card.title,
            type: card.type || null,
            fields: card.fields || [],
            category: card.category || [],
            statusId: card.statusId,
            ...card,
          }
        }),
      };
    },
    async addKanbanCard(column, page) {
      const kanbancolumn = this.kanbanColumns.find(
        (item) => item.id === column.id
      );
      if (kanbancolumn) {
        const kanbanCard = await this.getKanbanCardList(column, page);
        if (kanbanCard.data.length > 0) {
          kanbancolumn.data.push(...kanbanCard.data);
        }
      }
    },
    async deleteKanbanCard(item){
      try {
        this.$alert.error({
        mode: 'modal',
        title: `ID: ${item.id}`,
        message: this.$tr('isite.cms.message.deleteRecord'),
        actions: [
          {label: this.$tr('isite.cms.label.cancel'), color: 'grey'},
          {
            label: this.$tr('isite.cms.label.delete'),
            color: 'red',
            handler: async () => {
              const nameRoute = this.automation ? 'automation' : 'card';
              if(!this.routes[nameRoute]) {
                return { total: 0, data: [] };
              }
              const route = this.routes[nameRoute];
              const column = this.kanbanColumns.find(column => column.id === item.statusId);
              if(column) column.loading = true;
              await this.$crud.delete(route.apiRoute, item.id);
              const kanbanCard = await this.getKanbanCard(this.automation ? column : item.status, 1, true);
              if(column) {
                column.data = kanbanCard.data || [];
                setTimeout(() => {
                  column.loading = false;
                }, 1000);
                column.total = kanbanCard.total || 0;
              }

            }
          }
        ]
      })
      } catch (error) {
        console.log(error);
      }
    },
    async saveStatusOrdering() {
      try {
        if(!this.routes.orderStatus) return;
        const route = this.routes.orderStatus;
        const statusId = this.kanbanColumns.map((item) => ({ id: item.id }));
        await this.$crud.create(route.apiRoute, {
          [route.filter.name]: statusId,
        });
      } catch (error) {
        console.log(error);
      }
    },
    addColumn(index, data = null) {
      try {
            const counter = `kanban-${Math.random() + 1}`;
            console.log(counter);
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const column = { ...modelColumn };
            column.id = counter;
            column.color = `#${randomColor}`;
            column.type = data?.type || 0;
            this.kanbanColumns.splice(index + 1, 0, column);
        } catch (error) {
            console.log(error);
        }
    },
    async deleteColumn(columnId) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const kanbanColumn = this.kanbanColumns.filter(
          (item) => item.id !== columnId
        );
        this.kanbanColumns = kanbanColumn;
        if (!isNaN(columnId)) {
          await this.$crud.delete(route.apiRoute, columnId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveColumn(data) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const payloadStatus = {};
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus[route.filter.name] = this.funnelSelected;
        payloadStatus.type = data.type;
        return await this.$crud.create(route.apiRoute, payloadStatus);
      } catch (error) {
        console.log(error);
        this.setPayloadStatus();
      }
    },
    async updateColumn(data) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const payloadStatus = {};
        payloadStatus.id = data.id;
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus[route.filter.name] = this.funnelSelected;
        await this.$crud.update(route.apiRoute, data.id, payloadStatus);
      } catch (error) {
        console.log(error);
        this.setPayloadStatus();
      }
    },
    setPayloadStatus() {
      this.payloadStatus = {
        id: null,
        title: null,
        color: null,
        value: 1,
        [this.routes.column.filter.name]: null,
      };
    },
    openAutomationRulesModal() {
      if(this.$refs.automationRules) this.$refs.automationRules.openModal();
    },
    async openAnalytics() {
      storeAnalytics.showModal = true;
      storeAnalytics.categoryId = this.funnelSelected;
      await showaAnalytics();
    },
    openFormComponentModal(statusId, title, id = null) {
      if (this.automation) {
        if (this.$refs.formRules) this.$refs.formRules.openModal(statusId, title, id);
      } else {
        if (this.$refs.formComponent) this.$refs.formComponent.openModal(statusId, title);
      }
    },
    countTotalRecords() {
      try {
        this.kanbanColumns.forEach(item => {
          item.total = item.data.length;
        });
      } catch (error) {
        console.log(error);
      }
    },
    crudfieldActions(field) {
      try {
        return this.fieldActions(field);
      } catch (error) {
        console.log(error);
      }
    },
    setSearch(value) {
      this.search = value && value !== '' ? value : null;
    },
    scrollLeft() {
      const content = this.scroll;
      content.scrollLeft -= 400;
      this.scrollTotal = content.scrollLeft;
    },
    scrollRight() {
      const content = this.scroll;
      content.scrollLeft += 400;
      this.scrollTotal = content.scrollLeft;
    },
    updateCard(columId) {
      this.kanbanColumns.forEach(item => {
        if(item.id == columId) {
          item.data.forEach(card => {
            card.status.id = columId;
            card.statusId = columId;
          })
        }
      })
    }
  },
};
</script>

<style lang="stylus">
.kanbanBtnCtn .q-btn {
  border-radius: 10px;
}
.colorTextPrimary {
  color: $primary;
}
.icon-right {
  animation-name: slideUpReturn;
  animation-duration: .5s;
  animation-fill-mode: both;
  margin-top: 2px;
}
.icon-left {
  animation-name: slideLeftReturn;
  animation-duration: .5s;
  animation-fill-mode: both;
  margin-top: 2px;
}

@keyframes slideUpReturn {
  0% {
    transform-origin: 0 0;
    transform: translateX(100%);
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(0%);
  }
}
@keyframes slideLeftReturn {
  0% {
    transform-origin: 0 0;
    transform: translateX(0%);
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(25%);
  }
}
</style>
