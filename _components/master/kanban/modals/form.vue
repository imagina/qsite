<template>
  <master-modal
      v-model="show"
      :persistent="true"
      customPosition
      :loading="loading"
      maximized
      @hide="hideModal"
      modalWidthSize="98%"
      :title="title"
  >
    <div>
      <div class="relative-position">
        <div class="box box-auto-height q-mb-md">
          <div class="tw-mb-4">
            <dynamic-field
                v-for="(field, keyField) in formFields"
                :key="keyField"
                v-model="dynamicFieldForm[keyField]"
                :field="field"
            />
          </div>
          <div v-if="funnelForm">
            <dynamic-form
                v-if="formCategory.vIf"
                v-model="form"
                :form-id="formCategory.formId"
                @submit="saveForm()"
            />
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>
<script>
export default {
  props: {
    funnelId: {
      type: String,
      default: () => null,
    },
    filterName: {
      type: String,
      default: () => null,
    },
  },
  inject: {
    init: {
      type: Function,
      default: () => false,
    },
    routes: {
      type: Object,
      default: () => {
      },
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
    addCard: {
      type: Function,
      default: () => false,
    },
  },
  data() {
    return {
      show: false,
      funnelForm: null,
      statusId: null,
      form: {},
      dynamicFieldForm: {},
      loading: false,
      title: null,
    };
  },
  computed: {
    formCategory() {
      return {
        vIf: this.funnelForm && this.funnelForm.form ? true : false,
        formId: this.funnelForm?.form?.id || null,
      };
    },
    formFields() {
      const userData = this.$store.state.quserAuth.userData;
      return {
        createdBy: {
          value: null,
          type: 'crud',
          permission: 'requestable.requestables.edit-created-by',
          props: {
            crudType: 'select',
            crudData: import('@imagina/quser/_crud/users'),
            crudProps: {
              label: this.$tr('isite.cms.form.createdBy'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'fullName', value: 'id'
              }
            }
          },
        },
        requestedBy: {
          value: null,
          type: 'crud',
          permission: "requestable.requestables.filter-requested-by",
          props: {
            crudType: 'select',
            crudData: import('@imagina/quser/_crud/users'),
            crudProps: {
              label: this.$tr('isite.cms.form.requestedBy'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'fullName', value: 'id'
              }
            },
            customData: {
              create : {
                title: this.$tr('requestable.cms.newRequestedBy')
              },
              formLeft: {
                userName: {value: null},
                isActivated: {value: 1},
                changePassword: {value: null},
                password: {value: null},
                passwordConfirmation: {value: null}
              },
              formRight: false,
              getDataForm: (data) => {
                return new Promise(resolve => {
                  let password = this.$uid()
                  let role = this.$store.getters['qsiteApp/getSettingValueByName']('requestable::defaultContactRole')
                  data.password = password
                  data.passwordConfirmation = password
                  data.roles = role ? [role] : []
                  resolve(data)
                })
              }
            }
          },
        },
      }
    },
  },
  methods: {
    hideModal() {
      this.show = false;
      this.resetForm();
    },
    openModal(statusId, title = null) {
      this.statusId = statusId;
      this.title = title;
      const funnel =
          this.$helper.getDynamicSelectList()[this.filterName] || null;
      if (funnel) {
        this.funnelForm = funnel.find((item) => item.id == this.funnelId);
      }
      if (!this.formCategory.vIf) {
        this.$alert.warning({message: 'No existen formulario para esta categoría'})
        return;
      }
      this.show = true;
    },
    async saveForm() {
      try {
        this.loading = true;
        const nameRoute = this.automation ? "automation" : "card";
        if (!this.routes[nameRoute]) return;
        const route = this.routes[nameRoute];
        const form = {
          ...this.form,
          type: this.funnelForm.type,
          statusId: this.statusId,
          ...this.dynamicFieldForm,
          requestedBy: this.dynamicFieldForm.requestedBy || this.$store.state.quserAuth.userId
        };
        await this.$crud.create(route.apiRoute, form);
        await this.addCard(this.statusId);
        this.hideModal();

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    resetForm() {
      this.form = {};
    }
  },
};
</script>
