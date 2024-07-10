import {computed, reactive, ref, onMounted, toRefs, watch } from "vue";
import { i18n, clone } from 'src/plugins/utils'
import moment from "moment";

export default function controller(props: any, emit: any) {
  const fieldProps = props.fieldProps.slot;
  const field = fieldProps.field;
  const rangeDateFormat = fieldProps.mask;
  const dateFormat = rangeDateFormat.split(' - ')[0];
  const emitFormat = `${dateFormat} HH:mm:ss`;
  const startOfDay = fieldProps.startOfDay;
  const endOfDay = fieldProps.endOfDay;
  

  const dateRanges = {
    customRange: {
      label: i18n.tr('isite.cms.label.customRange'),
      value: 'customRange'
    },    
    today: {           
      label: i18n.tr('isite.cms.label.today')      ,
      from: moment().format(dateFormat),
      to: moment().format(dateFormat), 
      value: 'today'
    }, 
    yesterday: {
      label: i18n.tr('isite.cms.label.yesterday'),       
      from: moment().subtract(1, 'd').format(dateFormat), 
      to:  moment().subtract(1, 'd').format(dateFormat), 
      value: 'yesterday'
    }, 
    tomorrow: {
      label: i18n.tr('isite.cms.label.tomorrow'), 
      from: moment().add(1, 'd').format(dateFormat),
      to: moment().add(1, 'd').format(dateFormat),
      value: 'tomorrow'
    },
    lastSevenDays: {
      label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 7}), 
      from: moment().subtract(6, 'd').format(dateFormat),
      to:  moment().format(dateFormat),
      value: 'lastSevenDays'
    },
    lastThirtyDays: {
      label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 30}),
      from: moment().subtract(29, 'd').format(dateFormat),
      to: moment().format(dateFormat),
      value: 'lastThirtyDays'
    },
    lastSixtyDays: {
      label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 60}),
      from: moment().subtract(59, 'd').format(dateFormat),
      to: moment().format(dateFormat), 
      value: 'lastSixtyDays'
    },
    currentWeek: {
      label: i18n.tr('isite.cms.label.currentWeek'),
      from: moment().startOf('isoWeek').format(dateFormat),
      to: moment().endOf('isoWeek').format(dateFormat),
      value: 'currentWeek'
    },
    lastWeek: {
      label: i18n.tr('isite.cms.label.lastWeek'), 
      from: moment().subtract(1, 'weeks').startOf('isoWeek').format(dateFormat),
      to: moment().subtract(1, 'weeks').endOf('isoWeek').format(dateFormat),
      value: 'lastWeek'
    },
    nextWeek: {
      label: i18n.tr('isite.cms.label.nextWeek'),
      from: moment().add(1, 'weeks').startOf('isoWeek').format(dateFormat),
      to: moment().add(1, 'weeks').endOf('isoWeek').format(dateFormat),
      value: 'nextWeek'
    },
    nextMonth: {
      label: i18n.tr('isite.cms.label.nextMonth'),
      from: moment().add(1, 'months').startOf('month').format(dateFormat),
      to: moment().add(1, 'months').endOf('month').format(dateFormat),
      value: 'nextMonth'
    },
    currentMonth: {
      label: i18n.tr('isite.cms.label.currentMonth'),
      from: moment().startOf('month').format(dateFormat),
      to: moment().endOf('month').format(dateFormat),
      value: 'currentMonth'
    },
    lastMonth: {
      label: i18n.tr('isite.cms.label.lastMonth'),
      from: moment().subtract(1, 'months').startOf('month').format(dateFormat),
      to: moment().subtract(1, 'months').endOf('month').format(dateFormat),
      value: 'lastMonth'
    },
    twoMonthsAgo: {
      label: i18n.tr('isite.cms.label.numMonthsAgo', {numMonths: 2}), 
      from: moment().subtract(2, 'months').startOf('month').format(dateFormat), 
      to: moment().subtract(2, 'months').endOf('month').format(dateFormat), 
      value: 'twoMonthsAgo'
    },
    currentYear: {
      label: i18n.tr('isite.cms.label.currentYear'), 
      from: moment().startOf('year').format(dateFormat),
      to: moment().endOf('year').format(dateFormat),
      value: 'currentYear'
    },
    lastYear: {
      label: i18n.tr('isite.cms.label.lastYear'), 
      from: moment().subtract(1, 'year').startOf('year').format(dateFormat),
      to: moment().subtract(1, 'year').endOf('year').format(dateFormat),
      value: 'lastYear'
    },
    twoYearsAgo: {
      label: i18n.tr('isite.cms.label.numYearsAgo', {numYears: 2}),
      from: moment().subtract(2, 'year').startOf('year').format(dateFormat),
      to: moment().subtract(2, 'year').endOf('year').format(dateFormat),
      value: 'twoYearsAgo'
    },
    lastTwoYears: {
      label: i18n.tr('isite.cms.label.lastNumYears', {numYears: 2}),
      from: moment().subtract(1, 'year').startOf('year').format(dateFormat),
      to: moment().endOf('year').format(dateFormat),
      value: 'lastTwoYears'
    },
    fifteenDaysAroundToday: {
      label: i18n.tr('isite.cms.label.daysAroundToday', {numDays: 15}), 
      from: moment().subtract(7, 'days').format(dateFormat),
      to: moment().add(7, 'days').format(dateFormat),
      value: '15daysAroundToday'
    },
    fiveDaysAroundToday: {
      label: i18n.tr('isite.cms.label.daysAroundToday', {numDays: 5}), 
      from: moment().subtract(2, 'days').format(dateFormat),
      to: moment().add(2, 'days').format(dateFormat),
      value: '5daysAroundToday'
    } 
  }

  function rangeOptions(){
    /*const option = []
    Object.keys(dateRanges).forEach((e) => {
      option.push({label: dateRanges[e].label, value: dateRanges[e].value}) 
    })
    return option
    */
    
    return Object.keys(dateRanges).reduce((arr, e) => {
      arr.push({label: dateRanges[e].label, value: dateRanges[e].value}) 
      return arr
    }, [])
  }  

   

  // Refs
  const refs = {
    dateRange: ref({from: '', to: ''}),
    inputRange: ref(null),
  }

  // States
  const state = reactive({
    type: null
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
            options: rangeOptions()                
           }
        },
      }
    }),
  }

  // Methods
  const methods = {
    //Get and validate the value from input
    updateDateRange(value){
      refs.inputRange.value = value
      if(value && moment(value, rangeDateFormat, true).isValid() ){
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
          state.type = methods.getType(refs.dateRange.value)
          methods.emitValue({from, to})
      } else {        
        refs.dateRange.value = {from: null, to: null}
        methods.emitValue(null)
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
          field,
          type: state.type,
          from: moment(`${from} ${startOfDay}`).format(emitFormat),
          to : moment(`${to} ${endOfDay}`).format(emitFormat)
        }
      }
      emit('update:modelValue', toEmit)      
    },

    //Change and update values when date changes on q-calendar
    changeType(value){
      state.type = methods.getType(value)
      methods.setInputRange(value)
      methods.emitValue(value)
    },
    getType(value){      
      const fromDate = value?.from || value
      const toDate = value?.to || value
      console.warn('_>>',toDate, toDate)
      /* one day range */
      if(fromDate == dateRanges.today.from && toDate == dateRanges.today.to) return dateRanges.today.value
      if(fromDate == dateRanges.yesterday.from && toDate == dateRanges.yesterday.to) return dateRanges.yesterday.value
      if(fromDate == dateRanges.tomorrow.from && toDate == dateRanges.tomorrow.to) return dateRanges.tomorrow.value

      return 'customRange'
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
        if(typeDate == dateRanges.customRange.value){
          fromDate = moment(fromDate).format(dateFormat)
          toDate = moment(toDate).format(dateFormat)
        } else {
          fromDate = dateRanges[typeDate].from
          toDate = dateRanges[typeDate].to
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
