import baseService from 'modules/qcrud/_services/baseService.js'

export default {
   updateUserData(refresh = false, userId, params = {}): Promise<any> {
     return new Promise((resolve, reject) => {
       //const requestParams = {refresh, params}
   //Request
       baseService.update('apiRoutes.quser.users', userId, params).then(response => {
         resolve(response)
       }).catch(error => reject(error))
     })
   }
}
