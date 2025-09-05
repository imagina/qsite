<template>
</template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.contacts',
        permission: 'isite.contacts',
        create: {
          title: this.$tr('isite.cms.newContact')
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'
            },
            {
              name: 'value', label: this.$tr('isite.cms.label.value'), field: 'value', align: 'center'
            },
            {
              name: 'systemName', label: this.$tr('isite.cms.form.systemName'), field: 'systemName', align: 'center'
            },
            {
              name: 'type', label: this.$tr('isite.cms.form.type'), field: 'type', align: 'center',
              format: val => val ? val.title : '-'
            },
            {
              name: 'statusId', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'center',
              format: val => val ? val.title : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'
            }
          ],         
          requestParams: { include: 'translations' }, 
          filters: {
            typeId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.type'),
                emitValue: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsite.contactTypes',
                select: { label: 'title', id: 'id' },
              }
            },        
            statusId: {
              value: 0,
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.status'),
                emitValue: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsite.statuses'
              }
            },
          }
        },
        update: {
          title: this.$tr('isite.cms.updateContact'),
          requestParams: { include: 'translations' },
        },
        delete: true,
        formLeft: {
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          value: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.label.value')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          systemName: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.systemName')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },        
          typeId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.type'),
              emitValue: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsite.contactTypes',
              select: { label: 'title', id: 'id' },
            }
          },        
          statusId: {
            value: 0,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              emitValue: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsite.statuses'
            }
          },
        },
        formRight: {        
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  }
};
</script>
