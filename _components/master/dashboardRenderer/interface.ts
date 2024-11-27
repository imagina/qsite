export interface Tickers {
  apiRoute: string,
  permission: string,
  valueHidden?: boolean
}
export interface Setting {
  apiRoute?: string
  type: string, 
  permission: string,
  className?: string,
  tickers?: Tickers[],
  header?: Header,
}

export interface View {
  apiRoute: string 
  component: any, 
}

export interface Header {
  title: string,
  icon?: string,
  cssStyle?: {
    [key: string]: string | number,
  }
}
