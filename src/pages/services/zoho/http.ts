import NetCloudFun from "./functions";

// 执行zoho 函数
export function executeFunction(key, params) {
  return NetCloudFun.get(`/crm/v2/functions/${key}/actions/execute`, params);
}

// 删除
export function deleteId(id, moduleName) {
  return NetCloudFun.delete(`/crm/v2/${moduleName}/${id}`);
}