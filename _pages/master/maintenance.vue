<template>
  <div id="pageMaintenanceMaster" class="flex flex-center">
    <!--Content-->
    <div class="text-center">
      <!--Logo-->
      <img style="max-height: 30vh" :src="siteLogo">
      <!--Separator-->
      <q-separator inset class="q-my-xl" />
      <!--title-->
      <div class="text-h5 text-capitalize text-grey-9">
        <q-icon name="fas fa-terminal" class="q-mr-sm" />
        {{$tr('isite.cms.messages.maintenancePage')}}...
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      logo: {default: false}
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    computed: {
      siteLogo() {
        return this.$store.state.qsiteApp.logo
      }
    },
    methods: {}
  }
</script>
<style lang="scss">
  #pageMaintenanceMaster {
    min-height: 100vh;
  }
</style>
