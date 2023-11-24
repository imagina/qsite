<template>
  <master-modal 
    v-model="show" 
    :persistent="true" 
    customPosition 
    @hide="resetForm"
    :loading="loading" 
    :title="modalTitle" 
    :actions="modalActions"
  >
    <q-form 
      autocorrect="off" 
      autocomplete="off" 
      ref="formContent" 
      @submit="submitData"
      @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
    >
      <!--Main-->
      <div class="box box-auto-height q-mb-md">
        <!--Category Id-->
        <dynamic-field v-model="form.categoryId" :field="formFields.category"/>
        <!--Title-->
        <dynamic-field v-model="form.name" :field="formFields.name"/>
        <!--Recipient Type-->
        <dynamic-field 
          v-model="form.to" 
          :field="formFields.to"
          v-if="formFields.to.vIf" 
          :key="`recipient-${changeKey}`"
        />
      </div>
      <!--Run fields-->
      <dynamic-form v-model="form.run" :blocks="formFields.run" no-actions no-reset-with-blocks-update
                    class="q-mb-md" :title="this.$tr('isite.cms.label.run')"/>
      <!--Category fields-->
      <dynamic-form v-model="form.categoryFields" :blocks="formFields.categoryFields" no-actions
                    v-if="formFields.categoryFields" :title="this.$tr('isite.cms.label.setting')"/>
    </q-form>
  </master-modal>
</template>
<script>
export default {
  props: {
    funnelId: {type: String, default: () => null}
  },
  inject: {
    addCard: {
      type: Function,
      default: () => false,
    },
  },
  watch: {
    'form.categoryId'() {
      this.changeKey = this.$uid()
      if(!this.loading) this.form.to = null;
      if (this.categorySelected) this.form.name = this.$clone(this.categorySelected.title)
    }
  },
  data() {
    return {
      show: false,
      modalTitle: '',
      loading: false,
      statusId: null,
      categories: [],
      automationId: null,
      form: {
        categoryId: null,
        name: null,
        to: null,
        run: {},
        categoryFields: {},
      },
      changeKey: this.$uid(),
      TELEGRAM: 14,
    };
  },
  computed: {
    isTo() {
      const idCategoriesWithRecipient = [1,7]
      const parentId = this.categorySelected.parentId || 0;
      return idCategoriesWithRecipient.includes(parentId)
    },
    whatLoadOptions() {
      const filterFormFieldType = this.categorySelected.options ? {
        filter: {
          type: this.categorySelected?.options?.filterFormFieldType || null
        }
      } : {};
      const ID_INTERNAL_COMMUNICATION = 7
      const loadOptionsUsers = {
        apiRoute: 'apiRoutes.quser.users',
        select: {
          label: 'fullName', 
          id: 'id'
        },
      }
      const loadOptionsCategories = {
        delayed: () => {
          return new Promise(resolve => {
            this.$crud.get(
              'apiRoutes.qrequestable.categoriesFormFields',
                {
                  ...filterFormFieldType
                },
                { categoryId: this.funnelId }
            ).then(response => resolve(response.data)
            ).catch(error => resolve([]))
          })
        },
        select: {
          label: 'name', 
          id: 'id'
        }
      }
      return this.categorySelected?.parentId === ID_INTERNAL_COMMUNICATION 
        ? loadOptionsUsers 
        : loadOptionsCategories
    },
    modalActions() {
      return [
        {
          props: {label: this.$tr('isite.cms.label.save'), color: 'green'},
          action: () => this.$refs.formContent.submit()
        },
      ]
    },
    formFields() {
      const categoryFields = this.categorySelected?.formFields || {}

      return {
        category: {
          type : 'treeSelect',
          required: true,
          props: {
            disableBranchNodes: true,
            label: `${this.$tr('isite.cms.label.category')} *`,
            options: this.$array.tree(this.categories)
          }
        },
        name: {
          value: null,
          type: "input",
          required: true,
          props: {
            label: `${this.$tr('isite.cms.form.title')} *`,
            vIf: this.categorySelected,
          }
        },
        to: {
          value: [],
          type: 'select',
          vIf: this.isTo,
          props: {
            multiple: true,
            useChips: true,
            clearable: true,
            label: `${this.$tr('isite.cms.label.recipient')} *`,
          },
          loadOptions: {
            ...this.whatLoadOptions
          }
        },
        run: [{
          name: 'runForm',
          fields: {
            when: {
              value: null,
              type: 'select',
              required: true,
              colClass: ["inBefore", 'inAfter'].includes(this.form.run.when) ? 'col-12 col-md-6' : 'col-12',
              props: {
                label: this.$tr('isite.cms.label.when'),
                options: [
                  {label: this.$tr('isite.cms.label.currentTime'), value: 'currentTime'},
                  {label: this.$tr('isite.cms.label.exactTime'), value: 'exactTime'},
                  {label: this.$tr('isite.cms.label.inBefore'), value: 'inBefore'},
                  {label: this.$tr('isite.cms.label.inAfter'), value: 'inAfter'},
                ]
              }
            },
            type: {
              value: 'minutes',
              type: 'select',
              required: true,
              props: {
                label: this.$tr('isite.cms.form.type'),
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                options: [
                  {label: this.$trp('isite.cms.label.hour'), value: 'hours'},
                  {label: this.$trp('isite.cms.label.minute'), value: 'minutes'},
                  {label: this.$trp('isite.cms.label.day'), value: 'days'}
                ]
              }
            },
            value: {
              type: 'input',
              required: true,
              props: {
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                label: this.$tr('isite.cms.label.time')
              }
            },
            date: {
              value: 'created_at',
              type: 'select',
              required: true,
              props: {
                label: this.$tr('isite.cms.label.field'),
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                options: [
                  {label: this.$trp('isite.cms.form.createdAt'), value: 'created_at'},
                  {label: this.$trp('isite.cms.form.updatedAt'), value: 'updated_at'}
                ]
              }
            }
          }
        }],
        categoryFields: !Object.values(categoryFields).length ? null : [{
          name: 'categoryFields',
          fields: categoryFields
        }]
      }
    },
    categorySelected() {
      return this.categories.find(category => category.id == this.form.categoryId) || {}
    }
  },
  methods: {
    async openModal(statusId, title, id = null) {
      try {
        this.automationId = id;
        this.loading = true
        let response = false;
        this.statusId = statusId;
        this.modalTitle = `${this.$tr('requestable.cms.newRule')} - ${title}`
        this.show = true;
        if(id) {
          response = await this.showAutomation(id);
        }
        await this.getCategories(response);
      } catch (error) {
        this.loading = false
      }
    },
    getCategories(data = false) {
      return new Promise(resolve => {
        //Request params
        const requestParams = {
          refresh: true,
          params: {
            filter: { statusId: this.statusId, categoryId: this.$filter.values.categoryId}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qrequestable.categoriesRule', requestParams)
          .then(async response => {
            const categoriesRule = this.$clone(response.data);
            if(data) {
              const category = await categoriesRule.find(item => item.id === data.categoryRuleId);
              await data.fields.forEach(item => {
                if(category.formFields[item.name]) {
                  category.formFields[item.name].value = item.value;
                }
              })
            }
            // telegram is hidden until the functionality remains
            this.categories = await this.$clone(categoriesRule).filter(item => item.id !== this.TELEGRAM);
            this.loading = false
          }).catch(error => {console.log(error); this.loading = false })
      })
    },
    async showAutomation(id) {
      try {
        const requestParams = {
          refresh: true,
          params: {
            filter: { 
              statusId: this.statusId, 
              categoryId: this.$filter.values.categoryId
            }
          }
        }
        const response = await this.$crud.show(
          'apiRoutes.qrequestable.automationRule',
          id, 
          requestParams
        );
        this.form.categoryId = response.data.categoryRuleId;
        this.form.name = response.data.name;
        const when = response.data.runType ? { when: response.data.runType } : {};
        this.form.run = {...when, ...response.data.runConfig};
        this.form.to = response.data.to;
        return response.data;
      } catch (error) {
        this.$apiResponse.handleError(error, () => {
          this.loading = false
        })
      }
    },
    submitData() {
      const route = 'apiRoutes.qrequestable.automationRule';
      this.loading = true
      //Instance the rule data
      var ruleData = {
        categoryRuleId: this.form.categoryId,
        name: this.form.name,
        to: this.form.to,
        runType: this.form.run.when,
        runConfig: null,
        statusId: this.statusId,
        ...this.form.categoryFields
      }

      //Validate the runConfig
      if (['exactTime'].includes(this.form.run.when)) {
        ruleData.runConfig = {date: 'created_at'}
      } else if (['inBefore', 'inAfter'].includes(this.form.run.when)) {
        ruleData.runConfig = {
          type: this.form.run.type,
          value: this.form.run.value,
          date: this.form.run.date
        }
      }
      const crud = this.automationId
        ? this.$crud.update(route, this.automationId, ruleData)
        : this.$crud.create(route, ruleData);
      //Request
      crud.then(response => {
        this.loading = false
        this.addCard(this.statusId)
        this.resetForm();
        this.show = false
      }).catch(error => this.loading = false)
    },
    resetForm() {
      this.categories = [];
      this.form = {
        categoryId: null,
        run: {},
        categoryFields: {},
        to: null
      }
    }
  },
};
</script>
