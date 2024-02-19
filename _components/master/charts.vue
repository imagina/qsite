<template>
  <div class="q-mt-sm box box-auto-hieght small">
    <!--charts Components -->
    <!-- line chart -->
    <Line v-if="lineChart" :data="data" :options="options" id="line" />
    <!-- bar chart -->
    <Bar v-if="barChart" :data="data" :options="options" id="bar" />
    <!-- pie chart -->
    <Pie v-if="pieChart" :data="data" :options="options" id="pie" />
    <!-- doughnut cart -->
    <Doughnut
      v-if="doughnutChart"
      :data="data"
      :options="options"
      id="doughnut"
    />
  </div>
</template>

<script>
import { Bar, Doughnut, Line, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import Exporter from 'vue-chartjs-exporter';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default {
  components: {
    Line,
    Bar,
    Pie,
    Doughnut,
  },
  props: {
    chartsData: {},
  },
  data() {
    return {
      lineChart: false,
      barChart: false,
      pieChart: false,
      doughnutChart: false,
      download_status: 'Download Charts',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        locale: 'es-ES',
      },
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
  },
  computed: {
    //reder chart
    data() {
      return {
        labels: this.chartsData.dataLabels.map((item) => item.name || item),
        datasets: this.chartsData.dataSets,
      };
    },
  },
  methods: {
    //init
    init() {
      this.selectChart();
    },
    //select chart
    selectChart() {
      return (this[this.chartsData.type] = true);
    },
    //esport to pdf chart
    exportToPDF() {
      this.download_status = 'Processing...';
      let line = document.getElementById('line');

      const exp = new Exporter([line]);
      exp.export_pdf().then((pdf) => {
        pdf.save('charts.pdf');
        this.download_status = 'Download Charts';
      });
    },
  },
};
</script>

<style>
.small {
  width: 100%;
  height: 450px;
}
</style>