<template>
  <div id="signatureComponent" class="q-py-sm full-width">
    <!--Signature component-->
    <div id="vueSiganture">
      <VueSignaturePad ref="signature" :options="options" :width="width" :height="height"/>
    </div>
    <!--Actions-->
    <div class="row justify-between q-mt-sm">
      <!--Clear-->
      <q-btn color="grey-7" :label="$tr('ui.label.clear')" rounded unelevated size="sm" @click="clear()"/>
      <!--Undo-->
      <q-btn color="grey-7" :label="$tr('ui.label.back')" rounded unelevated size="sm" @click="undo()"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'signature',
    props: {
      value: null,
      width : {default : '100%'},
      height : {default : '150px'},
    emitFile: {type: Boolean, default: false}
    },
    watch: {
      value() {
        this.init()
      }
    },
    data() {
      return {
        model: null,
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
        this.model = this.value
        this.options.images = [{src: this.model, x: 0, y: 0}]
      },
      onBegin() {

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
      }
    }
  };
</script>

<style lang="stylus">
  #vueSiganture
    border 1px solid $grey-5
</style>
