import axios from 'axios'
import alert from '@imagina/qsite/_plugins/alert'

export default function ({app, router, store, Vue, ssrContext}) {
  //=========== Set base url to axios
  let baseUrl = config('app.baseUrl')
  let tagsToParceHost = ['http://', 'https://', ':8080', ':3000', 'www.']
  //Get base url
  let rootHost = baseUrl || (ssrContext ? ssrContext.req.get('host') : window.location.host)
  let host = rootHost
  //Parse host if not exist in .env
  if (!baseUrl) {
    tagsToParceHost.forEach(tagToReplace => host = host.replace(tagToReplace, ''))
    if (rootHost.indexOf('www') != -1) host = `www.${host}`//Set again WWW
    host = `https://${host}` //Add protocol
  }

  store.commit('qsiteApp/SET_BASE_URL', host) //Set base Url in store
  store.commit('qsiteApp/SET_ORIGIN_URL', (ssrContext ? ssrContext.req.get('origin') : window.location.origin)) //Set origin Url in store
  axios.defaults.baseURL = `${host}/api`// Set base url in axios
  console.log(`[AXIOS] Registered Host: ${host}`)

  //========== Set default params: setting
  axios.defaults.params = {setting: {}}

  //========== Show alert from interceptor
  function showMessages(messages = []) {
    messages.forEach(item => {
      alert[item.type || 'info']({message: item.message, timeOut: 8000})
    })
  }

  //========== Response interceptor
  axios.interceptors.response.use((response) => {
    if (response.data && response.data.messages) showMessages(response.data.messages)//Show messages
    return response;
  }, (error) => {
    if (error.response.data && error.response.data.messages) showMessages(error.response.data.messages)//Show messages
    if (error.response) {
      let status = error.response.status;
      switch (status) {
        case 401:
          let routeName = router.currentRoute.name
          //Logout
          if ((routeName != 'auth.login') && (routeName != 'auth.change.password'))
            router.push({name: 'auth.logout'})
          break;
      }
    }
    return Promise.reject(error);//Return response error
  })

  //============ Set ignore SSL
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  //axios.defaults.httpsAgent = new https.Agent({rejectUnauthorized: false})

  //============= Set as global
  Vue.prototype.$axios = axios
}
