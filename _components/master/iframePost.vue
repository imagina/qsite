<template>
  <div id="iframePostcomponent" v-if="actionUrl" class="relative-position">
    <iframe name="post-iframe" frameborder="0" @load="loading = false"/>
    <form name="formPostIframe"
          id="formPostIframe"
          method="post"
          target="post-iframe"
          :action="actionUrl"
    >
      <div v-for="input in inputsForm" v-html="input.outerHTML"/>
    </form>
    <!--Inner loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      actionUrl: null,
      inputsForm: []
    }
  },
  computed: {},
  methods: {
    loadIframe(actionUrl, attributes) {
      this.loading = true
      this.actionUrl = this.$clone(actionUrl)
      let newInputsForm = []
      Object.keys(attributes).forEach(field => {
        const input = document.createElement("input");
        input.name = field;
        input.value = JSON.stringify(attributes[field]);
        input.type = "hidden";
        newInputsForm.push(input);
      });
      this.inputsForm = newInputsForm
      //Submit the form
      this.$nextTick(() => {
        const submitFormFunction = Object.getPrototypeOf(document.forms["formPostIframe"]).submit;
        submitFormFunction.call(document.forms["formPostIframe"]);
      })
    },
  }
}
</script>
<style lang="scss">
#iframePostcomponent {
  height: 100%;
  width: 100%;

  iframe {
    height: 100%;
    width: 100%;
  }
}
</style>
