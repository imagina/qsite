<template>
  <div class="relative-position" v-if="success">
    <div id="dynamicFieldComponent">
      <!--Read Only-->
      <div v-if="readOnly">
        <div v-if="infoReadOnly">
          <!--Label-->
          <div class="text-primary">
            <q-icon name="fas fa-circle" size="8px" class="q-mr-xs"/>
            {{ fieldLabel }}
          </div>
          <!--Value-->
          <div class="text-caption q-ml-sm text-grey-9"> {{ infoReadOnly }}</div>
        </div>
      </div>
      <!--Field-->
      <div v-else :data-testid="`dynamicField-${field.testId || field.name}`">
        <!--Label-->
        <div class="input-title text-capitalize" v-if="loadField('html') || loadField('multiSelect')">
          {{ fieldLabel }}
        </div>
        <!--Crud-->
        <crud v-model="responseValue" @created="getOptions" v-bind="fieldProps" :key="field.name"
              :type="field.props.crudType || 'select'" ref="crudComponent"
              v-if="loadField('crud') || (field.props && field.props.crudData)"
              :class="`q-mb-xs ${(field.props && field.props.crudType == 'button-create') ? 'absolute-right' : ''}`"/>
        <!--Input-->
        <q-input v-model="responseValue" @keyup.enter="$emit('enter')" v-if="loadField('input')"
                 :label="fieldLabel" v-bind="fieldProps" style="padding-bottom: 20px">
          <template v-slot:prepend v-if="fieldProps.icon">
            <q-icon :name="fieldProps.icon" size="18px"/>
          </template>
          <template v-slot:append v-if="isFieldPassword">
            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                    @click="showPassword = !showPassword"/>
          </template>
        </q-input>
        <!--Search-->
        <q-input v-model="responseValue" @keyup.enter="$emit('enter')" v-if="loadField('search')"
                 v-bind="fieldProps">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <!--Date-->
        <q-input v-model="customValue" :label="fieldLabel" v-if="loadField('date')" v-bind="fieldProps.field"
                 @click="$refs.qDateProxy.show()">
          <template v-slot:prepend>
            <!--icon-->
            <q-icon v-if="fieldProps.field.icon" :name="fieldProps.field.icon" size="18px"/>
            <!--Float calendar-->
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="responseValue" @input="() => $refs.qDateProxy.hide()"
                      v-bind="fieldProps.slot"/>
            </q-popup-proxy>
          </template>
          <template v-slot:append>
            <q-btn icon="fas fa-times" round size="xs" unelevated color="grey-8"
                   v-if="fieldProps.field.clearable && responseValue" @click="responseValue = null"/>
          </template>
        </q-input>
        <!--Hour-->
        <q-input v-model="customValue" :label="fieldLabel" v-if="loadField('hour')" v-bind="fieldProps.field"
                 @click="$refs.qTimeProxy.show()">
          <template v-slot:prepend>
            <!--icon-->
            <q-icon v-if="fieldProps.field.icon" :name="fieldProps.field.icon" size="18px"/>
            <!--Float Time-->
            <q-popup-proxy ref="qTimeProxy" transition-show="scale" transition-hide="scale">
              <q-time v-model="responseValue" :format24h="false" @input="() => $refs.qTimeProxy.hide()"
                      v-bind="fieldProps.slot"/>
            </q-popup-proxy>
          </template>
          <template v-slot:append>
            <q-btn icon="fas fa-times" round size="xs" unelevated color="grey-8"
                   v-if="fieldProps.field.clearable && responseValue" @click="responseValue = null"/>
          </template>
        </q-input>
        <!--Full date-->
        <q-input v-model="customValue" :label="fieldLabel" v-if="loadField('fullDate')" v-bind="fieldProps.field">
          <template v-slot:prepend>
            <q-icon name="fas fa-calendar-day" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="responseValue" @input="() => $refs.qDateProxy.hide()"
                        v-bind="fieldProps.slot"/>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="fas fa-clock" class="cursor-pointer">
              <q-popup-proxy ref="qTimeProxy" transition-show="scale" transition-hide="scale">
                <q-time v-model="responseValue" :format24h="false" @input="() => $refs.qTimeProxy.hide()"
                        v-bind="fieldProps.slot"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!--Select-->
        <q-select v-model="responseValue" :options="formatOptions" :label="fieldLabel" use-input v-bind="fieldProps"
                  @input="matchTags(field)" v-if="loadField('select')" @filter="filterSelectOptions">
          <!--No options slot-->
          <template v-slot:no-option v-if="!fieldProps.hideDropdownIcon">
            <q-item>
              <q-item-section class="text-grey">
                {{ $tr('ui.message.notFound') }}
              </q-item-section>
            </q-item>
          </template>
          <!--Custom Option-->
          <template v-slot:option="scope" v-if="!fieldProps.hideDropdownIcon">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <!--Load checkbos if is multiple-->
              <q-item-section avatar v-if="field.props && field.props.multiple">
                <q-checkbox v-model="responseValue" :val="scope.opt.value"/>
              </q-item-section>
              <!--Icon-->
              <q-item-section v-else-if="scope.opt.icon" avatar>
                <q-icon size="20px" :name="scope.opt.icon" class="q-mr-sm"/>
              </q-item-section>
              <!--Labels-->
              <q-item-section>
                <q-item-label v-html="scope.opt.label"/>
                <q-item-label style="margin: 0" caption v-if="scope.opt.sublabel">
                  {{ scope.opt.sublabel }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <!--Icon-->
          <template v-slot:prepend v-if="fieldProps.icon">
            <q-icon :name="fieldProps.icon" size="18px" :color="fieldProps.color"/>
          </template>
        </q-select>
        <!--tree select-->
        <q-field v-model="responseValue" v-if="loadField('treeSelect')" :label="fieldLabel"
                 v-bind="fieldProps.fieldComponent">
          <tree-select v-model="responseValue" :options="formatOptions" placeholder="" v-bind="fieldProps.field"
                       @select="(node, instanceId) => $emit('select', {node, instanceId})"/>
        </q-field>
        <!--HTML-->
        <q-field v-model="responseValue" v-if="loadField('html')" label="" class="field-no-padding"
                 v-bind="fieldProps.fieldComponent">
          <ck-editor v-model="responseValue"/>
          <q-editor v-if="false" v-model="responseValue" class="full-width" v-bind="fieldProps.field"/>
        </q-field>
        <!--multiSelect-->
        <q-field v-model="responseValue" v-if="loadField('multiSelect')" label="" v-bind="fieldProps.fieldComponent">
          <recursive-select v-model="responseValue" class="bg-white full-width" :items="options"/>
        </q-field>
        <!--Checkbox-->
        <q-field v-model="responseValue" v-if="loadField('checkbox')" label="" class="field-no-padding"
                 v-bind="fieldProps.fieldComponent">
          <q-checkbox v-model="responseValue" label="" v-bind="fieldProps.field">
            <div class="text-blue-grey" v-if="fieldProps.field.label" v-html="fieldProps.field.label"></div>
          </q-checkbox>
        </q-field>
        <!--Image-->
        <q-field v-model="responseValue" v-if="loadField('image')" class="field-image" label=""
                 v-bind="fieldProps.fieldComponent">
          <upload-image v-model="responseValue" v-bind="fieldProps.field"/>
        </q-field>
        <!--Media-->
        <q-field v-model="responseValue" v-if="loadField('media')" label="" class="field-no-padding no-border"
                 v-bind="fieldProps.fieldComponent">
          <media v-model="responseValue" class="bg-white" v-bind="fieldProps.field"/>
        </q-field>
        <!--Manage Permission-->
        <manage-permissions v-model="responseValue" class="q-mb-sm" v-if="loadField('permissions')"
                            @input="watchValue" :allow-inherit="field.allowInherit ? true : false"/>
        <!--Manage Settings-->
        <manage-settings v-model="responseValue" class="q-mb-sm" :settings="field.settings"
                         v-if="loadField('settings')" @input="watchValue"/>
        <!--Schedules form-->
        <div class="round bg-white" v-if="loadField('schedule')">
          <schedules-form v-model="responseValue" @input="watchValue" class="q-mb-sm"
                          @converted="value => $emit('converted', value)"/>
        </div>
        <!--input color-->
        <q-input v-model="responseValue" :label="fieldLabel" v-if="loadField('inputColor')" v-bind="fieldProps.field"
                 @click="$refs.qColorProxi.show()">
          <template v-slot:append>
            <!--Icon-->
            <q-icon name="fas fa-tint" class="cursor-pointer" :style="`color : ${responseValue || 'grey'}`"/>
            <!--Picker-->
            <q-popup-proxy ref="qColorProxi" transition-show="scale" transition-hide="scale">
              <q-color v-model="responseValue"/>
            </q-popup-proxy>
          </template>
        </q-input>
        <!--Toggle-->
        <q-toggle v-model="responseValue" :label="fieldLabel" v-if="loadField('toggle')" v-bind="fieldProps.field"/>
        <!--position Marker (MAP)-->
        <q-field v-model="responseValue" v-if="loadField('positionMarkerMap')" label=""
                 class="field-no-padding no-border" v-bind="fieldProps.fieldComponent">
          <map-leaflet v-model="responseValue" type="positionMarkerMap" v-bind="fieldProps.field"/>
        </q-field>
        <!--Signature-->
        <q-field v-model="responseValue" v-if="loadField('signature')"
                 v-bind="fieldProps.fieldComponent" stack-label>
          <signature v-model="responseValue" v-bind="fieldProps.field"/>
        </q-field>
        <!--Uploader-->
        <q-field v-model="responseValue" v-if="loadField('uploader')" v-bind="fieldProps.fieldComponent" stack-label>
          <uploader v-model="responseValue" v-bind="fieldProps.field"/>
        </q-field>
        <!--rating-->
        <q-field v-model="responseValue" v-if="loadField('rating')" v-bind="fieldProps.fieldComponent">
          <q-rating v-model="responseValue" v-bind="fieldProps.field"/>
        </q-field>
        <!--icon select-->
        <select-icon v-model="responseValue" v-if="loadField('selectIcon')" v-bind="fieldProps"/>
      </div>
    </div>
  </div>
</template>
<script>
//Component
import recursiveSelect from '@imagina/qsite/_components/master/recursiveListSelect'
import managePermissions from '@imagina/qsite/_components/master/managePermissions'
import manageSettings from '@imagina/qsite/_components/master/manageSettings'
import media from '@imagina/qmedia/_components/form'
import uploadImage from '@imagina/qsite/_components/master/uploadImage'
import schedulesForm from '@imagina/qsite/_components/master/schedules'
import ckEditor from '@imagina/qsite/_components/master/ckEditor'
import mapLeaflet from '@imagina/qsite/_components/master/mapLeaflet'
import signature from '@imagina/qsite/_components/master/signature'
import uploader from '@imagina/qsite/_components/master/uploader'
import selectIcon from '@imagina/qsite/_components/master/selectIcon'

export default {
  name: 'dynamicField',
  beforeDestroy() {
    //Close listen event
    if (this.$refs.crudComponent) {
      this.$root.$off(`crudForm${this.$refs.crudComponent.params.apiRoute}Created`)
    }
  },
  props: {
    value: {default: null},
    field: {default: false},
    language: {default: false},
    itemId: {default: ''},
    readOnly: {type: Boolean, default: false}
  },
  components: {
    managePermissions,
    manageSettings,
    recursiveSelect,
    media,
    uploadImage,
    schedulesForm,
    ckEditor,
    mapLeaflet,
    signature,
    uploader,
    selectIcon
  },
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
          this.setDefaultVModel(newValue)//Order Value
        }
      }
    },
    responseValue(newValue, oldValue) {
      this.watchValue(newValue)
    },
    rootOptions(newValue) {
      this.options = this.rootOptions
    },
    'field.props.options'(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        if (typeof newValue == 'object') this.rootOptions = newValue
    },
    'field.loadOptions': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.getOptions()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      success: false,//global component status
      loading: false,
      responseValue: null,//value to response
      showPassword: false,//to show password
      options: [],//Options
      rootOptions: [],//Options
      rootOptionsData: [],//Options
      editorText: {
        toolbar: [
          ['bold', 'italic', 'strike', 'underline', 'removeFormat'],
          ['link'],
          [
            {
              label: 'Font Size',
              icon: 'format_size',
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
            }
          ],
          ['quote', 'unordered', 'ordered'],
          ['fullscreen']
        ]
      }
    }
  },
  computed: {
    //Return label to field
    fieldLabel() {
      let response = ''
      if (this.field.props && this.field.props.label) {
        response = this.field.props.label
        if (this.field.isTranslatable) response = `${response} (${this.language})`
      } else if (this.field.type == 'search') {
        return `${this.$tr('ui.label.search', {capitalize: true})}...`
      } else if (['date', 'fullDate'].includes(this.field.type)) {
        return `${this.$tr('ui.label.date')}`
      } else if (this.field.type == 'hour')
        return `${this.$tr('ui.label.hour')}`

      //Set tree data
      if (this.field.type == 'treeSelect' && this.responseValue && !Array.isArray(this.responseValue)) {
        if (this.rootOptionsData && this.rootOptionsData.length) {
          let infoSelected = this.$array.parents(this.rootOptionsData, this.responseValue)
          if (infoSelected) response += ` | ${infoSelected.parents}`
        }
      }

      return response
    },
    //Return field props
    fieldProps() {
      //Default props
      let props = {...this.field.props || {}}

      //Case per type field
      switch (this.field.type) {
        case'crud':
          props = {...props}
          break;
        case'input':
          props = {
            bgColor: 'white',
            outlined: true,
            dense: true,
            ...props
          }

          //Add rule to validate field
          if (this.field.validateField && this.field.validateField.apiRoute) {
            if (!props.debounce) props.debounce = '800' //Add debounce
            props.rules = [...(props.rules || []), this.validateField]//Add rule to validate field
          }

          //Extra logic to input type password
          if (this.isFieldPassword) props.type = this.showPassword ? 'text' : 'password'

          break;
        case'search':
          props = {
            bgColor: 'white',
            debounce: '800',
            outlined: true,
            dense: true,
            clearable: true,
            label: this.fieldLabel,
            ...props
          }
          break;
        case'date':
          props = {
            field: {
              bgColor: 'white',
              color: 'primary',
              outlined: true,
              dense: true,
              readonly: true,
              icon: 'fas fa-calendar-alt',
              ...props,
              mask: ''
            },
            slot: {
              ...props
            }
          }
          //Remove mask from prop field
          delete props.field.mask
          break;
        case'hour':
          props = {
            field: {
              bgColor: 'white',
              color: 'primary',
              outlined: true,
              dense: true,
              readonly: true,
              icon: 'fas fa-clock',
              ...props,
              mask: ''
            },
            slot: {
              ...props
            }
          }
          break;
        case'fullDate':
          props = {
            field: {
              bgColor: 'white',
              color: 'primary',
              outlined: true,
              dense: true,
              readonly: true,
              ...props
            },
            slot: {
              mask: "YYYY-MM-DD HH:mm:ss",
              ...props
            }
          }
          //Remove mask from prop field
          delete props.field.mask
          break;
        case'select':
          props = {
            emitValue: true,
            mapOptions: true,
            outlined: true,
            dense: true,
            bgColor: 'white',
            style: 'width: 100%',
            behavior: "menu",
            ...props
          }
          props.loading = props.loading || this.loading
          break;
        case'treeSelect':
          props = {
            field: {
              appendToBody: true,
              sortValueBy: 'INDEX',
              ...props
            },
            fieldComponent: {
              outlined: true,
              dense: true,
              ...props
            }
          }
          break;
        case'html':
          props = {
            field: {
              toolbar: this.editorText.toolbar,
              contentClass: 'text-grey-9',
              toolbarTextColor: 'grey-9',
              ...props
            },
            fieldComponent: {
              outlined: true,
              dense: true,
              ...props
            }
          }
          break;
        case'multiSelect':
          props = {
            field: {
              ...props
            },
            fieldComponent: {
              outlined: true,
              dense: true,
              ...props
            }
          }
          break;
        case'checkbox':
          props = {
            field: {
              ...props
            },
            fieldComponent: {
              dense: true,
              borderless: true,
              ...props
            }
          }
          break;
        case'image':
          props = {
            field: {
              ...props
            },
            fieldComponent: {
              outlined: true,
              dense: true,
              ...props
            }
          }
          break;
        case'media':
          props = {
            field: {
              multiple: (this.field.props.zone == 'gallery') ? true : false,
              ...props,
              entityId: this.$clone(this.itemId)
            },
            fieldComponent: {
              borderless: true,
              dense: true,
              ...props
            }
          }
          break;
        case'permissions':
          props = {
            ...props
          }
          break;
        case'settings':
          props = {
            ...props
          }
          break;
        case'inputColor':
          props = {
            field: {
              bgColor: 'white',
              color: 'primary',
              outlined: true,
              dense: true,
              readonly: true,
              ...props
            },
            slot: {
              ...props
            }
          }
          break;
        case'toggle':
          props = {
            field: {
              falseValue: "0",
              trueValue: "1",
              ...props
            },
          }
          break;
        case'positionMarkerMap':
          props = {
            field: {
              ...props
            },
            fieldComponent: {
              borderless: true,
              dense: true,
              ...props
            }
          }
          break;
        case'signature':
          props = {
            field: {
              ...props,
            },
            fieldComponent: {
              borderless: true,
              dense: true,
              ...props
            }
          }
          break;
        case'uploader':
          props = {
            field: {
              emitFile: true,
              ...props,
            },
            fieldComponent: {
              borderless: true,
              dense: true,
              ...props
            }
          }
          break;
        case'rating':
          props = {
            field: {
              max: 5,
              color: 'amber',
              size: "3em",
              ...props
            },
            fieldComponent: {
              borderless: true,
              dense: true,
              ...props
            }
          }
          break;
        case'selectIcon':
          props = {
            ...props
          }
          break;
      }

      //Add ruler to required field
      if (this.field.required) {
        if (!props.rules) props.rules = []
        props.rules.push(val => !!val || this.$tr('ui.message.fieldRequired'))
      }

      //Response
      return props
    },
    //Return format of datetime
    formatDateTime() {
      let response = ''

      if (this.field.type == 'date') response = 'MMM DD, YYYY'
      if (this.field.type == 'time') response = 'HH:mm a'
      if (this.field.type == 'datetime') response = 'MMM DD, YYYY - HH:mm a'

      return response
    },
    //Convert value of options to string
    formatOptions() {
      //Convert value/id to string
      const toString = (items) => {
        items.forEach(item => {
          //Convert value and id to string
          if (item.value || item.value >= 0) item.value = item.value.toString()
          if (item.id || item.id >= 0) item.id = item.id.toString()
          //convert children
          if (item.children) item.children = toString(item.children)
        })
        //response
        return items
      }

      //response
      return toString(this.$clone(this.options))
    },
    //Return info fields readOnly
    infoReadOnly() {
      let currenResponse = this.$clone(this.responseValue)
      let response = currenResponse

      //Function to get value from select
      let valueFromSelect = () => {
        if (currenResponse && (typeof currenResponse == 'object')) {
          response = []
          currenResponse.forEach(itemValue => {
            let value = this.formatOptions.find(item => item.value == itemValue)
            if (value && value.label) response.push(value.label)
          })
          response = response.length ? response.join(', ') : false
        } else {
          response = this.formatOptions.find(item => item.value == response)
          response ? response = response.label : false
        }
      }

      //Swith type response
      switch (this.field.type) {
        case 'select':
          valueFromSelect()
          break;
        case 'treeSelect':
          valueFromSelect()
          break;
        case 'date':
          response = response ? this.$trd(response) : false
          break;
        case 'hour':
          response = response ? this.$trd(response, {type: 'time'}) : false
          break;
      }

      return response//Response
    },
    //Crud info
    crudInfo() {
      //Default response
      let response = {}

      //Get crud info
      if (this.field.validateField && this.field.validateField.crudId)
        response = this.$store.state.qcrudComponent.component[this.field.validateField.crudId] || {}

      //Response
      return response
    },
    //Custom value to response value
    customValue: {
      get() {
        let response = ''//Defualt response
        let currentValue = this.$clone(this.responseValue)

        switch (this.field.type) {
          case 'date':
            response = currentValue ? this.$trd(currentValue) : ''
            break;
          case 'hour':
            let date = this.field.withFullDate ? '' : this.$moment().format('Y-MM-DD')
            response = currentValue ? this.$trd(`${date} ${currentValue}`, {type: 'time'}) : ''
            break;
          case 'fullDate':
            response = currentValue ? this.$trd(currentValue, {type: 'long'}) : ''
            break;
        }

        //Response
        return response
      }
    },
    //Validate if field is password
    isFieldPassword() {
      let field = this.$clone(this.field)
      return (field.props.type && (field.props.type == 'password')) ? true : false
    }
  },
  methods: {
    //initi
    async init() {
      if (this.field.type) {
        this.setDefaultVModel((this.value != undefined) ? this.value : this.field.value)//Set default values by field type
        this.listenEventCrud()//config dynamic component
        this.success = true//sucess
        //Set options if is type select
        if (['treeSelect', 'select', 'multiSelect'].indexOf(this.field.type) != -1) {
          if (this.field.loadOptions) {
            await this.getOptions()
          }//Get options
          else if (this.field.props && this.field.props.options) this.rootOptions = this.field.props.options
        }
      }
    },
    //Set default values by type
    setDefaultVModel(value) {
      let propValue = this.$clone(value)
      switch (this.field.type) {
        case 'crud':
          //Get crudProps
          let crudProps = (this.field.props && this.field.props.crudProps) ? this.field.props.crudProps : {}
          //Validate if select is multiple
          if (crudProps.multiple) {
            this.responseValue = []
            //Get filter options
            let filterField = (crudProps.config && crudProps.config.options) ?
                crudProps.config.options : {label: 'title', value: 'id'}
            //if value is array, get id option
            if (propValue && Array.isArray(propValue)) {
              propValue.forEach(item => {
                if (item[filterField.value]) this.responseValue.push(item[filterField.value])
                else this.responseValue.push(item)
              })
            }
          } else this.responseValue = (propValue && propValue.id) ? propValue.id : propValue
          break;
        case 'input':
          this.responseValue = (propValue != undefined) ? propValue : null
          break
        case 'html':
          this.responseValue = propValue || ''
          break
        case 'treeSelect':
          this.orderOptions(propValue)
          break
        case 'select':
          this.orderOptions(propValue)
          break
        case 'multiSelect':
          this.responseValue = propValue || []
          break
        case 'checkbox':
          this.responseValue = (propValue !== undefined) ? propValue : null
          break
        case 'media':
          this.responseValue = propValue || {}
          break
        case 'permissions':
          this.responseValue = (propValue.length == undefined) ? propValue : {}
          break
        case 'settings':
          this.responseValue = propValue || {}
          break
        case 'search':
          this.responseValue = propValue || null
          break
        case 'toggle':
          this.responseValue = (propValue || 0).toString()
          break
        case 'positionMarkerMap':
          this.responseValue = propValue || false
          break
        case 'uploader':
          this.responseValue = (propValue !== undefined) ? propValue : null
          break
        case 'rating':
          this.responseValue = (propValue !== undefined) ? propValue : 1
          break
        case 'selectIcon':
          this.responseValue = (propValue !== undefined) ? propValue : null
          break
        default :
          this.responseValue = propValue || null
          break
      }
    },
    //Order options
    orderOptions(propValue) {
      if (propValue !== undefined) {
        if (Array.isArray(propValue)) {
          this.responseValue = []
          propValue.forEach(item => {
            let value = (typeof item == 'object') ? item.id : item
            this.responseValue.push(value.toString())
          })
        } else {
          this.responseValue = propValue ? this.$clone(propValue.toString()) : propValue
        }
      }
    },
    //Config dynamic component
    listenEventCrud() {
      setTimeout(() => {
        if (this.field.create && this.field.create.component) {
          let componentCrud = this.$refs.crudComponent
          if (componentCrud) {
            //Activate listen to chanel
            this.$root.$on(`crudForm${componentCrud.params.apiRoute}Created`, async () => {
              this.getOptions()//Get options
            })
          }
        }
      }, 500)
    },
    //Get options if is load options
    getOptions(query = false) {
      return new Promise((resolve, reject) => {
        let loadOptions = this.$clone(this.field.loadOptions || {})
        this.loading = true//Open loading
        //==== Request options
        if (loadOptions.apiRoute) {
          this.rootOptions = []//Reset options
          let fieldSelect = {label: 'title', id: 'id'}

          let params = {//Params to request
            refresh: true,
            params: loadOptions.requestParams || {}
          }

          //add filter
          if (!params.params.filter) params.params.filter = {}
          params.params.filter.allTranslations = true

          //Add Params to get options by query
          if (loadOptions && loadOptions.filterByQuery) {
            if (query && (query.length > 2)) {
              params.params.filter.search = query
              params.params.take = 25
            } else {
              this.loading = false
              return resolve(false)
            }
          }

          //Request
          this.$crud.index(loadOptions.apiRoute, params).then(response => {
            this.rootOptionsData = this.$clone(response.data)
            let formatedOptions = []
            //Format response
            formatedOptions = this.field.type == 'select' ?
                this.$array.select(response.data, loadOptions.select || fieldSelect) :
                this.$array.tree(response.data, loadOptions.select || fieldSelect)

            //Assign options
            this.rootOptions = (this.field.props && this.field.props.options) ?
                this.$clone((this.field.props.options || []).concat(formatedOptions)) : formatedOptions
            this.loading = false
            resolve(true)
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
            reject(true)
          })
          //==== Delayed loading options
        } else if (loadOptions.delayed) {
          loadOptions.delayed.then(response => {
            this.rootOptions = this.$clone(response)
            this.loading = false
            resolve(true)
          }).catch(error => {
            this.loading = false
            resolve(true)
          })
        } else {
          this.loading = false
          resolve(true)
        }
      })
    },
    //Regex to tags
    matchTags(field) {
      if (field.props.useChips && field.matchTags) {
        let tags = []
        //only letters and spaces
        this.responseValue.forEach((tag, index) => {
          let tagString = tag.trim()//Trim
          tagString = tagString.match(/^[a-zA-Z\-\s]*$/)//Regex
          if (tagString && tagString.length) tags.push(tagString.join(''))
        })
        this.responseValue = this.$clone(tags)
      }
    },
    //Check if value change
    watchValue() {
      let value = this.$clone(this.value)
      let response = this.$clone(this.responseValue)

      if (JSON.stringify(value) !== JSON.stringify(response)) {
        this.$emit('input', response)
      }
    },
    //Validate if show  field
    loadField(name) {
      let response = true
      let field = this.$clone(this.field)

      //Validate type field
      if (field.type !== name) response = false
      //Validate permission
      if (field.permission && !this.$auth.hasAccess(field.permission)) response = false
      //Validate vIf prop
      if (response && field.props && (field.props.vIf != undefined)) response = field.props.vIf

      //Response
      return response
    },
    //Validate fields
    validateField(val) {
      return new Promise((resolve, reject) => {
        let ruleResponse = true || 'update'//Default rule response
        let crudInfo = this.$store.state.qcrudComponent.component[this.crudId] || {}
        //Request Params
        let requestParams = {
          refresh: true,
          params: this.field.validateField.requestParams || {}
        }
        //Set default filter
        requestParams.params.filter = {field: 'title', ...(requestParams.params.filter || {})}

        //Request
        this.$crud.show(this.field.validateField.apiRoute, val, requestParams).then(response => {
          if (response.status == 200) {
            //Already exist
            ruleResponse = false || this.$tr('ui.message.fieldAlreadyExist')
            //Validate if compare with crudInfo
            if (this.crudInfo && (this.crudInfo.typeForm == 'update') && (this.crudInfo.id == response.data.id))
              ruleResponse = true || 'update'
          }
          resolve(ruleResponse)
        }).catch(error => {
          console.error(error)
          resolve(ruleResponse)
        })
      })
    },
    //filter Select
    async filterSelectOptions(val, update, abort) {
      //Get params
      let loadOptions = this.field.loadOptions

      //Filter By Query
      if (loadOptions && loadOptions.filterByQuery) {
        await this.getOptions(val)
        update()
      } else {//Filter current options
        update(async () => {
          this.options = this.$helper.filterOptions(val, this.rootOptions, this.responseValue)
        })
      }
    }
  }
}
</script>
<style lang="stylus">
#dynamicFieldComponent
  .checkbox-field
    .q-field__control-container
      padding-top 0 !important

  .field-no-padding
    .q-field__control
      padding 0 !important

      .q-field__control-container
        padding 0 !important

  .vue-treeselect
    .vue-treeselect__control
      background transparent !important
      border 0
      max-height 26px
      padding 0

      .vue-treeselect__single-value
        line-height 1.9
        padding 0

#ckEditorComponent
  width 100%
</style>
