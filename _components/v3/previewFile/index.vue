<template>
  <div id="pageId" width="100%">
    <!--Image preview-->
    <avatar-image v-if="extImage.includes(ext)" :src="url" v-bind="imgProps"
                  :class="fileClass || imgProps?.class || ''"/>
    <!---MS Docs && PDF preview-->
    <iframe
      v-else-if="extDocs.includes(ext)"
      :src="url"
      width="100%" style="height: calc(100vh - 272px)"
      :class="fileClass"
    />
    <!---Audio preview-->
    <audio v-else-if="extAudio.includes(ext)" controls style="width: 100%" :class="fileClass">
      <source :src="url" type="audio/ogg">
      <source :src="url" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <!---Video preview-->
    <video v-else-if="extVideo.includes(ext)" width="100%" controls :class="fileClass">
      <source :src="url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    url: { default: '', type: String },
    extension: {default: null},
    imgProps: { default: null },
    fileClass: { default: '' }
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
