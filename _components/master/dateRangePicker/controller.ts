import {computed, reactive, ref, onMounted, toRefs, watch } from "vue";
import { i18n, clone } from 'src/plugins/utils'
import moment from "moment";
import ranges from 'modules/qsite/_components/master/dateRangePicker/constants'

export default function controller(props: any, emit: any) {
  const fieldProps = props.fieldProps.slot;
  const field = fieldProps.field;
  const rangeDateFormat = fieldProps.mask;
  const dateFormat = rangeDateFormat.split(' - ')[0];
  const emitFormat = fieldProps?.removeTime ? dateFormat : `${dateFormat} HH:mm:ss`;
  const startOfDay = fieldProps.startOfDay;
  const endOfDay = fieldProps.endOfDay;  

  const dateRanges = ranges.getDateRanges(dateFormat)
  const dateRangesOptions = ranges.getDateRangesOptions(dateFormat)   

  // Refs
  const refs = {
    dateRange: ref({from: '', to: ''}),
    inputRange: ref(null),
  }

  // States
  const state = reactive({
    type: null,
    focus: false, 
    modal: false,
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
            options: dateRangesOptions
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
          methods.getType({from, to})
          methods.emitValue({from, to})
      } else {
        state.type = null
        refs.dateRange.value = {from: null, to: null}
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
        methods.getType({from, to})

        toEmit = {
          field,
          type: state.type,
          label: dateRanges[state.type].label,
          from: moment(new Date(`${from} ${startOfDay}`)).format(emitFormat),
          to : moment(new Date(`${to} ${endOfDay}`)).format(emitFormat)
        }        
      }
      if(fieldProps?.autoClose && toEmit != null) state.modal = false      
      emit('update:modelValue', toEmit)      
    },

    //Change and update values when date changes on q-calendar
    changeType(value){
      methods.getType(value)
      methods.setInputRange(value)
      methods.emitValue(value)
    },
    getType(value){      
      const fromDate = value?.from || value
      const toDate = value?.to || value
      let type = dateRanges.customRange.value

      Object.keys(dateRanges).forEach((range) => {
        if(dateRanges[range]?.from && dateRanges[range]?.to){
          if(fromDate == dateRanges[range].from && toDate == dateRanges[range].to){
            type =  dateRanges[range].value
          }
        }
      })     
      state.type = type
    },
    //Change the date due the type selector
    changeDate() {      
      let fromDate = ''
      let toDate = ''
      let typeDate = clone(state.type)
      
      //one day range
      if(typeDate == 'today' || typeDate == 'yesterday' || typeDate == 'tomorrow'){
        fromDate = refs.dateRange.value || dateRanges.today.from
        toDate = refs.dateRange.value  || dateRanges.today.to     
      } else {
        fromDate = refs.dateRange.value?.from || dateRanges.today.form
        toDate = refs.dateRange.value?.to || dateRanges.today.to
      }
        
      if (typeDate) {        
        if(typeDate == dateRanges.customRange.value){
          fromDate = moment(new Date(fromDate)).format(dateFormat)
          toDate = moment(new Date (toDate)).format(dateFormat)
        } else {
          fromDate = dateRanges[typeDate].from
          toDate = dateRanges[typeDate].to
        }
      }
      methods.setDateRange({fromDate, toDate})
      methods.setInputRange(refs.dateRange.value)
      methods.emitValue({from: fromDate, to: toDate})
    },
    clear(){
      methods.setInputRange({from: null, to: null})
      refs.dateRange.value = {from: null, to: null}
      methods.emitValue(null)
    },
    setFocus({value}){
      state.focus = value
    },
    setDateRange({from, to}){
      if(from == to){
        refs.dateRange.value = from
      } else {
        refs.dateRange.value = {from, to}
      }
    },
    setByType(value){
      const type = value.type
      if(dateRanges[type]){
        const from  = value?.from || dateRanges[type]?.from
        const to = value?.to || dateRanges[type]?.to
        refs.dateRange.value.from = moment(new Date(from)).format(dateFormat)
        refs.dateRange.value.to = moment(new Date(to)).format(dateFormat)
        state.type = type
        methods.changeDate()
      }
    },
    init(){
      //Check props
      if(props.modelValue != null){
        const value = props.modelValue
        if( (value?.from && value?.to) || value?.type){
          //set value by type
          if(value?.type){
            methods.setByType(value)
          } else {
            refs.dateRange.value.from = moment(new Date(value.from)).format(dateFormat) ?? null
            refs.dateRange.value.to = moment(new Date(value.to)).format(dateFormat) ?? null
            state.type = value?.type ?? null
            methods.setInputRange({from: refs.dateRange.value.from, to: refs.dateRange.value.to})
            methods.emitValue({from: refs.dateRange.value.from, to: refs.dateRange.value.to})
          }
        }
      }
    } 
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  watch(props, (newField, oldField): void => {
    const model = newField.modelValue
    if(model?.type != null  && model?.from != null && model?.to != null){
        const from = model?.from ? moment(new Date(model.from)).format(dateFormat) : null
        const to = model?.to ? moment(new Date(model.to)).format(dateFormat) : null
        methods.setInputRange({ from, to})
        methods.getType({from, to})
        methods.setDateRange({from, to})
    } else {
      if(!state.focus){
        methods.clear()
      }
    }
  }, {deep: true})
  

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
