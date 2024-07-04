<template>
    <div>
        <p> this is the recycle bin </p>
        {{ params }}
    </div>
</template>
<script>
export default {
  mounted(){
    this.params = decodeURI(window.location).split('?')   

  }, 
  data() {
    return {
      crudId: this.$uid(),
      params: {}
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.categories',
        permission: 'isite.categories',
        extraFormFields: 'isite.crud-fields.categories',
        create: {
          title: this.$tr('isite.cms.newCategory'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {name: 'slug', label: this.$tr('isite.cms.form.slug'), field: 'slug', align: 'left'},
            {name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'left'},
            {
              name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'parent'},
          filters: {
            parentId: {
              value: null,
              type: 'treeSelect',
              props: {
                label: this.$tr('isite.cms.form.parent')
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsite.categories',
                requestParams: {filter: {status: 1}}
              }
            },            
          },
          excludeActions: ['new', 'edit', 'destroy', 'sync', 'export', 'share'], 
          actions: [
            {//restore item action
              icon: 'fa-light fa-floppy-disk-circle-arrow-right',
              color: 'green',
              label: 'Restore item',
              //vIf: ,
              action: (item) => {
              this.$emit('restore', item)
              }
            },
            {//restore item action
              icon: 'fa-light fa-trash-can-xmark',
              color: 'green',
              label: 'Delete permanently',
              //vIf: ,
              action: (item) => {
              this.$emit('deletePermanently', item)
              }
            },
          ]
        },
        update: {
          title: this.$tr('isite.cms.updateCategory'),
          requestParams: {include: 'parent'}
        },
        delete: true,
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
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          }
        },
        formRight: {
          status: {
            value: '1',
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('isite.cms.form.status')}*`,
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'}
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          parentId: {
            value: 0,
            type: 'treeSelect',
            props: {
              label: this.$tr('isite.cms.form.parent'),
              options: [
                {label: this.$tr('isite.cms.label.disabled'), value: 0},
              ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsite.categories',
              select: {label: 'title', id: 'id'},
              requestParams: {include: 'parent', filter: {status: 1}}
            }
          },
          showMenu: {
            value: '0',
            type: 'select',
            isTranslatable: false,
            props: {
              label: this.$tr('isite.cms.form.showInMenu'),
              options: [
                {label: this.$tr('isite.cms.label.yes'), value: '1'},
                {label: this.$tr('isite.cms.label.no'), value: '0'}
              ]
            }
          },
          featured: {
            value: '0',
            type: 'select',
            isTranslatable: false,
            props: {
              label: this.$tr('isite.cms.form.featured'),
              options: [
                {label: this.$tr('isite.cms.label.yes'), value: '1'},
                {label: this.$tr('isite.cms.label.no'), value: '0'}
              ]
            }
          },
          sortOrder: {
            value: '0',
            type: 'input',
            props: {
              label: this.$tr('isite.cms.form.sortOrder'),
              type: 'number'
            }
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.firstImage'),
              zone: 'mainimage',
              entity: "Modules\\Isite\\Entities\\Category",
              entityId: null
            }
          }
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }  
}
</script>
