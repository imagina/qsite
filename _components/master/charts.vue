<template>
  <div class="q-mt-sm box box-auto-hieght small">
    <!--charts Components -->
    <!-- line chart -->
    <line-chart v-if="lineChart" :chart-data="data" :options="options" id="line"></line-chart>
    <!-- bar chart -->
    <bar-chart v-if="barChart" :chart-data="data" :options="options" id="bar"></bar-chart>
    <!-- pie chart -->
    <pie-chart v-if="pieChart" :chart-data="data" :options="options" id="pie"></pie-chart>
    <!-- doughnut cart -->
    <doughnut-chart v-if="doughnutChart" :chart-data="data" :options="options" id="doughnut"></doughnut-chart>
  </div>
</template>

<script>
  import LineChart from './qcharts/LineChart.js'
  import BarChart from './qcharts/BarChart.js'
  import PieChart from './qcharts/PieChart.js'
  import DoughnutChart from './qcharts/DoughnutChart.js'
  import Exporter from "vue-chartjs-exporter";
  export default {
    components: {
      LineChart,
      BarChart,
      PieChart,
      DoughnutChart
    },
    props: {
      chartsData: {}
    },
    data () {
      return {
        lineChart: false,
        barChart: false,
        pieChart: false,
        doughnutChart: false,
        download_status: "Download Charts",
        options: {
          responsive: true,
          maintainAspectRatio: false,
          locale: 'es-ES'
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    }, 
    computed: {
      //reder chart
      data () {
        return {
          labels: this.chartsData.dataLabels.map((item) => item.name || item),
          datasets: this.chartsData.dataSets
        }
      }
    },
    methods: {
      //init
      init () {
        this.selectChart()
      },
      //select chart
      selectChart () {
        return this[this.chartsData.type] = true
      },
      //esport to pdf chart
      exportToPDF() {
        this.download_status = "Processing...";
        let line = document.getElementById("line");

        const exp = new Exporter([line]);
        exp.export_pdf().then((pdf) => {
          pdf.save("charts.pdf");
          this.download_status = "Download Charts";
        });
      },
    },
  }
</script>

<style>
  .small {
    width: 100%;
    height: 450px;
  }
</style>