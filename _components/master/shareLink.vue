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
    <q-dialog id="shareLinkModal" v-model="showModal">
      <q-card>
        <q-card-section class="row items-center">
          <!--Title-->
          <div class="text-h6 text-primary">
            <q-icon name="fas fa-share-alt" class="q-mr-xs"/>
            {{$tr('isite.cms.label.share')}}
          </div>
          <q-space/>
          <!--Close button-->
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <!-- Content preview -->
        <q-card-section
          v-if="contentPreview && content"
          class="q-gutter-y-md"
        >
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
                :label="$trp('isite.cms.label.copyEmbedHtml')"
                color="primary"
                @click="copyToClipBoard(content)"
                unelevated
                rounded
                no-caps
              />
          </div>
        </q-card-section>
        <!--Available buttons to share-->
        <q-card-section
          v-else
          class="q-gutter-y-lg"
        >
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
                autofocus
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      link: {default: false},
      content: {default: false},
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
          content: this.content ? { icon: 'fa-light fa-code-simple', color: 'grey', label: this.$trp('isite.cms.label.copyEmbedHtml') } : false,
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
  border-radius: $custom-radius !important
  .q-card
    min-width: 360px
  .platform:hover
    transform: scale(1.1)
    transition: all 0.2s ease-in-out;

</style>
