<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!--map--->
    results: {{ results }}
    <div :id="mapId" :style="`width: 100%; height : ${height}`">
      <!-- search geolocation -->          
      <div id="leaflet-search-box">       
        <q-select
          v-if="!readOnly"
          v-model="address"
          class="leaflet-search-box-input"
          for="leaflet_search_input"
          :options="geolocations"
          :loading="searchLoading"          
          :label="label"          
          behavior="menu"
          input-debounce="500"
          bg-color="white"
          hide-dropdown-icon        
          clearable
          use-input
          emit-value
          map-options
          @clear="geolocations = []"
          @filter="filterFn"
          @update:modelValue="emitResponseValue()"
        />
      </div>    
    </div>
    <p>
      address {{ address }}      
      <br>
      modelValue {{ modelValue }}  
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';
import "./plugins/fullscreen/Leaflet.fullscreen.js"
import "./plugins/fullscreen/Leaflet.fullscreen.css"
import "./plugins/editable/Leaflet.Editable.js"

export default defineComponent({
  props: {
    modelValue: {default: false},
    type: {default: false},
    mapId: { default: 'map'},
    height: {default: '400px'},
    label: {default: ''},
    readOnly: {type: Boolean, default: false},
    defaultCenter: {
      default: () => {
        return {lat: '4.6529539', lng: '-74.0835643' }
      }
    },
    emitDefault: {type: Boolean, default: false},
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#leaflet-search-box{
  position: absolute;
  top: 0;
  z-index: 1000;  
  width: 100%;
  width: 100%;
  height: 64px;
  width: 100%;  
  height: 64px;
  display: grid;
  justify-content: center;  
  padding-top: 10px;
}

.leaflet-search-box-input {
  width: 380px;
}
</style>
