<template>
  <div id="panelOrganization">
    <div class="row items-center justify-center">
      <div class="box box-auto-height text-center" style="max-width: 800px">
        <div class="q-pa-lg">
          <q-icon name="fal fa-crown" size="40px" color="primary" class="q-mb-md"/>
          <div v-if="hasOrganization">
            <div class="q-mb-md text-blue-grey">
              {{ $tr('isite.cms.message.organizationCreated') }}
            </div>
            <q-btn color="primary" :label="$tr('isite.cms.showSite')" @click="openOrganization" rounded no-caps
                   unelevated/>
          </div>
          <div v-else class="text-blue-grey">
            {{ $tr('isite.cms.message.organizationNoCreated') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
    hasOrganization() {
      let organizations = this.$store.state.quserAuth.organizations || []
      return organizations.length ? true : false
    }
  },
  methods: {
    init() {
    },
    openOrganization() {
      let baseUrl = this.$store.state.qsiteApp.baseUrl
      this.$helper.openExternalURL(`${baseUrl}/iadmin/#${this.$route.fullPath}`, false)
    }
  }
}
</script>
<style lang="scss">
</style>
