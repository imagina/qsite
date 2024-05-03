import { start } from "repl";
import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import { i18n, clone } from 'src/plugins/utils'
import moment from "moment";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  const rangeDateFormat = props.fieldProps.slot.mask;
  const dateFormat = rangeDateFormat.split(' - ')[0];
  const startOfDayFormat = `${dateFormat} 00:00:00`;
  const endOfDayFormat = `${dateFormat} 23:59:59`;
  

  // Refs
  const refs = {
    dateRange: ref({from: '', to: ''}),
    inputRange: ref(null),
  }

  // States
  const state = reactive({
    type: ''
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    mask: computed(() => dateFormat),
  
    fieldsConfig: computed(() => {
      return {
        type: {
          value: props.modelValue?.type || null,
          type: 'select',
          props: {
            label: props.label ?? i18n.tr('isite.cms.form.date'),
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
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    //Get and validate the value from input
    updateDateRange(value){
      refs.inputRange.value = value
      if(value){
        if(moment(value, rangeDateFormat, true).isValid() ){
           const values = value.split(' - ')
           let from = values[0]
           let to = values[1]
           /*fixs the input if from is grater than to*/
           if(from > to ){
             from = values[1]
             to = values[0]
             methods.setInputRange({from, to})
           }
           refs.dateRange.value = {from, to}
           state.type = 'customRange'
           methods.emitValue({from, to})
        } else {
          refs.dateRange.value = {from: null, to: null}
          methods.emitValue(null)
        }
      }
    },
    //Set and cast value for input
    setInputRange(value){
      if(value == null){
        refs.inputRange.value = value
      } else {
        if(value?.from){
          refs.inputRange.value = `${value.from ?? ''} - ${value?.to ?? ''}`
        } else {
          //one day range
          refs.inputRange.value = `${value ?? ''} - ${value ?? ''}`
        }
      }
    },

    //Emits value for model-value
    emitValue(value){
      let toEmit = null

      if(value != null ){
        const from = value?.from ? value?.from : value
        const to = value?.to ? value?.to : value
        toEmit = {
          type: state.type,
          from: moment(from).format(startOfDayFormat),
          to : moment(to).format(endOfDayFormat)
        }
      }
      emit('update:modelValue', toEmit)      
    },

    //Change and update values when date changes on q-calendar
    changeType(value){
      state.type = 'customRange'
      methods.setInputRange(value)
      methods.emitValue(value)
    },
    //Change the date due the type selector
    changeDate() {      
      let fromDate = ''
      let toDate = ''
      let typeDate = clone(state.type)
      
      //one day range
      if(typeDate == 'today' || typeDate == 'yesterday' || typeDate == 'tomorrow'){
        fromDate = refs.dateRange.value || moment().format(dateFormat)
        toDate = refs.dateRange.value  || moment().format(dateFormat)     
      } else {
        fromDate = refs.dateRange.value?.from || moment().format(dateFormat)
        toDate = refs.dateRange.value?.to || moment().format(dateFormat)
      }
        
      if (typeDate) {
        //Default Dates          
        //Case values
        switch (typeDate) {
          case 'today':
            fromDate = moment().format(dateFormat)
            toDate = moment().format(dateFormat)
            break;
          case 'yesterday':
            fromDate = moment().subtract(1, 'd').format(dateFormat)
            toDate = moment().subtract(1, 'd').format(dateFormat)
            break;
          case 'tomorrow':
            fromDate = moment().add(1, 'd').format(dateFormat)
            toDate = moment().add(1, 'd').format(dateFormat)
            break;
          case 'lastSevenDays':
            fromDate = moment().subtract(6, 'd').format(dateFormat)
            toDate = moment().format(dateFormat)
            break;
          case 'currentWeek':
            fromDate = moment().startOf('isoWeek').format(dateFormat)
            toDate = moment().endOf('isoWeek').format(dateFormat)
            break;
          case 'lastWeek':
            fromDate = moment().subtract(1, 'weeks').startOf('isoWeek').format(dateFormat)
            toDate = moment().subtract(1, 'weeks').endOf('isoWeek').format(dateFormat)
            break;
          case 'nextWeek':
            fromDate = moment().add(1, 'weeks').startOf('isoWeek').format(dateFormat)
            toDate = moment().add(1, 'weeks').endOf('isoWeek').format(dateFormat)
            break;
          case 'lastThirtyDays':
            fromDate = moment().subtract(29, 'd').format(dateFormat)
            toDate = moment().format(dateFormat)
            break;
          case 'lastSixtyDays':
            fromDate = moment().subtract(59, 'd').format(dateFormat)
            toDate = moment().format(dateFormat)
            break;
          case 'currentMonth':
            fromDate = moment().startOf('month').format(dateFormat)
            toDate = moment().endOf('month').format(dateFormat)
            break;
          case 'lastMonth':
            fromDate = moment().subtract(1, 'months').startOf('month').format(dateFormat)
            toDate = moment().subtract(1, 'months').endOf('month').format(dateFormat)
            break;
          case 'nextMonth':
            fromDate = moment().add(1, 'months').startOf('month').format(dateFormat)
            toDate = moment().add(1, 'months').endOf('month').format(dateFormat)
            break;
          case 'twoMonthsAgo':
            fromDate = moment().subtract(2, 'months').startOf('month').format(dateFormat)
            toDate = moment().subtract(2, 'months').endOf('month').format(dateFormat)
            break;
          case 'twoYearsAgo':
            fromDate = moment().subtract(2, 'year').startOf('year').format(dateFormat)
            toDate = moment().subtract(2, 'year').endOf('year').format(dateFormat)
            break;
          case 'lastYear':
            fromDate = moment().subtract(1, 'year').startOf('year').format(dateFormat)
            toDate = moment().subtract(1, 'year').endOf('year').format(dateFormat)
            break;
          case 'lastTwoYears':
            fromDate = moment().subtract(1, 'year').startOf('year').format(dateFormat)
            toDate = moment().endOf('year').format(dateFormat)
            break;
          case 'currentYear':
            fromDate = moment().startOf('year').format(dateFormat)
            toDate = moment().endOf('year').format(dateFormat)
            break;
          case '15daysAroundToday':
            fromDate = moment().subtract(7, 'days').format(dateFormat);
            toDate = moment().add(7, 'days').format(dateFormat);
            break;
          case '5daysAroundToday':
            fromDate = moment().subtract(2, 'days').format(dateFormat);
            toDate = moment().add(2, 'days').format(dateFormat);
            break;
          case 'customRange':
            if (fromDate)
              fromDate = moment(fromDate).format(dateFormat)
            if (toDate)
              toDate = moment(toDate).format(dateFormat)
            break;
        }
      }
      //One day range
      if(fromDate == toDate){
        refs.dateRange.value = fromDate
      } else {
        refs.dateRange.value = {from: fromDate, to: toDate}
      }
      methods.setInputRange(refs.dateRange.value)
      methods.emitValue({from: fromDate, to: toDate})
    }, 
    init(){
      //Check props
      if(props.modelValue != null){
        const value = props.modelValue
        if(value?.from && value?.to){
          refs.dateRange.value.from = moment(value.from).format(dateFormat) ?? null
          refs.dateRange.value.to = moment(value.to).format(dateFormat) ?? null
          state.type = value?.type ?? null
        
          methods.setInputRange({from: refs.dateRange.value.from, to: refs.dateRange.value.to})
          methods.emitValue({from: refs.dateRange.value.from, to: refs.dateRange.value.to})
        }
      }
    } 
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch  
  watch(state, (newField, oldField): void => {
    methods.changeDate()    
  }, {deep: true})
  

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
