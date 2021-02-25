<template>
  <q-dialog id="modalCropperComponent" v-model="show" persistent maximized>
    <div id="cropperContent" class="row items-center justify-center">
      <!---Cropper-->
      <vue-cropper v-if="imgSrc" v-bind="cropperProps" ref="cropper" @crop="getCropperData()"/>
      <!---top actions-->
      <div id="topAction" class="row q-gutter-x-sm" v-if="information">
        <div v-for="(item, keyItemAction) in cropperActions.top" :key="keyItemAction"
             class="btnActionCropper row items-center text-center" @click="item.popupName ? false : item.action()">
          <q-icon :name="item.icon" class="q-mr-xs"/>
          {{ item.value }}
          <!--pupop edit-->
          <q-popup-edit v-if="item.popupName" v-model="cropperSize[item.popupName]" auto-save>
            <q-input v-model="cropperSize[item.popupName]" dense autofocus outlined type="number"
                     :label="item.label" @input="item.action()">
              <template v-slot:append>
                <q-icon :name="item.icon" class="cursor-pointer" v-close-popup/>
              </template>
            </q-input>
          </q-popup-edit>
        </div>
      </div>
      <!---Bottom actions-->
      <div id="buttomAction" class="row q-gutter-x-xs">
        <q-btn v-for="(item, keyItem) in cropperActions.bottom" :key="keyItem" round flat
               :icon="item.icon" @click="item.action()" color="white" size="11px"/>
      </div>
      <!--Inner loading-->
      <inner-loading :visible="loading" />
    </div>
  </q-dialog>
</template>
<script>
// Local
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  beforeDestroy() {
    this.$eventBus.$off('master.cropper.image')
  },
  props: {
    props: {type: Object}
  },
  components: {VueCropper},
  watch: {},
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
      callBack: false
    }
  },
  computed: {
    //props to cropper
    cropperProps() {
      return {
        ref: 'cropper',
        autoCropArea: 0.98,
        background: false,
        toggleDragModeOnDblclick: false,
        cropBoxResizable: true,
        src: this.imgSrc,
        viewMode: 1,
        containerStyle: {'height': '92%', 'width': '96%', 'max-height': '92%', 'max-width': '96%'},
        ...(this.props || {})
      }
    },
    //Actions
    cropperActions() {
      return {
        top: [
          {
            popupName: 'width',
            icon: 'fas fa-arrows-alt-h',
            value: `${this.information ? this.information.cropper.width : ''}px`,
            label: this.$tr('ui.form.width'),
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
            label: this.$tr('ui.form.height'),
            action: () => {
              this.$refs.cropper.setData({
                width: parseInt(this.cropperSize.width),
                height: parseInt(this.cropperSize.height)
              })
            }
          },
          {
            icon: 'fas fa-save', value: this.$tr('ui.label.save'), action: this.cropImage
          },
        ],
        bottom: [
          {icon: 'fas fa-search-plus', action: () => this.$refs.cropper.relativeZoom(0.2)},
          {icon: 'fas fa-search-minus', action: () => this.$refs.cropper.relativeZoom(-0.2)},
          {icon: 'fas fa-undo-alt', action: () => this.$refs.cropper.rotate(-45)},
          {icon: 'fas fa-redo-alt', action: () => this.$refs.cropper.rotate(45)},
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
        ]
      }
    }
  },
  methods: {
    init() {
      //Listen global event
      this.$eventBus.$on('master.cropper.image', params => {
        if (params.src) this.loadFile(params.src)
        if (params.type) this.imgType = this.$clone(params.type)
        if (params.callBack) this.callBack = params.callBack
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
    cropImage() {
      this.loading = true
      //Get base 64
      let base64 = this.$refs.cropper.getCroppedCanvas().toDataURL(this.imgType)
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
<style lang="stylus">
#modalCropperComponent
  #cropperContent
    position relative
    background #000

    #topAction
      position absolute
      right 10px
      bottom 10px

      .btnActionCropper
        cursor pointer
        border-radius 20px
        background #00000099
        color white
        padding 3px 10px
        border 2px solid white

        .q-icon
          font-size 16px
          color white

    #buttomAction
      padding 3px 5px
      border-radius 20px
      background #00000099
      border 2px solid white
      margin auto
      position absolute
      top 10px
      left 10px
</style>
