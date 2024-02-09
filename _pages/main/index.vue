<template>
  <div id="mainPage">
    <!--index admin-->
    <index-admin v-if="appMode == 'iadmin'"/>
    <!--index panel-->
    <index-panel v-else/>
  </div>
</template>
<script>
//components
import indexAdmin from 'modules/qsite/_pages/admin/index'
import indexPanel from 'modules/qsite/_pages/panel/index'
import 'modules/qsite/interface'

export default {
  props: {},
  components: {indexAdmin, indexPanel},
  watch: {},
  mounted() {
    this.$nextTick(async function () {
    })
  },
  data() {
    return {
      appMode: config('app.mode')
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="scss">
</style>
