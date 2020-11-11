export default {
  version: '2.2.4',
  isBackend : true, //Define if project is to admin
  forceRoleAndDepartment : false,//Force to select role and department
  //UI Languages
  languages : {
    default : 'es',
    availables : ['en-us','es']
  },
  //Modules
  modules : [
    'qcrud',
    'quser',
    'qblog',
    'qcommerce',
    'qform',
    'qdocument',
    'qplace',
    'qlocations',
    'qpage',
    'qredirect',
    'qmenu',
    'qmedia',
    'qslider',
    'qsite',
  ],
  //Cache
  saveCache : {
    refresh : [
      'sessionData',
      'auth.department.id',
      'auth.role.id',
      'site.default.locale',
      'impersonatorData',
      'app.state.extra',
      'app.data.filters'
    ],
    logout : [
      'offlineRequests',
      'site.default.locale',
    ]
  },
  //Reset Store
  resetStores : [
    'quserAuth/RESET'
  ]
}
