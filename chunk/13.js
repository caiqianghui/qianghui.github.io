(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"195":function(e,t,n){"use strict";n.d(t,"b",(function(){return getUserSelections})),n.d(t,"d",(function(){return getWarehouseStock})),n.d(t,"c",(function(){return getWarehouseBatchStock})),n.d(t,"a",(function(){return getSelections}));var r=n(16),a=n(22),c=n(162);function getUnits(e){return _getUnits.apply(this,arguments)}function _getUnits(){return(_getUnits=Object(a.a)(Object(r.a)().mark((function _callee(e){return Object(r.a)().wrap((function _callee$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/product_manage/units/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee)})))).apply(this,arguments)}function getPricingSystems(e){return _getPricingSystems.apply(this,arguments)}function _getPricingSystems(){return(_getPricingSystems=Object(a.a)(Object(r.a)().mark((function _callee2(e){return Object(r.a)().wrap((function _callee2$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/price_manage/pricing_systems/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee2)})))).apply(this,arguments)}function getCategories(e){return _getCategories.apply(this,arguments)}function _getCategories(){return(_getCategories=Object(a.a)(Object(r.a)().mark((function _callee4(e){return Object(r.a)().wrap((function _callee4$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/product_manage/categories/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee4)})))).apply(this,arguments)}function getBrands(e){return _getBrands.apply(this,arguments)}function _getBrands(){return(_getBrands=Object(a.a)(Object(r.a)().mark((function _callee5(e){return Object(r.a)().wrap((function _callee5$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/product_manage/brands/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee5)})))).apply(this,arguments)}function getUserSelections(e){return _getUserSelections.apply(this,arguments)}function _getUserSelections(){return(_getUserSelections=Object(a.a)(Object(r.a)().mark((function _callee7(e){return Object(r.a)().wrap((function _callee7$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/account/users/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee7)})))).apply(this,arguments)}function getWarehouses(e){return _getWarehouses.apply(this,arguments)}function _getWarehouses(){return(_getWarehouses=Object(a.a)(Object(r.a)().mark((function _callee8(e){return Object(r.a)().wrap((function _callee8$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/warehouse_manage/warehouses/selection",{"params":e}));case 1:case"end":return t.stop()}}),_callee8)})))).apply(this,arguments)}function getWarehouseStock(e){return _getWarehouseStock.apply(this,arguments)}function _getWarehouseStock(){return(_getWarehouseStock=Object(a.a)(Object(r.a)().mark((function _callee9(e){return Object(r.a)().wrap((function _callee9$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/warehouse_manage/warehouses/warehouse_stock",{"params":e}));case 1:case"end":return t.stop()}}),_callee9)})))).apply(this,arguments)}function getWarehouseBatchStock(e){return _getWarehouseBatchStock.apply(this,arguments)}function _getWarehouseBatchStock(){return(_getWarehouseBatchStock=Object(a.a)(Object(r.a)().mark((function _callee10(e){return Object(r.a)().wrap((function _callee10$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",c.a.get("/api/v1/qudaoyi/warehouse_manage/warehouses/batch_stock",{"params":e}));case 1:case"end":return t.stop()}}),_callee10)})))).apply(this,arguments)}function getTabSelections(e,t){return _getTabSelections.apply(this,arguments)}function _getTabSelections(){return(_getTabSelections=Object(a.a)(Object(r.a)().mark((function _callee17(e,t){return Object(r.a)().wrap((function _callee17$(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",c.a.get("/api/v1/".concat(e,"/selection"),{"params":t}));case 1:case"end":return n.stop()}}),_callee17)})))).apply(this,arguments)}function getSelections(e,t){return _getSelections.apply(this,arguments)}function _getSelections(){return(_getSelections=Object(a.a)(Object(r.a)().mark((function _callee18(e,t){return Object(r.a)().wrap((function _callee18$(n){for(;;)switch(n.prev=n.next){case 0:n.t0=e,n.next="units"===n.t0?3:"warehouses"===n.t0?4:"categories"===n.t0?5:"brands"===n.t0?6:"pricing_systems"===n.t0?7:8;break;case 3:return n.abrupt("return",getUnits(t));case 4:return n.abrupt("return",getWarehouses(t));case 5:return n.abrupt("return",getCategories(t));case 6:return n.abrupt("return",getBrands(t));case 7:return n.abrupt("return",getPricingSystems(t));case 8:return n.abrupt("return",getTabSelections(e,t));case 9:case"end":return n.stop()}}),_callee18)})))).apply(this,arguments)}},"624":function(e,t,n){"use strict";n.r(t);var r=n(16),a=n(22),c=n(134),s=n(18),o=n(20),i=n(891),l=n(263),u=n.n(l),d=n(154),p=n(140),_=n(900),f=n(903),b=n(143),h=n(482),j=n(282),g=n(244),m=n(195),O=n(136);t.default=function(e){var t=Object(o.useContext)(j.a),n=t.form,l=t.fields,x=t.refForm,y=t.productsRef,v=t.promotionsRef,S=e.field,k=e.value,w=e.isDisable,N=e.placeholder,C=e.onChange,F=e.onSelect,W=e.subFormName,q=e.index,$=e.initSelectionDatas,B=e.subFormSelectSetting,U=e.overloadData,D=Object(o.useState)([]),M=Object(s.a)(D,2),P=M[0],R=M[1],T=Object(o.useState)(""),V=Object(s.a)(T,2),z=V[0],E=V[1],J=Object(o.useState)(),I=Object(s.a)(J,2),L=I[0],H=I[1],A=Object(o.useState)(!1),G=Object(s.a)(A,2),K=G[0],Q=G[1],X=Object(o.useState)(!0),Y=Object(s.a)(X,2),Z=Y[0],ee=Y[1],te=Object(o.useState)(),ne=Object(s.a)(te,2),re=ne[0],ae=ne[1],ce="sales_orders"===n.name&&!x.getFieldValue("client_id"),se=W?(U[W]||[])[q]&&U[W][q][S.name]&&U[W][q][S.name].related_field_search_condition:U[S.name]&&U[S.name].related_field_search_condition,oe=Object(o.useState)(1),ie=Object(s.a)(oe,2),le=ie[0],ue=ie[1];Object(o.useEffect)((function(){B&&Object(g.a)({"form_name":S.options.data_source_type}).then((function(e){if(e.data){var t={};B.show_columns.forEach((function(n){var r=e.data.fields.filter((function(e){return e.id===n}))[0];r&&(t[r.id]={"name":r.name,"label":r.label})}))}}))}),[]);var de=function searchSelectionDatas(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(S.options.data_source_type){var r=null;if(W){var a=l.filter((function(e){return"Fields::NestedFormField"===e.type&&e.name===W}))[0];r=a&&a.fields.filter((function(e){return e.is_default_relation_field&&2===e.default_relation_field.length&&e.default_relation_field[0]===S.key}))}else r=(l||[]).filter((function(e){return e.is_default_relation_field&&2===e.default_relation_field.length&&e.default_relation_field[0]===S.key}));if(S.options.show_warehouse_stock&&W){var s=l.filter((function(e){return"Fields::NestedFormField"===e.type&&e.name===W}))[0],o=s&&s.fields.filter((function(e){return"Fields::ResourceField"===e.type&&"products"===e.options.data_source_type}))[0];o&&Object(m.d)({"product_id":x.getFieldValue([W,q,o.name])}).then((function(e){var t=(e.data||[]).map((function(e){return{"id":e.id,"name":"".concat(e.name,"（").concat(e.stock,"）")}}));R(t)}))}else{var i={"q":Object(c.a)(Object(c.a)({},e||{}),se||S.related_field_search_condition||{}),"page":t,"sub_form_select_setting_id":B&&B.id,"client_id":n&&"sales_orders"===n.name?x.getFieldValue("client_id"):null,"search_field_id":S.id,"form_name":n&&n.name,"is_auth":S.options.data_range_by_auth,"show_column_options":JSON.stringify(S.options.show_column_options||[]),"related_fields":r&&r.map((function(e){return e.default_relation_field[1]})).join(",")};"products"===S.options.data_source_type&&(i.related_fields="".concat(i.related_fields,",saleable_stock,lock_stock")),console.log(i,"paramsparams");var u=t;Object(m.a)(S.options.data_source_type,i).then((function(e){if(console.log(e),e.data){var n=e.data.datas;R(t>1?P.concat(n):n),ee(e.data.info.total_count!==n.length),u++,ue(u),k&&(ae(n.find((function(e){return e.id===k}))),_e(k))}else Q(!1)}))}}};Object(o.useEffect)((function(){k&&0===P.filter((function(e){return e.id===k})).length&&($&&$[S.id]?R($[S.id]):de({"id_eq":k}))}),[k]);var pe=u()((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n={};e&&(S.search_columns?n["".concat(S.search_columns.join("_or_"),"_cont")]=e:n.name_cont=e),E(e),de(n,t)}),500),_e=function resourceSelectChange(e){if("sales_orders"!==n.name||x.getFieldValue("client_id")){var t=P.filter((function(t){return t.id===e}))[0];t&&(y.current[e]=t,v.current[e]=t.current_promotion,H(t.current_promotion)),C(e),ae(t)}else C(null),R([]),i.b.warning("请选择客户！",5)},fe=function(){var e=Object(a.a)(Object(r.a)().mark((function _callee(){return Object(r.a)().wrap((function _callee$(e){for(;;)switch(e.prev=e.next){case 0:Z&&K&&pe(z,le);case 1:case"end":return e.stop()}}),_callee)})));return function loadMore(){return e.apply(this,arguments)}}(),be=Object(O.jsxs)(p.e,{"className":"form-field","onClick":function onClick(){w||Q(!0)},"children":[Object(O.jsxs)(p.e,{"className":"form-field-content","children":[re?Object(O.jsxs)(p.d,{"className":"form-field-content-text","style":{"margin":0},"children":[re.current_promotion&&Object(O.jsx)(p.e,{"style":{"color":"#8c7ee4","border":"1px solid rgba(140,123,231,.4)","marginRight":5,"padding":"0 2px","fontSize":"10px"},"children":Object(O.jsx)(p.d,{"children":re.current_promotion.promotion_rule_str})}),re.show_name||re.name]}):Object(O.jsx)(p.d,{"className":"form-field-content-placeholder","children":N||""}),Object(O.jsx)(_.a,{})]}),Object(O.jsx)(b.z,{"visible":K,"onMaskClick":function onMaskClick(){Q(!1)},"bodyStyle":{"minHeight":"90vh"},"children":Object(O.jsxs)(p.e,{"className":"resource-popup","children":[Object(O.jsx)(b.s.Item,{"prefix":Object(O.jsx)(f.a,{}),"extra":Object(O.jsx)("a",{"onClick":function onClick(){return pe(z)},"children":"搜索"}),"className":"search-content","children":Object(O.jsx)(b.r,{"placeholder":"请输入内容","clearable":!0,"value":z,"onChange":function onChange(e){return E(e)}})}),ce?Object(O.jsx)(p.d,{"style":{"color":"red"},"children":"请先选择客户"}):null,Object(O.jsx)(p.e,{"className":"main","children":Object(O.jsxs)(b.e,{"defaultValue":e.value?[e.value]:[],"onChange":function onChange(e){_e(void 0===e[0]?null:e[0]),F&&void 0===e[0]?F(null):F(P.filter((function(t){return t.id===e[0]}))[0]),Q(!1)},"children":[P.map((function(e){return Object(O.jsx)(b.e.Item,{"value":e.id.toString(),"disabled":ce,"children":Object(O.jsxs)("p",{"children":[Object(O.jsxs)("p",{"style":{"margin":0},"children":[e.current_promotion&&Object(O.jsx)("span",{"style":{"color":"#8c7ee4","border":"1px solid rgba(140,123,231,.4)","marginRight":5,"padding":"0 2px","fontSize":"10px"},"children":e.current_promotion.promotion_rule_str}),e.show_name||e.name]}),Object(O.jsxs)("p",{"style":{"margin":0,"fontSize":"10px","color":"gray"},"children":[Object(O.jsxs)("span",{"children":["可销售库存：",e.saleable_stock||0]}),Object(O.jsxs)("span",{"style":{"float":"right"},"children":["锁定库存：",e.lock_stock||0]})]})]})},e.id)})),Object(O.jsx)(b.q,{"loadMore":fe,"hasMore":Z,"threshold":100})]})}),Object(O.jsx)(b.c,{"onClick":function onClick(){return Q(!1)},"block":!0,"children":"关闭"})]})})]});return L?Object(O.jsxs)(p.e,{"className":"field","children":[be,Object(O.jsx)(b.y,{"placement":"topLeft","content":Object(O.jsxs)(p.e,{"className":"popover-content","children":[Object(O.jsxs)(p.d,{"className":"category","children":[L.category_str,"-",L.promotion_rule_str]}),Object(O.jsx)(p.d,{"className":"popover-title","children":L.title}),Object(O.jsxs)(p.e,{"className":"popover-category","children":[Object(O.jsx)(p.d,{"className":"popover-text","children":"combined"===L.category?"活动商品合计订购":"订购"}),Object(O.jsx)(p.d,{"className":"popover-text","children":"quantity"===L.promotion_type?"数量":"金额"})]}),Object(O.jsx)(p.e,{"className":"popover-list","children":L.promotion_conditions.map((function(e,t){return Object(O.jsx)(p.e,{"className":"popover-item","children":Object(O.jsxs)("span",{"children":[Object(d.e)(L),Object(O.jsx)("span",{"style":{"color":"red","margin":"0  2px"},"children":parseFloat(e.meet_value||0)}),Object(d.f)(L),"buy_and_give"===L.promotion_rule&&e.give_products.map((function(t,n){return Object(O.jsxs)("span",{"style":{"textDecoration":"underline"},"children":[Object(O.jsxs)("a",{"children":["“[",t.code,"]",t.name,"”"]}),e.give_products.length>1&&n+1!==e.give_products.length&&Object(O.jsx)("span",{"children":"，"})]},t.id)})),Object(O.jsx)("span",{"style":{"color":"red","margin":"0  2px"},"children":parseFloat(e.execution_value||0)}),Object(d.c)(L)]})},t)}))}),Object(O.jsx)(p.d,{"className":"popover-desc","children":"说明：多单位商品按最小单位计件数"})]}),"children":Object(O.jsx)(h.a,{"style":{"marginLeft":"4px"}})})]}):be}}}]);