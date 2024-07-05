<template>
  <div>    
      <component v-if="dynamicCrud" :is="dynamicCrud" ref="componentCrudData" />
  </div>
</template>
<script>
import dynamicCrud from '@imagina/qsite/_plugins/dynamicCrud'
export default {
beforeMount(){
},
mounted(){
}, 
data() {
  return {
    crudId: this.$uid(),
    params: {},
    modules: null, 
    cruds: []
  }
},
computed: {  
  //Crud info
  crudInfo() {
    return this.$store.state.qcrudComponent.component[this.crudId] || {}
  },
  dynamicCrud(){
    //return false          
    if (this.isRecycle) {    
      if(this.getModule){
        try {
          //return require(`@imagina/qblog/_crud/${this.getModule}`).default
          return dynamicCrud.importCrud(this.getModule[0], this.getModule[1])          
        } catch(e) {
          console.log(e)
        }
      }
    } else {
      return false
    }
  },
  isRecycle(){
    return this.$route.name == 'app.recycle'
  },
  getModule(){        
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
        
        return query['module'] ? query['module'].split('.') : false        
      }
    }
    return false
  },
  crudData(){      
    if(this.$refs.componentCrudData && this.$refs.componentCrudData?.crudData){
     const dynamicCrudData = this.$refs.componentCrudData.crudData
      //exclude page actions 
      dynamicCrudData.read['excludeActions'] =  ['new', 'edit', 'destroy', 'sync', 'export', 'share', 'recycle'] 
      // add new actions
      dynamicCrudData.read['actions'] = [
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
      return dynamicCrudData
    }
    return ''      
  }
}, 
methods: {
  init(){
  }      
}  
}
</script>
