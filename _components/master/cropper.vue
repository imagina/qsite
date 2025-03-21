<template>
  <q-dialog id="modalCropperComponent" v-model="show" persistent maximized>
    <div id="cropperContent" class="row items-center justify-center">
      <!---Cropper-->
      <vue-cropper v-if="imgSrc" v-bind="cropperProps" ref="cropper" @crop="getCropperData()"/>
      <!---Top actions-->
      <div id="topActions" class="row q-gutter-x-xs">
        <q-btn v-for="(item, keyItem) in cropperActions.top" :key="keyItem" round flat
               :icon="item.icon" @click="item.action()" color="white" size="11px"/>
      </div>
      <!---Bottom actions-->
      <div id="bottomActions" class="row q-gutter-x-sm" v-if="information">
        <div v-for="(item, keyItemAction) in cropperActions.bottom" :key="keyItemAction"
             class="btnActionCropper row items-center text-center" @click="item.popupName ? false : item.action()">
          <q-icon :name="item.icon" class="q-mr-xs"/>
          {{ item.value }}
          <!--pupop edit-->
          <q-popup-edit v-if="item.popupName" v-model="cropperSize[item.popupName]" auto-save>
            <q-input v-model="cropperSize[item.popupName]" dense autofocus outlined type="number"
                     :label="item.label" @update:modelValue="item.action()">
              <template v-slot:append>
                <q-icon :name="item.icon" class="cursor-pointer" v-close-popup/>
              </template>
            </q-input>
          </q-popup-edit>
        </div>
      </div>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </q-dialog>
</template>
<script>
//Mixins
import zoneConfigMixing from "modules/qmedia/_mixins/zoneConfigMixins"
// Local
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { eventBus } from 'src/plugins/utils'

export default {
  beforeUnmount() {
    eventBus.off('master.cropper.image')
  },
  mixins: [zoneConfigMixing],
  props: {
    props: {type: Object}
  },
  emits: ['cropped','canceled'],
  components: {VueCropper},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      show: false,
      scale: {y: 1, x: 1},
      information: false,
      cropperSize: {width: 100, height: 100},
      imgSrc: false,
      imgType: false,
      callBack: false,
      aspectRatio: NaN,
    }
  },
  computed: {
    //props to cropper
    cropperProps() {
      return {
        ref: 'cropper',
        autoCropArea: 1,
        background: false,
        toggleDragModeOnDblclick: false,
        cropBoxResizable: true,
        src: this.imgSrc,
        viewMode: 1,
        containerStyle: {'height': '92%', 'width': '96%', 'max-height': '92%', 'max-width': '96%'},
        aspectRatio: this.aspectRatio,
        ...(this.props || {})
      }
    },
    //Actions
    cropperActions() {
      return {
        top: [
          {icon: 'fas fa-search-plus', action: () => this.$refs.cropper.relativeZoom(0.2)},
          {icon: 'fas fa-search-minus', action: () => this.$refs.cropper.relativeZoom(-0.2)},
          {icon: 'fas fa-undo-alt', action: () => this.$refs.cropper.rotate(-45)},
          {icon: 'fas fa-redo-alt', action: () => this.$refs.cropper.rotate(45)},
          {
            icon: 'fas fa-vector-square', action: () => {
              let imageData = this.$refs.cropper.getImageData()//Get image data
              let cropData = this.$refs.cropper.getData()//Get crop data
              let percentages = [1.00, 0.90, 0.80, 0.70]//Instance options to percentages

              //Calculate current percentage between image original data and cropperData
              let currentPercentaje = parseFloat((((cropData.width * 100) / imageData.naturalWidth) / 100).toFixed(2))

              /**
               * Instance the next percentage acoording to current percentage, and validate that not be more than
               * the last option percentages or reset it to 0
               */
              let indexPercentage = (percentages.indexOf(currentPercentaje) + 1)
              if (indexPercentage > (percentages.length - 1)) indexPercentage = 0

              //instance size to cropBox acoording to the instanced percentage
              let sizeCropBox = {
                width: imageData.naturalWidth * percentages[indexPercentage],
                height: imageData.naturalHeight * percentages[indexPercentage]
              }

              //Set bos data calculating the percentage size and X and Y
              this.$refs.cropper.setData({
                ...sizeCropBox,
                x: (imageData.naturalWidth - sizeCropBox.width) / 2,
                y: (imageData.naturalHeight - sizeCropBox.height) / 2,
              })
            }
          },
          {
            icon: 'fas fa-arrows-alt-h', action: () => {
              this.$refs.cropper.scaleY(-this.scale.y)
              this.scale.y = -this.scale.y
            }
          },
          {
            icon: 'fas fa-arrows-alt-v', action: () => {
              this.$refs.cropper.scaleX(-this.scale.x)
              this.scale.x = -this.scale.x
            }
          },
          {icon: 'fas fa-reply', action: () => this.$refs.cropper.reset()},
        ],
        bottom: [
          {
            icon: 'fas fa-ban',
            value: this.$tr('isite.cms.label.cancel'),
            action: () => {
              this.cropImage(false)
            }
          },
          {
            popupName: 'width',
            icon: 'fas fa-arrows-alt-h',
            value: `${this.information ? this.information.cropper.width : ''}px`,
            label: this.$tr('isite.cms.form.width'),
            action: () => {
              this.$refs.cropper.setData({
                width: parseInt(this.cropperSize.width),
                height: parseInt(this.cropperSize.height)
              })
            }
          },
          {
            popupName: 'height',
            icon: 'fas fa-arrows-alt-v',
            value: `${this.information ? this.information.cropper.height : ''}px`,
            label: this.$tr('isite.cms.form.height'),
            action: () => {
              this.$refs.cropper.setData({
                width: parseInt(this.cropperSize.width),
                height: parseInt(this.cropperSize.height)
              })
            }
          },
          {
            icon: 'fas fa-save', value: this.$tr('isite.cms.label.save'), action: this.cropImage
          },
        ]
      }
    }
  },
  methods: {
    init() {
      //Listen global event
      eventBus.on('master.cropper.image', params => {
        if (params.src) this.loadFile(params.src)
        if (params.type) this.imgType = this.$clone(params.type)
        if (params.callBack) this.callBack = params.callBack
        if (params.ratio) this.aspectRatio = this.parseRatio(params.ratio)
      })
    },
    //Open crop
    loadFile(src) {
      this.show = true
      setTimeout(() => this.imgSrc = this.$clone(src), 500)
    },
    //Get cropper data
    getCropperData() {
      //Get all information
      this.information = {
        cropper: this.$refs.cropper.getData(true),
        container: this.$refs.cropper.getContainerData(),
        image: this.$refs.cropper.getImageData()
      }
      //Set cropper size information
      this.cropperSize = {
        width: parseInt(this.information.cropper.width),
        height: parseInt(this.information.cropper.height)
      }
    },
    //Crop Image
    cropImage(emitImage = true) {
      //Emit image
      if (emitImage) {
        this.loading = true
        //Get base 64
        let base64 = this.$refs.cropper.getCroppedCanvas().toDataURL(this.imgType)

        /* if didn't crop returns original image */
        if( this.information.image.naturalWidth == this.information.cropper.width &&
          this.information.image.naturalHeight == this.information.cropper.height){
          base64 = this.imgSrc
        }

        //Data response
        let dataResponse = {
          base64: base64,
          size: parseInt((base64).replace(/=/g, "").length * 0.75),
          height: this.information.cropper.height,
          width: this.information.cropper.width
        }
        //Emit value
        this.$emit('cropped', dataResponse)
        //Call back
        if (this.callBack) this.callBack(dataResponse)
      }
      //Emit canceled cropper
      else {
        //Emit value
        this.$emit('canceled')
        //Call back
        if (this.callBack) this.callBack(null)
      }

      //Reset component
      this.show = false
      this.imgSrc = false
      this.callBack = false
      this.imgType = false
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
#modalCropperComponent {
  #cropperContent {
    position: relative;
    background: #000;

    #bottomActions {
      position: absolute;
      right: 10px;
      bottom: 10px;

      .btnActionCropper {
        cursor: pointer;
        border-radius: 20px;
        background: #00000099;
        color: white;
        padding: 3px 10px;
        border: 2px solid white;

        .q-icon {
          font-size: 16px;
          color: white;
        }
      }
    }

    #topActions {
      padding: 3px 5px;
      border-radius: 20px;
      background: #00000099;
      border: 2px solid white;
      margin: auto;
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
}
</style>
