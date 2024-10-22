import { 
  ref, 
  onMounted, 
  toRefs, 
  watch, 
  onBeforeUnmount, 
  computed 
} from 'vue';
import { eventBus } from 'src/plugins/utils.ts'
import service from '../../services'
import { Table, Column, Row, ColorAssignment } from './interface'
import { tableModel } from './models'

export default function controller(props: any, emit: any) {

  const { apiRoute, filters, data } = toRefs(props)
  
  const refs = {
    isLoading: ref(true),
    tableData: ref<Table>({ ...tableModel }),
    maxNumberPerColor: 0
  }

  const methods = {
    getMaxNumberPerColor: (colorAssignment: ColorAssignment | undefined) => {
      if (!colorAssignment) return 0
      const { referenceColumn, colors } = colorAssignment
      const listOfNumber: number[] = refs.tableData.value.rows.map(row => Number(row[referenceColumn]))
      const maxNumber = Math.max(...listOfNumber)
      return maxNumber / colors.length
    },
    pickColor: (row: Row) => {
      if (!refs.tableData.value?.colorAssignment) return 'tw-bg-neutral-100'

      const ASCENDANT = 'asc'
      const DESCENDANT = 'desc'
      const { referenceColumn, colors, order } = refs.tableData.value?.colorAssignment
      const colorLength = colors.length - 1
      const colorIndex = Math.floor(Number(row[referenceColumn]) / refs.maxNumberPerColor)

      if (order === DESCENDANT) {
        const colorsReverse = [...colors].reverse()
        if (colorIndex >= colorLength) return colorsReverse[colorLength]
        return colorsReverse[colorIndex]
      }

      if (order === ASCENDANT) {
        if (colorIndex >= colorLength) return colors[colorLength]
        return colors[colorIndex]
      }
    },
    sort: (col: Column) => {
      if (!col) return
      refs.tableData.value?.rows.sort((a, b) => {
        const name = col.name
        const asc = col.asc
    
        if (a[name] < b[name]) return asc ? -1 : 1
        if (a[name] > b[name]) return asc ? 1 : -1
        return 0
      })
    },
    sortReverse: (column: Column) => {
      if (!column || !column.sortable) return
      refs.tableData.value?.columns.map(col => {
        if ((col.name === column.name) && col.sortable) {
          col.asc = !col?.asc
        }
      })

      methods.sort(column)
    },
    formatted: (value: string | number) => {
      if (typeof value === 'number') return value.toLocaleString('en')
      return value
    },
    formatPercentage: (value: number | string) => {
      const percentage = Number(value) * 100
      
      return `${Math.round(percentage)}%`
    },
    getData: async (): Promise<Table> => {
      return await service.getQuickCardData(apiRoute.value, filters.value)
    },
    sortAndColor: () => {
      refs.maxNumberPerColor = methods.getMaxNumberPerColor(refs.tableData.value?.colorAssignment)
      refs.tableData.value?.columns.forEach(col => methods.sort(col))
    }
  }

  const computeds = {
    thereAreRows: computed(() => (
      refs.tableData.value?.rows && Object.keys(refs.tableData.value?.rows).length
    ))
  }

  onMounted(async () => {
    refs.isLoading.value = true
    if (apiRoute.value) {
      refs.tableData.value = await methods.getData()
    } else refs.tableData.value = data.value
    refs.isLoading.value = false

    methods.sortAndColor()
    
    eventBus.on('crud.data.refresh', async () => {
      refs.isLoading.value = true
      if (apiRoute.value) {
        await methods.getData()
        methods.sortAndColor()
      }
      refs.isLoading.value = false
    })
  })

  onBeforeUnmount(() => {
    eventBus.off('crud.data.refresh')
  })

  watch(filters, async (): Promise<void> => {
    refs.isLoading.value = true
    if (apiRoute.value) {
      refs.tableData.value = await methods.getData()
      methods.sortAndColor()
    }
    refs.isLoading.value = false
  }, { deep: true })

  return {...refs, ...methods, ...computeds }
}