export default {
  importCrud(moduleName, view){
    try {
      return require(`@imagina/${moduleName}/_crud/${view}`).default
    } catch (e) {
      console.log(e)      
    }      
  }
}