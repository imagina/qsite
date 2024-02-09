export default ({ app, router, store }) => {
  //Components
  let components = [
    //{name: 'name-component', component: Component}
  ]

  //Register components
  components.forEach(item => {
    app.use(item.component)
    app.component(item.name, item.component)
  })
}
