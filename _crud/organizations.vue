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
        apiRoute: 'apiRoutes.qsite.organizations',
        permission: 'isite.organizations',
        create: false,
        read: {
          showAs: 'grid',
          allowToggleView: false,
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left'},
            ...(!this.$hasAccess('isite.organizations.edit-status') ? [] : [
              {name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status'}
            ]),
            ...(!this.$hasAccess('isite.organizations.edit-featured') ? [] : [
              {name: 'featured', label: this.$tr('isite.cms.form.featured'), field: 'featured', asStatus: true}
            ]),
            {
              name: 'users', label: this.$trp('isite.cms.label.user'), field: 'users',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => `${item.firstName} ${item.lastName}`).join(', ') : ''
            },
            {
              name: 'emails', label: this.$trp('isite.cms.label.email'), field: 'users',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => item.email).join(', ') : ''
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
          requestParams: {
            include: 'users'
          }
        },
        update: {
          to: 'qsite.admin.organizations.update'
        },
        delete: true,
        formLeft: {},
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
