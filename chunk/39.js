(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{"613":function(e,r,n){"use strict";n.r(r);var o=n(20),t=n(914),c=(n(205),n(283)),s=n(143),a=n(482),i=n(140),l=n(136);r.default=function(e){var r=Object(o.useContext)(c.a),n=r.refForm,p=r.form,u=r.productsRef,d=e.field,_=e.value,b=e.isDisable,h=e.placeholder,m=e.onChange,f=e.onBlur,j=e.subFormName,x=e.index,w=(e.onSelect,"sales_orders"===p.name&&"price"===d.name&&"sales_order_items"===j&&n&&u.current[n.getFieldValue([j,x,"product_id"])]),g=Object(l.jsx)(t.a,{"className":"field","status":w&&parseFloat(w.current_client_price||0)!==parseFloat(_||0)&&"warning","step":1,"type":"number","bordered":!1,"placeholder":h,"onBlur":function onBlur(e){f&&f(e.target.value)},"disabled":d.is_formula||b,"parser":function parser(e){var r=e,n=Math.pow(10,d.options.decimal_places||2);return"round_up"===d.options.round_option?r=Math.ceil(Number(e)*n)/n:"round_down"===d.options.round_option&&(r=Math.floor(Number(e)*n)/n),r},"value":_,"precision":d.options.decimal_places||2,"prefix":d.options.hide_currency?"":"￥","onChange":function onChange(e){console.log(e),m&&m(e)}});return w?Object(l.jsxs)(i.e,{"className":"row-center","children":[g,Object(l.jsx)(s.y,{"placement":"top","content":Object(l.jsxs)("div",{"children":[Object(l.jsxs)("div",{"style":{"color":"red","textDecoration":parseFloat(w.current_client_price||0)!==parseFloat(_||"0")?"line-through":"none"},"children":[w.current_client_price_type,"：",w.current_client_price]}),Object(l.jsxs)("div",{"style":{"color":"red"},"children":["当前价：",_]})]}),"children":Object(l.jsx)(a.a,{"style":{"marginLeft":"4px"}})})]}):g}}}]);