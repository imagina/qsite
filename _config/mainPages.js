import appConfig from 'src/config/app'

export default {
  //Home Page
  home: {
    permission: null,
    activated: true,
    path: '/',
    name: 'app.home',
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    page: (appConfig.mode == 'iadmin') ? () => import('@imagina/qsite/_pages/admin/index.vue') :
      () => import('@imagina/qsite/_pages/panel/index.vue'),
    title: 'sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  //Not authorize
  notAuthorized: {
    permission: null,
    activated: true,
    path: '/not-authorized',
    name: 'app.not.authorized',
    layout: () => import('@imagina/qsite/_layouts/blank'),
    page: () => import('@imagina/qsite/_pages/master/notAuthorized'),
    title: 'sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated: true,
  },
}
