<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!--Label-->
    <div class="text-grey-9 text-capitalize" v-if="label">{{label}}</div>
    <!--Map-->
    <l-map id="lMap" v-if="success && center" :zoom="mapZoom" :center="center" @click="mapClickEvent"
           :style="`height : ${height}`">
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
  import {latLng, Icon} from "leaflet";
  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
  import 'leaflet/dist/leaflet.css';

  export default {
    components: {LMap, LTileLayer, LMarker},
    props: {
      value: {default: false},
      type: {default: 'positionMarkerMap'},
      height: {default: '400px'},
      label: {default: false}
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
        success: false,
        responseValue: false,
        center: false,
        mapZoom: 8,
        marker: false
      }
    },
    computed: {
      //Return token to map
      token() {
        return this.$store.getters['qsiteApp/getSettingValueByName']('isite::api-maps')
      },
      //Emit response value
      emitResponseValue() {
        this.$emit('input', this.$clone(this.responseValue))
      }
    },
    methods: {
      init() {
        this.setDefaultValue()//Set default values
        this.fixMarkerIconImage()//Fix marker icon
      },
      //Set default values
      setDefaultValue() {
        if (!this.marker) this.success = false//Reset map
        let center = ['4.642129714308486', '-74.11376953125001']//Default center

        //Validate map types
        switch (this.type) {
          //Set default value and response value
          case 'positionMarkerMap':
            if (this.value) {
              this.responseValue = this.$clone(this.value)//Set default value
              this.marker = this.$clone(this.value)//Set default marker value
              center = this.$clone(this.value)//Set default center
              this.mapZoom = 15//Change map zoom
            }
            break;
        }

        setTimeout(() => {
          this.center = this.$clone(center)//Set default center
          this.success = true//Reset map
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
      //Handler to click over map
      mapClickEvent(event) {
        switch (this.type) {
          //Set lat-lng to response value
          case 'positionMarkerMap':
            this.responseValue = [event.latlng.lat, event.latlng.lng]
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
