import baseService from '@imagina/qcrud/_services/baseService'

export default {
  getNotifications(requestParams){
    return new Promise((resolve, reject) => {
      //Request
      baseService.index('apiRoutes.qnotification.notifications', requestParams).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        resolve(error)
      })
    })
  },
  getSources(){
    return new Promise((resolve, reject) => {      
      //Request Params
      let requestParams = {
        refresh: true,
        params: {filter: {allTranslations: true, configNameByModule: 'config.notificationSource'}}
      }
      //Request
      baseService.index('apiRoutes.qsite.configs', requestParams).then(response => {        
        
        let sourceSettings = []
        for (const [key, value] of Object.entries(response.data)) {
          if(value != null){
            sourceSettings = {...sourceSettings, ...response.data[key]}
          }
        }

        resolve(sourceSettings)
      }).catch(error => {
        console.log(error)
        resolve(error)
      })
    })
  },
  markAllAsRead(){ 
    return new Promise((resolve, reject) => {        
      baseService.put('apiRoutes.qnotification.markAllAsRead', {}).then(response => {                    
        resolve(response)
      }).catch(error => {
        console.log(error)
        resolve(error)        
      })
    })
  },
  markAsRead(id){
    return new Promise((resolve, reject) => {        
      baseService.update('apiRoutes.qnotification.markRead', id, {}).then(response => {            
        resolve(true)
      }).catch(error => {
        console.log(error)
        resolve(error)    
      })
    })
  },
  
}

