<template>
  <div id="iframePostcomponent" v-if="actionUrl" class="relative-position">
    <iframe :id="id" name="post-iframe" frameborder="0" @load="handleIframeLoad"/>
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
import {defineComponent} from 'vue'
import controller from 'src/modules/qsite/_components/v3/iframePost/controller'

export default defineComponent({
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {},
  setup() {
    return {...controller()}
  }
})
</script>
<style lang="scss">
#iframePostcomponent {
  height: 100%;
  width: 100%;

  iframe {
    min-height: 500px;
    height: 100%;
    width: 100%;
  }
}
</style>
