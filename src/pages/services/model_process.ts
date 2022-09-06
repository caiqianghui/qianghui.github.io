import HttpClient from "src/utils/http/cloud/HttpClient";
import HttpLoading from "src/utils/http/cloud/HttpLoading";

export async function getModelProcesses(params: any) {
  return HttpClient.get('/api/v1/system_process/model_processes', {
    params,
  });
}
export async function processAudit(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/audit',
    params,
  );
}
export async function processResubmit(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/resubmit',
    params,
  );
}
export async function processRevoke(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/revoke',
    params,
  );
}

export async function processTransfer(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/transfer',
    params,
  );
}

export async function processReturn(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/return',
    params,
  );
}

export async function processAppend(params: any) {
  return HttpLoading.post(
    '/api/v1/system_process/model_processes/append',
    params,
  );
}
export async function getApprovedLogs(params: any) {
  return HttpLoading.get(
    '/api/v1/system_process/model_processes/approved_logs',
    {
      params,
    },
  );
}
export async function getProcessNode(params) {
  return  HttpLoading.get('/api/v1/system_process/model_processes/get_node', {
    params,
  });
}