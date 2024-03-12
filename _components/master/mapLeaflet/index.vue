<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!-- search geolocation -->
    address {{ address }}
      <div id="leaflet-search-box">
        <q-select
          v-model="address"
          :options="geolocations"
          emit-value 
          behavior="menu"
          input-debounce="500"
          use-input
          map-options
          @filter="filterFn"
          @update:modelValue="emitResponseValue()"
          :loading="searchLoading"
          v-if="!readOnly"
          class="leaflet-search-input"          
          :label="label"
          bg-color="white"
          style="width: 250px; padding-top: 32px; border-radius: 0px;"
          item-aligned
          hide-dropdown-icon
        >
        </q-select>
      </div>    
    <!--map--->         
    <div :id="mapId" :style="`width: 100%; height : ${height}`"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import "leaflet/dist/leaflet.css";

export default defineComponent({
  props: {
    modelValue: {default: false},
    type: {default: 'positionMarkerMap'},
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
  height: 48px;
  display: grid;
  justify-content: start;
  padding: px
}

</style>
