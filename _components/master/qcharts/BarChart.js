import { Bar} from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['options'],
  mounted () {
   // this.chartData is created in the mixin.
   // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
