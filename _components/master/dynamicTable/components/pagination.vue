<template>
  <!--pagination-->
  <div :class="`bottonCrud full-width flex items-center ${windowSize == 'mobile' ? 'justify-center' : 'justify-between'}`">
    <div class="sm:tw-text-sm":class="`text-blue-grey ${windowSize == 'mobile' ? 'q-mb-sm' : ''} `">
      
    </div>
    
    {{ pagination }}
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
//import controller from 'modules/qsite/_components/master/dynamicTable/controllers/contentTypeController'

export default defineComponent({
  props: {
    pagination: {default: {}}
  },
  setup(props, {emit}) {
    //return controller(props, emit)
  }, 
  computed: {
    windowSize() {
      return window.innerWidth >= '500' ? 'desktop' : 'mobile';
    },
  }
})
</script>
<style lang="scss">
</style>