<template>
  <div>
    <master-modal 
      v-model="modal.show"
      :title="this.isRestore ? `${this.restore.title} - ${this.itemLabel}` : `${this.deletePermanently.title} - ${this.itemLabel}`" 
      :loading="modal.loading"
    >
      <div>
        <p v-if="item" class="q-my-md">
          Register: {{ item.id }} - {{ itemLabel }}
        </p>
        <dynamic-field :field="this.restore" /> 
        <dynamic-field :field="this.deletePermanently" /> 
      </div>
    </master-modal>    
    <!-- banner info -->
    <dynamic-field :field="info" />
    <!-- crud component-->
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
    action: null, 
    item: null,
    modal: {
      show: false,
      loading: false,       
    },    
    info: {
      type: 'banner',
      props: {
        color: 'info',
        icon: 'fas fa-exclamation-triangle',
        message: 'This is the recycle bin, When you delete a register, it goes to this Recycle Bin as a temporary file. You can restore It or delete It permanently from its options.',        
      }
    },
    restore: {
      title: 'Restore register',
      type: 'banner',
      props: {
        color: 'green',
        icon: 'fas fa-exclamation-triangle',
        message: 'Do you want to restore this register?, this action will move the register to its original table',
        actions: [                    
          
          {
            props: {
              label: 'Restore this register',
              color: 'green'
            },
            action: () => {
                console.log('restore the item')
            }
          }
        ]
      }
    },
    deletePermanently: {
      title: 'Delete Permanently',
      type: 'banner',
      props: {
        color: 'negative',
        icon: 'fas fa-exclamation-triangle',
        message: 'Do you want to delete Permanently this register?, Once you delete this register, there is no going back. Please be certain.',
        actions: [
          {
            props: {
              label: 'cancel',
              color: 'grey-4', 
              textColor: 'black',
              class: 'q-mx-md'

            },
            action: () => {
              this.modal.show = false
            }
          },
          {
            props: {
              label: 'Delete this register permanently',
              color: 'negative'
            },
            action: () => {
                console.log('delete the item')
            }
          }
        ]
      }
    },   
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
          return dynamicCrud.importCrud(this.getModule[0], this.getModule[1])          
        } catch(e) {
          console.log(e)
        }
      }
    } else {
      return false
    }
  },
  isRestore(){
    return this.action == 'restore'
  },
  isRecycle(){
    return this.$route.name == 'app.recycle'
  },
  itemLabel(){    
    return this.item ? this.item.name || this.item.title || this.item.userName || '' : ''
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
            this.item = item
            this.action = 'restore'
            this.modal.show = true
            this.$emit('restore', item)
          }
        },
        {//restore item action
          icon: 'fa-light fa-trash-can-xmark',
          color: 'green',
          label: 'Delete permanently',
          //vIf: ,
          action: (item) => {
            this.item = item
            this.action = 'delete'
            this.modal.show = true          
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
