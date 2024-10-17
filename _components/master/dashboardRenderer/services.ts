import baseService from 'modules/qcrud/_services/baseService'

export default {
  async getConfig(configName: string, byModule?: boolean): Promise<any> {
    try {
      if (!configName) return null

      const requestParams = {
        refresh: true,
        params: {
          filter: {
            ...(byModule ? { configNamebyModule: configName } : { configName }),
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
      const response = await baseService.index(apiRoute, requestParams)
      return response.data
    } catch (error) {
        console.error(error)
    }
  }
}
