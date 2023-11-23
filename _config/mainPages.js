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
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fal fa-home',
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
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated: true,
  },
  //test PAge
  testPage: {
    permission: null,
    activated: true,
    path: '/test-page',
    name: 'app.test.page',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qsite/_pages/master/testPage'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fal fa-flask',
    authenticated: true,
  },
  //Dynamic Fields Page
  dynamicFieldsPage: {
    permission: null,
    activated: true,
    path: '/dynamic-fields',
    name: 'app.dynamic.fields.page',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qsite/_pages/master/dynamicFieldPage'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fas fa-flask',
    authenticated: true,
  },
  //organization Wizard
  organizationWizard: {
    permission: null,
    authenticated: true,
    activated: true,
    path: '/site/organizations-wizard',
    name: 'app.organizations.wizard',
    page: () => import('@imagina/qsite/_pages/main/organizations/wizard'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'isite.cms.sidebar.adminOrganizationWizard',
    icon: 'fal fa-crown'
  },
}
