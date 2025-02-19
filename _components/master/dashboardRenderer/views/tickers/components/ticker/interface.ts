interface Body {
  title?: string,
  value: string,
  footer?: string,
  className?: string,
}

export interface Ticker {
  title?: string,
  body: Body[],
  footer?: string,
  valueHidden?: boolean,
  icon?: {
    name: string,
    className?: string,
  }
}
