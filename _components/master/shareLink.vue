<template>
  <div id="shareLinkcomponent" v-if="link || content">
    <!--Button to open modal to share-->
    <q-btn icon="fa-light fa-share-alt"
      @click="openModal()"
      flat
      unelevated
      rounded
    />
    <!--Modal Buttons-->
    <master-modal id="shareLinkModal" v-model="showModal" :title="$tr('isite.cms.label.share')" icon="fas fa-share-alt">
      <div>
        <q-btn
          v-if="contentPreview && content"
          icon="fa-light fa-arrow-left"
          size="sm"
          color="primary"
          @click="contentPreview = false"
          unelevated
          round
          no-caps
          class="q-mb-md"
        />
        <!-- Content preview -->
        <div v-if="contentPreview && content" class="q-gutter-y-md">
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="content"
                type="textarea"
                standout
                readonly
                autogrow
              />
            </div>
          </div>
          <div class="row col justify-center">
              <q-btn
                :label="$trp('isite.cms.label.copy')"
                color="primary"
                @click="copyToClipBoard(content)"
                unelevated
                rounded
                no-caps
              />
          </div>
        </div>
        <!--Available buttons to share-->
        <div v-else class="q-gutter-y-lg q-pt-xs">
          <div class="row q-gutter-x-md justify-center">
            <div v-for="(button, key) in availableButtons"
              :key="key"
              v-if="button.icon"
              class="text-center platform"
              style="max-width: 70px;"
            >
              <q-btn
                :icon="button.icon"
                unelevated
                :color="button.color"
                align="center"
                @click="shareLink(key)"
                round
              />
              <div>
                {{ button.label }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                rounded
                bottom-slots
                v-model="link"
                outlined
              >
                <template v-slot:append>
                  <q-btn
                    :label="$trp('isite.cms.label.copy')"
                    @click="copyToClipBoard(link)"
                    unelevated
                    rounded
                    no-caps
                    color="primary"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </master-modal>
  </div>
</template>
<script>
  export default {
    props: {
      link: {default: null},
      content: {default: null},
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        showModal: false,
        contentPreview: false
      }
    },
    computed: {
      availableButtons() {
        return {
          content: this.content ? { icon: 'fa-light fa-code-simple', color: 'grey', label: this.$trp('isite.cms.label.insert') } : false,
          facebook: {
            icon: 'fa-brands fa-facebook',
            color: 'blue',
            label: 'Facebook',
            apiUrl: `https://www.facebook.com/sharer/sharer.php?u=${this.link}`
          },
          whatsapp: {
            icon: 'fab fa-whatsapp',
            color: 'green',
            label: 'Whatsapp',
            apiUrl: `https://api.whatsapp.com/send?text=${this.link}`
          },
          twitter: {
            icon: 'fab fa-twitter',
            color: 'cyan',
            label: 'Twitter',
            apiUrl: `http://www.twitter.com/share?url=${this.link}`
          },
        }
      },
      stylePupop() {
        let windowH = window.innerHeight
        let windowW = window.innerWidth

        return `resizable,height=${windowH - 100},width=600,top=${50},left=${((windowW - 600) / 2)}`
      }
    },
    methods: {
      init() {
        this.stylePupop
      },
      //Share link
      shareLink(platform) {
        if(platform == 'content'){
          this.contentPreview = true
        }else {
          this.openInNewWindow(this.availableButtons[platform].apiUrl)
        }
      },
      openModal(){
        this.contentPreview = (!this.link && this.content)
        this.showModal = true
      },
      openInNewWindow(url){
        window.open(url, '_blank', this.stylePupop)
      },
      copyToClipBoard(text){
        navigator.clipboard.writeText(text).then(() => {
          this.$alert.info(this.$tr('isite.cms.message.copiedToClipboard'))
        })
      }
    }
  }
</script>
<style lang="stylus">
#shareLinkModal
  .platform:hover
    transform: scale(1.1)
    transition: all 0.2s ease-in-out;
</style>
