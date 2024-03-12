<template>
  <div id="mapLeafletcomponent" class="full-width">
    <!-- search geolocation -->
      <div id="leaflet-search-box">
        <q-select
          v-if="!readOnly"
          v-model="address"
          :options="geolocations"
          :loading="searchLoading"          
          :label="label"          
          behavior="menu"
          input-debounce="500"
          bg-color="white"
          style="width: 100%;"
          item-aligned
          hide-dropdown-icon
          fill-input
          clearable
          use-input
          emit-value
          map-options 
          dense
          outlined
          class="q-pb-md custom-btn"
          @clear="geolocations = []"
          @filter="filterFn"
          @update:modelValue="emitResponseValue()"
        />
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
  height: 64px;
  display: grid;
  justify-content: start;
  padding-top: 10px;
  padding-left: 14px;
}

</style>
