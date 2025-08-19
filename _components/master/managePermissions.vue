<template>
  <q-card id="componentSelectPermissions" class="no-shadow col-12"
          v-if="$hasAccess('iuser.permissions.manage')">
    <!--===== Title =====-->
    <div>
      <div 
          class="
            row 
            justify-between 
            items-center 
            tw-border 
            tw-border-gray-300 
            tw-p-1 tw-rounded-xl
            tw-cursor-pointer
          "
          @click="modal.show = true"
        >
        <!--Title-->
        <div class="tw-text-base tw-text-gray-500 tw-flex tw-items-center">
          <i class="fa-light fa-shield-keyhole tw-mx-2" />
          <span>{{this.$trp('isite.cms.label.permission')}}</span>
        </div>
        <!--Loading-->
        <q-spinner v-if="loading" color="blue-grey" :size="30"/>
        <!--Toogle list-->
        <q-btn 
          icon="fa-regular fa-pen-to-square" 
          size="sm" @click="modal.show = true" flat round
          color="secondary" v-else-if="Object.keys(modal.listPermissions).length"
        />
      </div>
    </div>

    <!--===== Dialog Content =====-->
    <q-dialog
      v-model="modal.show" 
      v-if="modal.show" 
      no-esc-dismiss 
      no-backdrop-dismiss
    >
      <q-card 
        class="
          tw-flex 
          tw-flex-col 
          tw-gap-6
          tw-p-5 
          md:tw-min-w-[524px] 
          md:!tw-max-w-3xl 
          !tw-rounded-xl
          no-shadow
        "
      >
        <!--== Header == -->
        <q-toolbar class="tw-p-0 text-blue-grey">
          <q-toolbar-title class="tw-flex tw-items-center">
            <i class="fa-light fa-shield-keyhole tw-mr-3"></i>
            <h2 class="tw-text-lg tw-font-bold tw-m-0">
              {{ this.$trp('isite.cms.label.permission') }}
            </h2>
          </q-toolbar-title>
          <q-btn flat round dense v-close-popup size="16px">
            <i class="fas fa-times"></i>
          </q-btn>
        </q-toolbar>

        <!--=== Content ===-->
        <!--== Filters ==-->
        <section class="tw-flex tw-items-center tw-gap-3.5 tw-flex-col md:tw-flex-row">
          <!--By Module-->
          <q-select 
            outlined dense v-model="modal.filter.module" :options="optionsModule"
            :label="$tr('isite.cms.label.module')" popup-content-class="text-capitalize"
            class="tw-w-full text-capitalize" emit-value map-options
          />
  
          <!--By entity-->
          <q-select
            outlined dense v-model="modal.filter.entity" :options="optionsEntity"
            :label="$tr('isite.cms.label.entity')" popup-content-class="text-capitalize"
            class="tw-w-full text-capitalize" emit-value map-options
          />
        </section>

        <section class="tw-flex tw-flex-col tw-gap-3.5">
          <p class="tw-text-base tw-text-gray-400 tw-font-semibold">
            {{ $tr('isite.cms.label.bulkPermissions') }}
          </p>
          <q-btn-toggle
            class="tw-rounded-lg border-toggle"
            unelevated
            v-model="modal.change.type"
            @click="changePermissionsMassively"
            :toggle-color="toggleColor(modal.change.type)"
            color="grey-2" 
            size="14px"
            text-color="grey-8"
            :options="options.typeChange"
            no-caps
          />
        </section>

        <section v-if="!modal.filter.entity == '0'">
          <p class="tw-text-base tw-text-gray-400 tw-font-semibold tw-mb-3.5">
            {{ $tr('isite.cms.label.entityPermissions') }}
          </p>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3.5">
            <div
              v-for="(permission, permissionName) in modal.listPermissions[modal.filter.module][modal.filter.entity]"
              :key="permissionName"
              :label="permissionName" 
              class="tw-flex tw-flex-col tw-gap-2.5"
            >
              <!--Title-->
              <p class="tw-font-medium">{{ permissionName }}</p>
              <!--Actions-->
              <q-btn-toggle
                class="tw-rounded-lg"
                unelevated
                v-model="modal.listPermissions[modal.filter.module][modal.filter.entity][permissionName]"
                :toggle-color="toggleColor(modal.listPermissions[modal.filter.module][modal.filter.entity][permissionName])"
                color="grey-2" 
                size="14px"
                text-color="grey-8"
                :key="permissionName"
                :options="options.status"
                no-caps
              />
            </div>
          </div>
        </section>

        <!--btn to apply changes-->
        <div class="tw-flex tw-justify-end">
          <q-btn
            v-close-popup
            :label="$tr('isite.cms.label.close')" 
            rounded unelevated color="green-5" 
            @click="changePermissions()"
            no-caps
          />
        </div>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
  export default {
    props: {
      modelValue: {
        type: Object, default: () => {
          return {}
        }
      },
      allowInherit: {default: false},
      apiRoute: {
        type: String, 
        default: ''
      }
    },
    emits: ['update:modelValue'],
    watch: {
      modelValue: {
        handler: function (newValue, oldValue) {
          if (JSON.stringify(newValue) !== JSON.stringify(this.getPermissions()))
            this.formatPermissions()
        },
        deep: true
      },
      'modal.listPermissions': {
        handler: function () {
          if (Object.keys(this.modal.listPermissions).length) {
            this.$emit('update:modelValue', this.getPermissions())//Emit permissions
          }
        },
        deep: true
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: true,
        dataPermission: [],
        modal: {
          show: false,
          filter: {module: null, entity: null},
          listPermissions: [],
          tab: 'filter',
          change: {
            type: '',
          }
        }
      }
    },
    computed: {
      //Return options of module names
      optionsModule() {
        let optionsResponse = [{label: this.$tr('isite.cms.label.all'), value: 0}]
        let options = Object.keys(this.modal.listPermissions).sort()

        if (options && options.length) {
          //Create object to select with modules name
          options.forEach(item => {
            optionsResponse.push({label: item, value: item})
          })
          //set default filter
          this.modal.filter.module = 0
        }

        return optionsResponse//Response
      },
      //Return options of entity name
      optionsEntity() {
        let optionsResponse = [{label: this.$tr('isite.cms.label.all'), value: 0}]
        let filterModule = this.modal.filter.module

        if (filterModule) {
          let options = Object.keys(this.modal.listPermissions[filterModule]).sort()

          if (options && options.length) {
            //Create object to select with modules name
            options.forEach(item => {
              optionsResponse.push({label: item, value: item})
            })
            //set default filter
            this.modal.filter.entity = 0
          }
        }

        if (filterModule == 0) this.modal.filter.entity = 0

        return optionsResponse//Response
      },
      //Ootions to toggle buttons
      options() {
        let response = {
          typeChange: [
            {label: this.$tr('isite.cms.label.allow'), slot: 'allow', value: 'allow'},
            {label: this.$tr('isite.cms.label.inherit'), value: 'inherit'},
            {label: this.$tr('isite.cms.label.deny'), slot: 'deny', value: 'deny'},
          ],
          typeApply: [
            {label: this.$tr('isite.cms.label.all'), value: 'all'},
            ...this.optionsModule
          ],
          status: [
            {label: this.$tr('isite.cms.label.allow'), value: true},
            {label: this.$tr('isite.cms.label.inherit'), value: 0},
            {label: this.$tr('isite.cms.label.deny'), value: false}
          ]
        }

        //Remove status inherit
        if (!this.allowInherit) response.status.splice(1, 1)
        if (!this.allowInherit) response.typeChange.splice(1, 1)

        return response//Response
      }
    },
    methods: {
      //Init
      async init() {
        await this.getData()//Get permissions
        this.formatPermissions()//Format to permissions
      },
      //Get data
      getData() {
        return new Promise((resolve, reject) => {
          this.loading = true
          let configName = 'apiRoutes.qsite.permissions'

          //Request
          this.$crud.index(configName, {
            params: {
              configNameByModule: 1,
              configName: 'permissions'
            },
            refresh: true
          }).then(response => {
            this.loading = false
            this.dataPermission = response.data
            resolve(response.data)
          }).catch(error => {
            this.$apiResponse.handleError(error, () => {
              this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
              this.loading = false
              resolve([])
            })
          })
        })
      },
      //Order permissions as list to render
      formatPermissions() {
        //v12
        Object.keys(this.dataPermission).forEach(moduleName => {
          Object.keys(this.dataPermission[moduleName]).forEach(category => {
            Object.keys(this.dataPermission[moduleName][category]).forEach(action => {
              this.dataPermission[moduleName][category][action] = this.dataPermission[moduleName][category][action]['title']
            })
          })
        })
        let permissions = this.$clone(this.dataPermission)
        this.modal.listPermissions = []
        let listToRender = {}//Default List to render

        if (Object.keys(permissions).length) {
          Object.keys(permissions).forEach(moduleName => {
            let module = this.$clone(permissions[moduleName])//Get module permission
            Object.keys(module).forEach(entityName => {
              let permissionNames = entityName.split('.')
              let entityPermissionName = permissionNames[1] || permissionNames[0]
              if (!listToRender[permissionNames[0]]) listToRender[permissionNames[0]] = {}//Create moduleName
              listToRender[permissionNames[0]][entityPermissionName] = {} //Create entityName of module
              let entity = module[entityName]//Get data entity
              Object.keys(entity).forEach(permissionName => {
                let permissionFullName = `${entityName}.${permissionName}`//Get fullname of permission
                //Get value of permission
                let valuePermission = this.$clone(this.modelValue[permissionFullName])//Find in value prop
                if (typeof (valuePermission) != 'boolean') valuePermission = (this.allowInherit ? 0 : false)
                //Add to response
                listToRender[permissionNames[0]][entityPermissionName][permissionName] = this.$clone(valuePermission)
              })
            })
          })
          this.modal.listPermissions = this.$clone(listToRender) //Set in modal listPermissions
        }
      },
      //validate if show entity list
      showEntity(entity) {
        if (!this.modal.filter.entity) return true
        return (this.modal.filter.entity == entity) ? true : false
      },
      //Change permissions
      changePermissions() {
        if (this.modal.filter.module == 0 || this.modal.filter.entity == 0) {
          let type = this.$clone(this.modal.change.type)//Get type of change
          let module = this.$clone(this.modal.filter.module)//Get option to apply
          let permissions = this.$clone(this.modal.listPermissions)//Clone current permissions
          let permissionsToChange = {}//To response
  
          //Define value to change permissions
          let valuePermission = (type == 'allow') ? true : ((type == 'deny') ? false : 0)
  
          //Filter only by module or all modules to change
          if (module == 0) permissionsToChange = permissions
          else permissionsToChange[module] = permissions[module]
  
          //Apply change to all permissions
          for (let moduleName in permissionsToChange) {
            let moduleValues = permissions[moduleName]
            for (let entityName in moduleValues) {
              let entityValues = permissions[moduleName][entityName]
              for (let permissionName in entityValues) {
                permissions[moduleName][entityName][permissionName] = valuePermission
              }
            }
          }

          this.modal.listPermissions = this.$clone(permissions)//Set new permissions
        }

        this.$alert.info('Click "Update" to save the permission changes')//Message success
      },
      //Return permission with format to backend
      getPermissions() {
        let permissions = this.$clone(this.modal.listPermissions)
        let responsePermissions = {}

        //Format permissions with format to backend
        for (let moduleName in permissions) {
          for (let entityName in permissions[moduleName]) {
            for (let permissionName in permissions[moduleName][entityName]) {
              //Get fullName of permission
              let fullName = (moduleName.toLowerCase() == 'dashboard') ?
                (`${moduleName}.${permissionName}`).toLowerCase() :
                (`${moduleName}.${entityName}.${permissionName}`).toLowerCase()

              let valuePermission = permissions[moduleName][entityName][permissionName]

              //If allow inherit, only set item with different value 0(inherit)
              if (this.allowInherit && (valuePermission !== 0))
                responsePermissions[fullName] = valuePermission

              //If not allow inherit, only set item with value true(allow)
              if (!this.allowInherit && valuePermission)
                responsePermissions[fullName] = valuePermission
            }
          }
        }

        return responsePermissions//Response
      },
      changePermissionsMassively() {
        if (this.modal.filter.entity == 0) return
        const permissionValues = {
          'allow': true,
          'inherit': 0,
          'deny': false
        }
        const entity = this.modal.listPermissions[this.modal.filter.module][this.modal.filter.entity]
        Object.keys(entity).map(permission => {
          entity[permission] = permissionValues[this.modal.change.type]
        })
      },
      toggleColor(value) {
        if (value === 'allow' || value === true) return 'green-5'
        if (value === 'inherit' || value === 0) return 'light-blue-6'
        if (value === 'deny' || value === false) return 'red-5'
      }
    }
  }
</script>
<style lang="scss">
  .border-toggle > button:nth-child(1) {
    @apply tw-border-r tw-border-gray-200 tw-border-solid;
  }

  .border-toggle > button:nth-child(3) {
    @apply tw-border-l tw-border-gray-200 tw-border-solid;
  }
</style>
