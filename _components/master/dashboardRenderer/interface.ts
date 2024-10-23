export interface Setting {
  apiRoute: string
  type: string, 
  permission: string, 
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
