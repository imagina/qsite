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
        apiRoute: 'apiRoutes.qsite.logs',
        //permission: 'isite.logs.index',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id'},
            {
              name: 'message', label: 'Message', field: 'message',
              align: 'left', sortable: true
            },
            {
              name: 'user_id', label: 'User Id',
              field: 'user_id', align: 'left', sortable: true
            },
          ],
          filters: {
            userId: {
              value: null,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {label: 'fullName', id: 'id'}
              },
              props: {
                label: `${this.$tr('iprofile.cms.sidebar.adminUserIndex')}:`,
                clearable: true
              }
            },
          }
        },
        update: false,
        delete: false,
        formLeft: {},
        formRight: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
