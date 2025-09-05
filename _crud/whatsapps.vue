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
        apiRoute: 'apiRoutes.qsite.whatsapps',
        permission: 'isite.whatsapps',
        create: {
          title: this.$tr('isite.cms.newWhatsapp')
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'
            },
            {
              name: 'label', label: this.$tr('isite.cms.label.label'), field: 'label', align: 'rigth'
            },
            {
              name: 'countryCode', label: this.$tr('isite.cms.label.codeCountry'), field: 'countryCode', align: 'center'
            },
            {
              name: 'phone', label: this.$tr('isite.cms.label.phone'), field: 'phone', align: 'center'
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
          title: this.$tr('isite.cms.updateWhatsapp'),
          requestParams: { include: 'translations' },
        },
        delete: true,
        formLeft: {
          label: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.label.label')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          countryCode: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.label.codeCountry')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          phone: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.label.phone')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          message: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.label.message')}`
            }
          },
          icon: {
            value: '',
            type: 'input',
            //isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.icon')}`              
            }
          }          
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
