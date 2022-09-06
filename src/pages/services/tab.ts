import HttpClient from "src/utils/http/cloud/HttpClient";
import HttpLoading from "src/utils/http/cloud/HttpLoading";


export async function invokeLinkageFunction(params) {
  return HttpClient.post(`/api/v1/extension_manage/custom_functions/exec_linkage_function`, params);
}

export async function getRecordAddresses(model_name: string, params: any) {
  return HttpClient.get(`/api/v1/${model_name}/addresses`, {
    params
  });
}