<template>
    <div>
        <component :is="dynamicCrud" ref="componentCrudData" @hook:mounted="init" />
    </div>
</template>
<script>
export default {
  beforeMount(){
    this.configDynamicCrud();
  },
  mounted(){}, 
  data() {
    return {
      crudId: this.$uid(),
      params: {},
      dynamicCrud:  null,
      dynamicCrudData: null
    }
  },
  computed: {    
    crudData() {
      return this.dynamicCrudData
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }, 
  methods: {
    init(){
      this.setDynamicCrudData()
    },
    configDynamicCrud(){
      const queries  = this.getUrlQueries()
      if(queries?.module && queries?.crud){
        try {
          const modulePath = `${queries.module}/_crud/${queries.crud}`
          console.log('to open', modulePath)
          //this.dynamicCrud = require(`@imagina/${modulePath}`).default;
          this.dynamicCrud = require(path.toString()).default;
        } catch(e){
          console.log(e)
        }        
      }      
    },
    setDynamicCrudData(){
      console.log('loaded')
      this.dynamicCrudData = this.$refs.componentCrudData.crudData
      //exclude page actions 
      this.dynamicCrudData.read['excludeActions'] =  ['new', 'edit', 'destroy', 'sync', 'export', 'share', 'recycle'] 
      // add new actions
      this.dynamicCrudData.read['actions'] = [
        {//restore item action
          icon: 'fa-light fa-floppy-disk-circle-arrow-right',
          color: 'green',
          label: 'Restore item',
          //vIf: ,
          action: (item) => {
          this.$emit('restore', item)
          }
        },
        {//restore item action
          icon: 'fa-light fa-trash-can-xmark',
          color: 'green',
          label: 'Delete permanently',
          //vIf: ,
          action: (item) => {
          this.$emit('deletePermanently', item)
          }
        },
      ]
      //console.warn('dynamicCrudData', this.dynamicCrudData)
    },     
    getUrlQueries(){
      const params = decodeURI(window.location).split('?')
      if(Array.isArray(params) ){
        if(params.length > 1){
          const query =  params[1]
            .split('&')
            .map(param => param.split('='))
            .reduce((values, [ key, value ]) => {
              values[ key ] = value
              return values
            }, {})
          return query
        }
      }
      return {}
    },
  }  
}
</script>
