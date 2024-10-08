<template>
  <div id="dynamicFormComponent">
    <div v-bind="structure.wrapper.props" :key="structure.wrapper.directives.key" v-show="showForm">
      <!--Top Content-->
      <div v-bind="structure.wrapperTop.props" v-if="structure.wrapperTop.directives.vIf">
        <!--Title-->
        <div class="box-title text-center q-mb-md" v-if="formProps.title" v-html="formProps.title"></div>
        <!--Description-->
        <div class="text-body2 q-mb-md text-grey-8" v-if="formProps.description" v-html="formProps.description"></div>
      </div>

      <!--Progress bar-->
      <div v-bind="structure.wrapperProgress.props" v-if="structure.wrapperProgress.directives.vIf">
        <q-linear-progress :value="progress" color="primary" rounded />
      </div>

      <!--Form Content-->
      <q-form v-bind="structure.form.props" v-if="structure.form.directives.vIf"
              @validation-error="structure.form.events.validateError()">
        <!--Language-->
        <div v-bind="structure.wrapperLocales.props" v-show="structure.wrapperLocales.directives.vShow">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent" />
        </div>
        <!--Wrapper blocks-->
        <component v-model="step" v-bind="structure.wrapperBlocks.props" v-if="structure.wrapperBlocks.directives.vIf"
                   :is="structure.wrapperBlocks.props.is">
          <!--Columns-->
          <component v-for="(column, keyColumn) in structure.columns()" :key="keyColumn" v-bind="column.props"
                     :is="column.props.is">
            <!--Blocks-->
            <component v-for="(block, keyBlock) in column.blocks" :key="keyBlock" v-bind="block.props"
                       class="position-relative" :is="block.props.is">
              <help-text v-if="block.help" :title="block.help.title" :description="block.help.description"
                         class="position-right" />
              <div :class="block.childClass">
                <!--Top step Info-->
                <div class="step-top-content row items-center q-mb-md"
                     v-if="block.title || block.description || (canEditForm && (keyBlock == 0))">
                  <!--Title-->
                  <div class="box-title col-6"
                       v-show="block.title && !['stepVertical','collapsible'].includes(formType)">
                    {{ block.title }}
                  </div>
                  <!--Actions-->
                  <div :class="`col-6 text-right ${block.title ? '' : 'offset-6'}`">
                    <q-btn text-color="primary" outline rounded v-if="canEditForm && (keyBlock == 0)" dense
                           class="btn-small"
                           icon="fa-solid fa-pencil"
                           style="border: 1px solid rgba(0, 13, 71, 0.15)"
                           @click="$refs.editFormModal.editForm(formId)">
                      <q-tooltip>
                        {{ $tr('iforms.cms.label.editForm') }}
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <!--Description-->
                  <div class="text-caption text-grey-8 col-12" v-if="block.description">{{ block.description }}</div>
                </div>
                <!--Fields-->
                <div class="row q-col-gutter-x-md q-mb-sm">
                  <template v-for="(field, key) in block.fields" :key="key">

                    <div v-if="hidenFields(field)"
                         :class="field.children ? 'col-12' : (field.colClass || field.columns || defaultColClass)">
                      <!--fake field-->
                      <div v-if="field.type === 'fileList'">
                        <fileListComponent v-bind="field.files" @selected="files => selectedFile(files)" />
                      </div>
                      <div v-else>
                        <dynamic-field v-if="field.fakeFieldName" :field="field"
                                       :language="locale.language"
                                       v-model="locale.formTemplate[field.fakeFieldName][field.name || key]"
                                       :item-id="field.fieldItemId" />
                        <!--Sample field-->
                        <dynamic-field v-else :field="field" :item-id="field.fieldItemId"
                                       v-model="locale.formTemplate[field.name || key]" :language="locale.language"
                                       :ref="field.type" />
                        <!--Child fields-->
                        <div v-if="field.children">
                          <!--Title-->
                          <div class="text-blue-grey q-mb-xs">
                            <b>{{ field.label }} <label v-if="field.isTranslatable">({{ locale.language }})</label></b>
                          </div>
                          <!---Child fields-->
                          <div class="row q-col-gutter-x-md">
                            <template v-for="(childField, childKey) in getParsedFields(field.children)" :key="childKey">
                              <div :class="childField.colClass || childField.columns || defaultColClass"
                                   v-if="childField.type != 'hidden'">
                                <!--Child field-->
                                <dynamic-field :field="childField" :key="childKey" :language="locale.language"
                                               v-model="locale.formTemplate[field.name || key][childField.name || childKey]"
                                               :item-id="childField.fieldItemId" />
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <!--Actions-->
                <div :class="`tw-space-x-1 actions__content row justify-${step == 0 ? 'end' : 'between'}`"
                     v-if="(formType == 'stepper') && !noActions">
                  <template v-for="(action, keyAction) in formActions" :key="keyAction">
                    <q-btn v-bind="action" unelevated rounded no-caps @click="action.action(keyBlock)" type="button"
                           v-if="action?.vIf != undefined ? action?.vIf : true" />
                  </template>
                </div>
              </div>
            </component>
          </component>
        </component>
        <!--Actions-->
        <div class="box box-auto-height row justify-end" v-if="(formType == 'grid') && !noActions">
          <template v-for="(action, keyAction) in formActions" :key="keyAction">
            <q-btn v-bind="action"
                   unelevated rounded no-caps @click="action.action('next')" type="button"
                   v-if="action?.vIf != undefined ? action?.vIf : true" />
          </template>
        </div>
      </q-form>

      <!--Innerloading-->
      <inner-loading :visible="(loading || innerLoading) ? true : false" />
    </div>
    <!-- Feedback after submit-->
    <div v-if="withFeedBack && showFeedBack">
      <div class="box box-auto-height justify-center">
        <div class="row">
          <div class="col-12 text-center q-gutter-y-sm">
            <div>
              <q-icon
                name="fa-light fa-envelope-circle-check"
                color="green"
                size="xl"
              />
            </div>
            <div>
              <p class="text-subtitle1">
                {{ successText }}
              </p>
            </div>
            <div>
              <q-btn
                unelevated
                rounded
                no-caps
                @click="setNewForm"
                :label="$tr('iforms.cms.feedBack.newForm')"
                type="button"
                color="primary"
                icon="fa-light fa-envelope"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit form Modal-->
    <edit-form-modal ref="editFormModal" @hide="init" />
  </div>
</template>

<script>
import fileListComponent from 'modules/qsite/_components/master/fileList';
import layoutStore from 'modules/qsite/_store/layoutStore.js';
import editFormModal from 'modules/qform/_components/editFormModal/index.vue'

export default {
  components: {
    fileListComponent,
    editFormModal,
  },
  props: {
    modelValue: {
      default: () => {
        return {};
      }
    },
    help: {
      type: Object,
      default() {
        return { description: 'Some description...' };
      }
    },
    loading: { type: Boolean, default: false },
    formType: { type: String, default: 'stepper' },
    title: { default: false },
    description: { default: false },
    blocks: { default: false },
    allowNavigation: { type: Boolean, default: false },
    formId: { default: false },
    sendTo: { default: false },
    actions: { default: false },
    defaultColClass: { default: 'col-12 col-md-6' },
    useCaptcha: { type: Boolean, default: false },
    hideTitle: { type: Boolean, default: false },
    hideProgressBar: { type: Boolean, default: false },
    noActions: { type: Boolean, default: false },
    formColNumber: {
      type: Number,
      default: 1,
      validator: (value) => [1, 2, 3].includes(value)
    },
    noResetWithBlocksUpdate: { type: Boolean, default: false },
    boxStyle: { type: Boolean, default: true },
    noSave: { type: Boolean, default: false },
    withFeedBack: { type: Boolean, default: false },
    requestParams: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['update:modelValue', 'obtainedForm', 'validated', 'sent', 'feedBack', 'submit', 'newForm'],
  watch: {
    modelValue: {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setLocaleFormData();
      }
    },
    blocks: {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setLocaleFields();
      }
    },
    'locale.form': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
          this.$emit('update:modelValue', this.$clone(this.locale.form));
        }
      }
    },
    formId() {
      this.init();
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      success: false,
      componentId: this.$uid(),
      locale: {},
      step: 0,
      innerLoading: false,
      formBlocks: false,
      showForm: true,
      showFeedBack: false
    };
  },
  computed: {
    //Blocks props
    structure() {
      //Instance mutation to structure by form type
      let strtByFormType = {
        //As stepper
        stepper: {
          wrapper: {
            props: {
              class: `relative-position box box-auto-height`
            }
          },
          wrapperBlocks: {
            props: {
              is: 'q-stepper',
              id: 'stepperContent',
              color: 'primary',
              ref: 'stepper',
              flat: true,
              animated: true,
              'header-class': 'q-hide'
            }
          },
          columns: () => {
            let response = this.blocksData.map((block, keyBlock) => {
              return {
                props: {
                  is: 'q-step',
                  name: keyBlock,
                  title: block.title || `#${keyBlock + 1}`,
                  class: `col-12 ${this.allowNavigation ? 'cursor-pointer' : ''}`
                },
                blocks: [{ props: { is: 'div' }, childClass: '', ...block }]
              };
            });

            //response
            return response;
          }
        },
        //as a grid
        grid: {
          wrapper: {
            props: {
              class: `relative-position`
            }
          },
          wrapperLocales: {
            props: {
              class: 'q-mb-md box box-auto-height'
            }
          },
          wrapperBlocks: {
            props: {
              is: 'div',
              id: 'gridContent',
              ref: 'gridContent',
              class: 'row q-col-gutter-md'
            }
          },
          columns: () => {
            //Instance form columns number grid class
            let formColumsClass = { 1: 'col-md-12', 2: 'col-md-6', 3: 'col-md-4' };
            //Instance response
            let response = Array(this.formColNumber).fill(0).map((_, i) => {
              return { blocks: [], props: { is: 'div', class: `col-12 ${formColumsClass[this.formColNumber]}` } };
            });
            //Transform blocks data
            let blocksData = this.blocksData.map((block, keyBlock) => {
              return {
                props: {
                  is: 'div',
                  class: `${this.boxStyle ? 'box box-auto-height' : ''} q-mb-md`
                },
                //childClass: 'q-py-sm q-px-md',
                ...block
              };
            });
            //Split blocks in columns
            let posColumn = 0;
            blocksData.forEach(block => {
              response[posColumn].blocks.push(block);
              posColumn = (posColumn >= (this.formColNumber - 1)) ? 0 : (posColumn + 1);
            });
            //response
            return response;
          }
        },
        //as a collapsible
        collapsible: {
          wrapper: {
            props: {
              class: `relative-position`
            }
          },
          wrapperLocales: {
            props: {
              class: 'q-mb-md box box-auto-height'
            }
          },
          wrapperBlocks: {
            props: {
              is: 'div',
              id: 'gridContent',
              ref: 'gridContent',
              class: 'row q-col-gutter-md'
            }
          },
          columns: () => {
            //Instance form columns number grid class
            let formColumsClass = { 1: 'col-md-12', 2: 'col-md-6', 3: 'col-md-4' };
            //Instance response
            let response = Array(this.formColNumber).fill(0).map((_, i) => {
              return { blocks: [], props: { is: 'div', class: `col-12 ${formColumsClass[this.formColNumber]}` } };
            });
            //Transform blocks data
            let blocksData = this.blocksData.map((block, keyBlock) => {
              return {
                props: {
                  is: 'q-expansion-item',
                  group: 'blockCollapsible',
                  defaultOpened: (keyBlock == 0) ? true : false,
                  style: 'padding : 0',
                  label: block.title,
                  class: `${this.boxStyle ? 'box box-auto-height' : ''} q-mb-md`,
                  headerClass: 'box-title text-blue-grey'
                },
                childClass: 'q-py-sm q-px-md',
                ...block
              };
            });
            //Split blocks in columns
            let posColumn = 0;
            blocksData.forEach(block => {
              response[posColumn].blocks.push(block);
              posColumn = (posColumn >= (this.formColNumber - 1)) ? 0 : (posColumn + 1);
            });
            //response
            return response;
          }
        }
      };

      //instance structure by formType to merge
      let strtToMerge = strtByFormType[this.formType];

      //Response
      return {
        wrapper: {
          props: {
            id: 'dynamicFormComponentContent',
            class: 'relative-position',
            ...(strtToMerge.wrapper?.props || {})
          },
          directives: {
            key: this.componentId,
            ...(strtToMerge.wrapper?.directives || {})
          }
        },
        wrapperTop: {
          props: {
            id: 'topContent',
            ...(strtToMerge.wrapperTop?.props || {})
          },
          directives: {
            vIf: (this.formType == 'stepper') && !this.hideTitle,
            ...(strtToMerge.wrapperTop?.directives || {})
          }
        },
        wrapperProgress: {
          props: {
            id: 'progressContent',
            class: 'q-mb-md',
            ...(strtToMerge.wrapperProgress?.props || {})
          },
          directives: {
            vIf: (this.formType == 'stepper') && !this.hideProgressBar,
            ...(strtToMerge.wrapperProgress?.directives || {})
          }
        },
        form: {
          props: {
            autocorrect: 'off',
            autocomplete: 'off',
            ref: 'formContent',
            class: 'full-width',
            ...(strtToMerge.form?.props || {})
          },
          directives: {
            vIf: this.success,
            ...(strtToMerge.form?.directives || {})
          },
          events: {
            validateError: () => {
              this.$alert.error(this.$tr('isite.cms.message.formInvalid'));
            },
            ...(strtToMerge.form?.events || {})
          }
        },
        wrapperLocales: {
          props: {
            class: 'q-mb-md',
            ...(strtToMerge.wrapperLocales?.props || {})
          },
          directives: {
            vShow: this.locale.fieldsTranslatable && Object.keys(this.locale.fieldsTranslatable).length && (this.locale.languages?.length >= 2),
            ...(strtToMerge.wrapperLocales?.directives || {})
          }
        },
        wrapperBlocks: {
          props: {
            is: 'div',
            ...(strtToMerge.wrapperBlocks?.props || {})
          },
          directives: {
            vIf: this.locale.success,
            ...(strtToMerge.wrapperBlocks?.props || {})
          }
        },
        columns: strtToMerge.columns
      };
    },
    //Settings
    settings() {
      return {
        defaultLocale: this.$clone(this.$store.state.qsiteApp.defaultLocale),//Get selected locales
        locales: this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      };
    },
    //From Props
    formProps() {
      //Get form data
      let form = this.$clone(this.formBlocks);

      //Default response
      let response = {
        title: this.$clone(this.title),
        description: this.$clone(this.description)
      };

      //Set info from form
      if (form) response.title = form.title;

      //Add count steps
      if (this.blocksData.length >= 2)
        response.title = `${form.title || response.title || ''} (${this.step + 1}/${this.blocksData.length})`;

      //Response
      return response;
    },
    //BlocksData
    blocksData() {
      let blocks = this.$clone(this.blocks || []);
      let form = this.$clone(this.formBlocks);

      if (form && form.blocks) {
        //Get dynamic field by blocks from form
        form.blocks.forEach((block, index) => {
          form.blocks[index].fields = form.blocks[index].fields.map(field => field.dynamicField);
        });
        //Merge blocks
        blocks = [...blocks, ...form.blocks];
      }

      //Add captcha field
      if (this.useCaptcha && blocks.length) {
        const lastBlock = blocks[blocks.length - 1];

        if (!Array.isArray(lastBlock.fields)) {
          lastBlock.fields.captcha = { type: 'captcha', ref: 'captcha' };
        } else {
          lastBlock.fields.push({ type: 'captcha', name: 'captcha', value: '', ref: 'captcha' });
        }
      }

      //Validate if field should be translatable
      blocks.forEach((block, blockKey) => {
        let blockFields = this.$clone(block.fields);//get block fields
        let parsedFields = this.getParsedFields(blockFields);//Parse fields

        //Get translatable fields
        let translatableFields = [];//Translatable fields name
        for (var key in parsedFields) {
          if (parsedFields[key].isTranslatable)
            translatableFields.push(parsedFields[key].fakeFieldName || parsedFields[key].name || key);
        }

        //Parse block fields
        for (var key in blockFields) {
          let field = blockFields[key];
          //validate first level
          if (translatableFields.includes(field.fakeFieldName || field.name || key))
            blockFields[key].isTranslatable = true;
          //Validate children fields
          if (field.children) {
            for (var keyChild in field.children) {
              let fieldChild = blockFields[key].children[keyChild];
              //validate first level
              if (translatableFields.includes(fieldChild.fakeFieldName || fieldChild.name || keyChild))
                blockFields[key].children[keyChild].isTranslatable = true;
            }
          }
        }

        //Set fields to blocks
        blocks[blockKey].fields = this.$clone(blockFields);
      });

      //Response
      return blocks;
    },
    //Form progress
    progress() {
      let totalStep = this.blocksData.length;//Get total steps
      let valuePerStep = parseFloat(1 / totalStep).toFixed(1); // Get value per step

      //Return progress value
      if (this.step == 0) return parseFloat(valuePerStep);//To first step
      else if (this.step == (totalStep - 1)) return 1;//To last step
      else return parseFloat(parseFloat(valuePerStep * (this.step + 1)).toFixed(1));//To middle step
    },
    //Step actions
    formActions() {
      //Validate if is last step
      let isLastStep = this.step == (this.blocksData.length - 1);

      //Default actions config
      let actions = {
        previous: {
          color: 'grey-6',
          icon: this.formType == 'stepVertical' ? 'fas fa-arrow-up' : 'fas fa-arrow-left',
          label: this.$tr('isite.cms.label.previous'),
          ...(this.actions.previous || {}),
          vIf: (this.step == 0) ? false : true,
          action: () => this.changeStep('previous')
        },
        next: {
          color: 'green',
          iconRight: this.formType == 'stepVertical' ? 'fas fa-arrow-down' : 'fas fa-arrow-right',
          label: this.$tr('isite.cms.label.next'),
          ...(this.actions.next || {}),
          action: () => this.changeStep('next', isLastStep)
        },
        submit: {
          color: 'green',
          icon: 'fas fa-save',
          vIf: !this.noSave,
          label: this.formBlocks.submitText ?? this.$tr('isite.cms.label.save'),
          ...(this.actions.submit || {}),
          action: () => this.changeStep('next', true)
        }
      };
      //Instance Response
      let response = { previous: actions.previous, next: (isLastStep ? actions.submit : actions.next) };

      //Validate prop icon
      if (!response.previous.icon) delete response.previous.icon;
      if (!response.next.icon) delete response.next.icon;

      //Response
      return (this.formType == 'stepper') ? response : [actions.submit];
    },
    //Return all form fields
    blocksFieldsName() {
      //Defualt fields anme
      let fields = [];
      //Get field name form every block
      this.blocksData.forEach(block => {
        Object.keys(block.fields).forEach(fieldKey => {
          fields.push(block.fields[fieldKey].name || fieldKey);
        });
      });
      //Response
      return fields;
    },
    //Returns success text after submit
    successText() {
      return this.formBlocks.successText ?? this.$tr('iforms.cms.feedBack.message');
    },
    hidenFields() {
      return field => (field.type != 'hidden') &&
        (field?.vIf != undefined ? field?.vIf : true);

    },
    // Validate if the dynamicForm is a backendForm and can edit it
    canEditForm() {
      return this.formId && this.$hasAccess('iforms.forms.edit');
    }
  },
  methods: {
    //Init method
    async init() {
      this.success = false;
      this.innerLoading = true;
      await this.getFormFields();
      this.setLocaleFields();
      this.setLocaleFormData();
      this.listenerStepTabClick();
      this.innerLoading = false;
      this.success = true;
    },
    //Get form fields
    getFormFields() {
      return new Promise((resolve, reject) => {
        //Reset formBlocks
        this.formBlocks = false;
        //Validate form data
        if (!this.formId) return resolve(false);
        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            include: 'blocks.fields',
            ...this.requestParams
          }
        };

        //Request
        this.$crud.show('apiRoutes.qform.forms', this.formId, requestParams).then(response => {
          this.formBlocks = response.data;
          this.$emit('obtainedForm', this.$clone(response.data));
          resolve(response.data);
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            reject(error);
          });
        });
      });
    },
    //set locale form data
    setLocaleFormData() {
      let formData = this.$clone({ ...this.locale.form, ...this.modelValue });

      //Clear fields
      /*Object.keys(formData).forEach(fieldName => {
        if (!this.settings.locales.includes(fieldName) && !this.blocksFieldsName.includes(fieldName))
          delete formData[fieldName]
      })*/

      //Validate data to fake fields
      this.blocksData.forEach(block => {
        //Parse fields
        let parsedFields = this.getParsedFields(block.fields);
        //Loop every fields
        for (var key in parsedFields) {
          //get field data
          let field = parsedFields[key];
          //Validate translatable field
          if (field.isTranslatable) {
            this.settings.locales.forEach(locale => {
              //validate if exist locale in form data
              if (formData[locale] == undefined) formData[locale] = {};

              //Validate translatable as fake field
              if (field.fakeFieldName) {
                //Validate fake field
                if ((formData[locale][field.fakeFieldName] == undefined) || (typeof formData[locale][field.fakeFieldName] != 'object'))
                  formData[locale][field.fakeFieldName] = {};
                //Validate field
                if (formData[locale][field.fakeFieldName][field.name || key] == undefined)
                  formData[locale][field.fakeFieldName][field.name || key] = field.value;
              }
              //Validate translatable
              else if (formData[locale][field.name || key] == undefined) {
                formData[locale][field.name || key] = field.value;
              }
            });
          } else {
            if (field.fakeFieldName) {
              //Validate fake field
              if ((formData[field.fakeFieldName] == undefined) || (typeof formData[field.fakeFieldName] != 'object'))
                formData[field.fakeFieldName] = {};
              //Validate field
              if (formData[field.fakeFieldName][field.name || key] == undefined)
                formData[field.fakeFieldName][field.name || key] = field.value;
            }
            //Validate translatable
            else if (formData[field.name || key] == undefined)
              formData[field.name || key] = field.value;
          }
        }
      });

      //set locale form data
      this.locale.form = this.$clone(formData);
    },
    //Set form Fields from blocks
    setLocaleFields() {
      //Reset locale component
      if (!this.noResetWithBlocksUpdate && this.$refs.localeComponent) this.$refs.localeComponent.vReset();

      //Instance variables to locale fields
      let fields = {}, fieldsTranslatables = {};

      //Loop every fields from all blocks
      this.blocksData.forEach(block => {
        //Parse fields
        let parsedFields = this.getParsedFields(block.fields);

        //Validate every fields
        for (var key in parsedFields) {
          let field = parsedFields[key];//get field data
          //Add to data locale to field
          if (field.isTranslatable) {
            if (field.fakeFieldName) {
              if (!fieldsTranslatables[field.fakeFieldName]) fieldsTranslatables[field.fakeFieldName] = {};
              fieldsTranslatables[field.fakeFieldName][field.name || key] = field.value;
            } else fieldsTranslatables[field.name || key] = field.value;
          } else {
            //Set fake field
            if (field.fakeFieldName) {
              if (!fields[field.fakeFieldName]) fields[field.fakeFieldName] = {};
              fields[field.fakeFieldName][field.name || key] = field.value;
            } else {//Set field
              fields[field.name || key] = field.value;
            }
          }
        }
      });

      //Assign fields and validations to locale

      this.locale.fields = this.$clone(fields);
      this.locale.fieldsTranslatable = this.$clone(fieldsTranslatables);
    },
    //return parsed fields
    getParsedFields(fields) {
      let response = {};//instance response

      //loop every fields
      Object.keys(fields).forEach(fieldKey => {
        let field = fields[fieldKey];//get field data
        let fieldName = (field.name || fieldKey);//instance field name

        //Validate field permission
        if (field.permission && !this.$hasAccess(field.permission)) return;

        //parse child fields
        if (field.children) {
          Object.keys(field.children).forEach(childFieldKey => {
            response[`${fieldName}-${childFieldKey}`] = {
              ...field.children[childFieldKey],
              fakeFieldName: fieldName,
              isTranslatable: field.isTranslatable,
              permission: field.permission
            };
          });
        } else {//Set to response
          response[fieldKey] = {
            ...field,
            ...((field?.isFakeField && !field?.fakeFieldName) ? { fakeFieldName: 'options' } : {})
          };
        }
      });

      //Parse every fields
      Object.keys(response).forEach(fieldName => {
        //Validate col class
        let colClass = (response[fieldName].colClass || response[fieldName].columns || this.defaultColClass);
        response[fieldName].colClass = colClass.split(' ').filter(item => item.includes('col-')).join(' ');
      });

      //response
      return response;
    },
    //Listener to step head click
    listenerStepTabClick() {
      var stepTabs = document.getElementsByClassName('q-stepper__tab');
      let _this = this;
      //Listen click on step tab
      for (var i = 0; i < stepTabs.length; i++) {
        (function(index) {
          stepTabs[index].addEventListener('click', function() {
            if (parseInt(index) != _this.step) _this.changeStep(index);
          });
        })(i);
      }
    },
    //validate all languages
    async validateCompleteForm() {
      const isValid = await this.$refs.localeComponent.validateForm();
      return isValid;
    },
    //Handler step transition
    async changeStep(toStep, isSubmit = false) {
      //Validate if new Step it's not same to current step
      let isValid = (toStep == 'previous') ? true : await this.$refs.formContent.validate();

      if (isSubmit && this.useCaptcha && isValid) {
        await this.captchaHandler()
      }
      //Dispatch event to know if if is valid
      this.$emit('validated', isValid);
      //Validate if new Step it's not same to current step

      if (isValid) {
        //Emit submit form
        if (isSubmit) {
          if (this.sendTo && this.sendTo.apiRoute) {
            this.innerLoading = true;
            //Request Data
            let requestData = { ...this.locale.form };
            if (this.sendTo.extraData) {
              requestData = {
                ...requestData,
                ...((typeof this.sendTo.extraData == 'function') ?
                  this.sendTo.extraData(requestData) : this.sendTo.extraData)
              };
            }

            //Request
            this.$crud.create(this.sendTo.apiRoute, requestData).then(response => {
              this.innerLoading = false;
              this.reset();
              this.$emit('sent', this.$clone(this.locale.form));
              this.$emit('feedBack', this.$clone(response.data));
              //feedBack
              if (this.withFeedBack) {
                this.showForm = false;
                this.showFeedBack = true;
              }

            }).catch(error => {
              this.innerLoading = false;
            });
          } else {
            this.$emit('submit', this.$clone(this.locale.form));
          }
        } else {//Change step
          if (toStep == 'previous') this.$refs.stepper.previous();//To previous step
          else if (toStep == 'next') this.$refs.stepper.next();//To next step
          else if (this.allowNavigation) this.$refs.stepper.goTo(toStep);//To specific step
        }
      }
    },
    //Reset form
    reset() {
      this.componentId = this.$uid();
      this.$refs.formContent.resetValidation();
      this.step = 0;
      this.showForm = true;
      this.showFeedBack = false;
    },
    selectedFile(file) {
      const fileId = file.length === 0 ? null : file[0].id;
      layoutStore().setSelectedLayout(fileId);
    },
    setNewForm() {
      this.reset();
      this.locale.form = false;
      this.init();
      this.$emit('newForm');
    },
    async captchaHandler() {
      const {version} = this.locale.formTemplate['captcha']
      if (version == 3) {
        const ref = this.$refs.captcha[0].getRef()
        await ref.getToken().then((response) => {
          this.locale.formTemplate['captcha'] = response
        })
      }
    }
  }
};
</script>

<style lang="scss">
#dynamicFormComponentContent {
  //min-height 150px

  .position-relative {
    position: relative;
  }

  .position-right {
    position: absolute;
    right: 16px;
  }

  #stepperContent {
    padding: 0;

    &.q-stepper--vertical {
      .q-stepper__tab {
        padding: 12px 5px !important;
      }

      .q-stepper__step-inner {
        padding: 0 10px 10px 40px;
      }
    }

    &.q-stepper--horizontal {
      .q-stepper__step-inner {
        padding: 0;
      }
    }
  }

  .q-btn {
    .q-icon {
      font-size: 14px;
    }
  }
}
</style>
