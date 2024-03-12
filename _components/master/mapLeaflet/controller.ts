import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import L from "leaflet";
import {OpenStreetMapProvider} from 'leaflet-geosearch'
import { store } from 'src/plugins/utils.ts'


export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    countries: Object,
    map: L.Map,            
    marker: L.Marker,
    responseValue: false,      
    mapZoom: 8,      
    searchLoading: false,
    searchProvider: {}, 
    address: null,
    geolocations: [],
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    isPositionMarkerMap: () =>  props.type == 'positionMarkerMap',
    init: () => {
      methods.setMap()
      methods.setDefaultValue()
    },    
    //Set default values
    async setDefaultValue() {      
      //Validate map types
      if(methods.isPositionMarkerMap()){        
        //Set default value and response value        
        let center = props.modelValue//Set default value
        if (center?.lat && center?.lng) {
          methods.moveMarker(center.lat, center.lng, 15)          
          await methods.getMarkerInfo(center.lat, center.lng) || {}
        } else {              
          center = {lat: props.defaultCenter.lat, lng: props.defaultCenter.lng}
        }
        
        if(props.emitDefault){
          await methods.getMarkerInfo(center.lat, center.lng)
        }      
      }
    },
    //Handler to click over map
    async getMarkerInfo(lat, lng) {
      const info = {label: '', lat, lng}
      const query = `${lat}, ${lng}`
      await state.searchProvider.search({query}).then((results) => {              
        if(results.length){
          const item = results[0]
          info.label = item['display_name'] || item?.label || ''          
          state.marker.bindPopup(info.label).openPopup();          
        }
      })
      emit('update:modelValue', info)
      return info
    },
    async emitResponseValue() {     
      console.log('emitResponseValue') 
      if (state.address) {
        methods.moveMarker(state.address.lat, state.address.lng)      
        await this.getMarkerInfo(state.address.lat, state.address.lng)        
      }
    },
    filterFn(val, update, abort) {
      update(async () => {
        await methods.searchLocations(val)
      })
    },
    async searchLocations(val) {
      if(val.length < 4) return false
      state.searchLoading = true
      await state.searchProvider.search({query: val}).then((results) => {
        state.geolocations = results.map(item => {
          return {
            label: item.label,
            value: {
              title: item.label,
              lat: item.y,
              lng: item.x,
            }
          }
        })
        state.searchLoading = false
      }).catch(e => {
        state.searchLoading = false
      })
    },
    setMap: () => {
      const id = 'map'
      const layer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      const accessToken = store.getSetting('isite::api-open-street-maps')      

      state.searchProvider =  new OpenStreetMapProvider({params: {countrycodes: methods.getCountries()}})
      state.map = L.map(id, {
        zoomControl: false
      }).setView([props.defaultCenter.lat, props.defaultCenter.lng], state.mapZoom);

      L.tileLayer(layer, {
        attribution, 
        accessToken
      }).addTo(state.map);

      /* readOnly */
      if(props.readOnly){
        state.map.dragging.disable();
      }
      
      L.control.zoom({
        position: 'bottomright'
      }).addTo(state.map);

      if(methods.isPositionMarkerMap()){
        state.marker = L.marker([props.defaultCenter.lat, props.defaultCenter.lng]).addTo(state.map)       
      }

      state.map.on('click', async (event) => {
        const lat = event.latlng.lat
        const lng = event.latlng.lng
        if (methods.isPositionMarkerMap() && !props.readOnly){
          state.geolocations = []
          state.address = null
          methods.moveMarker(lat, lng)
          await methods.getMarkerInfo(lat, lng)
        }
      })
    },
    //force to load maker images
    setIconSettings(){
      L.Marker.prototype.options.icon = L.icon({
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        }
      );
    }, 
    moveMarker(lat, lng, zoom = 8){
      state.map.setView([lat, lng], zoom || state.map.getZoom())
      state.marker.setLatLng([lat, lng])
    }, 
    getCountries(){
      const value = store.getSetting('ilocations::availableCountries') || ["co"]
      return value.map(val => val.toLowerCase())
    }
  }

  // Mounted
  onMounted(() => {
    methods.setIconSettings()
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
