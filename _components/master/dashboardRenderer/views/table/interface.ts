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
      textColor?: string,
    }
  },
  asc?: boolean,
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
  title: string,
  colorAssignment?: ColorAssignment,
  columns: Column[],
  rows: Row[],
}
