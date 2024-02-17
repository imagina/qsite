import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, onUnmounted} from "vue";
import store from 'modules/qsite/_components/v3/recursiveItem/store'
import { store as pluginStore, uid } from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    showMenu: false,
    listUid: uid().toString(),
    props: {},
    // Key: Default Value
  })

  // Computed
  const computeds = {
    menuData: computed(() => {
      let menu = props.menu.map(item => {
        //Instance item props
        item.itemProps = {
          class: methods.getClassItem(item),
          tag: 'div',
          key: uid(),
          vIf: methods.checkItemSingle(item),
          clickable: true
        }

        if(item.action) return item

        item.itemProps.tag = 'a'
        //Define redirect
        if (item.toRoute) item.itemProps.href = item.toRoute
        else item.itemProps.to = {name: item.name, params: item.params || {}}

        //Return item
        return item
      })

      //Response
      return menu
    })
  }

  // Methods
  const methods = {
    init() {
      state.props = proxy.$clone(props)
      setTimeout(() => {
        methods.checkCollapsibles()
        state.showMenu = true
      }, 300)
    },
    //Parse Id Item
    parseIdItem(idItem) {
      if(Number.isInteger(idItem)) return idItem
      return idItem.replaceAll(".", "");
    },
    //Validate if should load single-item
    checkItemSingle(item) {
      let response = true
      if (!item.activated) response = false
      if (item.children) response = false
      if (!item.name) response = false
      if (item.permission && !pluginStore.hasAccess(item.permission)) response = false
      if(!item.children?.length && item.action) response = true
      return response//Response
    },
    //Validate if should load multi-item
    checkItemMultiple(item) {
      let response = true
      if(item.children && item.children.length && item.action) return true
      if (!item.children) response = false
      if (item.children && !item.children.length) response = false
      if (item.permission && !pluginStore.hasAccess(item.permission)) response = false
      return response//Response
    },
    //Validate if should load all multi-item
    checkCollapsibles() {
      let collapsibles = proxy.$el.getElementsByClassName('q-expansion-item')

      //@ts-ignore
      for (let group of collapsibles) {
        let items = group.getElementsByClassName('single-item')
        if (!items.length) group.style.display = 'none'
      }
    },
    //Redirect to route of pages
    redirectTo(item) {
      if (item.linkType && (item.linkType == 'external')) {
        window.open(`https://${item.url}`, item.target)
      } else if (item.name) {
        proxy.$router.push({name: item.name, params: item.params || {}})
      }
    },
    //Validate if children of multi-item is selected
    selectedChildren(item) {
      let response = ''//Defualt response

      //Validate if current route name is like children
      let validateRouteName = (children) => {
        let routeName = proxy.$route.name//Route name
        let response = false// Default response

        if (children)
          children.forEach(element => {
            if (element.name == routeName) response = true
            if (element.children && validateRouteName(element.children)) response = true
          })

        if(children && store.itemSelected?.id) {
          children.forEach(element => {
            if (element.id == store.itemSelected?.id) response = true
          })
        }
        return response
      }

      //If has children's
      if (item.children && validateRouteName(item.children)) response = ' item-is-active'

      return response //Response
    },
    //Validate if item is same of current page
    getClassItem(item) {
      let response = 'single-item'
      if(props.rightIcon) response += ' row reverse'

      if(store.itemSelected?.id && item.id === store.itemSelected.id) response += ' item-is-active'

      if (proxy.$route.name == item.name) {
        if (JSON.stringify(proxy.$route.params) == JSON.stringify(item.params || {})) {
          response += ' item-is-active'
        }
      }

      return response
    },
    async selectItem(item) {
      if(item.action) {
        const change = await item.action(item)
        if(change) store.itemSelected = item
      }
    }
  }

  watch(() => props.menu, () => {
    methods.init()
  })

  // Mounted
  onMounted(() => {
    proxy.$nextTick(function () {
      methods.init()
    })
  })

  onUnmounted(() => {
    store.itemSelected = {}
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods, store}
}
