<template></template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qsite.entityNames.recommendation"),
        apiRoute: 'apiRoutes.qsite.recommendations',
        permission: 'isite.recommendations',
        extraFormFields: 'isite.crud-fields.recommendations',
        create: {
          title: this.$tr('isite.cms.newRecommendation'),
        },
        read: {
          columns: []
        },
        update: {
          title: this.$tr('isite.cms.updateRecommendation'),
        },
        delete: {
          title: this.$tr('isite.cms.deleteRecommendation'),
        },
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              type: 'textarea',
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
