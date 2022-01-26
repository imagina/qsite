<template>
  <div id="testPageId">
    <dynamic-field v-for="(field, keyField) in fieldsConfig" :key="keyField" :field="field" class="q-mb-md"/>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {
    fieldsConfig() {
      return {
        crud: {
          value: null,
          type: 'crud',
          props: {
            crudType: 'select',
            crudData: import('@imagina/qblog/_crud/categories'),
            customData: {
              read: {
                requestParams: {include: 'parent', filter: {status: 1}}
              }
            },
            crudProps: {
              label: 'Type: CRUD'
            },
          },
        },
        input: {
          type: 'input',
          props: {label: 'type: input'}
        },
        search: {
          type: 'search',
          props: {label: 'type: search'}
        },
        date: {
          type: 'date',
          props: {label: 'type: date'}
        },
        time: {
          type: 'time',
          props: {label: 'type: time'}
        },
        fullDate: {
          type: 'fullDate',
          props: {label: 'type: fullDate'}
        },
        select: {
          type: 'select',
          props: {label: 'type: select'}
        },
        treeSelect: {
          type: 'treeSelect',
          props: {label: 'type: treeSelect'}
        },
        html: {
          type: 'html',
          props: {label: 'type: html'}
        },
        checkbox: {
          type: 'checkbox',
          props: {label: 'type: checkbox'}
        },
        media: {
          value: {},
          type: 'media',
          props: {
            label: 'type: media',
            zone: 'gallery',
            entity: "Modules\\Iblog\\Entities\\Post",
            entityId: null
          }
        },
        inputColor: {
          type: 'inputColor',
          props: {label: 'type: inputColor'}
        },
        toggle: {
          type: 'toggle',
          props: {label: 'type: toggle'}
        },
        signature: {
          type: 'signature',
          props: {label: 'type: signature'}
        },
        rating: {
          type: 'rating',
          props: {label: 'type: rating'}
        },
        selectIcon: {
          type: 'selectIcon',
          props: {label: 'type: selectIcon'}
        },
        optionGroup: {
          type: 'optionGroup',
          props: {
            label: 'type: optionGroup',
            options : [
              {label : 'opt1', val : 'opt1'},
              {label : 'opt2', val : 'opt2'},
              {label : 'opt3', val : 'opt3'}
            ]
          }
        },
        schedulable: {
          type: 'schedulable',
          props: {label: 'type: schedulable'}
        },
        json: {
          type: 'json',
          props: {label: 'type: json'}
        },
      }
    }
  },
  methods: {
    init() {
    },
  }
}
</script>
<style lang="stylus">
</style>
