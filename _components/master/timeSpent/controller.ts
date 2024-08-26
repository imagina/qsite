import {computed, reactive, ref, onMounted, toRefs, watch } from "vue";
import { i18n, clone } from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  
  const outputs = ['minutes', 'hours', 'days', 'weeks']
  const types = ['m', 'h', 'd', 'w']
  const hour = 60; //mins
  const day = hour * 24;
  const week = day * 7;
  const regex = props.fieldProps.field.regex;

  // Refs
  const refs = {    
  }

  // States
  const state = reactive({
    timeSpent: null,
    focus: false
  })

  // Computed
  const computeds = {
    // key: computed(() => {})    
  }

  // Methods
  const methods = {
    init(){      
      if(props.modelValue && !state.focus){        
        state.timeSpent = methods.convertMinutesToHumanReadable(props.modelValue)
      }
    },

    // const types = ['m', 'h', 'd', 'w']

    convertMinutesToHumanReadable(minutes){      
      if (!minutes || minutes == '') return null
      if (minutes < 60) {
        return `${minutes}${types[0]}`
      }

      const weeks = Math.floor(minutes / (60 * 24 * 7));
      const days = Math.floor((minutes % (60 * 24 * 7)) / (60 * 24));
      const hours = Math.floor((minutes % (60 * 24)) / 60);
      const remainingMinutes = minutes % 60;
      let result = '';

      if (weeks > 0) {
        result =  `${weeks}${types[3]}`
      }

      if (days > 0) {
        result =  `${result} ${days}${types[2]}`
      }

      if (hours > 0) {
        result = `${result} ${hours}${types[1]}`
      }

      if (remainingMinutes > 0) {
        result = `${result} ${remainingMinutes}${types[0]}`
      }      
      return result
    },

    clear(){
      state.timeSpent = null
      emit('update:model-value', null)
    },
    setFocus(value){
      state.focus = value
    },
    /* converts from 2w 4d 6h 45m to unit weeks, hous */
    setTimeSpent(val){
      if(!val || val == '' || !regex.test(val)) {
        methods.clear()
        return false        
      }

      let timeSpent = val.toString().split(' ')
      let totalTimeSpent = 0

      timeSpent.forEach(element => {
        if(element == '') return
        const str = element.toLowerCase()
        
        /*
        get last char if not valid or missing 
        ignores it and takes the time in minutes
        */
        const type = types.includes(str.slice(-1)) ? str.slice(-1) : types[0]
        let time = types.includes(str.slice(-1)) ? Number(str.slice(0, -1)) : Number(str)
        
        if(Number.isNaN(time)){ 
          emit('update:model-value', null)
          return false
        }

        switch (type) {
          case types[1]:
            time = time * hour
            break;
          case types[2]:
            time = time * day
            break;
          case types[3]:
            time = time * week
            break;
        }
        totalTimeSpent = totalTimeSpent + time
      });

      
      if(outputs.includes(props.fieldProps.field.unit)){
        switch (props.fieldProps.field.unit) {
          case outputs[1]:
            totalTimeSpent = totalTimeSpent / hour
            break;
          case outputs[2]:
            totalTimeSpent = totalTimeSpent / day
            break;
          case outputs[3]:
            totalTimeSpent = totalTimeSpent / week
            break;
        }

      }
      emit('update:model-value', totalTimeSpent)
      return totalTimeSpent
    }    
  }

  // Mounted
  onMounted(() => {
   methods.init()
  })

  
  watch(props, (newField, oldField): void => {
    //if(newField.modelValue != oldField.modelValue){
      methods.init()
    //}    
  }, {deep: true})
  
  

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
