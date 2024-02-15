import appConfig from 'src/setup/app'

export default {
  //Home Page
  home: {
    permission: null,
    activated: true,
    path: '/',
    name: 'app.home',
    layout: () => import('layouts/master.vue'),
    page: (appConfig.mode == 'iadmin') ? () => import('modules/qsite/_pages/admin/index.vue') :
      () => import('modules/qsite/_pages/panel/index.vue'),
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
    layout: () => import('layouts/blank'),
    page: () => import('modules/qsite/_pages/master/notAuthorized'),
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
    layout: () => import('layouts/master'),
    page: () => import('modules/qsite/_pages/master/testPage'),
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
    layout: () => import('layouts/master'),
    page: () => import('modules/qsite/_pages/master/dynamicFieldPage'),
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
    page: () => import('modules/qsite/_pages/main/organizations/wizard'),
    layout: () => import('layouts/blank.vue'),
    title: 'isite.cms.sidebar.adminOrganizationWizard',
    icon: 'fal fa-crown'
  },
}
