<template>
  <q-dialog
    id="drawerFilterMaster"
    v-model="showDialog"
    persistent
    maximized
    position="right"
    v-if="filter.load"
  >
    <q-card style="width: 350px;">
      <div id="masterFilterComponent" v-if="filter">
        <!-- Header -->
        <div id="masterFilterContent">
          <!--Title-->
          <div class="row justify-between items-center q-pa-md">
            <div class="text-subtitle1 row items-center">
              <q-icon name="fa-regular fa-filter" color="primary" size="20px" class="q-mr-sm" />
              <label class="text-primary text-weight-bold">{{ $trp('isite.cms.label.filter', { capitalize: true })
                }}</label>
            </div>
            <!-- Close icon -->
            <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
                    @click="eventBus.emit('toggleMasterDrawer', 'filter')" />
          </div>

          <!--Tabs-->
          <q-separator class="q-mb-md" inset />
          <div id="tabsContent" class="full-width" v-if="false">
            <q-tabs v-model="tabName" dense class="text-grey" active-color="primary" indicator-color="primary"
                    align="justify" v-if="filter.hasValues" :breakpoint="0">
              <q-tab name="tabForm" :label="$tr('isite.cms.label.filter')" />
            </q-tabs>
          </div>
        </div>

        <!--Content-->
        <q-scroll-area id="contentMasterField" class="q-pm-md" style="height: calc(100vh - 253px)">
          <!--Tab panels-->
          <q-tab-panels v-model="tabName" animated keep-alive>
            <!--Tab form-->
            <q-tab-panel name="tabForm" class="q-pa-none q-px-xs">
              <div id="filtersContent" class="q-px-sm" style="height: calc(100vh - 300px)">
                <!--Search-->
                <div v-if="filter.fields && filter.fields.search" class="q-mb-sm">
                  <!--Label-->
                  <div class="full-width text-primary q-mb-xs">
                    <q-icon name="fas fa-search" class="q-mr-xs" />
                    {{ $tr('isite.cms.label.search', { capitalize: true }) }}
                  </div>
                  <!--Input search-->
                  <dynamic-field v-model="filterValues.search"
                                 :field="{...filter.fields.search, props : {debounce : '0'}}"
                                 :enableCache="dynamicFieldCache" />
                </div>
                <!--Date-->
                <div v-if="filter.fields && filter.fields.date" class="q-mb-sm">
                  <!--Fields date-->
                  <dynamic-field v-for="(fieldDate, key) in dateFields" :key="key" :field="fieldDate" class="q-mb-sm"
                                 v-model="filterValues.date[fieldDate.name || key]" :enableCache="dynamicFieldCache" />
                </div>
                <!--Pagination-->
                <div v-if="filter.fields && filter.fields.pagination" class="q-mb-sm">
                  <!--Label-->
                  <div class="full-width text-primary q-mb-xs">
                    <q-icon name="fab fa-buffer" class="q-mr-xs" />
                    {{ $tr('isite.cms.label.pagination', { capitalize: true }) }}
                  </div>
                  <!--Fields pagination-->
                  <dynamic-field v-for="(fieldPagination, key) in paginationFields" :field="fieldPagination"
                                 class="q-mb-sm"
                                 v-model="pagination[fieldPagination.name || key]" :key="key"
                                 :enableCache="dynamicFieldCache" />
                </div>
                <!--others Fields-->
                <template v-for="(field, key) in filter.fields" :key="key">
                  <dynamic-field
                    v-model="filterValues[field.name || key]" v-if="['search','pagination'].indexOf(key) == -1"
                    class="q-mb-sm" :field="field"
                    :enableCache="dynamicFieldCache"
                    @update:modelValueReadOnly="data => readOnlyData[field.name || key] = data" />
                </template>


              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <!--footer -->
        <div class="absolute-bottom text-center bg-white tw-p-3" ref="footerContent">
          <q-separator class="tw-mb-3" />
          <q-btn :label="$tr('isite.cms.label.search')" unelevated color="primary" no-caps class="tw-w-full" rounded
                 @click="emitFilter(), eventBus.emit('toggleMasterDrawer','filter')" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { eventBus } from 'src/plugins/utils';

export default {
  /*
  inject: {
    filterPlugin: {
      from: 'filterPlugin',
      default: {
        name: false,
        fields: {},
        values: {},
        callBack: false,
        pagination: {},
        load: false,
        hasValues: false,
        storeFilter: false
      }
    }
  },
  */
  props: {
    show: {
      type: Boolean,
      default: () => false
    }
  },
  components: {},
  watch: {
    show(newValue) {
      this.showDialog = this.$clone(newValue);
    },
    '$filter': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue))
          this.init();
      }
    },
    'filterValues.date': {
      deep: true,
      handler: function(newValue) {
        if (newValue) this.changeDate();
      }
    },
    '$route.name': {
      deep: true,
      handler: function(newValue) {
        //this.filterPlugin.reset();
      }
    },
    readOnlyData: {
      deep: true,
      handler: async function() {
        if (this.filterPlugin.storeFilter && this.currentUrlFilter.length > 0) {
          const obj = await this.$helper.convertStringToObject();
          Object.keys(this.readOnlyData).forEach((key) => {
            if (obj.hasOwnProperty(key)) {
              this.readOnlyData[key].value = obj[key];
            }
          });
          //this.filterPlugin.readValues = this.$clone(this.readOnlyData);
          return;
        }
        //this.filterPlugin.readValues = this.$clone(this.readOnlyData);
      }
    }
  },
  created() {
    this.$nextTick(async function() {
      const origin = window.location.href.split('?');
      if (origin.length === 2) {
        this.currentUrlFilter = origin[1] || '';
      }
      await this.init();
    });
  },
  data() {
    return {
      showDialog: false,
      tabName: 'tabForm',
      filterValues: {},
      pagination: {},
      readOnlyData: {},
      currentUrlFilter: '',
      dynamicFieldCache: true,
      eventBus
    };
  },
  computed: {
    filter() {
      if (this.filterPlugin.storeFilter && this.currentUrlFilter.length > 0) {
        this.filterValues = this.$helper.convertStringToObject();
      }
      if (!this.filterPlugin.storeFilter && this.filterPlugin.values) this.filterValues = this.$clone(this.filterPlugin.values);
      if (this.filterPlugin.pagination) this.pagination = this.$clone(this.filterPlugin.pagination);
      return this.filterPlugin;
    },
    dateFields() {
      let filterDate = this.$clone(this.filterValues.date);
      let filterFields = this.$clone(this.filter.fields);
      let fieldDate = (filterFields && filterFields.date && filterFields.date.field) ? filterFields.date.field : false;
      let fieldDateLabel = (filterFields && filterFields.date && filterFields.date.props) ? filterFields.date.props.label || null : null;
      if (!filterDate) return {};
      let fields = {
        field: fieldDate || { value: 'created_at' },
        type: {
          value: this.filterValues.date.type || null,
          type: 'select',
          props: {
            label: fieldDateLabel ?? this.$tr('isite.cms.form.date'),
            clearable: true,
            options: [
              { label: this.$tr('isite.cms.label.customRange'), value: 'customRange' },
              { label: this.$tr('isite.cms.label.today'), value: 'today' },
              { label: this.$tr('isite.cms.label.yesterday'), value: 'yesterday' },
              { label: this.$tr('isite.cms.label.tomorrow'), value: 'tomorrow' },
              { label: this.$tr('isite.cms.label.LastNumDays', { numDays: 7 }), value: 'lastSevenDays' },
              { label: this.$tr('isite.cms.label.LastNumDays', { numDays: 30 }), value: 'lastThirtyDays' },
              { label: this.$tr('isite.cms.label.LastNumDays', { numDays: 60 }), value: 'lastSixtyDays' },
              { label: this.$tr('isite.cms.label.currentWeek'), value: 'currentWeek' },
              { label: this.$tr('isite.cms.label.lastWeek'), value: 'lastWeek' },
              { label: this.$tr('isite.cms.label.nextWeek'), value: 'nextWeek' },
              { label: this.$tr('isite.cms.label.currentMonth'), value: 'currentMonth' },
              { label: this.$tr('isite.cms.label.lastMonth'), value: 'lastMonth' },
              { label: this.$tr('isite.cms.label.nextMonth'), value: 'nextMonth' },
              { label: this.$tr('isite.cms.label.numMonthsAgo', { numMonths: 2 }), value: 'twoMonthsAgo' },
              { label: this.$tr('isite.cms.label.currentYear'), value: 'currentYear' },
              { label: this.$tr('isite.cms.label.lastYear'), value: 'lastYear' },
              { label: this.$tr('isite.cms.label.numYearsAgo', { numYears: 2 }), value: 'twoYearsAgo' },
              { label: this.$tr('isite.cms.label.lastNumYears', { numYears: 2 }), value: 'lastTwoYears' },
              { label: this.$tr('isite.cms.label.daysAroundToday', { numDays: 15 }), value: '15daysAroundToday' },
              { label: this.$tr('isite.cms.label.daysAroundToday', { numDays: 5 }), value: '5daysAroundToday' }
            ]
          }
        },
        from: {
          value: this.filterValues.date.from || null,
          type: 'date',
          props: {
            vIf: (filterDate && (filterDate.type == 'customRange')) ? true : false,
            label: this.$tr('isite.cms.form.startDate'),
            clearable: true,
            options: (date) => {
              let toDate = filterDate.to ? this.$moment(filterDate.to).format('YYYY/MM/DD') : false;
              return toDate ? (date < this.$moment(toDate).format('YYYY/MM/DD')) : true;
            }
          }
        },
        to: {
          value: this.filterValues.date.to || null,
          type: 'date',
          props: {
            vIf: (filterDate && (filterDate.type == 'customRange')) ? true : false,
            label: this.$tr('isite.cms.form.endDate'),
            clearable: true,
            options: (date) => {
              let fromDate = filterDate.from ? this.$moment(filterDate.from).format('YYYY/MM/DD') : false;
              return fromDate ? (date > this.$moment(fromDate).format('YYYY/MM/DD')) : true;
            }
          }
        }
      };
      return fields;
    },
    paginationFields() {
      let filter = this.$clone(this.filter);
      //Order fields to pagination
      if (filter && filter.fields && filter.fields.pagination) {
        let pages = [];
        let lastPage = filter.pagination.lastPage || 1;
        //Define number of pages
        for (let i = 1; i <= lastPage; i++)
          pages.push({ label: i.toString(), value: i.toString() });
        return {
          page: {
            value: filter.pagination.page || 1,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.page'),
              options: pages
            }
          },
          rowsPerPage: {
            value: filter.pagination.rowsPerPage || 20,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.perPage'),
              options: [
                { label: this.$tr('isite.cms.label.all'), value: '0' },
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' },
                { label: '100', value: '100' }
              ]
            }
          }
        };
      } else return {};
    }
  },
  methods: {
    async init() {
      const filterValues = this.filterPlugin.storeFilter && this.currentUrlFilter.length > 0
        ? await this.$helper.convertStringToObject()
        : this.filterValues;
      this.filterValues = filterValues || {};
      await this.emitFilter(true);
    },
    //Emit filter
    async emitFilter(filterBtn = false) {
      if (!filterBtn) {
        if (this.filterPlugin.storeFilter) {
          const objUrl = await this.$helper.convertStringToObject();
          const type = objUrl.type ? { type: objUrl.type } : {};
          const date = objUrl.dateStart && objUrl.dateEnd
            ? { dateEnd: objUrl.dateEnd, dateStart: objUrl.dateStart }
            : {};
          this.filterValues = { ...this.filterValues, ...type, ...date };
        }
        this.currentUrlFilter = '';
      }
      this.changeDate();
      this.filterPlugin.addValues(this.filterValues);
      if (this.filterPlugin.storeFilter) {
        this.mutateCurrentURL();
      }
      ;
      //Emit Filter
      if (this.filter && this.filter.callBack) {
        this.filter.callBack(this.filter);//Call back
        eventBus.emit('page.data.filtered', this.filter);//Global event
      }
    },
    // Mutate Current Url
    async mutateCurrentURL() {
      try {
        let paramsUrl = '';
        Object.keys(this.filterValues).forEach((item, index) => {
          if (this.filterPlugin.fields.hasOwnProperty(item)) {
            if (index === 0) {
              paramsUrl += this.validateObjectFilter('?', item);
            } else {
              paramsUrl += this.validateObjectFilter('&', item);
            }
          }
        });
        const origin = window.location.href.split('?');
        const urlBase = `${origin[0]}${paramsUrl}`;
        window.history.replaceState({}, '', urlBase);
      } catch (error) {
        console.log(error);
      }
    },
    // validate Object Filter
    validateObjectFilter(operator = '?', item) {
      if (this.filterValues[item]) {
        if (typeof this.filterValues[item] === 'object'
          || Array.isArray(this.filterValues[item])) {
          return `${operator}${item}=${JSON.stringify(this.filterValues[item])}`;
        }
        return `${operator}${item}=${this.filterValues[item]}`;
      }
      return '';
    },
    //Change dates by type
    changeDate() {
      if (this.filterValues.date && this.filterValues.date.type) {
        let typeDate = this.$clone(this.filterValues.date.type);
        if (typeDate) {
          //Default Dates
          let fromDate = this.filterValues.date.from;
          let toDate = this.filterValues.date.to;
          //Case values
          switch (typeDate) {
            case 'today':
              fromDate = this.$moment().format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().format('YYYY-MM-DD 23:59:59');
              break;
            case 'yesterday':
              fromDate = this.$moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(1, 'd').format('YYYY-MM-DD 23:59:59');
              break;
            case 'tomorrow':
              fromDate = this.$moment().add(1, 'd').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().add(1, 'd').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastSevenDays':
              fromDate = this.$moment().subtract(6, 'd').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().format('YYYY-MM-DD 23:59:59');
              break;
            case 'currentWeek':
              fromDate = this.$moment().startOf('isoWeek').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().endOf('isoWeek').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastWeek':
              fromDate = this.$moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD 23:59:59');
              break;
            case 'nextWeek':
              fromDate = this.$moment().add(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().add(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastThirtyDays':
              fromDate = this.$moment().subtract(29, 'd').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastSixtyDays':
              fromDate = this.$moment().subtract(59, 'd').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().format('YYYY-MM-DD 23:59:59');
              break;
            case 'currentMonth':
              fromDate = this.$moment().startOf('month').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().endOf('month').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastMonth':
              fromDate = this.$moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59');
              break;
            case 'nextMonth':
              fromDate = this.$moment().add(1, 'months').startOf('month').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().add(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59');
              break;
            case 'twoMonthsAgo':
              fromDate = this.$moment().subtract(2, 'months').startOf('month').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(2, 'months').endOf('month').format('YYYY-MM-DD 23:59:59');
              break;
            case 'twoYearsAgo':
              fromDate = this.$moment().subtract(2, 'year').startOf('year').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(2, 'year').endOf('year').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastYear':
              fromDate = this.$moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD 23:59:59');
              break;
            case 'lastTwoYears':
              fromDate = this.$moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().endOf('year').format('YYYY-MM-DD 23:59:59');
              break;
            case 'currentYear':
              fromDate = this.$moment().startOf('year').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().endOf('year').format('YYYY-MM-DD 23:59:59');
              break;
            case '15daysAroundToday':
              fromDate = this.$moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().add(7, 'days').format('YYYY-MM-DD 23:59:59');
              break;
            case '5daysAroundToday':
              fromDate = this.$moment().subtract(2, 'days').format('YYYY-MM-DD 00:00:00');
              toDate = this.$moment().add(2, 'days').format('YYYY-MM-DD 23:59:59');
              break;
            case 'customRange':
              if (fromDate)
                fromDate = this.$moment(fromDate).format('YYYY-MM-DD 00:00:00');
              if (toDate)
                toDate = this.$moment(toDate).format('YYYY-MM-DD 23:59:59');
              break;
          }
          //Set new Date
          this.filterValues.date.from = this.$clone(fromDate);
          this.filterValues.date.to = this.$clone(toDate);
        }
      } else if (this.filterValues.date) {
        //Remove dates
        this.filterValues.date.from = null;
        this.filterValues.date.to = null;
      }
    }
  }
};
</script>
<style lang="scss">
#masterFilterComponent {
  #tabsContent {
    .q-tab__content {
      min-width: auto;
    }
  }

  .q-field.q-field--float .q-field__label {
    color: $primary;
  }

  .q-field__control {
    .q-field__append .q-icon {
      color: $tertiary;
    }

    .q-field__append:last-child .q-icon {
      color: $primary;
    }
  }
}
</style>
