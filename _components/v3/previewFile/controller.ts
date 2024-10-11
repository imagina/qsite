import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    extDocs: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pps', 'pdf'],
    extAudio: ['mp3','ogg'],
    extVideo: ['mp4'],
    extImage: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp', 'ico', 'heif', 'heic'],
  })

  // Computed
  const computeds = {
    ext: computed(() => {
      const {url, extension} = props
      return methods.getFileExtension(url) || extension
    })
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    getFileExtension(url) {
      // Remove parameters (if any) by using split and taking the first part
      const cleanUrl = url.split('?')[0];

      // Get the extension using a regular expression
      const extension = cleanUrl.match(/\.(\w+)$/);

      // If there is a match, return the extension; otherwise, return null
      return extension ? extension[1] : null;
    }
  }

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
