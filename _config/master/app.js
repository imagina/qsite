export default {
  version: '2.2.4',
  isBackend: true, //Define if project is to admin
  forceRoleAndDepartment: false,//Force to select role and department
  //UI Languages
  languages: {
    default: 'es',
    availables: ['en-us', 'es']
  },
  //Modules
  modules: [
    'qcrud',
    'quser',
    'qnotification',
    'qcommerce',
    'qblog',
    'qform',
    'qdocument',
    'qplace',
    'qlocations',
    'qevent',
    'qpage',
    'qredirect',
    'qmenu',
    'qmedia',
    'qslider',
    'qbanner',
    'qsite',
    'qchat'
  ],
  //Cache
  saveCache: {
    refresh: [
      'sessionData',
      'auth.department.id',
      'auth.role.id',
      'impersonatorData',
      'app.state.extra',
      //'app.data.filters'
    ],
    logout: [
      'offlineRequests',
      'site.default.locale',
    ]
  },
  //Reset Store
  resetStores: [
    'quserAuth/RESET'
  ],
  //Footer movile main action
  mobilMainAction: {
    icon: 'fas fa-home',
    color: 'primary',
    route: 'app.home'
  }
}
