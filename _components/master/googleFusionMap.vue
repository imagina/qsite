<template>
  <div id="googleFusionMapComponent">
    <!--Fusion Map-->
    <div :id="`fusionMap${componentUID}`" :style="`height: ${height}; width: ${width}`"></div>
  </div>
</template>
<script>
export default {
  props: {
    height: {default: '450px'},
    width: {default: '100%'},
    buildTarget: {
      type: Function,
      default: () => {
        return ''
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
      loading: false,
      componentUID: this.$uid(),
      map: '',
      infoWindow: new google.maps.InfoWindow(),
      markerCluster: {}
    }
  },
  computed: {},
  methods: {
    init() {
      this.loadLibraries()
    },
    //Load CDNs
    loadLibraries() {
      this.$helper.loadCDN('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js')
    },
    //Build fusion map
    buildFusionMap(params = {}) {
      return new Promise((resolve) => {
        //Set default params
        params = {data: [], zoom: 16, latitude: '', longitude: '', ...params}

        setTimeout(() => {
          //Build google map
          this.map = new google.maps.Map(document.getElementById(`fusionMap${this.componentUID}`), {
            zoom: params.zoom,
            center: new google.maps.LatLng(params.latitude, params.longitude),
            mapTypeControl: false,
            streetViewControl: false
          });

          //Prepare Data
          this.map.data.addGeoJson(params.data);

          //Build markers
          let markers = []
          this.map.data.forEach(feature => {
            let iconColor = feature.getProperty('ic') ? feature.getProperty('ic') : "ffffff";
            let icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + iconColor
            let g = feature.getGeometry();
            //Create marker
            this.marker = new google.maps.Marker({position: g.get(0), icon: icon});
            //Listen Click event
            this.marker.addListener('click', (event) => {
              let targetHtml = this.buildTarget(feature)
              this.infoWindow.setContent(targetHtml);
              this.infoWindow.setPosition(event.latLng);
              this.infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -34)});
              this.infoWindow.open(this.map);
            });
            //Add marker to map
            markers.push(this.marker)
          });

          //Default marker
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(params.latitude, params.longitude),
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2&chld=%20|FF0000"
          });
          markers.push(marker)

          //Group markers
          this.markerCluster = new MarkerClusterer(this.map, markers, {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'});

          //Add map styles
          this.map.data.setStyle({
            fillColor: 'green',
            strokeWeight: 1,
            visible: false
          });

          //Resolve
          resolve(true)
        }, 600)
      })
    },
    //Build tarjet
  }
}
</script>
<style lang="scss">
</style>
