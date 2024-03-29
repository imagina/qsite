<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!-- search geolocation -->
    <q-select :options="geolocations" v-model="address" emit-value behavior="menu" input-debounce="700"
              use-input map-options outlined dense bg-color="white" :label="label" clearable class="q-mb-md"
              @filter="filterFn" @input="emitResponseValue" :loading="searchLoading" v-if="!readOnly"
              hint="eg. Avenida la francia, calle San Bernando 34..."/>

    <!--Map-->
    <l-map id="lMap" v-if="success && center" :zoom="mapZoom" :center="center"
           :style="`height : ${height}`" ref="map" @click="mapClickEvent">
      <!--Layer-->
      <l-tile-layer name="OpenStreetMap" layer-type="base" :token="token"
                    attribution='&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <!--Marker-->
      <l-marker v-if="marker" :lat-lng="marker"/>
    </l-map>
  </div>
</template>

<script>
import {Icon, latLng} from "leaflet";
import {LMap, LMarker, LTileLayer} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {OpenStreetMapProvider} from 'leaflet-geosearch'

export default {
  components: {LMap, LTileLayer, LMarker},
  props: {
    value: {default: false},
    type: {default: 'positionMarkerMap'},
    height: {default: '400px'},
    label: {default: ''},
    readOnly: {type: Boolean, default: false},
    defaultCenter: {
      default: () => {
        return {lat: '4.642129714308486', lng: '-74.11376953125001' }
      }
    },
    emitDefault: {type: Boolean, default: false}
  },
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setDefaultValue()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  data() {
    return {
      selectValue: null,
      success: false,
      responseValue: false,
      center: false,
      mapZoom: 8,
      marker: false,
      searchLoading: false,
      searchProvider: new OpenStreetMapProvider({params: {countrycodes: this.countries}}),
      address: null,
      searchAddressValue: null,
      geolocations: [],
      markPoint: false,
    }
  },
  computed: {
    //Return token to map
    token() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('isite::api-open-street-maps')
    },
    //Emit response value
    emitResponseValue() {
      if (this.address) {
        this.marker = latLng(this.address.lat, this.address.lng)//Set default marker value
        this.center = this.$clone(this.marker)//Set default center
        this.mapZoom = 15//Change map zoom
        this.$emit('input', this.$clone(this.address))
      }
    },
    //Return the countries enables for the site
    countries() {
      const value = this.$store.getters['qsiteApp/getSettingValueByName']('ilocations::availableCountries')|| ["co"]
      return value.map(val => val.toLowerCase())
    }
  },
  methods: {
    init() {
      this.setDefaultValue()//Set default values
      this.fixMarkerIconImage()//Fix marker icon
    },
    //Set default values
    async setDefaultValue() {
      if (!this.marker) this.success = false//Reset map
      let center = [this.defaultCenter.lat, this.defaultCenter.lng]//Default center

      //Validate map types
      switch (this.type) {
          //Set default value and response value
        case 'positionMarkerMap':
          if (this.value) {
            this.address = this.$clone(this.value)//Set default value
            if (this.address.lat) {
              this.marker = latLng(this.address.lat, this.address.lng)//Set default marker value
              center = this.$clone(this.marker)//Set default center
            } else {
              this.address = {title: this.value, lat: center[0], lng: center[1]}
            }
            this.mapZoom = 15//Change map zoom
            this.geolocations.push({
              label: this.address.title,
              value: this.address,
            })
          }
          break;
      }
      setTimeout(() => {
        this.center = this.$clone(center)//Set default center
        this.success = true//Reset map
        if(this.emitDefault){
          this.mapZoom = 8
          this.$emit('input', this.$clone({lat: this.defaultCenter.lat, lng: this.defaultCenter.lng}))
        }
      }, 500)
    },
    //Fix marker icon image
    fixMarkerIconImage() {
      delete Icon.Default.prototype._getIconUrl;
      Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    },
    filterFn(val, update, abort) {
      update(async () => {
        await this.searchLocations(val)
      })
    },
    //Search location
    async searchLocations(val) {
      this.searchLoading = true
      await this.searchProvider.search({query: val}).then((results) => {
        this.geolocations = results.map(item => {
          return {
            label: item.label,
            value: {
              title: item.label,
              lat: item.y,
              lng: item.x,
            }
          }
        })
        this.searchLoading = false
      }).catch(e => {
        this.searchLoading = false
      })
    },
    //Handler to click over map
    mapClickEvent(event) {
      switch (this.type) {
          //Set lat-lng to response value
        case 'positionMarkerMap':
          this.markPoint = true
          this.address = {title: '', lat: event.latlng.lat, lng: event.latlng.lng}
          this.marker = this.$clone(event.latlng)
          break;
      }

      //Emit response
      this.emitResponseValue
    }
  }
}
</script>

<style lang="stylus">
#mapLeafletcomponent
  #lMap
    width 100%
</style>
