import { defineAsyncComponent} from "vue";

export default {  
  'table':  defineAsyncComponent(() => import('modules/qsite/_components/master/dynamicTable')),
  'grid':  defineAsyncComponent(() => import('modules/qsite/_components/master/dynamicGrid')),
}
