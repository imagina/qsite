<template>
  <div id="testPageId">
    tes page...
  </div>
</template>
<script>

export default {
  props: {},
  components: { },
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {},
  methods: {
    init() {
    },
  }
}
</script>
<style lang="stylus">
</style>
