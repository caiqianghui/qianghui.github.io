(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{"632":function(e,n,t){"use strict";t.r(n);var c=t(134),a=t(18),i=t(20),s=t(440),r=t(176),o=t(486),l=t(282),u=t(140),f=t(136);n.default=function(e){var n=e.isDisable,t=e.onChange,j=Object(i.useState)([]),b=Object(a.a)(j,2),d=b[0],p=b[1],O=Object(i.useContext)(l.a).type;Object(i.useEffect)((function(){var n=(e.value||[]).map((function(e){return{"uid":e.id,"name":Object(f.jsxs)("span",{"children":[e.name,Object(f.jsxs)("span",{"style":{"marginLeft":20,"color":"#ccc"},"children":[e.size,"KB"]})]}),"status":"done","url":e.url}}));p("new"!==O?n:[])}),[]);var h={"name":"file","multiple":!0,"fileList":d,"beforeUpload":function beforeUpload(){return!1},"onChange":function onChange(e){p(e.fileList),t&&t(e.fileList)}};return Object(f.jsx)(u.e,{"className":"form-field","children":Object(f.jsx)(s.a,Object(c.a)(Object(c.a)({},h),{},{"children":!n&&Object(f.jsx)(r.a,{"icon":Object(f.jsx)(o.a,{}),"children":"上传"})}))})}}}]);