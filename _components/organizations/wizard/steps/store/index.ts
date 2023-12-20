import Vue from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js';
import cache from '@imagina/qsite/_plugins/cache'

export default function storeStepWizard() {
  async function getInfoWizard(systemName: string) {
    try {
      const response = await baseService.show(
        'apiRoutes.qgamification.categories',
        'admin_organization_wizard',
        {
          refresh: false, params: {filter: {field: 'system_name'}, include: "activities"}
        });
      return response.data.activities;
    } catch (error) {
      console.log('Error info general');
    }
  }

  async function getCategories() {
    try {
      const requestParams = {refresh: true}
      const response = await baseService.index('apiRoutes.qsite.categories', requestParams);
      const categories = response.data.sort((a, b) => a.title.localeCompare(b.title));
      cache.set('org-wizard-categories', categories)
      return categories;
    } catch (error) {
      console.log('Error al cargar las categorias');
    }
  }

  async function getCategoriesSearch(text: string) {
    try {
      const params = {
        filter: {
          search: text
        }
      };
      const response = await baseService.index('apiRoutes.qsite.categories', {refresh: true, params});
      const categories = response.data.sort((a, b) => a.title.localeCompare(b.title));
      return categories;
    } catch (error) {
      console.log('Error al cargar las categorias');
    }
  }

  //Return the data plans
  async function getPlans(planBaseId: number) {
    try {
      //Get plans with product relation
      const paramsPlans = {
        refresh: true,
        params: {include: 'product', filter: {internal: false}}
      };
      let plans = await baseService.index('apiRoutes.qplan.plans', paramsPlans);

      // Get full data of products
      const paramsProducts = {
        refresh: true, params: {
          filter: {id: plans.data.map(plan => plan.product.id), status: true},
          include: 'productOptions,optionValues,relatedProducts'
        }
      };
      let products = await baseService.index('apiRoutes.qcommerce.products', paramsProducts);

      //Validate optionValues (Frequency)
      products.data.forEach((product, index) => {
        if (!product.optionValues.length) {
          let plan = plans.data.find(plan => plan.product.id == product.id)
          products.data[index].optionValues = [{optionValue: plan.frequency, price: plan.price,}]
        }
      })
      //save in cache
      cache.set('org-wizard-plans', products.data)
      //Response
      return products.data;
    } catch
      (error) {
      console.error('Error al cargar los planes', error);
      return []
    }
  }

  async function getPlan(planId: number) {
    try {
      const params = {
        filter: {
          id: planId,
        },
        include: 'productOptions,optionValues,relatedProducts,categories'
      };
      let response = await baseService.index('apiRoutes.qcommerce.products', {refresh: true, params});
      return response.data;
    } catch (error) {
      console.log('Error al cargar los planes');
    }
  }


  return {getInfoWizard, getCategories, getCategoriesSearch, getPlans, getPlan}
}

