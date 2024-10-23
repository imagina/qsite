import { Header } from '../../interface'

export interface Column {
  name: string,
  label: string,
  align: 'center' | 'left' | 'right',
  field: string,
  sortable?: boolean,
  progress?: {
    barColor?: string,
    barTextColor?: string,
    badge?: {
      bgColor?: string,
      textColor?: string,
    }
  },
  asc?: boolean,
  headerClass?: string,
  bodyClass?: string,
}

export interface Row {
  [key: string]: string | number,
}

export interface ColorAssignment {
  referenceColumn: string,
  order: 'desc' | 'asc',
  colors: string[],
}

export interface Table {
  header?: Header, 
  colorAssignment?: ColorAssignment,
  columns: Column[],
  rows: Row[],
}
