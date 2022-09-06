import HttpClient from "src/utils/http/cloud/HttpClient";
import HttpLoading from "src/utils/http/cloud/HttpLoading";


export async function getDataById(model_name, id, params = {}) {
  return HttpClient.get(`/api/v1/${model_name}/${id}`, {
    params,
  });
}

export async function getFormProfile(model_name) {
  return HttpClient.get(`/api/v1/${model_name}/profile`, {});
}

export async function getFieldMapDependencies(params) {
  return HttpClient.get('/api/v1/custom_form/field_map_dependencies', {
    params,
  });
}
export async function getConversionData(model_name, params) {
  return HttpClient.get(`/api/v1/${model_name}/conversion`, {
    params,
  });
}

export async function uploadAttachment(model_name, params = {}) {
  return HttpClient.post(`/api/v1/${model_name}/upload_attachment`, params, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function getSubRows(model_name, params) {
  return HttpClient.get(`/api/v1/${model_name}/sub_rows`, {params});
}

export async function deleteAttachment(id, params = {}) {
  return HttpClient.delete(`/api/v1/attachment_manage/attachments/${id}`, {params});
}

export async function updateData(model_name: string, id: string, params: any) {
  return HttpClient.put(`/api/v1/${model_name}/${id}`, {params});
}

export async function createData(model_name: string, params: any) {
  return HttpClient.post(`/api/v1/${model_name}`, params);
}

export async function invokeValidateFunction(params: any) {
  return HttpClient.post(`/api/v1/extension_manage/custom_functions/exec_validate_function`, params);
}

export async function getCustomFormJs(params) {
  return HttpClient.get('/api/v1/extension_manage/custom_functions/custom_form_js', {
    params,
  });
}

export async function getLayoutRules(params) {
  return HttpClient.get('/api/v1/custom_form/layout_rules/list', {
    params,
  });
}

export async function invokeLinkageFunction(params) {
  return HttpClient.post(`/api/v1/extension_manage/custom_functions/exec_linkage_function`, params);
}

export async function invokeOnloadFunction(params) {
  return HttpClient.post(`/api/v1/extension_manage/custom_functions/exec_onload_function`, params);
}

export async function cloneAttachment(model_name, params) {
  return HttpClient.post(`/api/v1/${model_name}/clone_attachment`, params);
}
