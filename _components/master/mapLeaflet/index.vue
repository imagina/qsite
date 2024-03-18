<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!--map--->
    <div :id="mapId" :style="`width: 100%; height : ${height}`">
      <!-- search geolocation -->
      <div id="leaflet-search-box">
        <q-select
          v-if="!readOnly"
          v-show="showSearch"
          v-model="address"
          class="leaflet-search-box-input"
          input-class="q-pa-md"
          popup-content-class="leaflet-search-box-input"
          for="leaflet_search_input"
          :options="geolocations"
          :loading="searchLoading"
          behavior="menu"
          input-debounce="500"
          bg-color="white"
          hide-dropdown-icon        
          clearable
          use-input
          emit-value
          map-options
          square          
          dense
          @clear="geolocations = []"
          @filter="filterFn"
          @update:modelValue="emitResponseValue()"
        >
        <template v-slot:append v-if="address == null  || address == ''">
          <div class="q-pa-xs">
            <i class="fa-light fa-magnifying-glass fa-md"></i>
          </div>
        </template>
        </q-select>
      </div>    
    </div>
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
    polygonControls: { type: Boolean, default: false}, 
    points: { type: Array, default: []}, 
  },
  emit: ["update:modelValue"],
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
