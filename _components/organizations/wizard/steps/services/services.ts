import baseService from '@imagina/qcrud/_services/baseService.js';

export default function services() {
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
      console.log('Error in wizard/services.getInfoWizard ' + error);
    }
  }

  async function getCategories() {
    try {
      const requestParams = {refresh: true}
      const response = await baseService.index('apiRoutes.qsite.categories', requestParams);
      const categories = response.data.sort((a, b) => a.title.localeCompare(b.title));
      return categories;
    } catch (error) {
      console.log('Error in wizard/services.getCategories ' + error);
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
      console.log('Error in wizard/services.getCategoriesSearch ' + error);
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
          filter: {id: plans.data.map(plan => plan.product.id), status: true, validationInternal:true},
          include: 'productOptions,optionValues,relatedProducts.files'
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

      return products.data;
    } catch
      (error) {
        console.log('Error in wizard/services.getPlans ' + error);
      return []
    }
  }

  async function getPlan(planId: number) {
    try {
      const params = {
        filter: {
          id: planId,
        },
        include: 'productOptions,optionValues,relatedProducts.files,categories'
      };
      let response = await baseService.index('apiRoutes.qcommerce.products', {refresh: true, params});
      return response.data;
    } catch (error) {
      console.log('Error in wizard/services.getPlan ' + error);
    }
  }


  return {getInfoWizard, getCategories, getCategoriesSearch, getPlans, getPlan}
}

