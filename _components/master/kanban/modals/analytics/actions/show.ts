import Vue from 'vue';
import store from '../store/index'
export default async function showAnalytics(criteria: string = 'leadsByStatus') {
    try {
        const filters = {
            date: {
            "field": "created_at",
            "type": store.filterDate,
            "from": store.from,
            "to": store.to
            },
            categoryId: store.categoryId
        }
        store.loading = true;
        const response = await Vue.prototype.$crud.show("apiRoutes.qrequestable.analytics", criteria, {
            refresh: true,
            params: {
                filter: { ...filters }
            }
        })
        store.chartsData = response.data;
        store.loading = false;
    } catch (error) {
        store.loading = false;
        Vue.prototype.$alert.error({message:  Vue.prototype.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
        return { data: {} }
    }
}