// [ptc] - 2021-03-04 - 16:00:00
// import { Doughnut, mixins } from 'vue-chartjs'
// const { reactiveProp } = mixins

//[ptc]
// export default {
//   extends: Doughnut,
//   mixins: [reactiveProp],
//   props: ['options'],
//   mounted () {
//     // this.chartData is created in the mixin.
//     // If you want to pass options please create a local options object
//     this.renderChart(this.chartData, this.options)
//   }
// }

export default {
  extends: {},
  mixins: [],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}