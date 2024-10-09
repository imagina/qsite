interface Body {
  title?: string,
  value: string,
  footer?: string,
}

export interface Ticker {
  title?: string,
  body: Body[],
  footer?: string,
  icon?: {
    name: string,
    className?: string,
  }
}
