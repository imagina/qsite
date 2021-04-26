export default async ({app, router, store, Vue}) => {
  await Promise.all([
    store.dispatch('qsiteApp/GET_SITE_SETTINGS'),
    store.dispatch('qsiteApp/GET_SITE_HOOKS')
  ])
}
