import { start } from "repl";
import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import { i18n, clone } from 'src/plugins/utils'
import moment from "moment";
import { from } from "core-js/core/array";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    dateRange: ref({from: '', to: ''}),
    qDateProxy: ref()
   // type: ref(null)
  }

  // States
  const state = reactive({
    // Key: Default Value
    type: null
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    fieldsConfig: computed(() => {
      return {
        type: {
          value: props.modelValue?.type || null,
          type: 'select',
          props: {
            //label: props.label ?? i18n.tr('isite.cms.form.date'),
            label: 'Date Range',
            clearable: true,
            options: [
              {label: i18n.tr('isite.cms.label.customRange'), value: 'customRange'},
              {label: i18n.tr('isite.cms.label.today'), value: 'today'},
              {label: i18n.tr('isite.cms.label.yesterday'), value: 'yesterday'},
              {label: i18n.tr('isite.cms.label.tomorrow'), value: 'tomorrow'},
              {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 7}), value: 'lastSevenDays'},
              {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 30}), value: 'lastThirtyDays'},
              {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 60}), value: 'lastSixtyDays'},
              {label: i18n.tr('isite.cms.label.currentWeek'), value: 'currentWeek'},
              {label: i18n.tr('isite.cms.label.lastWeek'), value: 'lastWeek'},
              {label: i18n.tr('isite.cms.label.nextWeek'), value: 'nextWeek'},
              {label: i18n.tr('isite.cms.label.currentMonth'), value: 'currentMonth'},
              {label: i18n.tr('isite.cms.label.lastMonth'), value: 'lastMonth'},
              {label: i18n.tr('isite.cms.label.nextMonth'), value: 'nextMonth'},
              {label: i18n.tr('isite.cms.label.numMonthsAgo', {numMonths: 2}), value: 'twoMonthsAgo'},
              {label: i18n.tr('isite.cms.label.currentYear'), value: 'currentYear'},
              {label: i18n.tr('isite.cms.label.lastYear'), value: 'lastYear'},
              {label: i18n.tr('isite.cms.label.numYearsAgo', {numYears: 2}), value: 'twoYearsAgo'},
              {label: i18n.tr('isite.cms.label.lastNumYears', {numYears: 2}), value: 'lastTwoYears'},
              {label: i18n.tr('isite.cms.label.daysAroundToday', {numDays: 15}), value: '15daysAroundToday'},
              {label: i18n.tr('isite.cms.label.daysAroundToday', {numDays: 5}), value: '5daysAroundToday'}
            ]
          }
        },
      }
    }),
    /*

      dateInput: computed({
      get(){
        return `${state.model.from} - ${state.model.to}`
      }, 
      set(value){
        state.model.from = value.split('-')[0]
        state.model.to = value.split('-')[1]
        emit('update:modelValue', state.model);
      }
    })
    */
    
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    changeType(){
      state.type = null
    },
    changeDate() {      
        let typeDate = clone(state.type)
        let fromDate = refs.dateRange.value.from
        let toDate = refs.dateRange.value.to

        //const startOfDay = 'YYYY-MM-DD 00:00:00'
        //const endOFDay = 'YYYY-MM-DD 23:59:59'

        const startOfDay = 'YYYY/MM/DD'
        const endOFDay = 'YYYY/MM/DD'
        if (typeDate) {
          //Default Dates          
          //Case values
          switch (typeDate) {
            case 'today':
              fromDate = moment().format(startOfDay)
              toDate = moment().format(endOFDay)
              break;
            case 'yesterday':
              fromDate = moment().subtract(1, 'd').format(startOfDay)
              toDate = moment().subtract(1, 'd').format(endOFDay)
              break;
            case 'tomorrow':
              fromDate = moment().add(1, 'd').format(startOfDay)
              toDate = moment().add(1, 'd').format(endOFDay)
              break;
            case 'lastSevenDays':
              fromDate = moment().subtract(6, 'd').format(startOfDay)
              toDate = moment().format(endOFDay)
              break;
            case 'currentWeek':
              fromDate = moment().startOf('isoWeek').format(startOfDay)
              toDate = moment().endOf('isoWeek').format(endOFDay)
              break;
            case 'lastWeek':
              fromDate = moment().subtract(1, 'weeks').startOf('isoWeek').format(startOfDay)
              toDate = moment().subtract(1, 'weeks').endOf('isoWeek').format(endOFDay)
              break;
            case 'nextWeek':
              fromDate = moment().add(1, 'weeks').startOf('isoWeek').format(startOfDay)
              toDate = moment().add(1, 'weeks').endOf('isoWeek').format(endOFDay)
              break;
            case 'lastThirtyDays':
              fromDate = moment().subtract(29, 'd').format(startOfDay)
              toDate = moment().format(endOFDay)
              break;
            case 'lastSixtyDays':
              fromDate = moment().subtract(59, 'd').format(startOfDay)
              toDate = moment().format(endOFDay)
              break;
            case 'currentMonth':
              fromDate = moment().startOf('month').format(startOfDay)
              toDate = moment().endOf('month').format(endOFDay)
              break;
            case 'lastMonth':
              fromDate = moment().subtract(1, 'months').startOf('month').format(startOfDay)
              toDate = moment().subtract(1, 'months').endOf('month').format(endOFDay)
              break;
            case 'nextMonth':
              fromDate = moment().add(1, 'months').startOf('month').format(startOfDay)
              toDate = moment().add(1, 'months').endOf('month').format(endOFDay)
              break;
            case 'twoMonthsAgo':
              fromDate = moment().subtract(2, 'months').startOf('month').format(startOfDay)
              toDate = moment().subtract(2, 'months').endOf('month').format(endOFDay)
              break;
            case 'twoYearsAgo':
              fromDate = moment().subtract(2, 'year').startOf('year').format(startOfDay)
              toDate = moment().subtract(2, 'year').endOf('year').format(endOFDay)
              break;
            case 'lastYear':
              fromDate = moment().subtract(1, 'year').startOf('year').format(startOfDay)
              toDate = moment().subtract(1, 'year').endOf('year').format(endOFDay)
              break;
            case 'lastTwoYears':
              fromDate = moment().subtract(1, 'year').startOf('year').format(startOfDay)
              toDate = moment().endOf('year').format(endOFDay)
              break;
            case 'currentYear':
              fromDate = moment().startOf('year').format(startOfDay)
              toDate = moment().endOf('year').format(endOFDay)
              break;
            case '15daysAroundToday':
              fromDate = moment().subtract(7, 'days').format(startOfDay);
              toDate = moment().add(7, 'days').format(endOFDay);
              break;
            case '5daysAroundToday':
              fromDate = moment().subtract(2, 'days').format(startOfDay);
              toDate = moment().add(2, 'days').format(endOFDay);
              break;
            case 'customRange':
              if (fromDate)
                fromDate = moment(fromDate).format(startOfDay)
              if (toDate)
                toDate = moment(toDate).format(endOFDay)
              break;
          }          
          //refs.qDateProxy.value.hide()
        //Set new Date
        refs.dateRange.value.from = clone(fromDate)
        refs.dateRange.value.to = clone(toDate)
        //refs.calendar.value.setEditingRange(fromDate, toDate)
        ///refs.qDateProxy.value.show()
        }  
        emit('update:modelValue', {type: typeDate, from: fromDate, to: toDate}) 
    }, 
    init(){
    } 
  }

  // Mounted
  onMounted(() => {
    //methods.init()
  })

  // Watch  
  watch(state, (newField, oldField): void => {
    console.log('wacho')
    methods.changeDate()    
  }, {deep: true})
  

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
