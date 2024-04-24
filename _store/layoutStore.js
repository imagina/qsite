import { reactive } from "vue";
import baseService from 'modules/qcrud/_services/baseService.js';

const data = {
  title: "Layouts",
  description: null,
  name: "Layouts",
  fields: {
    layoutId: {
      type: 'fileList',
      colClass: "col-12",
      files: {
        ref: 'otherFilesComponent',
        key: 'otherFiles',
        allowSelect: 1,
        gridColClass: 'col-6 col-md-3 col-lg-4',
        modelValue: [],
      }
    }
  }
};
const state = reactive({
  layoutList: {...data},
  allLayouts: [],
  selectedlayoutId: null,
});

export default function layoutStore() {

  function getLayouts() {
    return new Promise(resolve => {
      const requestParams = {
        refresh: true,
        params: {include:'files'}
      }
      //Request
      baseService.index('apiRoutes.qsite.layouts', requestParams).then(response => {
        setSelectedFile();
        setAllLayouts(response.data);
        resolve(response.data)
      }).catch(error => {
        setAllLayouts([]);
        console.log(error);
        resolve(false)
      })
    })
  }

  function setSelectedFile() {
    state.layoutList.fields.layoutId.files.selectedFile = getSelectedLayout();
  }

  function getLayoutsList() {
    return state.layoutList;
  }

  function setSelectedLayout(layaoutId) {
    state.selectedlayoutId = layaoutId;
  }

  function getSelectedLayout() {
    return state.selectedlayoutId;
  }

  function mapLayoutsList(data) {
    return data.map((item) => {
      return {
        id: item.id,
        filename: item.title,
        createdAt: item.createdAt,
        path: item.mediaFiles?.mainimage.path,
        isFolder: item.mediaFiles?.mainimage.isFolder,
        isImage: item.mediaFiles?.mainimage.isImage,
        isVideo: item.mediaFiles?.mainimage.isVideo,
        largeThumb: item.mediaFiles?.mainimage.largeThumb,
        mediaType: item.mediaFiles?.mainimage.mediaType,
        mediumThumb: item.mediaFiles?.mainimage.mediumThumb,
        mimeType: item.mediaFiles?.mainimage.mimeType,
      }
    });
  }

  function getAllLayouts() {
    return state.allLayouts;
  }

  function setAllLayouts(layouts = []) {
    state.allLayouts = layouts;
  }

  function setValueLayoutList(value = []) {
    state.layoutList.fields.layoutId.files.modelValue = value;
  }

  return {
    getLayouts,
    getLayoutsList,
    getSelectedLayout,
    setSelectedLayout,
    setSelectedFile,
    getAllLayouts,
    setAllLayouts,
    setValueLayoutList,
    mapLayoutsList
  }
}
