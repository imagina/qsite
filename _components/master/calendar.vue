<template>
  <div id="calendarComponent" :key="componentId">
    <!--Content-->
    <div id="componentContent" class="box relative-position" style="padding: 0px">
      <!--Actions-->
      <div class="row items-center">
        <!--Calendar type-->
        <div class="col-12">
          <q-btn-toggle v-model="calendarType" no-caps unelevated toggle-color="blue-grey" color="white"
                        text-color="blue-grey" :options="calendarTypeOptions" id="btnCalendarType"
                        size="14px" padding="md sm" spread />
        </div>
        <!--Date Actions-->
        <div class="col-12" v-if="calendarType != 'all'">
          <div class="row items-center justify-center q-gutter-x-sm q-py-md">
            <!--Prev date-->
            <q-btn v-if="calendarType != 'all'" @click="$refs.calendarComponent.prev()" icon="fas fa-chevron-left"
                   color="blue-grey" round unelevated size="sm" flat />
            <!--Current date-->
            <div class="text-blue-grey text-weight-bold text-subtitle1 cursor-pointer" @click="modalQDate = true">
              {{ calendarType == 'day' ? $trd(calendarDate, { type: 'small' }) : $trd(calendarDate, { type: 'month' })
              }},
              {{ $trd(calendarDate, { type: 'year' }) }}
            </div>
            <!--Float calendar-->
            <q-dialog v-model="modalQDate">
              <q-date v-model="calendarDate" @update:modelValue="modalQDate = false" mask="YYYY-MM-DD" />
            </q-dialog>
            <!--Next date-->
            <q-btn v-if="calendarType != 'all'" @click="$refs.calendarComponent.next()" icon="fas fa-chevron-right"
                   color="blue-grey" round unelevated size="sm" flat />
          </div>
          <!--Separator-->
          <q-separator />
        </div>
      </div>
      <!--Events-->
      <div id="calendarContent">
        <!---Calendar-->
        <q-calendar id="calendarComponent" v-model="calendarDate" v-bind="propsCalendar[calendarType]"
                    ref="calendarComponent" v-if="calendarType != 'all'" no-scroll>
          <!--Body content | Year-->
          <template #day="{ scope: {timestamp} }">
            <!--- Day and Week-->
            <div class="row q-py-md" v-if="propsCalendar[calendarType].type == 'card'">
              <div v-for="(event, index) in getEventsList(timestamp)" :key="index"
                        :class="propsCalendar[calendarType].eventClass">
                <div class="event-content" @click="openEvent(event)">
                  <!--Icon-->
                  <div class="event-icon row justify-center">
                    <q-avatar :icon="event.icon" :color="event.color" />
                  </div>
                  <!--Description-->
                  <div class="event-description q-pb-sm q-px-sm">
                    <!--Type-->
                    <div class="text-caption ellipsis">{{ event.title }}</div>
                    <!--Time-->
                    <div class="text-weight-bold">{{ event.time }}</div>
                    <!--main details-->
                    <div v-for="(item, key) in (event.mainDetails || [])" :key="key" class="text-caption ellipsis">
                      <q-icon v-if="item.icon" :name="item.icon" />
                      {{ item.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Month -->
            <div class="q-pa-sm row q-col-gutter-y-xs" v-else>
              <div v-for="(event, index) in getEventsList(timestamp)" :key="index" class="col-12">
                <div class="event-content q-px-sm q-py-xs relative-position text-caption ellipsis"
                     style="margin: 0 !important;" @click="openEvent(event)">
                  <q-avatar :icon="event.icon" :color="event.color" size="sm"
                            text-color="white" />
                  {{ event.time }} - {{ event.title }}
                  <q-tooltip>{{ event.title }}</q-tooltip>
                </div>
              </div>
            </div>
          </template>
        </q-calendar>
        <!--List events-->
        <div id="eventListcontent" v-else>
          <div class="row">
            <div v-for="(event, index) in getEventsList()" :key="index"
                 :class="propsCalendar[calendarType].eventClass">
              <div class="event-content" @click="openEvent(event)">
                <!--Icon-->
                <div class="event-icon row justify-center">
                  <q-avatar :icon="event.icon" :color="event.color" />
                </div>
                <!--Description-->
                <div class="event-description q-pb-sm q-px-sm">
                  <!--Type-->
                  <div class="text-caption ellipsis">{{ event.title }}</div>
                  <!--Time-->
                  <div class="text-weight-bold">{{ event.time }}</div>
                  <!--main details-->
                  <div v-for="(item, key) in (event.mainDetails || [])" :key="key" class="text-caption ellipsis">
                    <q-icon v-if="item.icon" :name="item.icon" />
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Service appointment modal-->
      <master-modal v-model="modal.show" custom-position :actions="eventActions || []" :loading="loading"
                    :title="$tr('isite.cms.label.event') + (modal.data.id ? ' ID: ' + modal.data.id : '')">
        <!--Card Component-->
        <component v-if="modal.data.card" :is="modal.data.card.component" :row="modal.data.card.row" />
        <!--Default Card-->
        <div class="box" v-else>
          <q-list separator dense>
            <q-item v-for="(item, key) in modal.data.extraDetails" :key="key" class="q-px-none">
              <!--Title-->
              <q-item-section>
                <div class="text-left">
                  <q-icon :name="item.icon" color="grey-7" class="q-mr-sm" size="sm" />
                  {{ item.title }}
                </div>
              </q-item-section>
              <!--Description-->
              <q-item-section side v-html="item.value" />
            </q-item>
          </q-list>
        </div>
      </master-modal>
      <!--Inner loading-->
      <inner-loading :visible="loading" />
    </div>
  </div>
</template>
<script>
//Components
import { QCalendar, parseDate } from '@quasar/quasar-ui-qcalendar/src/index.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass';
import { eventBus } from 'src/plugins/utils';
import { markRaw } from 'vue';

export default {
  components: { QCalendar },
  props: {
    eventsData: { default: false },
    eventActions: { default: false }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      componentId: this.$uid(),
      loading: false,
      calendarType: 'day',
      calendarTypeOptions: [
        { label: this.$tr('isite.cms.label.month'), value: 'month', icon: 'fas fa-calendar-alt' },
        { label: this.$tr('isite.cms.label.week'), value: 'week', icon: 'fas fa-calendar-week' },
        { label: this.$tr('isite.cms.label.day'), value: 'day', icon: 'fas fa-calendar-day' },
        { label: this.$tr('isite.cms.label.all'), value: 'all', icon: 'fas fa-list-alt' }
      ],
      calendarDate: this.$moment().format('YYYY-MM-DD'),
      modalQDate: false,
      modal: {
        show: false,
        data: false
      }
    };
  },
  computed: {
    //Props to calendar by view
    propsCalendar() {
      return {
        month: {
          view: 'month',
          mode: 'month',
          style: 'min-width: 1200px;',
          type: 'badge'
        },
        week: {
          view: 'week',
          mode: 'agenda',
          eventClass: 'col-12',
          style: 'min-width: 1200px;',
          type: 'card'
        },
        day: {
          view: 'day',
          mode: 'agenda',
          eventClass: 'col-6 col-md-4 col-lg-3',
          type: 'card'
        },
        all: {
          view: 'all',
          eventClass: 'col-6 col-md-4 col-lg-3',
          type: 'card'
        }
      };
    }
  },
  methods: {
    init() {
      //Listen refresh event
      eventBus.on('page.data.refresh', () => this.componentId = this.$uid());
    },
    //Return events
    getEventsList(timestamp = false) {
      let events = this.$clone(this.eventsData || []);
      let response = [];
      //Transform event data
      events.forEach(event => {
        //Parse date
        let eventDate = parseDate(new Date(event.date));
        let fullDate = `${eventDate.date} ${eventDate.time}`;

        //Validate if event is date
        if (!timestamp || (eventDate.date == timestamp.date)) {
          response.push({
            ...event,
            time: this.$trd(fullDate, { type: 'time' }),
            extraDetails: [
              { value: event.title },
              {
                title: this.$tr('isite.cms.label.date'),
                icon: 'fas fa-calendar-day',
                value: this.$trd(eventDate.date)
              },
              {
                title: this.$tr('isite.cms.label.time'),
                icon: 'fas fa-clock',
                value: this.$trd(fullDate, { type: 'time' })
              },
              ...event.extraDetails || []
            ]
          });
        }
      });

      //Response
      return response;
    },
    //Open event detail
    async openEvent(data) {
      if (data.card) {
        const component = await data.card.component;
        if (component.default) data.card.component = markRaw(component.default);
      }
      this.modal = { data: data, show: true };
    }
  }
};
</script>
<style lang="scss">
#componentContent {
  #btnCalendarType {
    //border: 1px solid $primary;

    .q-btn {
      border-right: 1px solid $grey-4;
      border-bottom: 1px solid $grey-4;
      min-width: 55px;

      &:last-child {
        border-right: none;
      }
    }
  }

  #calendarContent {
    overflow-x: scroll;

    #calendarComponent {
      .q-calendar-agenda__pane {
        min-height: 515px;
        max-height: 515px;
        height: 515px;
        overflow-y: scroll;
      }

      .q-calendar-month__body {
        min-height: 555px;
        max-height: 555px;
        height: 555px;
        overflow-y: scroll;

        .q-calendar-month__day {
          min-height: 110px;
        }
      }
    }
  }

  .event-content {
    margin: 5px;
    background-color: $custom-accent-color;
    cursor: pointer;
    color: $grey-9;
    border-radius: $custom-radius-items;

    .event-icon {
      width: 100%;
      margin-top: 30px;

      .q-avatar {
        margin-top: -25px;
        margin-bottom: 10px;
        font-size: 60px;
        max-height: 60px;
        color: white;
      }
    }
  }

  #eventListcontent {
    height: 645px;
    max-height: 645px;
    overflow-y: scroll;
  }
}
</style>
