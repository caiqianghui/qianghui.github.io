import HttpClient from "src/utils/http/cloud/HttpClient";

export async function getForms(params) {
  return HttpClient.get('/api/v1/custom_form/forms', {
    params,
  });
}
export async function getSections(params) {
  return HttpClient.get('/api/v1/custom_form/forms/sections', {
    params,
  });
}
export async function getFields(params) {
  return HttpClient.get('/api/v1/custom_form/forms/fields', {
    params,
  });
}
export async function getFieldById(id) {
  return HttpClient.get(`/api/v1/custom_form/forms/fields/${id}`, {});
}
export async function getSubFields(params) {
  return HttpClient.get('/api/v1/custom_form/forms/fields/sub_fields', {
    params,
  });
}
export async function getRelatedFields(params) {
  return HttpClient.get('/api/v1/custom_form/forms/fields/association', {
    params,
  });
}
