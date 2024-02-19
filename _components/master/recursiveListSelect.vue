<template>
  <div id="treeListSelect" class="round-borders q-py-md q-px-sm">
    <div class="row header-list">
      <!-- Title -->
      <div class="col-12 col-md-6 q-title q-ma-none text-primary q-mb-sm">
        <q-icon :name="icon" v-if="icon && title" class="q-mr-md"></q-icon>
        <span v-if="title">{{title}}</span>
      </div>

      <!-- Search -->
      <div :class="'col-12 q-mb-md '+ (icon && title ? 'col-md-6 ' : '')">
        <q-input v-model="search" outlined dense debounce="800"
                 :placeholder="`${$tr('isite.cms.label.search',{capitalize : true})}...`">
          <template v-slot:append>
            <q-icon name="fas fa-search"/>
          </template>
        </q-input>
      </div>
    </div>
    <!-- List -->
    <q-scroll-area style="width: 100%; height: 250px;">
      <q-tree
        v-if="items.length"
        :nodes="items"
        default-expand-all
        color="primary"
        :ticked.sync="itemsSelected"
        tick-strategy="leaf-filtered"
        :filter="search"
        node-key="id"
        @update:modelValue.sync="changeSelectedItems()"
      />
    </q-scroll-area>
  </div>
</template>
<script>
  export default {
    name: 'recursiveList',
    components: {},
    props: {
      items: { default: false },
      title: { default: false },
      icon: { default: false },
      modelValue: { default: [] },
    },
    emits: ['update:modelValue'],
    watch: {
      itemsSelected () {
        this.changeSelectedItems()
      },
      modelValue (newValue) {
        this.itemsSelected = newValue
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.modelValue && this.modelValue.length) {
          this.itemsSelected = this.modelValue
        }
      })
    },
    data () {
      return {
        itemsSelected: [],
        ticked: [],
        search: null
      }
    },
    methods: {
      //Event when change selected items
      changeSelectedItems () {
        this.$emit('update:modelValue', this.itemsSelected)
      }
    }
  }
</script>
<style lang="scss">
  #treeListSelect {
    .header-list {
      border-bottom: 1px solid $grey-4;
      margin-bottom: 10px;
    }
  }
</style>


