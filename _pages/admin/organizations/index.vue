<template>
  <div id="myOrganizationsPage">
    <component v-bind="componentConfig"/>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
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
        is: () => import('@imagina/qcrud/_components/crud'),
        crudData: import('@imagina/qsite/_crud/organizations'),
        title: this.$route.meta.title
      }
      //Instance component to organization form
      const componentForm = {
        is: () => import('@imagina/qsite/_pages/admin/organizations/form'),
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
<style lang="stylus">
</style>
