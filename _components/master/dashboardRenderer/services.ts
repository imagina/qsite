import baseService from 'modules/qcrud/_services/baseService'

export default {
  async getConfig(configName: string) {
    try {
      if (!configName) return null

      const requestParams = {
        refresh: true,
        params: {
          filter: {
            configName
          }
        }
      };

      const { data } = await baseService.index('apiRoutes.qsite.configs', requestParams)
      return data
    } catch (error) {
        console.error(error)
    }
  },
  async getQuickCardData(apiRoute: string, filters: {}, refresh: boolean = true): Promise<any> {
    try {
      const requestParams = {
        refresh,
        params: {
          filter: {
            ...filters
          }
        }
      };
      // const response = await baseService.index(apiRoute, requestParams)
      // return response.data[0]
      return {}
    } catch (error) {
        console.error(error)
    }
  }
}
