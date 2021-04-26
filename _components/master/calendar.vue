<template>
  <div id="calendarComponent" :key="componentId">
    <!--Content-->
    <div id="componentContent" class="relative-position" style="padding: 0px">
      <!--Actions-->
      <div class="row q-px-md q-py-sm items-center q-col-gutter-sm">
        <!--Calendar type-->
        <div class="col-12 col-md-6">
          <q-btn-toggle v-model="calendarType" no-caps unelevated toggle-color="primary" color="white"
                        text-color="primary" :options="calendarTypeOptions" id="btnCalendarType"
                        size="12px" padding="xs sm"/>
        </div>
        <!--Date Actions-->
        <div class="col-12 col-md-6">
          <div class="row items-center justify-end q-gutter-x-sm">
            <!--Current date-->
            <div class="text-grey-9 text-weight-bold text-subtitle1 cursor-pointer" @click="modalQDate = true"
                 v-if="calendarType != 'all'">
              {{ calendarType == 'day' ? $trd(calendarDate, {type: 'small'}) : $trd(calendarDate, {type: 'month'}) }},
              {{ $trd(calendarDate, {type: 'year'}) }}
            </div>
            <!--Float calendar-->
            <q-dialog v-model="modalQDate">
              <q-date v-model="calendarDate" @input="modalQDate = false" mask="YYYY-MM-DD"/>
            </q-dialog>
            <!--Prev date-->
            <q-btn v-if="calendarType != 'all'" @click="$refs.calendarComponent.prev()" icon="fas fa-chevron-left"
                   color="primary" round unelevated size="sm"/>
            <!--Next date-->
            <q-btn v-if="calendarType != 'all'" @click="$refs.calendarComponent.next()" icon="fas fa-chevron-right"
                   color="primary" round unelevated size="sm"/>
          </div>
        </div>
      </div>
      <!--Separator-->
      <q-separator/>
      <!--Events-->
      <div id="calendarContent">
        <!---Calendar-->
        <q-calendar id="calendarComponent" v-model="calendarDate" v-bind="propsCalendar[calendarType]"
                    ref="calendarComponent" v-if="calendarType != 'all'" no-scroll>
          <!--Body content | Day and Week-->
          <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }"
                    v-if="propsCalendar[calendarType].type == 'card'">
            <div class="row q-py-md">
              <!--Event-->
              <div v-for="(event, index) in getEventsList(timestamp)" :key="index"
                   :class="propsCalendar[calendarType].eventClass">
                <div class="event-content" @click="modal.data = event; modal.show = true">
                  <!--Icon-->
                  <div class="event-icon row justify-center">
                    <q-avatar :icon="event.icon" :style="`background-color : ${event.color}`"/>
                  </div>
                  <!--Description-->
                  <div class="event-description q-pb-sm q-px-sm">
                    <!--Type-->
                    <div class="text-caption ellipsis">{{ event.title }}</div>
                    <!--Time-->
                    <div class="text-weight-bold">{{ event.time }}</div>
                    <!--main details-->
                    <div v-for="(item, key) in (event.mainDetails || [])" :key="key" class="text-caption ellipsis">
                      <q-icon v-if="item.icon" :name="item.icon"/>
                      {{ item.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!--Body content | Year-->
          <template #day="{ timestamp }">
            <div class="q-pa-sm row q-col-gutter-y-xs">
              <div v-for="(event, index) in getEventsList(timestamp)" :key="index" class="col-12">
                <div class="event-content q-px-sm q-py-xs relative-position text-caption ellipsis"
                     style="margin: 0 !important;" @click="modal.data = event; modal.show = true">
                  <q-avatar :icon="event.icon" :style="`background-color : ${event.color}`" size="sm"
                            text-color="white"/>
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
              <div class="event-content" @click="modal.data = event; modal.show = true">
                <!--Icon-->
                <div class="event-icon row justify-center">
                  <q-avatar :icon="event.icon" :style="`background-color : ${event.color}`"/>
                </div>
                <!--Description-->
                <div class="event-description q-pb-sm q-px-sm">
                  <!--Type-->
                  <div class="text-caption ellipsis">{{ event.title }}</div>
                  <!--Time-->
                  <div class="text-weight-bold">{{ event.time }}</div>
                  <!--main details-->
                  <div v-for="(item, key) in (event.mainDetails || [])" :key="key" class="text-caption ellipsis">
                    <q-icon v-if="item.icon" :name="item.icon"/>
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Service appointment modal-->
      <q-dialog v-model="modal.show" no-esc-dismiss no-backdrop-dismiss>
        <q-card class="bg-grey-1 backend-page row">
          <!--Header-->
          <q-toolbar class="text-white" :style="`background-color : ${modal.data.color}`">
            <q-toolbar-title>
              <q-icon :name="modal.data.icon" class="q-mr-sm"/>
              <label>{{ $tr('ui.label.event') }} {{ modal.data.id ? ' ID: '+modal.data.id : '' }}</label>
            </q-toolbar-title>
            <q-btn flat v-close-popup icon="fas fa-times"/>
          </q-toolbar>

          <!--Content-->
          <q-card-section class="relative-position col-12">
            <q-list separator dense>
              <q-item v-for="(item, key) in modal.data.extraDetails" :key="key" class="q-px-none">
                <!--Title-->
                <q-item-section>
                  <div class="text-left">
                    <q-icon :name="item.icon" color="grey-7" class="q-mr-sm" size="sm"/>
                    {{ item.title }}
                  </div>
                </q-item-section>
                <!--Description-->
                <q-item-section side v-html="item.value"/>
              </q-item>
            </q-list>
          </q-card-section>

          <!--Actions-->
          <div id="eventActions" class="text-right full-width q-pa-md" v-if="modal.data.id">
            <q-btn v-for="(item, key) in (eventActions || [])" :key="key" :icon="item.icon" :color="item.color"
                   :label="item.label" rounded unelevated no-caps
                   @click="item.callBack(modal.data), modal.show = false"/>
          </div>
        </q-card>
      </q-dialog>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
//Components
import QCalendar from '@quasar/quasar-ui-qcalendar'

export default {
  props: {
    eventsData: {default: false},
    eventActions: {default: false}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      componentId: this.$uid(),
      loading: false,
      calendarType: 'day',
      calendarTypeOptions: [
        {label: this.$tr('ui.label.month'), value: 'month'},
        {label: this.$tr('ui.label.week'), value: 'week'},
        {label: this.$tr('ui.label.day'), value: 'day'},
        {label: this.$tr('ui.label.all'), value: 'all'}
      ],
      calendarDate: this.$moment().format('YYYY-MM-DD'),
      modalQDate: false,
      modal: {
        show: false,
        data: false
      }
    }
  },
  computed: {
    //Props to calendar by view
    propsCalendar() {
      return {
        month: {
          view: 'month',
          style: 'min-width: 1200px;',
          type: 'badge'
        },
        week: {
          view: 'week-agenda',
          eventClass: 'col-12',
          style: 'min-width: 1200px;',
          type: 'card'
        },
        day: {
          view: 'day-agenda',
          eventClass: 'col-6 col-md-4 col-lg-3',
          type: 'card'
        },
        all: {
          view: 'all',
          eventClass: 'col-6 col-md-4 col-lg-3',
          type: 'card'
        },
      }
    }
  },
  methods: {
    init() {
      //Listen refresh event
      this.$root.$on('page.data.refresh', () => this.componentId = this.$uid())
    },
    //Return events
    getEventsList(timestamp = false) {
      let events = this.$clone(this.eventsData || [])
      let response = []
      //Transform event data
      events.forEach(event => {
        //Parse date
        let eventDate = QCalendar.parseDate(new Date(event.date))
        let fullDate = `${eventDate.date} ${eventDate.time}`
        //Validate if event is date
        if (!timestamp || (eventDate.date == timestamp.date))
          response.push({
            ...event,
            time: this.$trd(fullDate, {type: 'time'}),
            extraDetails: [
              {value: event.title},
              {title: this.$tr('ui.label.date'), icon: 'fas fa-calendar-day', value: this.$trd(eventDate.date)},
              {title: this.$tr('ui.label.time'), icon: 'fas fa-clock', value: this.$trd(fullDate, {type: 'time'})},
              ...event.extraDetails,
            ]
          })
      })

      //Response
      return response
    }
  }
}
</script>
<style lang="stylus">
#calendarComponent
  #componentContent
    #btnCalendarType
      border 1px solid $primary

      .q-btn
        border-right 1px solid $primary
        min-width 55px

        &:last-child
          border none

    #calendarContent
      overflow-x scroll

      #calendarComponent
        .q-calendar-daily__pane
          min-height 515px
          max-height 515px
          height 515px
          overflow-y scroll

        .q-calendar-weekly__container
          min-height 555px
          max-height 555px
          height 555px
          overflow-y scroll

          .q-calendar-weekly__day
            min-height 110px

      .event-content
        margin 5px
        background-color $custom-accent-color
        cursor pointer
        color $grey-9

        .event-icon
          width 100%
          margin-top 30px

          .q-avatar
            margin-top -25px
            margin-bottom 10px
            font-size 60px
            max-height 60px
            color white

      #eventListcontent
        height 580px
        max-height 580px
        overflow-y scroll
</style>
