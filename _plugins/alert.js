//Plugins
import {Notify} from 'quasar'
import {Dialog} from 'quasar'

//Components
import alertModal from '@imagina/qsite/_components/master/alertModal'

class Alert {
  constructor() {
    this.defaultParams = {
      message: 'Notify',
      progress: true,
      pos: 'bottom-right',
      action: false,
      timeOut: 4000,
      actions: [
        {
          label: 'Ok',
          icon: '',
          color: 'white',
          handler: () => {
            false
          }
        }
      ],
      color: 'primary',
      textColor: 'white',
      ...config('app.alert')
    }
  }

  //custom Alert
  custom(params = {}) {
    params = {...this.defaultParams, ...params}
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert success
  success(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'notifications'
    params.color = 'positive'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert Error
  error(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'error'
    params.color = 'negative'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert info
  info(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'info'
    params.color = 'cyan'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert warning
  warning(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'warning'
    params.color = 'warning'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert light
  light(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'notifications'
    params.color = 'faded'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Alert dark
  dark(params = {}) {
    if (!params.message) params = {message: params}
    params = {...this.defaultParams, ...params}
    params.icon = params.icon || 'notifications'
    params.color = 'black'
    //Show
    if (params.mode && (params.mode == 'modal')) this.showModal(params)
    else this.showNotify(params)
  }

  //Show Notify
  showNotify(params) {
    Notify.create({
      ...params,
      message: params.message,
      icon: params.icon,
      progress: params.progress,
      timeout: params.action ? 0 : params.timeOut,
      color: params.color,
      textColor: params.textColor,
      position: params.pos,
      actions: params.actions,
      html: true
    })
  }

  //Show modal
  showModal(params) {
    Dialog.create({
      component: alertModal,
      params: params
    })
  }
}

const alert = new Alert()

export default alert

export {alert}
