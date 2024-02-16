<template>
  <div id="myOrganizationsPage">
    <component :is="componentConfig.is" v-bind="componentConfig" />
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils'
import Crud from 'modules/qcrud/_components/crud'
import Form from 'modules/qsite/_pages/admin/organizations/form'

export default {
  beforeDestroy() {
    eventBus.off('page.data.refresh')
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  components: {
    Crud,
    Form
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {
    componentConfig() {
      let organizations = this.$store.state.quserAuth.organizations || []
      const loadDirectForm = organizations.length == 1 ? true : false
      //Instance component to crud
      const componentCrud = {
        is: 'Crud',
        crudData: import('modules/qsite/_crud/organizations'),
        title: this.$route.meta.title
      }
      //Instance component to organization form
      const componentForm = {
        is: 'Form',
        organizationId: organizations.length ? organizations[0].id : null
      }
      return loadDirectForm ? componentForm : componentCrud
    }
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss">
</style>
