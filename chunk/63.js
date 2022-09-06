(window.webpackJsonp=window.webpackJsonp||[]).push([[63],{"154":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"h",(function(){return getRules})),__webpack_require__.d(__webpack_exports__,"a",(function(){return calcFieldValue})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getCloudToken})),__webpack_require__.d(__webpack_exports__,"j",(function(){return getZOHOtoken})),__webpack_require__.d(__webpack_exports__,"e",(function(){return getMeetStr})),__webpack_require__.d(__webpack_exports__,"f",(function(){return getMeetValueTip})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getExecutionValueTip})),__webpack_require__.d(__webpack_exports__,"d",(function(){return getLayoutRuleResult})),__webpack_require__.d(__webpack_exports__,"l",(function(){return thousandAbdDecimal})),__webpack_require__.d(__webpack_exports__,"k",(function(){return isMeetConditions})),__webpack_require__.d(__webpack_exports__,"i",(function(){return getSelectQuery})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getModuleText}));var _Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7),_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(16),_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(22),_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(134),_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(699),_tarojs_taro__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(917),antd__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(891),dayjs__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(157),dayjs__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_7__),_http_http__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(170);function getRules(e){var t=[];if(e.validations.presence){["Fields::TextField","Fields::TextAreaField","Fields::PercentField","Fields::IntegerField","Fields::DecimalField"].find((function(t){return t===e.type}))?t.push({"required":!0,"message":"请输入"+e.label}):t.push({"required":!0,"message":e.label+"为空"})}if(e.validations.length&&0!==e.validations.length.maximum&&t.push({"max":e.validations.length.maximum}),e.validations.numericality){var n={},a=0,_=0;"greater_than"===e.validations.numericality.lower_bound_check?(a=e.validations.numericality.lower_bound_value+1,n.min=a):"greater_than_or_equal_to"===e.validations.numericality.lower_bound_check&&(a=e.validations.numericality.lower_bound_value,n.min=a),"less_than"===e.validations.numericality.upper_bound_check?(_=e.validations.numericality.upper_bound_value-1,n.max=_):"less_than_or_equal_to"===e.validations.numericality.upper_bound_check&&(_=e.validations.numericality.upper_bound_value,n.max=_),n.message=e.label+"须在"+a+"-"+_+"之间",Object.keys(n).length>0&&t.push(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_3__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_3__.a)({},n),{},{"type":"number"}))}return"Fields::EmailField"===e.type&&t.push({"type":"email","message":e.label+"不是一个有效的email"}),"Fields::LinkField"===e.type&&t.push({"type":"url","message":e.label+"不是一个有效的url"}),t}function calcFieldValue(formula,fields,data,sub_label,data_item){var newFormula=formula;console.log("fields",fields.label),fields.forEach((function(e){newFormula=sub_label&&data_item?newFormula.replace("/[".concat(sub_label,".").concat(e.label,"]/g"),data_item[e.name]&&data_item[e.name]._isAdayjsObject?dayjs__WEBPACK_IMPORTED_MODULE_7___default()(data_item[e.name]).format("YYYY-MM-DD"):data_item[e.name]||0):data[e.name]&&data[e.name]._isAdayjsObject?newFormula.replace("/[".concat(e.label,"]/g"),dayjs__WEBPACK_IMPORTED_MODULE_7___default()(data[e.name]).format("YYYY-MM-DD")):newFormula.replace("/[".concat(e.label,"]/g"),data[e.name]||("Fields::TextField"===e.type?"":0))}));try{var result=eval(newFormula);return console.log(newFormula,result),"number"==typeof result?Math.round(100*result)/100:result}catch(e){return console.log(newFormula,e),null}}function refreshCloudToken(e){return new Promise(function(){var t=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().mark((function _callee(t,n){var a,_;return Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:a=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("expires_in"),_=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("access_token"),console.log("accessToken",_),_&&"refresh_token"===e.grant_type&&(!a||dayjs__WEBPACK_IMPORTED_MODULE_7___default.a.unix(Number(a)).diff(dayjs__WEBPACK_IMPORTED_MODULE_7___default()(),"minute")>1)?t({"access_token":_}):_http_http__WEBPACK_IMPORTED_MODULE_8__.a.post("/oauth/token",e,{"headers":{"Accept":"application/json"}}).then((function(e){var n=e.data;n.refresh_token&&(Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.d)({"key":"refresh_token","data":n.refresh_token}),Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.d)({"key":"access_token","data":n.access_token}),Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.d)({"key":"expires_in","data":n.created_at+n.expires_in})),t(n)})).catch((function(e){Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_5__.a)(),e.toString().indexOf("Request failed with status code 400")&&antd__WEBPACK_IMPORTED_MODULE_6__.b.error("token 过期, 请退出重新进入Zoho CRM")}));case 4:case"end":return n.stop()}}),_callee)})));return function(e,n){return t.apply(this,arguments)}}())}function getCloudToken(){return _getCloudToken.apply(this,arguments)}function _getCloudToken(){return(_getCloudToken=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().mark((function _callee3(){var e,t,n,a;return Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().wrap((function _callee3$(_){for(;;)switch(_.prev=_.next){case 0:if(e=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("expires_in"),t=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("access_token"),n=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("refresh_token"),!t||e&&!(dayjs__WEBPACK_IMPORTED_MODULE_7___default.a.unix(Number(e)).diff(dayjs__WEBPACK_IMPORTED_MODULE_7___default()(),"minute")>1)){_.next=5;break}return _.abrupt("return","Bearer ".concat(t));case 5:if(!n||"undefined"===n){_.next=10;break}return _.next=8,refreshCloudToken({"grant_type":"refresh_token","refresh_token":n}).then((function(e){return e?"Bearer ".concat(e.access_token):null}));case 8:return a=_.sent,_.abrupt("return",a);case 10:return _.abrupt("return",null);case 11:case"end":return _.stop()}}),_callee3)})))).apply(this,arguments)}function refreshZOHOToken(){return new Promise(function(){var e=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().mark((function _callee2(e,t){var n;return Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().wrap((function _callee2$(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,getCloudToken();case 2:(n=a.sent)&&_http_http__WEBPACK_IMPORTED_MODULE_8__.a.post("/api/v1/functions/current_user_zoho_access_token/execute",{},{"headers":{"Authorization":n}}).then((function(n){if(200===n.data.code){var a=n.data.data.result;Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.d)({"key":"zoho_access_token","data":a.zoho_access_token}),Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.d)({"key":"expiration_time","data":a.expiration_time}),e(a)}else t()})).catch((function(e){antd__WEBPACK_IMPORTED_MODULE_6__.b.error("网络错误"),Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_5__.a)(),t()}));case 4:case"end":return a.stop()}}),_callee2)})));return function(t,n){return e.apply(this,arguments)}}())}function getZOHOtoken(){return _getZOHOtoken.apply(this,arguments)}function _getZOHOtoken(){return(_getZOHOtoken=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().mark((function _callee4(){var e,t,n;return Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_regeneratorRuntime__WEBPACK_IMPORTED_MODULE_1__.a)().wrap((function _callee4$(a){for(;;)switch(a.prev=a.next){case 0:if(e=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("zoho_access_token"),t=Object(_tarojs_taro__WEBPACK_IMPORTED_MODULE_4__.a)("expiration_time"),console.log("zoho_access_token",e),t&&!(t&&dayjs__WEBPACK_IMPORTED_MODULE_7___default()(t||0)<dayjs__WEBPACK_IMPORTED_MODULE_7___default()(new Date))){a.next=10;break}return a.next=6,refreshZOHOToken().then((function(e){return e?"".concat(e.zoho_access_token):null})).catch((function(){return null}));case 6:return n=a.sent,a.abrupt("return",n);case 10:return a.abrupt("return",e?"".concat(e):null);case 11:case"end":return a.stop()}}),_callee4)})))).apply(this,arguments)}function isDate(e){return!!new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/).test(e)}function initSearchCondition(e){var t=[];return(e||[]).forEach((function(e){var n={};n.id=e.id,n.field_id=e.field_id,n.criteria_option=e.criteria_option,n.criteria_value=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__.a)(e.criteria_value),n.show_field_condition=e.show_field_condition,e.criteria_value[0]&&isDate(e.criteria_value[0])&&(n.criteria_value[0]=dayjs__WEBPACK_IMPORTED_MODULE_7___default()(e.criteria_value[0])),e.criteria_value[1]&&isDate(e.criteria_value[1])&&(n.criteria_value[1]=dayjs__WEBPACK_IMPORTED_MODULE_7___default()(e.criteria_value[1])),t.push(n)})),t}function getMeetStr(e){var t="满";return e.ladder_promotion||("product"===e.category&&"buy_and_give"===e.promotion_rule?t="每满":"combined"===e.category?("buy_and_give"===e.promotion_rule||"amount"===e.promotion_type&&"direct_reduction"===e.promotion_rule)&&(t="每满"):"whole_order"===e.category&&"discount"!==e.promotion_rule&&(t="每满")),t}function getMeetValueTip(e){return"buy_and_give"===e.promotion_rule?"".concat("amount"===e.promotion_type?"元":"","，赠送"):"direct_reduction"===e.promotion_rule?"".concat("amount"===e.promotion_type?"元":"","，").concat("product"!==e.category&&"amount"===e.promotion_type?"订单金额减":"订货价统一降至"):"discount"===e.promotion_rule?"".concat("amount"===e.promotion_type?"元":"","，").concat("product"!==e.category&&"amount"===e.promotion_type?"订单金额打折":"在原订货价基础上再打折"):null}function getExecutionValueTip(e){return"buy_and_give"===e.promotion_rule?"个":"direct_reduction"===e.promotion_rule?"元":"discount"===e.promotion_rule?"%":null}function isMeetCondition(e,t,n){var a=n.filter((function(t){return t.id===e.field_id}))[0];if(!a)return!1;if(null!=a&&a.name){var _=t[null==a?void 0:a.name];if(-1!==["IS","ON","EQ"].indexOf(e.criteria_option)&&_===e.criteria_value[0]||-1!==["ISNT","NOT_EQ"].indexOf(e.criteria_option)&&_!==e.criteria_value[0]||"IN"===e.criteria_option&&-1!==(e.criteria_value[0]||[]).indexOf(_)||"NOT_IN"===e.criteria_option&&-1===(e.criteria_value[0]||[]).indexOf(_)||"CONTAINS"===e.criteria_option&&-1!==String(_).indexOf(e.criteria_value[0])||"DOESNT_CONTAINS"===e.criteria_option&&-1===String(_).indexOf(e.criteria_value[0])||"ARRAY_CONTAINS"===e.criteria_option&&-1!==(_||[]).indexOf(e.criteria_value[0])||"ARRAY_DOESNT_CONTAINS"===e.criteria_option&&-1===(_||[]).indexOf(e.criteria_value[0])||"STARTS_WITH"===e.criteria_option&&String(_).startsWith(e.criteria_value[0])||"ENDS_WITH"===e.criteria_option&&String(_).endsWith(e.criteria_value[0])||"IS_EMPTY"===e.criteria_option&&-1!==["","null","undefined"].indexOf(String(_))||"IS_NOT_EMPTY"===e.criteria_option&&-1===["","null","undefined"].indexOf(String(_))||"BETWEEN"===e.criteria_option&&_>=e.criteria_value[0]&&_<=e.criteria_value[1]||"NOT_BETWEEN"===e.criteria_option&&_<e.criteria_value[0]&&_>e.criteria_value[1]||-1!==["BEFORE","LT"].indexOf(e.criteria_option)&&_<e.criteria_value[0]||"LTEQ"===e.criteria_option&&_<=e.criteria_value[0]||-1!==["AFTER","GT"].indexOf(e.criteria_option)&&_>e.criteria_value[0]||"GTEQ"===e.criteria_option&&_>=e.criteria_value[0]||"SELECTED"===e.criteria_option&&!0===_||"NOT_SELECTED"===e.criteria_option&&!1===_)return!0}return!1}function getLayoutRuleResult(layoutRule,allValues,sections){var isMeet=!1,fields=sections.map((function(e){return e.fields})).flat(),meets=[];if(layoutRule.conditions.forEach((function(e){meets.push(isMeetCondition(e,allValues,fields))})),"AND"===layoutRule.patten||!layoutRule.patten&&!layoutRule.custom_patten)isMeet=!0,meets.forEach((function(e){isMeet=isMeet&&e}));else if("OR"===layoutRule.patten)meets.forEach((function(e){isMeet=isMeet||e}));else if(layoutRule.custom_patten){var str=layoutRule.custom_patten;meets.forEach((function(e,t){str=str.replace("[".concat(t+1,"]"),e)})),console.log(str),str=str.replace(/OR/g,"||").replace(/AND/g,"&&"),console.log("str=======>",str);try{isMeet=!0===eval(str)}catch(e){console.log(layoutRule,e),isMeet=!1}}var newSections=Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__.a)(sections),clearValues={};return layoutRule.actions.forEach((function(e){"field"===e.show_type?newSections.forEach((function(t,n){t.fields.forEach((function(t,a){-1!==e.values.indexOf(t.id)&&(newSections[n].fields[a].hidden=!isMeet,isMeet||(clearValues[newSections[n].fields[a].name]=null))}))})):"section"===e.show_type?newSections.forEach((function(t,n){-1!==e.values.indexOf(t.id)&&(newSections[n].hidden=!isMeet,isMeet||(clearValues[t.fields[0].name]=null))})):"presence_field"===e.show_type&&newSections.forEach((function(t,n){t.fields.forEach((function(t,a){-1!==e.values.indexOf(t.id)&&(newSections[n].fields[a].validations.presence=isMeet)}))}))})),[newSections,clearValues]}function thousandAbdDecimal(e){var t=Number(e),n="CN￥";return n+=t?t.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,"$1,"):"0.00"}function isMeetConditions(condition,condition_items,data,fields){if(!condition)return!1;var isMeet=!1,meets=[];if(condition_items.forEach((function(e){meets.push(isMeetCondition(e,data,fields))})),"AND"===condition.patten||!condition.patten&&!condition.custom_patten)isMeet=!0,meets.forEach((function(e){isMeet=isMeet&&e}));else if("OR"===condition.patten)meets.forEach((function(e){isMeet=isMeet||e}));else if(condition.custom_patten){var str=condition.custom_patten;meets.forEach((function(e,t){str=str.replaceAll("[".concat(t+1,"]"),e)})),str=str.replaceAll("OR","||").replaceAll("AND","&&");try{isMeet=!0===eval(str)}catch(e){console.log(condition,e),isMeet=!1}}return isMeet}function getSelectQuery(e,t,n){var a,_,r="",o=null==t?void 0:t.find((function(e){return e.active&&"Street"===e.api_name})),i=[];o&&o.value.forEach((function(e,t){i=i.concat(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_3__.a)(Object(_Users_caiqianghui_work_Github_ibodor_h5_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_3__.a)({},o),{},{"api_name":0===t?"Province":1===t?"City1":"Street","value":e}))}));var c=null==t?void 0:t.filter((function(e){return e.active&&"Street"!==e.api_name})).concat(i);null==c||c.forEach((function(e,t){1===c.length?"="===e.node.key||"!="===e.node.key?r+="((".concat(e.api_name," ").concat(e.node.key," '").concat(e.value||"","')"):"like"===e.node.key||"not lik"===e.node.key?r+="(".concat(e.api_name," ").concat(e.node.key," '%").concat(e.value||"","%')"):"starts_with"===e.node.key?r+="(".concat(e.api_name," like '").concat(e.value||"","%')"):"ends_with"===e.node.key?r+="(".concat(e.api_name," like '%").concat(e.value||"","')"):r+="(".concat(e.api_name," ").concat(e.node.key,")"):t===c.length-1?"="===e.node.key||"!="===e.node.key?r+="((".concat(e.api_name," ").concat(e.node.key," '").concat(e.value||"","')"):("like"===e.node.key||"not lik"===e.node.key?r+="((".concat(e.api_name," ").concat(e.node.key," '%").concat(e.value||"","%')"):"starts_with"===e.node.key?r+="((".concat(e.api_name," like '").concat(e.value||"","%')"):"ends_with"===e.node.key?r+="((".concat(e.api_name," like '%").concat(e.value||"","')"):r+="((".concat(e.api_name," ").concat(e.node.key,")"),r+=") "):("="===e.node.key||"!="===e.node.key?r+="((".concat(e.api_name," ").concat(e.node.key," '").concat(e.value||"","')"):"like"===e.node.key||"not lik"===e.node.key?r+="((".concat(e.api_name," ").concat(e.node.key," '%").concat(e.value||"","%')"):"starts_with"===e.node.key?r+="((".concat(e.api_name," like '").concat(e.value||"","%')"):"ends_with"===e.node.key?r+="((".concat(e.api_name," like '%").concat(e.value||"","')"):r+="((".concat(e.api_name," ").concat(e.node.key,")"),r+=" and ")}));var s="select "+(null===(a=n.find((function(t){return t.moduleName===e})))||void 0===a||null===(_=a.selects)||void 0===_?void 0:_.join(","));return null==c||c.forEach((function(){r+=")"})),s+=" from ".concat(e," where ").concat(r)}function getModuleText(e,t){var n={"name":"","description":"","phone":"","amount":0,"rating":""};switch(t){case"Leads":n.name=e.Company,n.description=e.Full_Name,n.rating=e.Rating,n.phone=e.Phone;break;case"Deals":n.name=e.Deal_Name,n.description=e.Stage,n.amount=e.Amount,n.rating=e.Rating,n.phone=e.phone;break;case"Accounts":n.name=e.Account_Name,n.description=e.Department,n.phone=e.Phone;break;case"Public_Leads":n.name=e.Name,n.description=e.Last_Name,n.phone=e.Phone,n.rating=e.Rating;break;case"TelephoneDevelopment":n.name=e.company_name||"",n.description=e.Name||"",n.phone=e.Phone||e.phone||"",n.rating=e.Rating||"";break;case"CompetitionInformationFeedback":n.name=e.Name||"",n.description=e.competition_model||"",n.rating=e.laser_brand||"";break;default:n.name=e.Name||"",n.description=e.Last_Name||"",n.phone=e.Phone||e.phone||"",n.rating=e.Rating||""}return n}},"162":function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var a=n(6),_=n(5),r=n(13),o=n(10),i=n(11),c=n(43),s=n(14),u=n(891),l=n(185),d=(Error,{"200":"服务器成功返回请求的数据。","201":"新建或修改数据成功。","202":"一个请求已经进入后台排队（异步任务）。","204":"删除数据成功。","400":"发出的请求有错误，服务器没有进行新建或修改数据的操作。","401":"用户没有权限（令牌、用户名、密码错误）。","403":"用户得到授权，但是访问是被禁止的。","404":"发出的请求针对的是不存在的记录，服务器没有进行操作。","406":"请求的格式不可得。","410":"请求的资源被永久删除，且不会再得到的。","422":"当创建一个对象时，发生一个验证错误。","500":"服务器发生错误，请检查服务器。","502":"网关错误。","503":"服务不可用，服务器暂时过载或维护。","504":"网关超时。"}),p=function(){function HttpClient(){Object(_.a)(this,HttpClient)}return Object(a.a)(HttpClient,null,[{"key":"parseResponse","value":function parseResponse(e){var t=e.data;return console.log("data",t),200===t.code||(t.tips=t.tips||(null==t?void 0:t.error)||d[t.code],t.tips&&u.b.error(t.tips)),t}},{"key":"get","value":function get(e,t){return l.a.get(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"put","value":function put(e,t){return l.a.put(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"delete","value":function _delete(e,t){return l.a.delete(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"post","value":function post(e,t,n){return l.a.post(e,t,n).then((function(e){return HttpClient.parseResponse(e)}))}}]),HttpClient}()},"170":function(e,t,n){"use strict";var a=n(16),_=n(22),r=n(169),o=n.n(r).a.create({"baseURL":"https://cloud.netfarmer.com.cn","timeout":3e4});o.interceptors.request.use((function(e){return new Promise(function(){var t=Object(_.a)(Object(a.a)().mark((function _callee(t){return Object(a.a)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:t(e);case 1:case"end":return n.stop()}}),_callee)})));return function(e){return t.apply(this,arguments)}}())}),(function(e){return Promise.reject(e)})),t.a=o},"185":function(e,t,n){"use strict";var a=n(16),_=n(22),r=n(169),o=n.n(r),i=n(154),c=o.a.create({"baseURL":"https://cloud.netfarmer.com.cn","timeout":3e4});c.interceptors.request.use((function(e){return new Promise(function(){var t=Object(_.a)(Object(a.a)().mark((function _callee(t){var n,_;return Object(a.a)().wrap((function _callee$(a){for(;;)switch(a.prev=a.next){case 0:if(!e.url){a.next=8;break}if(console.log(e.url),"/api/v1/functions/single_sign_on/execute"===e.url||"/oauth/token"===e.url){a.next=8;break}return a.next=5,Object(i.b)();case 5:n=a.sent,console.log("cToken",n),n&&(_={"Accept":"application/json","Authorization":n},e.headers=_);case 8:t(e);case 9:case"end":return a.stop()}}),_callee)})));return function(e){return t.apply(this,arguments)}}())}),(function(e){return Promise.reject(e)})),t.a=c},"219":function(e,t,n){},"523":function(e,t,n){"use strict";var a=n(140),_=(n(219),n(136));t.a=function(e){return Object(_.jsxs)(a.e,{"className":"not-data ","children":[Object(_.jsx)(a.b,{"src":n(524)}),Object(_.jsx)(a.d,{"style":{"color":"rgba(165, 204, 255)"},"children":e.name||"暂未开发"})]})}},"524":function(e,t,n){e.exports=n.p+"static/images/not_data.png"},"605":function(e,t,n){},"922":function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return M}));var a=n(5),_=n(6),r=n(13),o=n(10),i=n(11),c=n(14),s=n(20),u=(n(605),n(699)),l=n(16),d=n(22),p=n(18),b=n(140),m=n(24),h=n(19),f=n(143),O=n(523),j=n(162),E=n(136),Approval=function(){return Object(E.jsxs)(b.e,{"className":"cloud-approval","children":[Object(E.jsx)(f.w,{"backArrow":null,"style":{"background":"#4a93ed"},"children":Object(E.jsx)(b.d,{"style":{"color":"#FFF"},"children":"审批"})}),Object(E.jsx)(b.e,{"className":"cloud-approval-tabs","children":Object(E.jsxs)(f.I,{"children":[Object(E.jsx)(f.I.Tab,{"className":"cloud-approval-tabs","title":"待我审批","children":Object(E.jsx)(k,{"type":"my_data"})},"agency"),Object(E.jsx)(f.I.Tab,{"className":"cloud-approval-tabs","title":"其他人审批","children":Object(E.jsx)(k,{"type":"other_data"})},"other_data"),Object(E.jsx)(f.I.Tab,{"className":"cloud-approval-tabs","title":"审批历史","children":Object(E.jsx)(v,{})},"my_approved_logs")]})})]})},k=function List(e){var t=e.type,n=Object(s.useState)(),a=Object(p.a)(n,2),_=a[0],r=a[1],o=Object(s.useState)(1),i=Object(p.a)(o,2),c=i[0],u=i[1],k=Object(s.useState)(),v=Object(p.a)(k,2),M=v[0],y=v[1],D=Object(s.useState)(!1),x=Object(p.a)(D,2),w=x[0],P=x[1],T=function getDatas(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;P(!0),j.a.get("/api/v1/system_process/model_processes/approval_list/?type=".concat(t),{"params":{"q":{"model_process_form_name_eq":"Contracts"},"page":e,"per_page":20}}).then((function(n){if(200===n.code&&n.data){console.log("getDatas",t,n),u(e);var a=n.data.datas;r(1===e?a:_&&_.concat(a)),y(n.data.info)}P(!1)}))};return Object(s.useEffect)((function(){T()}),[]),Object(s.useEffect)((function(){return m.a.eventCenter.on("deleteId",(function(e){e&&_&&T()})),function(){m.a.eventCenter.off("deleteId")}}),[_]),Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content","children":Object(E.jsxs)(f.A,{"onRefresh":Object(d.a)(Object(l.a)().mark((function _callee(){return Object(l.a)().wrap((function _callee$(e){for(;;)switch(e.prev=e.next){case 0:w||T();case 1:case"end":return e.stop()}}),_callee)}))),"children":[_?Object(E.jsx)(E.Fragment,{"children":_.length?Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-list","children":_.map((function(e,n){return Object(E.jsxs)(b.e,{"className":"cloud-approval-tabs-tab-content-list-item","onClick":function onClick(){Object(h.e)({"url":"pages/main/workbench/cloud/show/index?module_name=".concat(e.module_name,"&id=").concat(e.data_id,"&title=").concat(e.module_title)})},"children":[Object(E.jsxs)(b.d,{"className":"cloud-approval-tabs-tab-content-list-item-text webkit-hidden1","children":[Object(E.jsxs)(b.d,{"className":"cloud-approval-tabs-tab-content-list-item-module","children":[e.module_title,"-"]}),Object(E.jsx)(b.d,{"className":"cloud-approval-tabs-tab-content-list-item-name","children":e.name||"<无>"})]}),Object(E.jsxs)(b.e,{"children":[Object(E.jsxs)(f.J,{"className":"cloud-approval-tabs-tab-content-list-item-tag","children":[e.process_node_name,"-",e.status_str]}),Object(E.jsx)(f.J,{"className":"cloud-approval-tabs-tab-content-list-item-tag","color":"red","children":g(e.wait_deal_time)}),Object(E.jsx)(f.J,{"className":"cloud-approval-tabs-tab-content-list-item-tag","color":"green","children":e.owner_name})]}),"other_data"===t&&Object(E.jsxs)(b.d,{"children":["审批人：",e.usernames&&e.usernames.map((function(e,t){return Object(E.jsx)(b.d,{"className":"cloud-approval-tabs-tab-content-list-item-names","children":e},t)}))]})]},n)}))}):Object(E.jsx)(O.a,{"name":"暂无数据"})}):Object(E.jsxs)(b.e,{"style":{"padding":"0 20px"},"children":[Object(E.jsx)(f.E.Title,{"animated":!0}),Object(E.jsx)(f.E.Paragraph,{"lineCount":5,"animated":!0})]}),M&&_&&M.total_count!==_.length&&!w?Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-foot","onClick":function onClick(){T(c+1)},"children":Object(E.jsx)(b.d,{"children":"加载更多"})}):null,w&&Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-foot","children":Object(E.jsxs)(b.d,{"children":["加载中",Object(E.jsx)(f.t,{})]})})]})})},v=function ApprovedLogs(){var e=Object(s.useState)([]),t=Object(p.a)(e,2),n=t[0],a=t[1],_=Object(s.useState)(),r=Object(p.a)(_,2),o=r[0],i=r[1],c=Object(s.useState)(1),u=Object(p.a)(c,2),m=u[0],O=u[1],k=Object(s.useState)(),v=Object(p.a)(k,2),g=v[0],M=v[1],y=Object(s.useState)(!1),D=Object(p.a)(y,2),x=D[0],w=D[1],P=function groupBy(e,t){return e.reduce((function(e,n){var a=n[t];return e[a]||(e[a]=[]),e[a].push(n),e}),{})},T=function getDatas(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;w(!0),j.a.get("/api/v1/system_process/model_processes/my_approved_logs",{"params":{"q":{"form_name_eq":"Contracts"},"page":e,"per_page":20}}).then((function(t){if(200===t.code&&t.data){var _=t.data.datas;1===e?(a(_),i(P(_,"approval_date"))):(a(n.concat(_)),i(P(n.concat(_),"approval_date"))),O(e),M(t.data.info)}w(!1)}))};return Object(s.useEffect)((function(){T()}),[]),Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content","style":{"background":"#F2F2F2"},"children":Object(E.jsxs)(f.A,{"onRefresh":Object(d.a)(Object(l.a)().mark((function _callee2(){return Object(l.a)().wrap((function _callee2$(e){for(;;)switch(e.prev=e.next){case 0:x||T();case 1:case"end":return e.stop()}}),_callee2)}))),"children":[n.length&&o?Object(E.jsx)(E.Fragment,{"children":Object.keys(o).map((function(e,t){return Object(E.jsxs)(b.e,{"className":"cloud-approval-tabs-tab-content-logs","children":[Object(E.jsx)(b.d,{"className":"cloud-approval-tabs-tab-content-logs-time","children":e}),Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-logs-content","children":o[e].map((function(e,t){var n="blue";return"rejected"===e.status?n="red":"passed"!==e.status&&"submit"!==e.status||(n="green"),Object(E.jsxs)(b.e,{"className":"cloud-approval-tabs-tab-content-logs-item","children":[Object(E.jsx)(b.d,{"className":"cloud-approval-tabs-tab-content-logs-item-time","children":e.approval_time}),Object(E.jsxs)("div",{"style":{"color":"#696969"},"children":[Object(E.jsx)("span",{"style":{"marginRight":10},"children":e.username}),Object(E.jsx)(f.J,{"color":n,"children":e.status_str}),e.remark&&Object(E.jsxs)("span",{"style":{"marginLeft":10},"children":["(",e.remark,")"]}),Object(E.jsx)("span",{"style":{"marginLeft":10},"children":"了名为"}),Object(E.jsx)("a",{"onClick":function onClick(){Object(h.e)({"url":"pages/main/workbench/cloud/show/index?module_name=".concat(e.module_name,"&id=").concat(e.data_id,"&title=").concat(e.data_name)})},"children":e.data_name})," 的 ",Object(E.jsx)("span",{"style":{"fontWeight":"bold","marginRight":10},"children":e.module_title})]})]},t)}))})]},e)}))}):Object(E.jsxs)(b.e,{"style":{"padding":"0 20px"},"children":[Object(E.jsx)(f.E.Title,{"animated":!0}),Object(E.jsx)(f.E.Paragraph,{"lineCount":5,"animated":!0})]}),g&&g.total_count!==n.length&&!x?Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-foot","onClick":function onClick(){T(m+1)},"children":Object(E.jsx)(b.d,{"children":"加载更多"})}):null,x&&Object(E.jsx)(b.e,{"className":"cloud-approval-tabs-tab-content-foot","children":Object(E.jsxs)(b.d,{"children":["加载中",Object(E.jsx)(f.t,{})]})})]})})},g=function getShowTime(e){return e?(e/60<1?"".concat(e,"秒"):e/3600<1?"".concat(Math.round(e/60),"分钟"):e/86400<1?"".concat(Math.round(e/3600),"小时"):"".concat(Math.round(e/86400),"天"))||void 0:""},M=function(e){Object(o.a)(Index,e);var t=Object(i.a)(Index);function Index(e){var n;return Object(a.a)(this,Index),n=t.call(this,e),Object(c.a)(Object(r.a)(n),"getCloudCurrentUser",(function(){var e=Object(u.a)("cloudCurrentUser"),t=!1;(e&&e.is_admin||e.profile_id&&"管理员"===e.profile_id.name)&&(t=!0),n.setState({"cloudCurrentUser":e,"isAdmin":t})})),n.state={"cloudCurrentUser":void 0,"isAdmin":!1},n}return Object(_.a)(Index,[{"key":"componentWillMount","value":function componentWillMount(){this.getCloudCurrentUser()}},{"key":"componentDidMount","value":function componentDidMount(){}},{"key":"componentWillUnmount","value":function componentWillUnmount(){}},{"key":"componentDidShow","value":function componentDidShow(){}},{"key":"componentDidHide","value":function componentDidHide(){}},{"key":"render","value":function render(){return Object(E.jsx)(E.Fragment,{"children":Object(E.jsx)(Approval,{})})}}]),Index}(s.Component)}}]);