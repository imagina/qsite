<template>
  <div id="signatureComponent" class="full-width flex flex-center">
    <div id="signatureContent" class="full-width relative-position q-pa-sm">
      <!--Label-->
      <div class="text-grey-9 q-mb-sm">{{ label }}</div>
      <!--Actions-->
      <div id="btnActions">
        <!--Clear-->
        <q-btn icon="fa-solid fa-trash" size="sm" flat round color="blue-grey" @click="clear()" :disable="readonly"/>
        <!--Undo-->
        <q-btn icon="fa-solid fa-reply" size="sm" flat round color="blue-grey" @click="undo()" :disable="readonly"/>
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
        <VueSignaturePad v-if="!readonly" class="bg-grey-2" ref="signaturePad" :options="options" :width="width" :height="height"/>
        <div v-else class="bg-grey-2">
          <img  v-if="value" :src="value" alt="" srcset="" :width="width" :height="height" />
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
import { VueSignaturePad } from 'vue-signature-pad';

export default {
  name: 'signature',
  props: {
    modelValue: null,
    width: {default: '100%'},
    height: {default: '150px'},
    emitFile: {type: Boolean, default: false},
    label: {type: String},
    readonly: {
      type: Boolean,
      default: () => false,
    }
  },
  components: { VueSignaturePad },
  emits: ['update:modelValue'],
  watch: {
    modelValue() {
      this.init()
    },
  },
  data() {
    return {
      model: null,
      isFullscreen: false,
      options: {
        onEnd: this.onEnd, 
        penColor: '#000000', 
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.model = this.modelValue;
      if(this.$refs.signaturePad) {
        this.$refs.signaturePad.fromDataURL(this.modelValue);
      }
    },
    onEnd() {
      const {isEmpty, data} = this.$refs.signaturePad.saveSignature();
      this.model = data || null
      this.$emit('update:modelValue', this.model)
    },
    undo() {
      this.$refs.signaturePad.undoSignature()
      this.onEnd()
    },
    clear() {
      this.$refs.signaturePad.clearSignature()
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

<style lang="scss">
#signatureContent {
  border: 1px solid rgb(229 229 229); //text-neutral-200
  border-radius: $custom-radius;

  #btnActions {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>
