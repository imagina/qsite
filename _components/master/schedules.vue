<template>
  <div id="scheduleComponent">
    <!--Read Content-->
    <q-list separator>
      <q-item v-for="(day, keyDay) in schedule" :key="keyDay" clickable style="padding: 8px">
        <div class="row full-width items-center">
          <!--Day Name-->
          <div class="col-xs-4 text-blue-grey"><b class="q-pl-md">{{ $tr(`isite.cms.label.${day.name}`) }}</b></div>
          <!--Schedules-->
          <div class="col-xs-6 text-left q-body-2">
            <!--Message Close-->
            <div class="text-red capitalize" v-if="day.schedules == '0'">
              <b>{{ $tr('isite.cms.label.closed') }}</b>
            </div>
            <!--Message 24 Hours-->
            <div class="text-green capitalize" v-else-if="day.schedules == '1'">
              <b>{{ `24 ${$trp('isite.cms.label.hour')}` }}</b>
            </div>
            <!--List Custom-->
            <div v-else>
              <div v-for="(daySchedule,index) in day.schedules" :key="index">
                {{
                  `${$trd(currentDate + daySchedule.from, {type: 'time'})} - ${$trd(currentDate + daySchedule.to, {type: 'time'})}`
                }}
              </div>
            </div>
          </div>
          <!---Actions-->
          <div class="col-xs-2 text-right">
            <btn-menu :actions="dayActions" :action-data="day"/>
          </div>
        </div>
      </q-item>
    </q-list>
    <!--Modal Form day schedule-->
    <master-modal v-model="modal.show" @hide="dayEdit = false" v-bind="propsModal">
      <div id="modalScheduleContent" class="box box-auto-height">
        <div class="row q-col-gutter-y-sm">
          <!--Schedules-->
          <div v-for="(schedule, indexSchedule) in dayEdit.schedules" :key="indexSchedule" class="col-xs-12">
            <div class="row items-center q-col-gutter-sm relative-position modal-content">
              <!--From hour-->
              <dynamic-field v-model="dayEdit.schedules[indexSchedule].from" class="col-6"
                             :field="formFields.fromHour"/>
              <!--To hour-->
              <dynamic-field v-model="dayEdit.schedules[indexSchedule].to" class="col-6"
                             :field="formFields.toHour"/>
              <!--Remove Range-->
              <div class="remove-action">
                <q-btn icon="fas fa-trash-alt" text-color="red" outline unelevated color="red" round size="10px"
                       padding="8px" @click="dayEdit.schedules.splice(indexSchedule, 1)"
                       :disable="dayEdit.schedules.length >= 2 ? false : true" class="btn-small"/>
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
    readonly: {type: Boolean, default: false}
  },
  emits: ['update:modelValue','converted'],
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
      schedule: [
        {name: 'monday', iso: 1, schedules: '1'},
        {name: 'tuesday', iso: 2, schedules: '1'},
        {name: 'wednesday', iso: 3, schedules: '1'},
        {name: 'thursday', iso: 4, schedules: '1'},
        {name: 'friday', iso: 5, schedules: '1'},
        {name: 'saturday', iso: 6, schedules: '1'},
        {name: 'sunday', iso: 7, schedules: '1'},
      ],
      currentDate: this.$moment().format('YYYY-MM-DD'),
      dayEdit: false,
      modal: {
        show: false
      },
      dayTest: false,
    }
  },
  computed: {
    //Day actions
    dayActions() {
      //Response
      return [
        {
          label: this.$tr('isite.cms.label.custom'),
          icon: 'fas fa-pen',
          action: (item) => {
            //Get day schedule
            this.dayEdit = this.$clone(this.schedule.find(day => day.iso == item.iso))
            //Change schedule to array
            if (!Array.isArray(this.dayEdit.schedules)) this.dayEdit.schedules = [
              {from: '08:00', to: '10:00'}
            ]
            //Open dialog
            this.modal.show = true
          }
        },
        {
          label: `24 ${this.$trp('isite.cms.label.hour')}`,
          icon: 'fas fa-store-alt',
          action: (item) => {
            this.schedule.forEach((day, index) => {
              if (day.iso == item.iso) this.schedule[index].schedules = '1'
            })
          }
        },
        {
          label: this.$tr('isite.cms.label.closed'),
          icon: 'fas fa-store-alt-slash',
          action: (item) => {
            this.schedule.forEach((day, index) => {
              if (day.iso == item.iso) this.schedule[index].schedules = '0'
            })
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
        title: `${this.$tr('isite.cms.form.schedule')} ${this.$tr(`isite.cms.label.${this.dayEdit.name}`)}`,
        actions: [
          {
            props: {
              label: this.$tr('isite.cms.label.add') + ' ' + this.$tr('isite.cms.form.hour'),
              icon: 'fas fa-plus-circle',
              color: 'blue',
              outline: true
            },
            action: () => {
              this.dayEdit.schedules.push({from: '08:00', to: '10:00'})
            }
          },
          {
            props: {
              label: this.$tr('isite.cms.label.save'),
              color: 'green'
            },
            action: () => {
              let dayIndex = this.schedule.findIndex(day => day.iso == this.dayEdit.iso)
              this.schedule[dayIndex] = this.$clone(this.dayEdit)
              this.modal.show = false
            }
          }
        ]
      }
    },
    //Form Fields
    formFields() {
      return {
        fromHour: {
          type: 'hour',
          withFullDate: true,
          props: {
            label: this.$tr('isite.cms.label.since'),
          }
        },
        toHour: {
          type: 'hour',
          withFullDate: true,
          props: {
            label: this.$tr('isite.cms.label.until'),
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
    //Emit Value
    emitResponse() {
      let transformedSchedule = []
      let schedule = this.$clone(this.schedule)
      //Transform data to schedules
      Object.values(this.schedule).forEach((day, dayKey) => {
        if (Array.isArray(day.schedules)) {
          day.schedules.forEach((item, keyItem) => {
            //Transformed
            const from = this.parserDate(item.from);
            const to = this.parserDate(item.to);
            transformedSchedule.push({
              iso: day.iso,
              name: day.name,
              startTime: from.format('HH:mm:00'),
              endTime: to.format('HH:mm:00'),
            })
          })
        } else {
          if (day.schedules == 1) {
            transformedSchedule.push({
              iso: day.iso,
              name: day.name,
              startTime: '00:00:00',
              endTime: '23:59:00'
            })
          }
        }
      })
      this.$emit('converted', this.$clone(transformedSchedule))//Emit response
      const scheduleClone = this.mapSchedule(schedule);
      this.$emit('update:modelValue', scheduleClone)//Emit response
    },
    parserDate(date) {
      return this.$moment(date).isValid() ? this.$moment(date) : this.$moment(this.currentDate + ' ' + date);
    },
    mapSchedule(data) {
      let schedule = this.$clone(data);
      schedule.forEach(item => {
        if (!["0", "1", 0, 1].includes(item.schedules)) {
          item.schedules = item.schedules.map((item) => {
            const from = this.parserDate(item.from).format('YYYY-MM-DD HH:mm');
            const to = this.parserDate(item.to).format('YYYY-MM-DD HH:mm');
            return {
              from,
              to,
            }
          })
        }
      });
      return schedule;
    }
  }
}
</script>
<style lang="scss">
#modalScheduleContent {
  .modal-content {
    padding-right: 45px;

    .remove-action {
      position: absolute;
      top: 6px;
      right: 0;
    }
  }
}
</style>
