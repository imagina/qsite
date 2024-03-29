<template>
  <div id="signatureComponent" class="full-width flex flex-center">
    <div id="signatureContent" class="full-width relative-position q-pa-sm">
      <!--Label-->
      <div class="text-grey-9 q-mb-sm">{{ label }}</div>
      <!--Actions-->
      <div id="btnActions">
        <!--Clear-->
        <q-btn icon="delete" size="sm" flat round color="blue-grey" @click="clear()" :disable="readonly"/>
        <!--Undo-->
        <q-btn icon="undo" size="sm" flat round color="blue-grey" @click="undo()" :disable="readonly"/>
        <!--fullscreen-->
        <q-btn :icon="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"
               size="sm"
               flat round
               color="blue-grey"
               :disable="readonly"
               @click="toggleFullscreen"/>
      </div>
      <q-separator class="q-mb-sm"/>
      <!--Signature component-->
      <div id="vueSiganture" class="full-width">
        <!--Component-->
        <VueSignaturePad v-if="!readonly" class="bg-grey-2" ref="signature" :options="options" :width="width" :height="height"/>
        <div v-else class="bg-grey-2">
          <img  v-if="value" :src="value" alt="" srcset="" :width="width" :height="height"></img>
        </div>
      </div>
      <!---Close fullscreen-->
      <div v-if="isFullscreen" class="text-center">
        <q-separator class="q-my-sm"/>
        <q-btn :label="$tr('isite.cms.label.accept')"
               unelevated dense color="green"
               rounded @click="toggleFullscreen"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signature',
  props: {
    value: null,
    width: {default: '100%'},
    height: {default: '150px'},
    emitFile: {type: Boolean, default: false},
    label: {type: String},
    readonly: {
      type: Boolean,
      default: () => false,
    }
  },
  watch: {
    value() {
      this.init()
    },
  },
  data() {
    return {
      model: null,
      isFullscreen: false,
      options: {onBegin: this.onBegin, onEnd: this.onEnd, penColor: '#000000', images: []}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.model = this.value;
      if(this.$refs.signature) {
        this.$refs.signature.fromDataURL(this.value);
      }
      this.options.images = [{src: this.model, x: 0, y: 0}]
    },
    onBegin() {
      this.$refs.signature.resizeCanvas()
      this.onEnd()
    },
    onEnd() {
      const {isEmpty, data} = this.$refs.signature.saveSignature();
      this.model = data || null
      this.$emit('input', this.model)
    },
    undo() {
      this.$refs.signature.undoSignature()
      this.onEnd()
    },
    clear() {
      this.$refs.signature.clearSignature()
      this.onEnd()
    },
    toggleFullscreen() {
      //Get element
      const element = document.getElementById("signatureComponent")

      if (this.isFullscreen) {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        element.style.background = "initial"
      } else {
        if (element.requestFullScreen) {
          element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        }
        element.style.background = "#fff"
      }
      //Toggle ref
      this.isFullscreen = !this.isFullscreen
    }
  }
};
</script>

<style lang="stylus">
#signatureContent
  border 1px solid $grey-5
  border-radius $custom-radius

  #btnActions
    position absolute
    top 5px
    right 5px
</style>
