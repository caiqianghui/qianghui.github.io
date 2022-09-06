import HttpClient from "src/utils/http/cloud/HttpClient";

export async function getModelProcesses(params: any) {
  return HttpClient.get('/api/v1/system_process/model_processes', {
    params,
  });
}