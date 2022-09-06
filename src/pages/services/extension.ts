import HttpClient from "src/utils/http/cloud/HttpClient";
import HttpLoading from "src/utils/http/cloud/HttpLoading";

export async function getExtensions(params) {
  return HttpClient.get('/api/v1/extension_manage/extensions', {
    params,
  });
}
export async function getMyExtensions(params) {
  return HttpClient.get('/api/v1/extension_manage/extensions/my_extensions', {
    params,
  });
}

export async function getExtensionById(id) {
  return HttpClient.get(`/api/v1/extension_manage/extensions/${id}`, {});
}

export async function installExtension(params) {
  return HttpClient.post(`/api/v1/extension_manage/extensions/install`, params);
}

export async function upgradeExtension(params) {
  return HttpClient.post(`/api/v1/extension_manage/extensions/upgrade`, params);
}

export async function unInstallExtension(params) {
  return HttpClient.post(`/api/v1/extension_manage/extensions/uninstall`, params);
}

export async function setExtensionDebug(params) {
  return HttpClient.post(`/api/v1/extension_manage/extensions/set_debuge`, params);
}

export async function executeFunction(params) {
  if (['csv_file', 'excel_file', 'text_file', 'file_stream'].indexOf(params.function_return_type) !== -1) {
    return HttpClient.get(`/api/v1/extension_manage/custom_functions/execute`, {
      responseType: 'blob',
      params,
    });
  } 
  
  return HttpClient.post(`/api/v1/extension_manage/custom_functions/execute`, params);
}

export async function getCustomWidgets(params) {
  return HttpClient.get('/api/v1/extension_manage/custom_widgets', {
    params,
  });
}
export async function getCustomWidgetById(id) {
  return HttpClient.get(`/api/v1/extension_manage/custom_widgets/${id}`, {});
}
export async function updateCustomWidgetPermission(params) {
  return HttpClient.post(`/api/v1/extension_manage/custom_widgets/update_permission`, params);
}
export async function getCustomWidgetTreeDatas(params) {
  return HttpClient.get('/api/v1/extension_manage/custom_widgets/tree_datas', {
    params,
  });
}

export async function getCustomProperties(params) {
  return HttpClient.get('/api/v1/extension_manage/custom_properties', {
    params
  });
}

export async function updateCustomProperties(params) {
  return HttpClient.put(`/api/v1/extension_manage/custom_properties/update`, params);
}
