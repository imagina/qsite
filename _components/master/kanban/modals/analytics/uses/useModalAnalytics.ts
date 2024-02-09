import Vue, { computed, onBeforeMount, getCurrentInstance } from "vue";
import store from "modules/qsite/_components/master/kanban/modals/analytics/store";
import changeDate from '../actions/changeDate'
import show from '../actions/show'

export default function useModalAnalytics() {
    const proxy = getCurrentInstance()!.appContext.config.globalProperties
    const loading = computed(() => store.loading);
    const showModal = computed({
        get: () => store.showModal,
        set(value) {
            store.showModal = value
        }
    });
    const filterDate = computed({
        get: () => store.filterDate,
        async set(value) {
            store.filterDate = value
            await changeDate();
            await show();
        }
    });
    const field = computed(() => ({
        date: {
            value: null,
            type: 'select',
            props: {
                label: proxy.$tr('isite.cms.form.date'),
                clearable: true,
                options: [
                    {label: proxy.$tr('isite.cms.label.customRange'), value: 'customRange'},
                    {label: proxy.$tr('isite.cms.label.today'), value: 'today'},
                    {label: proxy.$tr('isite.cms.label.yesterday'), value: 'yesterday'},
                    {label: proxy.$tr('isite.cms.label.tomorrow'), value: 'tomorrow'},
                    {label: proxy.$tr('isite.cms.label.LastNumDays', {numDays: 7}), value: 'lastSevenDays'},
                    {label: proxy.$tr('isite.cms.label.LastNumDays', {numDays: 30}), value: 'lastThirtyDays'},
                    {label: proxy.$tr('isite.cms.label.LastNumDays', {numDays: 60}), value: 'lastSixtyDays'},
                    {label: proxy.$tr('isite.cms.label.currentWeek'), value: 'currentWeek'},
                    {label: proxy.$tr('isite.cms.label.lastWeek'), value: 'lastWeek'},
                    {label: proxy.$tr('isite.cms.label.nextWeek'), value: 'nextWeek'},
                    {label: proxy.$tr('isite.cms.label.currentMonth'), value: 'currentMonth'},
                    {label: proxy.$tr('isite.cms.label.lastMonth'), value: 'lastMonth'},
                    {label: proxy.$tr('isite.cms.label.nextMonth'), value: 'nextMonth'},
                    {label: proxy.$tr('isite.cms.label.numMonthsAgo', {numMonths: 2}), value: 'twoMonthsAgo'},
                    {label: proxy.$tr('isite.cms.label.currentYear'), value: 'currentYear'},
                    {label: proxy.$tr('isite.cms.label.lastYear'), value: 'lastYear'},
                    {label: proxy.$tr('isite.cms.label.numYearsAgo', {numYears: 2}), value: 'twoYearsAgo'},
                    {label: proxy.$tr('isite.cms.label.lastNumYears', {numYears: 2}), value: 'lastTwoYears'},
                ]
            }
        }
    }))

    const chartsData = computed(() => store.chartsData);
    function hidden() {
        store.reset();
    }
    onBeforeMount(() => {
        hidden()
    })
    return {
        chartsData,
        showModal,
        loading,
        field,
        filterDate,
        hidden,
    };
}
