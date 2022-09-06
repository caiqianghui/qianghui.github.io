import HttpClient from "src/utils/http/cloud/HttpClient";

export async function getUnits(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/product_manage/units/selection', {
    params,
  });
}

export async function getPricingSystems(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/price_manage/pricing_systems/selection', {
    params,
  });
}

export async function getSuppliers(params: any) {
  return HttpClient.get('/api/v1/supply_manage/suppliers/selection', {
    params,
  });
}

export async function getCategories(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/product_manage/categories/selection', {
    params,
  });
}

export async function getBrands(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/product_manage/brands/selection', {
    params,
  });
}

export async function getFormSelections(params: any) {
  return HttpClient.get('/api/v1/custom_form/forms/selection', {
    params,
  });
}

export async function getUserSelections(params: any) {
  return HttpClient.get('/api/v1/account/users/selection', {
    params,
  });
}

export async function getWarehouses(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/warehouse_manage/warehouses/selection', {
    params,
  });
}

export async function getWarehouseStock(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/warehouse_manage/warehouses/warehouse_stock', {
    params,
  });
}

export async function getWarehouseBatchStock(params: any) {
  return HttpClient.get('/api/v1/qudaoyi/warehouse_manage/warehouses/batch_stock', {
    params,
  });
}

export async function getProducts(params: any) {
  return HttpClient.get('/api/v1/product_manage/products/selection', {
    params,
  });
}

export async function getProfileSelections(params: any) {
  return HttpClient.get('/api/v1/setting_manage/profiles/selection', {
    params,
  });
}

export async function getRoleSelections(params: any) {
  return HttpClient.get('/api/v1/setting_manage/roles/selection', {
    params,
  });
}

export async function getAccountTypeSelections(params: any) {
  return HttpClient.get('/api/v1/accountant_manage/account_types/selection', {
    params,
  });
}

export async function getAccountSelections(params: any) {
  return HttpClient.get('/api/v1/accountant_manage/accounts/selection', {
    params,
  });
}
export async function getPrintTemplateSelections(params: any) {
  return HttpClient.get('/api/v1/template_manage/print_templates/selection', {
    params,
  });
}

export async function getTabSelections(model_name: string, params: any) {
  return HttpClient.get(`/api/v1/${model_name}/selection`, {
    params,
  });
}

export async function getSelections(module: string, params: any) {
  switch (module) {
    case 'units':
      return getUnits(params);
    case 'warehouses':
      return getWarehouses(params);
    case 'categories':
      return getCategories(params);
    case 'brands':
      return getBrands(params);
    // case "products":
    //   return getProducts(params);
    case 'pricing_systems':
      return getPricingSystems(params);
    default:
      return getTabSelections(module, params);
  }
}
