<template>
  <q-inner-loading id="innerLoadingMaster" :showing="visible">
    <div class="q-box-inner-loading">
      <q-spinner size="50px" color="primary"/>
      <h6 class="q-ma-none text-primary q-title">{{message}}</h6>
    </div>
  </q-inner-loading>
</template>
<script>
  export default {
    props: {
      visible: {default: false},
      label: {default: false}
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        uid: this.$uid(),
        labelMessage: '',
      }
    },
    computed: {
      message() {
        return this.$tr('isite.cms.label.loading')
      },
    },
    methods: {
      init() {
        if (this.label) this.labelMessage = this.$clone(this.label)
        else this.labelMessage = this.message
      },
    }

  }
</script>
<style lang="scss">
  #innerLoadingMaster {
    z-index: 10;
    border-radius: $custom-radius;
  }

  #innerLoadingMaster.q-inner-loading .q-box-inner-loading {
    text-align: center;
    background-color: $grey-1;
    margin: 20px 10px 10px 10px;
    padding: 5px 15px;
    border-radius: 10px;
  }
</style>
