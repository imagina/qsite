<template>
  <div id="googleMapComponent">
    <!--Auto complete input-->
    <div id="address">
      <q-input v-bind="autocompleteFieldProps"/>
    </div>
    <!--Map-->
    <div id="map"></div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    modelValue: {default: null},
    defaultCenter: {
      default: () => {
        return {lat: 4.642129714308486, lng: -74.11376953125001}
      }
    },
    emitDefault: {
      default: false
    }
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setMarkerFromValue()
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
      map: {},
      marker: null,
      autocomplete: null
    }
  },
  computed: {
    autocompleteFieldProps() {
      return {
        bgColor: 'white',
        outlined: true,
        dense: true,
        label: this.$tr('isite.cms.label.address')
      }
    }
  },
  methods: {
    async init() {
      setTimeout(() => {
        this.initMap()
        this.initAutocomplete()
        this.setMarkerFromValue()
        if(this.emitDefault) {
          this.$emit('update:modelValue', this.$clone({lat: this.defaultCenter.lat, lng: this.defaultCenter.lng}))
          setTimeout(() => {
            this.map.setZoom(8)
          }, 50)
        }
      }, 500)
    },
    //Init Map
    initMap() {
      //Reset marker
      this.marker = null

      //Instance map
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: this.defaultCenter,
        mapTypeControl: false,
        streetViewControl: false,
      });

      //Listen map click event
      google.maps.event.addListener(this.map, 'click', (event) => this.setMarker(event.latLng));
    },
    //Set marker from value
    setMarkerFromValue() {
      //Get value
      let position = this.$clone(this.modelValue)
      //Validate value
      if (position.lat && position.lng) {
        //Instance marker
        let marker = this.$clone({
          lat: () => {
            return position.lat
          }, lng: () => {
            return position.lng
          }
        })
        //Set marker
        this.setMarker(marker)
      }
    },
    //init autocomplete
    initAutocomplete() {
      //Get input for init autocomplete
      let input = document.querySelector('#address input')
      input.placeholder = ''//Clear placeholder

      //Init autocomplete					//Init autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(
          input,
          {types: ['address'], componentRestrictions: {'country': 'co'}}
      );

      //Event when select a place from autocomplete
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace()
        this.setMarker({lat: place.geometry.location.lat, lng: place.geometry.location.lng})
      });

      //Clear placeholder
      setTimeout(() => input.placeholder = '', 500)
    },
    //Set marker
    setMarker(position) {
      //Parce position
      position = new google.maps.LatLng(position.lat(), position.lng())
      //Set position to current marker
      if (this.marker) this.marker.setPosition(position)
      //Create marker
      else this.marker = new google.maps.Marker({position: position, map: this.map});
      //Set map center
      this.map.setCenter(position)
      this.map.setZoom(15);
      //Emit marker
      this.$emit('update:modelValue', this.$clone({lat: position.lat(), lng: position.lng()}))
    },
  }
}
</script>
<style lang="scss">
#googleMapComponent {
  width: 100%;

  #map {
    height: 300px;
  }
}
</style>
