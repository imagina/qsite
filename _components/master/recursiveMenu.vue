<template>
  <span class="lt-sm-block">
    <q-no-ssr v-for="(item,key) in props.menu" :key="key">
      <!-- If the item doesn't have children and has a parent -->
      <q-list dense style="min-width: 100px" v-if="checkItemSingle(item) && props.parent">
        <q-item clickable>
          <q-item-section avatar v-if="item.icon"><q-icon color="secondary" :name="item.icon" /></q-item-section>
          <q-item-section>
            <router-link :to="{name: item.name}" class="text-secondary">
              {{props.translatable ? $tr(item.title) : item.title}}
            </router-link>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- If the item doesn't have children and doesn't have a parent -->
      <span class="cursor-pointer non-selectable lt-sm-block q-pa-sm" v-else-if="checkItemSingle(item)">
        <router-link :to="{name: item.name}" class="text-secondary">
          {{props.translatable ? $tr(item.title) : item.title}}
        </router-link>
      </span>
      <!-- If the item has children and has a parent -->
      <q-list dense style="min-width: 100px" v-else-if="checkItemMultiple(item) && props.parent">
        <q-item clickable>
          <q-item-section avatar v-if="item.icon"><q-icon color="secondary" :name="item.icon" /></q-item-section>
          <q-item-section class="text-secondary">
            {{props.translatable ? $tr(item.title) : item.title}}
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="secondary" />
          </q-item-section>
          <q-menu anchor="top right" self="top left">
            <recursive-menu :translatable="props.translatable" :show-icons="props.showIcons"
                          :key="key" :menu="item.children" :parent="item"/>
          </q-menu>
        </q-item>
      </q-list>
      <!-- If the item has children and doesn't have a parent -->
      <span class="cursor-pointer non-selectable lt-sm-block q-pa-sm text-secondary" v-else>
          {{props.translatable ? $tr(item.title) : item.title}}
          <q-menu>
            <recursive-menu :translatable="props.translatable" :show-icons="props.showIcons"
                            :key="key" :menu="item.children" :parent="item"/>
          </q-menu>
      </span>
    </q-no-ssr>
  </span>
</template>
<script>
  export default {
    name: 'recursiveMenu',
    components: {},
    props: {
      menu: {default: false},
      parent: {default: false},
      showIcons: {type: Boolean, default: true},
      translatable: {type: Boolean, default: true},
      inLine: {type: Boolean, default: false}
    },
    watch: {
      menu() {
        this.init()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        props: {}
      }
    },
    methods: {
      //init
      init() {
        this.props = this.$clone(this.$props)
        setTimeout(() => {
          this.checkCollapsibles()
        }, 300)
      },
      //Validate if should load single-item
      checkItemSingle(item) {
        let response = true
        if (!item.activated) response = false
        if (item.children) response = false
        if (!item.name) response = false
        if (item.permission && !this.$hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load multi-item
      checkItemMultiple(item) {
        let response = true
        if (!item.children) response = false
        if (item.children && !item.children.length) response = false
        if (item.permission && !this.$hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load all multi-item
      checkCollapsibles() {
        let collapsibles = this.$el.getElementsByClassName('q-expansion-item')

        for (let group of collapsibles) {
          let items = group.getElementsByClassName('single-item')
          if (!items.length) group.style.display = 'none'
        }
      },
      //Redirect to route of pages
      redirectTo(item) {
        if (item.linkType && (item.linkType == 'external')) {
          window.open(`https://${item.url}`, item.target)
        } else {
          this.$router.push({name: item.name, params: item.params || {}})
        }
      },
      //Validate if children of multi-item is selected
      selectedChildren(item) {
        let response = ''//Defualt response

        //If has children's
        if (item.children) {
          let routeName = this.$route.name
          let isSelectedChildren = item.children.find(item => item.name == routeName)
          if (isSelectedChildren) response = ' item-is-active'
        }

        return response //Response
      },
      //Validate if item is same of current page
      getClassItem(item) {
        let response = 'single-item'

        if (this.$route.name == item.name) {
          if (JSON.stringify(this.$route.params) == JSON.stringify(item.params || {})) {
            response += ' item-is-active'
          }
        }

        return response
      }
    }
  }
</script>
<style lang="scss">
  #listMenu
    .q-expansion-item__container
      .q-expansion-item__content
        padding 0 0 0 15px

    .q-item
      cursor pointer
      background-color white
      color $grey-9

      .q-item__section--avatar
        min-width 20px
        padding-right 10px

      .q-icon
        font-size 16px
</style>


