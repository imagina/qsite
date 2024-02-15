import appConfig from 'src/setup/app'

export default {
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
