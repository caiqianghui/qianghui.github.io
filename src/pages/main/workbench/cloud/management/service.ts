import HttpClient from "src/utils/http/cloud/HttpClient";

// 详情
export async function uploadLogo(params: any) {
  return HttpClient.post(
    '/api/v1/setting_manage/mobile_menus/upload_logo',
    params,
    {
      headers: {'Content-Type': 'multipart/form-data'},
    },
  );
}

// 清除图标
export async function clearLogo(params: any) {
  return HttpClient.post(
    '/api/v1/setting_manage/mobile_menus/clear_logo',
    params,
  );
}
