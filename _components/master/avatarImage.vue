<template>
  <div id="avatarImageComponent" @click="() => {dialog.show = true; $emit('click')}">
    <!--Avatar-->
    <div v-if="srcComponent && !noPreview" :class="`avatar-img-content ${!noOpen ? 'cursor-pointer' : ''}`"
         :style="`background-image: url('${srcComponent}'); ${defaultSize}`"></div>

    <!--Full screen-->
    <q-dialog id="modalOpenImage" v-model="dialog.show" v-if="!noOpen">
      <div class="contentImage text-center">
        <!--Image-->
        <q-card class="q-pa-sm q-mb-sm"><img :src="srcComponent"></q-card>
        <!--Button close-->
        <q-btn icon="fas fa-times" unelevated round color="red" @click="dialog.show = false"/>
      </div>
    </q-dialog>
  </div>
</template>
<script>
export default {
  props: {
    src: {default: false},
    noOpen: {type: Boolean, default: false},
    noPreview: {type: Boolean, default: false},
    size: {default: false},
    width: {default: '60px'},
    height: {default: '60px'},
  },
  emits: ['click'],
  components: {},
  watch: {
    src() {
      this.srcComponent = this.$clone(this.src)
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      dialog: {show: false},
      srcComponent: false
    }
  },
  computed: {
    defaultSize() {
      return `width : ${this.size || this.width}; height: ${this.size || this.height}`
    }
  },
  methods: {
    init() {
      this.srcComponent = this.$clone(this.src)
    },
    //Open image
    open(url) {
      this.srcComponent = this.$clone(url)
      this.dialog.show = true
    }
  }
}
</script>
<style lang="scss">
#avatarImageComponent {
  padding: 0;
  height: max-content;
  width: max-content;

  .avatar-img-content {
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #modalOpenImage {
    .contentImage {
      overflow: initial;
      position: relative;
      max-height: calc(100vh - 48px);
      box-shadow: none;
    }

    .q-card {
      max-height: calc(100vh - 98px);
      max-width: calc(100vw - 48px);
      position: relative;

      img {
        max-height: calc(100vh - 116px);
        max-width: calc(90vw - 16px);
      }
    }

    .q-btn {
      position: absolute;
      top: -18px;
      right: -18px;
    }
  }
}
</style>
