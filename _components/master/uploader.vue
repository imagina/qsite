<template>
  <div id="uploaderMasterComponent" class="full-width">
    <!---Content-->
    <div id="contentUploader" class="row q-col-gutter-md">
      <!---File block-->
      <div :class="`relative-position ${file.columns}`" v-for="(file , indexFile) in showFiles" :key="indexFile">
        <!--content-->
        <div class="file-block" @click="file.action(file)">
          <!---Content file block-->
          <div :class="`file-block_content row items-center justify-center img-as-bg ${file.class}`"
               :style="file.style">
            <!--Information-->
            <div class="text-center">
              <!--Icon-->
              <q-icon v-if="!loading && file.icon" class="file-block_icon" :name="file.icon" @added="setFiles"/>
              <!--Helper label-->
              <div v-if="!loading && file.label" class="text-caption text-grey-7 q-mt-md">{{ file.label }}</div>
            </div>
            <!--Tooltip-->
            <q-tooltip v-if="file.tooltip" anchor="center middle" self="center middle" :delay="500">
              {{ file.tooltip }}
            </q-tooltip>
            <!---Inner loading-->
            <q-spinner-oval v-if="file.loading" color="primary" size="40px"/>
          </div>
          <!--File title-->
          <div v-if="file.name" class="file-block_title ellipsis"> {{ file.name }}</div>
        </div>
        <!--Delete action-->
        <div v-if="file.actionDelete" class="btn-delete row items-center justify-center"
             @click="file.actionDelete(file.index)">
          <q-icon name="fas fa-trash-alt"/>
        </div>
      </div>
    </div>
    <!--Uploader image-->
    <q-uploader ref="qUploaderComponent" v-show="false" :accept="acceptFiles" @added="setFiles"
                :max-files="maxFiles - filesData.length" :multiple="maxFiles >= 2 ? true : false"/>
    <!--Image preview-->
    <avatar-image ref="avatarImage" no-preview/>
  </div>
</template>
<script>
export default {
  name: 'uploaderComponentMaster',
  props: {
    value: {default: false},
    accept: {default: '.pdf, .xlsx, .docx, .pptx, .mp4, .mp3, .jpg, image/*'},
    maxFiles: {default: 1},
    emitBase64: {type: Boolean, default: false},
    emitFile: {type: Boolean, default: false},
    helpText: {default: false}
  },
  components: {},
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.setValueToFileData()
      }
    },
    filesData() {
      this.emitFiles()
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      uploaderFiles: [],
      filesData: [],
      tmpFile: false
    }
  },
  computed: {
    //Return accept files
    acceptFiles() {
      //Images
      if (this.accept == 'images') return '.jpg, image/*'
      //documents
      if (this.accept == 'documents') return '.pdf, .xlsx, .docx, .pptx'
      //Media
      if (this.accept == 'media') return '.mp4, .mp3, .jpg, image/*'

      //Default
      return this.$clone(this.accept)
    },
    //Order Show Files
    showFiles() {
      let files = this.$clone(this.filesData)
      let response = []

      for (var fileIndex = 0; fileIndex < (files.length + 1); fileIndex++) {
        if ((fileIndex + 1) <= this.maxFiles) {
          let file = files[fileIndex]//Get file
          let fileIsImage = !file ? false : (file.isImage || (typeof file == 'string') ? true : false)
          let filePath = fileIsImage ? (file.base64 || file) : false

          //Add data
          response.push({
            ...(file && (typeof file != 'string') ? file : {}),
            index: fileIndex,
            name: file ? (file.name || filePath) : false,
            icon: file ? (fileIsImage ? false : 'task') :
              (this.accept == 'images' ? 'add_a_photo' : 'note_add'),
            label: file ? false : this.helpText || this.$tr('ui.message.addFile'),
            style: filePath ? `background-image: url('${filePath}')` : '',
            class: file ? 'file-block_loaded' : '',
            columns: (files.length && this.maxFiles >= 2) ? 'col-6 col-md-3 col-lg-2' : 'col-12',
            tooltip: file ? file.name : false,
            loading: file ? false : this.loading,
            action: () => {
              file ? this.fileAction(file) : this.$refs.qUploaderComponent.pickFiles()
            },
            actionDelete: file ? index => this.filesData.splice(index, 1) : false
          })
        }
      }

      //Set add card as first item
      if (this.filesData.length < this.maxFiles)
        response.splice(0, 0, response.pop())

      //Response
      return response
    }
  },
  methods: {
    init() {
      this.setValueToFileData()
      this.emitFiles()
    },
    //Set value to file data
    setValueToFileData() {
      if (this.value) {
        let newFilesData = this.$clone(Array.isArray(this.value) ? this.value : [this.value])
        let filesData = this.$clone(this.filesData)
        //Default condition to set new files
        let setFiles = newFilesData.length != filesData.length ? true : false
        //Set files
        if (setFiles) this.setFiles(this.$clone(newFilesData), true)
      }
    },
    //Get file information
    setFiles(files, replacing = false) {
      this.loading = true
      setTimeout(async () => {
        //Clear file data
        if (replacing) this.filesData = []
        //default files data
        let filesData = this.$clone(this.filesData)
        //Transform file information
        for (const file of files) {
          //Default file data
          let fileData = file
          //If file isn't a string
          if (typeof file !== 'string') {
            //Get base 64
            let base64 = await this.$helper.getBase64(file)
            //File data
            fileData = {
              file: file,
              name: file.name,
              size: file.size,
              type: file.type,
              base64: base64,
              isImage: file.__img ? true : false,
              width: file.__img ? file.__img.naturalWidth : 0,
              height: file.__img ? file.__img.naturalHeight : 0,
              extension: file.name.split('.').pop()
            }
            //Crop image
            if (file.__img) {
              await new Promise((resolve, reject) => {
                this.$eventBus.$emit('master.cropper.image', {
                  src: base64,
                  type: fileData.type,
                  callBack: async (fileCropped) => {
                    //Merge data
                    fileData = {...fileData, ...fileCropped}
                    //Get file
                    fileData.file = await this.$helper.urltoFile(fileData.base64, file.name, file.type)
                    //Resolve
                    resolve(true)
                  }
                })
              })
            }
          }
          //Set file data
          filesData.push(fileData)
        }
        //Set to files data
        this.filesData = this.$clone(filesData)
        //Reset uploader
        this.$refs.qUploaderComponent.reset()
        //Hide loading
        this.loading = false
      }, 500)
    },
    //File action
    fileAction(file) {
      //Action if is image
      if (file.isImage || (typeof file == 'string')) {
        this.$refs.avatarImage.open(file.base64 || file)
      }
    },
    //Emit response
    emitFiles() {
      let files = this.$clone(this.filesData)//Files
      let response = this.$clone(files)//Default response
      //Get only file
      if (this.emitFile) response = files.map(file => file.file || file)
      //Get only base64
      if (this.emitBase64) response = files.map(file => file.base64 || file)
      //Filter response quantity
      response = this.$clone((this.maxFiles >= 2) ? response : (response[0] || null))
      //Emit response
      this.$emit('input', response)
    },
    //Reset
    reset() {
      this.filesData = []
    }
  }
}
</script>
<style lang="stylus">
#uploaderMasterComponent
  color $grey-9
  display inline-grid

  #contentUploader
    .file-block
      border 1px dashed $grey-5
      border-color $blue
      border-radius 5px
      cursor pointer
      position relative

      .file-block_content
        height 150px

      .file-block_loaded
        background-color $grey-4
        height 126px

      .file-block_icon
        font-size 50px
        color $blue

      .file-block_title
        font-size 12px
        padding 3px 4px

    .btn-delete
      position absolute
      top 5px
      right -5px
      background $negative
      color white
      height 35px
      width 35px
      border-radius 50%
      cursor pointer
      z-index 99
</style>
