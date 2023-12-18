import cache from "@imagina/qsite/_plugins/cache";
import Vue from 'vue'

class cacheOffline {
  constructor() {}

  async addNewRecord(apiRoute, data = {}) {
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    await cache.remove(apiRoute);
    await cacheResponse.data.unshift({...data})
    await cache.set(route, cacheResponse);
    return true;
  }

  async updateRecord(apiRoute, data = {}){
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    const records = await cacheResponse.data.map(WO => WO.id === data.id ? {...WO, ...data} : WO);
    await cache.set(route, {data: records});
    return true;
  }

  async updateList(apiRoute, data){
    const route = `${apiRoute}::offline`;
    await cache.set(route, data);
    return true;
  }

  async deleteItem(itemId, apiRoute = 'apiRoutes.qramp.workOrders'){
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    const records = await cacheResponse.data.filter(WO => WO.id !== itemId);
    await cache.set(route, {data: records});
    return true;
  }

  async getItemById(itemId, apiRoute = 'apiRoutes.qramp.workOrders'){
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    const record = await cacheResponse.data.find(WO => WO.id === itemId);
    return record;
  }
}

const cacheOff = new cacheOffline()

export default cacheOff