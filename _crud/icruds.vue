<template>
  <master-modal v-model="modal.show" v-bind="modal.props" custom-position>
    <dynamic-field v-for="(field, keyField) in crudData.formLeft" :key="keyField"
                   v-model="form[field.name || keyField]" :field="field"/>
  </master-modal>
</template>
<script>
import { eventBus } from 'src/plugins/utils'

export default {
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        show: false,
        props: {
          title: 'Edit CRUD Form',
          loading: false,
          actions: [
            {
              action: this.saveCrud,
              props: {
                label: this.$tr('isite.cms.label.save'),
                color: 'green'
              }
            }
          ]
        },
      },
      form: {},
      selectedCrud: null
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.icruds',
        permission: 'isite.organizations',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {name: 'entity', label: this.$tr('isite.cms.label.entity'), field: 'entity', align: 'left'},
            {name: 'module', label: this.$tr('isite.cms.label.module'), field: 'module', align: 'left'},
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'updatedAt', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
          requestParams: {filter: {noTranslate: true}},
          actions: [
            {
              label: 'Edit',
              icon: 'fas fa-clipboard-list',
              action: (item) => {
                this.selectedCrud = this.$clone(item)
                this.form = this.$clone(item.projectCrud)
                //Set modal params
                this.modal.show = true
              }
            }
          ]
        },
        update: false,
        delete: false,
        formLeft: {
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.title')}`
            },
          },
          description: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.description')}`,
              type: 'textarea',
              rows: "3"
            },
          },
          icon: {
            value: 'fas fa-list-alt',
            type: 'selectIcon'
          },
          form: {
            value: null,
            type: 'json'
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    saveCrud() {
      return new Promise((resolve, reject) => {
        this.modal.props.loading = true

        //request data
        let requestData = {projectCrud: this.form}

        //request
        this.$crud.update('apiRoutes.qsite.icruds', this.selectedCrud.id, requestData).then(response => {
          this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
          eventBus.emit('crud.data.refresh')
          this.modal.props.loading = false
          this.modal.show = false
          resolve(response.data)
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.modal.props.loading = false
          reject(error)
        })
      })
    }
  }
}
</script>
