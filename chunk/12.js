(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"172":function(e,t,n){"use strict";n.d(t,"a",(function(){return b}));var c=n(16),a=n(134),r=n(22),o=n(5),u=n(6),s=n(211),i=n(239),l=n(154),p="Bearer NYbImmWjVdyN8Dh8PPq4XqVuKNCNWcp5dCDa8o2Xtyg",d="/api/v1/functions/forward_request/callback",b=function(){function NetCloudFun(){Object(o.a)(this,NetCloudFun)}var e,t,n,b;return Object(u.a)(NetCloudFun,null,[{"key":"get","value":(b=Object(r.a)(Object(c.a)().mark((function _callee(e,t,n){var r;return Object(c.a)().wrap((function _callee$(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,Object(l.j)();case 2:if(!(r=c.sent)){c.next=7;break}return c.abrupt("return",s.a.post(d,{"method":"GET","url":"https://www.zohoapis.com.cn"+e,"access_token":r,"payload":t},{"headers":Object(a.a)({"Content-Type":"application/json","Authorization":p},n)}));case 7:return c.abrupt("return",{"data":null,"info":null});case 8:case"end":return c.stop()}}),_callee)}))),function get(e,t,n){return b.apply(this,arguments)})},{"key":"post","value":(n=Object(r.a)(Object(c.a)().mark((function _callee2(e,t){var n;return Object(c.a)().wrap((function _callee2$(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,Object(l.j)();case 2:if(!(n=c.sent)){c.next=7;break}return c.abrupt("return",i.a.post(d,{"method":"POST","url":"https://www.zohoapis.com.cn"+e,"access_token":n,"payload":t},{"headers":{"Content-Type":"application/json","Authorization":p}}));case 7:return c.abrupt("return",{"data":null,"info":null});case 8:case"end":return c.stop()}}),_callee2)}))),function post(e,t){return n.apply(this,arguments)})},{"key":"delete","value":(t=Object(r.a)(Object(c.a)().mark((function _callee3(e,t){var n;return Object(c.a)().wrap((function _callee3$(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,Object(l.j)();case 2:if(!(n=c.sent)){c.next=7;break}return c.abrupt("return",s.a.post(d,{"method":"DELETE","url":"https://www.zohoapis.com.cn"+e,"access_token":n,"payload":t},{"headers":{"Content-Type":"application/json","Authorization":p}}));case 7:return c.abrupt("return",{"data":null,"info":null});case 8:case"end":return c.stop()}}),_callee3)}))),function _delete(e,n){return t.apply(this,arguments)})},{"key":"put","value":(e=Object(r.a)(Object(c.a)().mark((function _callee4(e,t){var n;return Object(c.a)().wrap((function _callee4$(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,Object(l.j)();case 2:if(!(n=c.sent)){c.next=7;break}return c.abrupt("return",i.a.post(d,{"method":"PUT","url":"https://www.zohoapis.com.cn"+e,"access_token":n,"payload":t},{"headers":{"Content-Type":"application/json","Authorization":p}}));case 7:return c.abrupt("return",{"data":null,"info":null});case 8:case"end":return c.stop()}}),_callee4)}))),function put(t,n){return e.apply(this,arguments)})}]),NetCloudFun}()},"211":function(e,t,n){"use strict";n.d(t,"a",(function(){return O}));var c=n(6),a=n(5),r=n(13),o=n(10),u=n(11),s=n(43),i=n(14),l=n(16),p=n(22),d=n(169),b=n.n(d),j=n(154),f=b.a.create({"baseURL":"https://cloud.netfarmer.com.cn","timeout":3e4});f.interceptors.request.use((function(e){return new Promise(function(){var t=Object(p.a)(Object(l.a)().mark((function _callee(t){var n,c;return Object(l.a)().wrap((function _callee$(a){for(;;)switch(a.prev=a.next){case 0:if(!e.url){a.next=8;break}if(console.log(e.url),"/api/v1/functions/single_sign_on/execute"===e.url||"/oauth/token"===e.url){a.next=8;break}return a.next=5,Object(j.b)();case 5:n=a.sent,console.log("cToken",n),n&&(c={"Accept":"application/json","Authorization":n},e.headers=c);case 8:t(e);case 9:case"end":return a.stop()}}),_callee)})));return function(e){return t.apply(this,arguments)}}())}),(function(e){return Promise.reject(e)}));var h=f,O=(Error,function(){function HttpClient(){Object(a.a)(this,HttpClient)}return Object(c.a)(HttpClient,null,[{"key":"parseResponse","value":function parseResponse(e){var t=e.data;return console.log("parseResponse-data",t),t}},{"key":"get","value":function get(e,t){return h.get(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"put","value":function put(e,t){return h.put(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"delete","value":function _delete(e,t){return h.delete(e,t).then((function(e){return HttpClient.parseResponse(e)}))}},{"key":"post","value":function post(e,t,n){return h.post(e,t,n).then((function(e){return HttpClient.parseResponse(e)}))}}]),HttpClient}())},"239":function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var c=n(5),a=n(6),r=n(211),o=n(917),u=function(){function HttpLoading(){Object(c.a)(this,HttpLoading)}return Object(a.a)(HttpLoading,null,[{"key":"get","value":function get(e,t){return Object(o.b)(),r.a.get(e,t).then((function(e){return Object(o.a)(),e})).catch((function(e){return Object(o.a)(),Promise.reject(e)}))}},{"key":"put","value":function put(e,t){return Object(o.b)(),r.a.put(e,t).then((function(e){return Object(o.a)(),e})).catch((function(e){return Object(o.a)(),Promise.reject(e)}))}},{"key":"post","value":function post(e,t,n){return Object(o.b)(),r.a.post(e,t,n).then((function(e){return Object(o.a)(),console.log("HttpLoading.posr-then",e),Promise.resolve(e)})).catch((function(e){return console.log("post",e),Object(o.a)(),Promise.reject(e)}))}}]),HttpLoading}()},"609":function(e,t,n){"use strict";n.r(t);var c=n(134),a=n(18),r=n(140),o=n(143),u=n(20),s=n(172),i=n(900),l=n(891),p=n(187),d=n(136),b=p.a.signInMoudles;t.default=function(e){var t=e.moduleName,n=e.onSelect,p=Object(u.useState)(!1),j=Object(a.a)(p,2),f=j[0],h=j[1],O=Object(u.useState)(""),m=Object(a.a)(O,2),v=m[0],k=m[1],g=Object(u.useState)(),x=Object(a.a)(g,2),w=x[0],y=x[1],C=Object(u.useState)(),_=Object(a.a)(C,2),N=_[0],T=_[1],S=Object(u.useState)(1),P=Object(a.a)(S,2),H=P[0],L=P[1],A=Object(u.useState)(),z=Object(a.a)(A,2),R=z[0],D=z[1],E=Object(u.useState)(!1),F=Object(a.a)(E,2),$=F[0],q=F[1];Object(u.useEffect)((function(){D(void 0)}),[t]);var M=function refresh(e,n){q(!0);var c={"page":e,"per_page":20};if(t){var a=b.find((function(e){return e.label===t}));a&&(!v||n?(console.log("functions"),s.a.get("/crm/v2/".concat(a.value),c).then((function(t){console.log("functions",t),t.data&&(L(e),y(1===e?t.data:(w||[]).concat(t.data)),T(t.info),q(!1))})).catch((function(e){y([]),q(!1)}))):s.a.get("/crm/v2/".concat(a.value,"/search"),{"word":v,"page":e,"per_page":20}).then((function(t){console.log("functions",t),t.data&&(L(e),y(1===e?t.data:(w||[]).concat(t.data)),T(t.info),q(!1))})).catch((function(e){y([]),q(!1)})))}};return Object(d.jsxs)(r.e,{"className":"field","children":[Object(d.jsxs)(r.e,{"onClick":function onClick(){t?(y(void 0),M(1),h(!0)):l.b.warn("请先选择签到模块")},"className":"field-content","children":[Object(d.jsx)(r.d,{"className":"field-text","children":R&&R.name||""}),Object(d.jsx)(i.a,{})]}),Object(d.jsx)(o.z,{"visible":f,"onMaskClick":function onMaskClick(){h(!1)},"bodyStyle":{"height":"70vh"},"children":Object(d.jsxs)(r.e,{"className":"show-menu-content","children":[Object(d.jsx)(o.C,{"placeholder":"请输入内容","onChange":function onChange(e){return k(e)},"onSearch":function onSearch(){return M(1)},"onClear":function onClear(){return M(1,!0)}}),w&&Object(d.jsxs)(r.e,{"className":"show-menu-content-scroll","children":[Object(d.jsx)(r.c,{"style":{"height":"100%"},"scrollTop":0,"enhanced":!0,"scrollY":!0,"lowerThreshold":100,"onScrollToLower":function onScrollToLower(){N.more_records&&M(H+1)},"children":Object(d.jsx)(o.B.Group,{"defaultValue":R&&R.id,"children":w.map((function(e){var a=b.find((function(e){return e.label===t})),u=function getModuleText(e,t){var n={"name":"","description":"","phone":"","amount":0};switch(t){case"Leads":n.name=e.Company,n.description=e.Full_Name,n.phone=e.Phone;break;case"Deals":n.name=e.Deal_Name,n.description=e.Stage,n.amount=e.Amount;break;case"Accounts":n.name=e.Account_Name,n.description=e.Department,n.phone=e.Phone;break;case"Public_Leads":n.name=e.Name,n.description=e.Last_Name,n.phone=e.Phone}return n}(e,(null==a?void 0:a.value)||"");return Object(d.jsx)(r.e,{"children":Object(d.jsxs)(o.B,{"className":"content-list-item-row","block":!0,"value":e.id,"onChange":function onChange(){D(Object(c.a)({"id":e.id},u)),h(!1),n&&n(Object(c.a)({"id":e.id},u))},"children":[Object(d.jsxs)(r.e,{"className":"content-list-item","children":[Object(d.jsx)(r.d,{"className":"content-list-item-name","children":u.name}),Object(d.jsx)(r.d,{"className":"content-list-item-name2","children":u.description}),Object(d.jsx)(r.d,{"children":u.phone})]}),Object(d.jsx)(i.a,{})]})},e.id)}))})}),!w.length&&!$&&Object(d.jsxs)(r.d,{"style":{"display":"block","textAlign":"center","marginTop":"20px"},"children":["暂无数据",Object(d.jsx)(o.c,{"onClick":function onClick(){return M(1)},"children":"刷新"})]})]}),$&&Object(d.jsxs)(r.d,{"style":{"display":"block","textAlign":"center","marginTop":"20px"},"children":["加载中",Object(d.jsx)(o.k,{})]})]})})]})}}}]);