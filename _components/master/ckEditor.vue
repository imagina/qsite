<template>
  <div id="ckEditorComponent">
    <ck-editor v-model="responseValue"
               :config="configEditor"
               @namespaceloaded="onNamespaceLoaded"
               :ref="`ref-${internalName}`"
               :id="`id-${internalName}`"
    />
  </div>
</template>
<script>
//Components
import CKEditor from '@mayasabha/ckeditor4-vue3';
//Custom Plugins
import pluginCollapsibleItem from 'src/plugins/ckEditorPlugins/collapsibleItem/plugin'
import pluginGrid from 'src/plugins/ckEditorPlugins/grid/plugin'
import pluginEmbed from 'src/plugins/ckEditorPlugins/embed/plugin'
import pluginFa from 'src/plugins/ckEditorPlugins/ckeditorfa-fa6/plugin'

/* range 7px to 36px*/
let fontSizes =  Array.from({length: 30}, (_, index) => `${7+index * 1}/${7 +index * 1}px;`)
fontSizes.push('48/48px;72/72px;96/96px;')

export default {
  props: {
    modelValue: {default: ''},
    name: {default: null}
  },
  emits: ['update:modelValue'],
  components: {ckEditor: CKEditor.component},
  watch: {
    modelValue(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.responseValue = this.$clone(newValue)
    },
    responseValue(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.$emit('update:modelValue', this.$clone(newValue))

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
        extraPlugins: 'colorbutton,colordialog,justify,collapsibleItem,font,btgrid,simplebox,ckeditorfa',
        embed_provider: '//iframe.ly/api/oembed?url={url}&callback={callback}&api_key=7e0aa12b0cd2c01651346b',
        contentsCss: 'https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css',
        fontSize_sizes: fontSizes.join('')
      }
    }
  },
  computed: {
    internalName(){
      return this.name || this.$uid()
    }
  },
  methods: {
    init() {
      this.responseValue = this.$clone(this.modelValue)
    },
    //On name space loaded
    onNamespaceLoaded(CKEDITOR) {
      //Load custom plugins
      pluginCollapsibleItem.load(CKEDITOR)
      pluginGrid.load(CKEDITOR);
      pluginEmbed.load(CKEDITOR);
      pluginFa.load(CKEDITOR);
      CKEDITOR.dtd.$removeEmpty['span'] = false;
    }
  }
}
</script>
<style lang="scss">
#ckEditorComponent {
  .btn-content-toolbar {
    background-size: 16px;
    height: 16px;
    width: 16px;
  }

  #iconToolbarCollapsibleitem {
    background-image: url("src/plugins/ckEditorPlugins/collapsibleItem/collapsibleitem.png");
  }

  #iconToolbarGrid {
    background-image: url("src/plugins/ckEditorPlugins/grid/grid.png");
  }

  #iconToolbarEmbed {
    background-image: url("src/plugins/ckEditorPlugins/embed/embed.png");
  }

  .cke_button__ckeditorfa_icon {
    background-image: url("src/plugins/ckEditorPlugins/ckeditorfa-fa6/icons/ckeditorfa.png") !important;
  }
}

/* ckeditor-fa pluging */
#ckeditor-fa-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

#ckeditor-fa-icons {
  text-align: center;
  white-space: normal;
  width: 100%;
  height: 400px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow: auto;
  background-color: #f0f1f3;
}

#ckeditor-fa-icons button {
  display: inline-block;
  width: 100px;
  padding: 5px;
  text-align: center;
  vertical-align: top;
  background-color: #ffffff;
  border-radius: 4px !important;
  border: 2px solid #f0f1f3 !important;
}

#ckeditor-fa-icons button:hover {
  /* transform: scale(1.2) */
  transition: all 0.1s ease-in-out;
  border: 2px solid $primary !important;
}

#ckeditor-fa-icons button span {
  font-size: 28px;
  display: block;
  text-align: center;
}

#ckeditor-fa-icons button p {
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ckeditor-fa-select {
  display: block !important;
}

</style>
