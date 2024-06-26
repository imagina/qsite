<template>
  <div id="scheduleComponent">
    <!--Schedule config-->
    <div class="row items-center q-pt-md q-px-md">
      <div class="text-blue-grey text-h6 col q-pb-md"><b>{{ $tr('isite.cms.form.schedule') }}</b></div>
      <div class="col">
        <dynamic-field v-model="schedule.status" :field="formFields.status"/>
      </div>
    </div>
    <q-separator class="-my-md" inset/>
    <!--Work time list-->
    <div class="q-pa-md row q-col-gutter-y-sm">
      <div v-for="(day, keyDay) in weekDays" :key="keyDay" class="col-12">
        <div class="row full-width items-center day-work-time">
          <!--Top content-->
          <div class="col-xs-4">
            <!--Day Name-->
            <label class="text-blue-grey text-weight-bold">{{ day.label }}</label>
            <!--Message Close-->
            <label class="text-red capitalize q-ml-xs" v-if="!workTimesByDay[day.id].length">
              {{ $tr('isite.cms.label.closed') }}
            </label>
          </div>
          <!--workTimes-->
          <div class="col-xs-8" v-if="!withShiftTime && workTimesByDay[day.id].length">
            <!--Work Times-->
            <div v-for="(workTime,index) in workTimesByDay[day.id]" :key="index">
              {{ $trd(currentDate + workTime.startTime, {type: 'time'}) }} -
              {{ $trd(currentDate + workTime.endTime, {type: 'time'}) }}
            </div>
          </div>
          <!--workTimes with shift time-->
          <div class="col-xs-12 text-left q-body-2" v-if="withShiftTime && workTimesByDay[day.id].length">
            <!--Headers-->
            <div class="row text-blue-grey q-my-xs">
              <div class="col" style="line-height: 1">{{ $tr('isite.cms.startTime') }}</div>
              <div class="col" style="line-height: 1">{{ $tr('isite.cms.endTime') }}</div>
              <div class="col" style="line-height: 1">{{ $tr('isite.cms.shiftTime') }}</div>
            </div>
            <!--Work Times-->
            <div v-for="(workTime,index) in workTimesByDay[day.id]" :key="index">
              <div class="row q-mb-xs">
                <div class="col">{{ $trd(currentDate + workTime.startTime, {type: 'time'}) }}</div>
                <div class="col">{{ $trd(currentDate + workTime.endTime, {type: 'time'}) }}</div>
                <div class="col">{{ workTime.shiftTime + ' ' + $trp('isite.cms.label.minute') }}</div>
              </div>
            </div>
          </div>
          <!---Actions-->
          <div class="actions-content row items-center">
            <btn-menu :actions="dayActions" :action-data="day"/>
          </div>
        </div>
      </div>
    </div>
    <!--Modal Form day schedule-->
    <master-modal v-model="modal.show" v-bind="propsModal">
      <div id="modalScheduleContent" v-if="modal.day">
        <div class="row q-col-gutter-y-sm">
          <!--workTimes-->
          <div v-for="(workTime, indexWorkTime) in modal.workTimes" :key="indexWorkTime" class="col-xs-12">
            <div class="work-time-content box box-auto-height row items-center">
              <div class="row items-center q-col-gutter-sm col-12">
                <!--From hour-->
                <dynamic-field v-model="modal.workTimes[indexWorkTime].startTime" class="col-6"
                               :field="formFields.startTime"/>
                <!--To hour-->
                <dynamic-field v-model="modal.workTimes[indexWorkTime].endTime" class="col-6"
                               :field="formFields.endTime"/>
                <!--Shift Time-->
                <dynamic-field v-model="modal.workTimes[indexWorkTime].shiftTime" class="col-12"
                               :field="formFields.shiftTime" v-if="withShiftTime"/>
              </div>
              <!--Remove Range-->
              <div class="actions-content">
                <q-btn icon="fas fa-trash-alt" text-color="red" outline unelevated color="red" round size="10px"
                       padding="8px" @click="modal.workTimes.splice(indexWorkTime, 1)"
                       :disable="modal.workTimes.length >= 2 ? false : true" class="btn-small"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </master-modal>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: {default: false},
    zone: {default: 'main'},
    withShiftTime: {type: Boolean, default: false}
  },
  emits: ['update:modelValue'],
  components: {},
  watch: {
    modelValue: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
            this.schedule = this.$clone(newValue)
          }
        }
      },
      deep: true
    },
    zone(newValue, oldValue) {
      this.schedule.zone = this.$clone(newValue)
    },
    schedule: {
      deep: true,
      handler(newValue, oldValue) {
        this.emitResponse()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      currentDate: this.$moment().format('YYYY-MM-DD'),
      schedule: {
        status: 1,
        zone: this.$clone(this.zone),
        fromDate: null,
        toDate: null,
        workTimes: []
      },
      modal: {
        show: false,
        day: null,
        worktimes: []
      }
    }
  },
  computed: {
    //Day Shifts
    weekDays() {
      return [
        {id: 1, label: this.$tr('isite.cms.label.monday')},
        {id: 2, label: this.$tr('isite.cms.label.tuesday')},
        {id: 3, label: this.$tr('isite.cms.label.wednesday')},
        {id: 4, label: this.$tr('isite.cms.label.thursday')},
        {id: 5, label: this.$tr('isite.cms.label.friday')},
        {id: 6, label: this.$tr('isite.cms.label.saturday')},
        {id: 7, label: this.$tr('isite.cms.label.sunday')}
      ]
    },
    //Group worktimes by day id
    workTimesByDay() {
      //Default response
      let response = {}

      //Group worktimes by week day
      this.weekDays.forEach(day => {
        response[day.id] = this.schedule.workTimes.filter(item => item.dayId == day.id)
      })

      //response
      return response
    },
    //Day actions
    dayActions() {
      //Response
      return [
        {
          label: this.$tr('isite.cms.label.edit'),
          icon: 'fas fa-pen',
          action: (item) => {
            //Get day schedule
            this.modal = {
              show: true,
              day: this.$clone(item),
              workTimes: this.$clone(this.schedule.workTimes.filter(wt => wt.dayId == item.id))
            }

            //Check default work times
            if (!this.modal.workTimes.length) this.modal.workTimes = [
              {dayId: item.id, startTime: null, endTime: null, shiftTime: null}
            ]
          }
        },
        {
          label: this.$tr('isite.cms.label.closed'),
          icon: 'fas fa-store-alt-slash',
          action: (item) => {
            this.removeWorktimesByDay(item.id)
          }
        }
      ]
    },
    //Modal props
    propsModal() {
      //Default props
      if (!this.modal.show) return {}
      //Response props
      return {
        title: `${this.$tr('isite.cms.form.schedule')} ${this.modal.day.label}`,
        actions: [
          {
            props: {
              label: this.$tr('isite.cms.label.add') + ' ' + this.$tr('isite.cms.form.hour'),
              icon: 'fas fa-plus-circle',
              color: 'blue',
              outline: true
            },
            action: () => {
              this.modal.workTimes.push({dayId: this.modal.day.id, startTime: null, endTime: null, shiftTime: null})
            }
          },
          {
            props: {
              label: this.$tr('isite.cms.label.save'),
              color: 'green'
            },
            action: () => {
              //Remove all work times by day
              this.removeWorktimesByDay(this.modal.day.id)
              //Add to schedule workTimes of the day
              this.schedule.workTimes = [...this.schedule.workTimes, ...this.$clone(this.modal.workTimes)]
              //Close modal
              this.modal.show = false
            }
          }
        ]
      }
    },
    //Form Fields
    formFields() {
      return {
        status: {
          value: 1,
          type: 'select',
          props: {
            label: this.$tr('isite.cms.form.status'),
            options: [
              {label: this.$tr('isite.cms.label.enabled'), value: 1},
              {label: this.$tr('isite.cms.label.disabled'), value: 0}
            ]
          }
        },
        startTime: {
          value: '08:00',
          type: 'hour',
          props: {
            label: this.$tr('isite.cms.startTime')
          }
        },
        endTime: {
          value: '09:00',
          type: 'hour',
          props: {
            label: this.$tr('isite.cms.endTime')
          }
        },
        shiftTime: {
          value: 30,
          type: 'select',
          props: {
            label: this.$tr('isite.cms.shiftTime'),
            useInput: false,
            options: this.$helper.getShiftTimeOptions({
              hour: this.$tr('isite.cms.label.hour'),
              hours: this.$trp('isite.cms.label.hour'),
              minutes: this.$trp('isite.cms.label.minute'),
              and: this.$tr('isite.cms.label.and'),
            })
          }
        }
      }
    }
  },
  methods: {
    //Init
    init() {
      this.emitResponse()
    },
    //Delete workTimes by day
    removeWorktimesByDay(dayId) {
      this.schedule.workTimes = this.$clone(this.schedule.workTimes.filter(item => item.dayId != dayId))
    },
    //Emit schedule
    emitResponse() {
      this.$emit('update:modelValue', this.$clone(this.schedule))
    }
  }
}
</script>
<style lang="scss">
#scheduleComponent {
  border: 1px solid $grey-4;
  border-radius: $custom-radius;

  .day-work-time {
    border: 1px solid $grey-4;
    border-radius: $custom-radius;
    padding: 10px 54px 10px 10px;
    position: relative;

    .actions-content {
      position: absolute;
      right: 10px;
    }
  }

  #modalScheduleContent {
    .work-time-content {
      padding-right: 54px;
      position: relative;

      .actions-content {
        position: absolute;
        right: 15px;
      }
    }
  }
}
</style>
