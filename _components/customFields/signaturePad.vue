<template>
  <div class="col-12">
    <div class="row">
      <div class="rounded-borders shadow-1 col-12">
        <signature-pad
            ref="signature"
            :options="options"
        />
      </div>
      <div class="col-12 text-right q-mt-sm">
        <q-btn color="negative" icon="fas fa-undo" @click="undo()">
          <q-tooltip>
            {{ $tr('qlogistic.layout.label.undo') }}
          </q-tooltip>
        </q-btn>
        &nbsp;
        <q-btn color="negative" icon="fas fa-trash" @click="clear()">
          <q-tooltip>
            {{ $tr('qlogistic.layout.label.clear') }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
    import { colors } from 'quasar'
    export default {
      name: 'signaturePad',
      props: {
        value: null,
      },
      watch:{
        value(){
          this.init()
        }
      },
      data(){
          return {
            model: null,
            options: { onBegin: this.onBegin, onEnd: this.onEnd , penColor: colors.getBrand('primary'), images: [] }
          }
      },
      mounted(){
        this.$nextTick(()=>{
          this.init()
        })
      },
      methods:{
        init(){
          this.model = this.value
          this.options.images = [{src:this.model, x:0, y:0}]
        },
        onBegin(){

        },
        onEnd(){
          const { isEmpty, data } = this.$refs.signature.saveSignature();
          this.model = data || null
          this.$emit('input',this.model)
        },
        undo(){
          this.$refs.signature.undoSignature()
          this.onEnd()
        },
        clear(){
          this.$refs.signature.clearSignature()
          this.onEnd()
        }
      }
    };
</script>
