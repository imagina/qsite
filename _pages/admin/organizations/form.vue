<template>
  <div id="organizationFormPage">
    <!--Content-->
    <div v-if="organizationIdLocal" id="pageContent">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="pageTitle" @refresh="getData(true)"/>
      </div>
      <!--Activities-->
      <div id="adminHomeActivities" class="col-12 q-mb-md">
        <activities system-name="admin_home_actions" view="cardImage"/>
      </div>
      <!--Form-->
      <div class="relative-position">
        <!--dynamic form-->
        <dynamic-form v-model="form" :blocks="blocks.blocks" form-type="grid"
                      @submit="syncOrganization" :item-id="organization.id" :form-col-number="2"/>
        <!--Inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
    <!--Empty conten-->
    <div v-else class="box box-auto-height text-center">
      <div class="q-py-md">
        <q-icon name="fal fa-crown" size="40px" color="primary" class="q-mb-md"/>
        <div>{{ $tr('isite.cms.messages.noOrganization') }}...</div>
      </div>
    </div>
  </div>
</template>
<script>
import layoutStore from 'modules/qsite/_store/layoutStore.js'

export default {
  beforeUnmount() {
    layoutStore().setValueLayoutList([])
  },
  props: {
    organizationId: {default: null}
  },
  components: {},
  watch: {
    '$route.params.id'(organizationId) {
      this.init()
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      organization: false,
      crudData: false,
      form: {},
    }
  },
  computed: {
    blocks() {
      const layoutList = layoutStore().getLayoutsList();
      const data = {
        blocks: [
          {
            "title": this.$tr("isite.cms.crudMySite.information.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.information.title"),
              description: this.$tr("isite.cms.crudMySite.information.description")
            },
            "name": "information",
            "fields": {
              "title": {
                "value": null,
                "type": "input",
                "isTranslatable": true,
                "required": true,
                "props": {
                  "label": `${this.$tr("isite.cms.form.name")}*`
                }
              },
              "categoryId": {
                "value": null,
                "type": "treeSelect",
                "required": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.category")}*`
                },
                "loadOptions": {
                  "apiRoute": "apiRoutes.qsite.categories"
                }
              },
              "description": {
                "value": null,
                "type": "html",
                "isTranslatable": true,
                "colClass": "col-12",
                "required": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.description")}*`
                }
              }
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.socialNetworks.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.socialNetworks.title"),
              description: this.$tr("isite.cms.crudMySite.socialNetworks.description")
            },
            "name": "socialNetworks",
            "fields": {
              "email": {
                "value": null,
                "type": "input",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.email")}`
                }
              },
              "facebook": {
                "value": null,
                "type": "input",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.facebook")}`
                }
              },
              "instagram": {
                "value": null,
                "type": "input",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.instagram")}`
                }
              },
              "youtube": {
                "value": null,
                "type": "input",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.label.youtube")}`
                }
              },
              "phones": {
                "value": null,
                "type": "select",
                "colClass": "col-12",
                "isTranslatable": true,
                "props": {
                  "label": this.$tr("isite.cms.form.phone"),
                  "useInput": true,
                  "useChips": true,
                  "multiple": true,
                  "hideDropdownIcon": true,
                  "newValueMode": "add-unique"
                }
              },
              "whatsapp1": {
                "name": "whatsapp1",
                "label": "Whatsapp #1",
                "isTranslatable": true,
                "multiple": true,
                "children": {
                  "calling_code": {
                    "value": null,
                    "type": "select",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.label.codeCountry")
                    },
                    "loadOptions": {
                      "apiRoute": "apiRoutes.qlocations.countries",
                      "select": {
                        "label": "name",
                        "id": "callingCode"
                      }
                    }
                  },
                  "number": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.label.whatsappNumber"),
                      "type": "number"
                    }
                  },
                  "message": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-12",
                    "props": {
                      "label": this.$tr("isite.cms.label.defaultMessage")
                    }
                  },
                  "label": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": "Etiqueta"
                    }
                  },
                  "iconLabel": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.form.icon")
                    }
                  }
                }
              },
              "whatsapp2": {
                "name": "whatsapp2",
                "label": "Whatsapp #2",
                "isTranslatable": true,
                "multiple": true,
                "children": {
                  "calling_code": {
                    "value": null,
                    "type": "select",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.label.codeCountry"),
                    },
                    "loadOptions": {
                      "apiRoute": "apiRoutes.qlocations.countries",
                      "select": {
                        "label": "name",
                        "id": "callingCode"
                      }
                    }
                  },
                  "number": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.label.whatsappNumber"),
                      "type": "number"
                    }
                  },
                  "message": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-12",
                    "props": {
                      "label": this.$tr("isite.cms.label.defaultMessage"),
                    }
                  },
                  "label": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": "Etiqueta"
                    }
                  },
                  "iconLabel": {
                    "value": null,
                    "type": "input",
                    "colClass": "col-6",
                    "props": {
                      "label": this.$tr("isite.cms.form.icon"),
                    }
                  }
                }
              }
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.media.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.media.title"),
              description: this.$tr("isite.cms.crudMySite.media.description")
            },
            "name": "media",
            "fields": {
              "logo": {
                "name": "mediasSingle",
                "value": [],
                "type": "media",
                "colClass": "col-12",
                "fieldItemId": this.organization.id,
                "props": {
                  "label": "Logo",
                  "zone": "mainimage",
                  "entity": "Modules\\Isite\\Entities\\Organization",
                  "entityId": null,
                  "accept": "images"
                }
              }
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.colors.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.colors.title"),
              description: this.$tr("isite.cms.crudMySite.colors.description")
            },
            "name": "colors",
            "fields": {
              "colorPrimary": {
                "value": "#420b0b",
                "type": "inputColor",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.form.primaryColor")}*`
                }
              },
              "colorSecondary": {
                "value": "#8b2d2d",
                "type": "inputColor",
                "isTranslatable": true,
                "props": {
                  "label": `${this.$tr("isite.cms.form.secondaryColor")}*`
                }
              }
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.schedule.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.schedule.title"),
              description: this.$tr("isite.cms.crudMySite.schedule.description")
            },
            "name": "schedule",
            "fields": {
              "schedule": {
                "value": null,
                "type": "schedulable",
                "colClass": "col-12",
                "props": {
                  "label": `${this.$tr("isite.cms.label.schedule")}*`
                }
              }
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.meta.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.meta.title"),
              description: this.$tr("isite.cms.crudMySite.meta.description")
            },
            "name": "meta",
            "fields": {
              tags: {
                value: [],
                type: 'select',
                colClass: 'col-12',
                props: {
                  label: this.$trp('isite.cms.form.tag'),
                  useInput: true,
                  useChips: true,
                  multiple: true,
                  hideDropdownIcon: true,
                  inputDebounce: "0",
                  newValueMode: "add-unique"
                }
              },
            }
          },
          {
            ...layoutList,
            name: "layouts",
            title: this.$tr("isite.cms.crudMySite.layouts.title"),
            help: {
              title: this.$tr("isite.cms.crudMySite.layouts.title"),
              description: this.$tr("isite.cms.crudMySite.layouts.description")
            }
          },
          {
            "title": this.$tr("isite.cms.crudMySite.location.title"),
            "help": {
              title: this.$tr("isite.cms.crudMySite.location.title"),
              description: this.$tr("isite.cms.crudMySite.location.description")
            },
            "name": "location",
            "fields": {
              "provinceId": {
                "value": null,
                "type": "select",
                "isTranslatable": true,
                "colClass": "col-12",
                "props": {
                  "label": this.$tr("isite.cms.form.province")
                },
                "loadOptions": {
                  "apiRoute": "apiRoutes.qlocations.provinces",
                  "select": {
                    "label": "name",
                    "id": "id"
                  },
                  "requestParams": {
                    "filter": {
                      "allTranslations": true,
                      "country": 48
                    }
                  },
                  "filterByQuery": true
                }
              },
              "cityId": {
                "value": null,
                "type": "select",
                "isTranslatable": true,
                "colClass": "col-12",
                "props": {
                  "label": this.$tr("isite.cms.form.city"),
                  "readonly": false
                },
                "loadOptions": {
                  "apiRoute": "apiRoutes.qlocations.cities",
                  "select": {
                    "label": "name",
                    "id": "id"
                  },
                  "requestParams": {
                    "filter": {
                      "allTranslations": true,
                      "country": 48
                    }
                  },
                  "filterByQuery": true
                }
              },
              "address": {
                "value": null,
                "type": "input",
                "colClass": "col-12",
                "isTranslatable": true,
                "props": {
                  "label": this.$tr("isite.cms.form.address")
                }
              },
              "map": {
                "value": null,
                "type": "positionMarkerMap",
                "colClass": "col-12",
                "isTranslatable": true,
                "props": {
                  "label": this.$tr("isite.cms.label.map")
                }
              }
            }
          }
        ]
      }
      return data;
    },
    pageTitle() {
      return this.$tr(this.$route.meta.title)
    },
    //Organization data
    organizationIdLocal() {
      return this.$clone(this.organizationId || this.$route.params.id)
    }
  },
  methods: {
    init() {
      this.getData(true)
    },
    //Get data
    getData(refresh = false) {
      return new Promise(async resolve => {
        this.loading = true
        try {
          await Promise.all([
            this.getOrganizationData(refresh),
            layoutStore().getLayouts()
          ])
          await this.getSubscriptionData(true, this.organization.userId)
        } catch (e) {
          this.$alert.error({message: this.$tr('isite.cms.message.errorRequest')})
        }
        this.loading = false
      })
    },
    //get organizations data
    getOrganizationData(refresh = false) {
      return new Promise((resolve, reject) => {
        //Validate if user has a organization
        if (!this.organizationIdLocal) return resolve(null)
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'fields,schedule.workTimes,tags',
            filter: {allTranslations: true}
          }
        }
        //Request
        this.$crud.show('apiRoutes.qsite.organizations', this.organizationIdLocal, requestParams).then(response => {
          this.organization = this.$clone(response.data)
          this.form = this.$clone(response.data)
          layoutStore().setSelectedLayout(response.data.layoutId);
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            reject(error)
          })
        })
      })
    },
    //Syn organization data
    syncOrganization() {
      return new Promise((resolve, reject) => {
        const layoutId = layoutStore().getSelectedLayout();
        if (layoutId) {
          this.form.layoutId = layoutId;
          layoutStore().setSelectedLayout(layoutId);
        }
        this.loading = true
        //Request
        this.$crud.update('apiRoutes.qsite.organizations', this.organization.id, this.form).then(response => {
          this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
          this.loading = false
          layoutStore().setSelectedFile();
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.loading = false
        })
      })
    },
    //get Subscriptions data by user
    getSubscriptionData(refresh = false, userId) {
      return new Promise((resolve, reject) => {
        //Validate if user has a organization
        if (!userId) return resolve(null)
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'plan',
            filter: {
              field: 'entity_id',
              entity: "Modules\\User\\Entities\\Sentinel\\User"
            }
          }
        }
        //Request
        this.$crud.show('apiRoutes.qplan.subscriptions', userId, requestParams).then(response => {
          const layousByPlan = response?.data?.plan?.options?.layouts ?? [];
          this.filteredLayouts(layousByPlan)
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            reject(error)
          })
        })
      })
    },
    //Filter layouts
    filteredLayouts(layoutsName = []) {
      const storeLayout = layoutStore();
      //Get all layouts
      const layouts = storeLayout.getAllLayouts()
      //Filter only layouts that have the user
      const filteredLayouts = layouts.filter(layout => layoutsName.includes(layout.systemName))
      //Map layouts to save in layoutList
      const mapLayouts = storeLayout.mapLayoutsList(filteredLayouts)
      //Save layouts in layoutList
      storeLayout.setValueLayoutList(mapLayouts)
    }
  },
}
</script>
<style lang="scss">
</style>
