import { start } from "repl";
import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import { i18n, clone } from 'src/plugins/utils'
import moment from "moment";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  const startOfDay = 'YYYY/MM/DD'
  const endOFDay = 'YYYY/MM/DD'

  // Refs
  const refs = {
    dateRange: ref({from: '', to: ''}),
    inputRange: ref(null),
    type: ref()
  }

  // States
  const state = reactive({
    type: '',
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

    isOneDayRange: computed(() => state.type == 'today' || state.type == 'yesterday' || state.type == 'tomorrow'),
    //inputValue: computed(() =>  refs.dateRange  )

  }

  // Methods
  const methods = {
    // methodKey: () => {}
    
    updateDateRange(value){
      refs.inputRange.value = value
      console.log(value)
      if(value){
        if(moment(value, 'YYYY/MM/DD - YYYY/MM/DD', true).isValid() ){
           const from = value.split(' - ')[0]
           const to = value.split(' - ')[1]
           refs.dateRange.value = {from, to}
           state.type = 'customRange'
           methods.emitValue({
            from, 
            to
           })
        }
        
      }

    },
    setInputRange(value){
      if(value != null){
        if(value?.from){
          refs.inputRange.value = `${value.from ?? ''} - ${value?.to ?? ''}`
        } else {
          refs.inputRange.value = `${value ?? ''} - ${value ?? ''}`
        }
      }
    },

    emitValue(value){
      const from = value?.from ? value?.from : value
      const to = value?.to ? value?.to : value
      const toEmit = {
        type: state.type,
        from: moment(from).format('YYYY/MM/DD 00:00:00'),
        to : moment(to).format('YYYY/MM/DD 23:59:59')
      }
      emit('update:modelValue', toEmit) 
    },

    changeType(value){
      state.type = 'customRange'
      methods.setInputRange(value)
      methods.emitValue(value)
    },
    changeDate() {      
      let fromDate = ''
      let toDate = ''
      let typeDate = clone(state.type)
      
      
      if(typeDate == 'today' || typeDate == 'yesterday' || typeDate == 'tomorrow'){
        fromDate = refs.dateRange.value || moment().format(startOfDay)
        toDate = refs.dateRange.value  || moment().format(startOfDay)     
      } else {
        fromDate = refs.dateRange.value?.from || moment().format(startOfDay)
        toDate = refs.dateRange.value?.to || moment().format(startOfDay)
      }
        
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
          if(fromDate == toDate){
            refs.dateRange.value = fromDate
          } else {
            refs.dateRange.value = {from: fromDate, to: toDate}
          }
        }
        methods.setInputRange(refs.dateRange.value)        
        methods.emitValue({from: fromDate, to: toDate})        
    }, 
    init(){
      //check props
      if(props.value){
        refs.dateRange.value.from = props.value?.from ? props.value.from : null
        refs.dateRange.value.to = props.value?.to ? props.value.to : null
        state.type = props.value?.type ? props.value.type : null
      } else {
        /*
        refs.dateRange.value.from = moment().format(startOfDay)
        refs.dateRange.value.to = moment().format(endOFDay)
        state.type = props.value?.type ? props.value.type : 'customRange'
        */
      }
      

    } 
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch  
  watch(state, (newField, oldField): void => {
    console.log('wacho')
    methods.changeDate()    
  }, {deep: true})
  

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
