# QSITE  | 1.0.0
root component of the app, where all global subcomponents are located

# Installation
```bash
npm i ./src/modules/qsite@1.0.0
```

# Usage
In this root component, there are several global sub components such as tables and dynamic forms, graphics among others

## Charts component

displays the following graphs.
**line chart, bar chart, pie chart, and donut chart**.

### Usage
each graph must send these three values ​​by props.
- type: the type of chart to display.
- dataLabel: the labels to show.
- dataSet: the data to be displayed


```js
 <template>
  <q-charts :chartsData="chartData" />
 <template />

<script>
import QCharts from 'modules/qsite/_components/master/charts.vue'
export default {
  component: { Qchart }
  computed: {
    chartData () {
      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'GitHub Commits',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
          }
        ]
      }
    },
  }
}
<script/>
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
