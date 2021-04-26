<template>
  <div id="ckEditorComponent">
    <ck-editor v-if="true" v-model="responseValue" :config="configEditor" @namespaceloaded="onNamespaceLoaded"/>
  </div>
</template>
<script>
//Components
import CKEditor from 'ckeditor4-vue';
//Custom Plugins
import pluginCollapsibleItem from '@imagina/qsite/_plugins/ckEditorPlugins/collapsibleItem/plugin'

export default {
  props: {
    value: {default: ''}
  },
  components: {ckEditor: CKEditor.component},
  watch: {
    value(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.responseValue = this.$clone(newValue)
    },
    responseValue(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.$emit('input', this.$clone(newValue))

    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      responseValue: '',
      configEditor: {
        allowedContent: true,
        filebrowserBrowseUrl: this.$router.resolve({name: 'app.media.select'}).href,
        extraPlugins: 'embed,autoembed,colorbutton,colordialog,collapsibleItem,font',
        embed_provider: '//iframe.ly/api/oembed?url={url}&callback={callback}&api_key=7e0aa12b0cd2c01651346b',

      }
    }
  },
  computed: {},
  methods: {
    init() {
      this.responseValue = this.$clone(this.value)
    },
    //On name space loaded
    onNamespaceLoaded(CKEDITOR) {
      //Load custom plugins
      pluginCollapsibleItem.load(CKEDITOR)
    }
  }
}
</script>
<style lang="stylus">
#ckEditorComponent
  //.q-icon
  #iconToolbarCollapsibleitem
    background-image url("../../_plugins/ckEditorPlugins/collapsibleItem/collapsibleitem.png")
    background-size 16px
    height 16px
    width 16px

</style>
