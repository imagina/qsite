<template>
  <div id="searchComponent">
    <div id="content">
      <!--Search and filter-->
      <q-input outlined dense v-model="filter.search" :placeholder="labelText" debounce="800"
               class="input-search" ref="inputSearch" @update:modelValue="emitFilter()">
        <template v-slot:append>
          <q-icon name="fas fa-search" class="q-mr-sm"/>
          <!--Button filter-->
          <q-btn color="primary" unelevated text-color="white" icon="fas fa-filter" class="q-px-xs" size="sm"
                 @click="showModal = true" v-if="Object.keys(fields).length"/>
        </template>
      </q-input>
    </div>

    <!--Modal form-->
    <q-dialog id="modalFilterComponent" v-model="showModal">
      <q-card>
        <!--Header-->
        <q-toolbar>
          <q-toolbar-title>
            <q-icon name="fas fa-filter" class="q-mr-sm"/>
            <label>{{$tr('isite.cms.label.filter',{capitalize : true})}}</label>
          </q-toolbar-title>
          <q-btn flat class="q-pr-none" v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <!--filters-->
        <q-card-section>
          <!--Fields-->
          <dynamic-field v-model="filter[key]" v-for="(field, key) in fields" :key="key"
                         :field="field" class="q-mb-sm"/>
          <!--Button filter-->
          <div class="text-center q-mt-md">
            <q-btn :label="$tr('isite.cms.label.search')" color="primary" rounded
                   @click="emitFilter()" unelevated/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  //Component
  import dynamicField from 'modules/qsite/_components/master/dynamicField'

  export default {
    props: {
      label: {defualt: false},
      fields: {
        default: () => {
          return []
        }
      },
      name: {default: false}
    },
    emits: ['update:modelValue'],
    components: {dynamicField},
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        uid: this.$uid(),
        showModal: false,
        filter: {
          search: null
        }
      }
    },
    computed: {
      labelText() {
        return this.label || `${this.$tr('isite.cms.label.search')}...`
      }
    },
    methods: {
      init() {
        this.orderFilter()
      },
      //Order fileds to filter
      orderFilter() {
        //Merge with fields
        if (Object.keys(this.fields).length) {
          for (var fieldName in this.fields) this.filter[fieldName] = this.$clone(this.fields[fieldName].value)
        }


        //Restore from cache
        if (this.name) {
          let dataInCache = this.$store.getters['qsiteApp/getExtra'](`filter.${this.name}`)
          if (dataInCache && Object.keys(dataInCache).length) this.filter = {...this.filter, ...dataInCache}
        }

        this.emitFilter()
      },
      //Emit data filter
      async emitFilter() {
        //Save in cache
        let dataFilter = {}
        dataFilter[`filter.${this.name}`] = this.$clone(this.filter)
        if (this.name) this.$store.dispatch('qsiteApp/SET_EXTRA', dataFilter)
        //Emit filter
        this.$emit('update:modelValue', this.filter)
        //Close mdoal
        this.showModal = false
      }
    }
  }
</script>
<style lang="scss">
  #searchComponent
    height 40px
    #content
      width 100%
      .input-search
        .q-field__control
          background-color white
          padding-right 0px
          border-radius 0px
          color $secondary

          .q-field__native
            color $secondary

          .q-icon
            color $primary

          .q-btn
            border-radius 0px
            height 100%
            width 55px

            .q-icon
              color white !important

  #modalFilterComponent
    .q-card
      min-width 250px
</style>
