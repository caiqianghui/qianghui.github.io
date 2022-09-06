import HttpClient from 'src/utils/http/HttpClient';

function invoke(code) {
  return HttpClient.post("/api/v1/functions/invoke_open_api", {
    data: { code },
  });
}

export const netcloud = (function() {
  return {
    base: (function() {
      return {
        async searchRecords (moduleName, criteria, page = 1, per_page = 100, options = {}) {
          return invoke(`netcloud.base.searchRecords('${moduleName}', ${JSON.stringify(criteria)}, ${page}, ${per_page}, ${JSON.stringify(options)})`);
        },
        async getRecords (moduleName, page = 1, per_page = 100, options = {}) {
          return invoke(`netcloud.base.getRecords('${moduleName}', ${page}, ${per_page}, ${JSON.stringify(options)})`);
        },
        async getSystemFormRecords (moduleName, page = 1, per_page = 100) {
          return invoke(`netcloud.base.getSystemFormRecords('${moduleName}', ${page}, ${per_page})`);
        },
        async searchRelatedRecords (relationName, parentModuleName, criteria, page = 1, per_page = 100, options = {}) {
          return invoke(`netcloud.base.searchRelatedRecords('${relationName}', '${parentModuleName}', ${JSON.stringify(criteria)}, ${page}, ${per_page}, ${JSON.stringify(options)})`);
        },
        async getRelatedRecords (relationName, parentModuleName, parent_id, page = 1, per_page = 100, options = {}) {
          return invoke(`netcloud.base.getRelatedRecords('${relationName}', '${parentModuleName}', ${parent_id}, ${page}, ${per_page}, ${JSON.stringify(options)})`);
        },
        async getAttachments (attachmentName, parentModuleName, parent_id, options = {}) {
          return invoke(`netcloud.base.getAttachments('${attachmentName}', '${parentModuleName}', ${parent_id}, ${JSON.stringify(options)})`);
        },
        async createRecord (moduleName, dataMap, options = {}) {
          return invoke(`netcloud.base.createRecord('${moduleName}', ${JSON.stringify(dataMap)}, ${JSON.stringify(options)})`);
        },
        async updateRecord (moduleName, data_id, dataMap, options = {}) {
          return invoke(`netcloud.base.updateRecord('${moduleName}', ${data_id}, ${JSON.stringify(dataMap)}, ${JSON.stringify(options)})`);
        },
        async updateRelatedRecord (relationName, data_id, parentModuleName, parent_id, dataMap, options = {}) {
          return invoke(`netcloud.base.updateRelatedRecord('${relationName}', ${data_id}, '${parentModuleName}', ${parent_id}, ${JSON.stringify(dataMap)}, ${JSON.stringify(options)})`);
        },
        async getRecordById (moduleName, data_id, options = {}) {
          return invoke(`netcloud.base.getRecordById('${moduleName}', ${data_id}, ${JSON.stringify(options)})`);
        },
        async deleteRecord (moduleName, data_id, options = {}) {
          return invoke(`netcloud.base.deleteRecord('${moduleName}', ${data_id}, ${JSON.stringify(options)})`);
        },
        async invokeFunction (funcName, params = {}) {
          return invoke(`netcloud.extension.invokeFunction('${funcName}', ${JSON.stringify(params)})`);
        },
        async getCustomProperty (propName) {
          return invoke(`netcloud.extension.getCustomProperty('${propName}')`);
        },
        async updateCustomProperty (propName, newValue) {
          return invoke(`netcloud.extension.updateCustomProperty('${propName}', '${newValue}')`);
        },
      }
    })(),
  }
})()
