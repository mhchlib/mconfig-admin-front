(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["views-Config"],{1071:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"hello"},[a("v-jsoneditor",{attrs:{options:t.options,plus:!0,height:"600px"},on:{error:t.onError},model:{value:t.json,callback:function(e){t.json=e},expression:"json"}}),a("div",{staticClass:"options"},[a("v-btn",{attrs:{depressed:"",color:"primary"}},[t._v(" 查看schema ")]),a("v-btn",{attrs:{depressed:"",color:"error"}},[t._v(" 保存上线 ")]),a("v-btn",{attrs:{depressed:"",color:"error"}},[t._v(" 立即归档 ")]),a("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,i=e.attrs;return[a("v-btn",t._g(t._b({attrs:{color:"primary",dark:""}},"v-btn",i,!1),n),[t._v(" 历史存档 ")])]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-toolbar",{attrs:{dark:"",color:"primary"}},[a("v-btn",{attrs:{icon:"",dark:""},on:{click:function(e){t.dialog=!1}}},[a("v-icon",[t._v("mdi-close")])],1),a("v-toolbar-title",[t._v(" 历史存档")])],1),a("v-card",{staticStyle:{width:"90%","margin-left":"5%","margin-top":"5px"}},[a("v-tabs",{attrs:{dark:"","background-color":"teal primary","show-arrows":""},model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},[a("v-tabs-slider",{attrs:{color:"teal lighten-3"}}),t._l(t.achieves,(function(e,n){return a("v-tab",{key:n,attrs:{href:"#"+n}},[t._v(" "+t._s(n)+" ")])}))],2)],1),a("v-snackbar",{attrs:{timeout:-1,value:!0,left:"",shaped:"",color:"primary"}},[t._v(" "+t._s(t.achieves[t.tab].desc)+" ")]),a("div",{staticClass:"achieve"},[a("div",[a("v-jsoneditor",{attrs:{options:t.options,plus:!0,height:"600px"},on:{error:t.onError},model:{value:t.achieves[t.tab].config,callback:function(e){t.$set(t.achieves[t.tab],"config",e)},expression:"achieves[tab].config"}})],1),a("div",[a("v-jsoneditor",{attrs:{options:t.options,plus:!0,height:"600px"},on:{error:t.onError},model:{value:t.achieves[t.tab].schema,callback:function(e){t.$set(t.achieves[t.tab],"schema",e)},expression:"achieves[tab].schema"}})],1)])],1)],1)],1)],1)},i=[],o=a("bcb2"),s=a.n(o),r={name:"app",components:{VJsoneditor:s.a},data:function(){return{tab:"current",json:{hello:"vue",hello1:"vue"},options:{mode:"code"},dialog:!1,notifications:!1,sound:!0,widgets:!1,achieves:{current:{desc:"dsada",config:"{}",schema:"{}"},"v1.12":{desc:"dsadadsadadsadadsada",config:"{}",schema:"{}"},"v1.08":{desc:"dsadadsada",config:"{}",schema:"{}"},"v1.7":{desc:"dsada",config:"{}",schema:"{}"},"v1.4":{desc:"dsada",config:"{}",schema:"{}"},"v0.7":{desc:"dsada",config:"{}",schema:"{}"},"v0.2":{desc:"dsadadsadadsadadsada",config:"{}",schema:"{}"}}}},methods:{onError:function(){console.log("error")}}},c=r,d=(a("4bc5"),a("2877")),l=a("6544"),u=a.n(l),v=a("8336"),h=a("b0af"),f=a("169a"),b=a("132d"),p=a("2db4"),m=a("71a3"),g=a("fe57"),y=a("9a96"),A=a("71d9"),O=a("2a7f"),j=Object(d["a"])(c,n,i,!1,null,"80ff8fda",null);e["default"]=j.exports;u()(j,{VBtn:v["a"],VCard:h["a"],VDialog:f["a"],VIcon:b["a"],VSnackbar:p["a"],VTab:m["a"],VTabs:g["a"],VTabsSlider:y["a"],VToolbar:A["a"],VToolbarTitle:O["b"]})},"21be":function(t,e,a){"use strict";a("99af"),a("caad"),a("e25e"),a("2532");var n=a("2909"),i=a("2b0e"),o=a("80d2");e["a"]=i["a"].extend().extend({name:"stackable",data:function(){return{stackElement:null,stackExclude:null,stackMinZIndex:0,isActive:!1}},computed:{activeZIndex:function(){if("undefined"===typeof window)return 0;var t=this.stackElement||this.$refs.content,e=this.isActive?this.getMaxZIndex(this.stackExclude||[t])+2:Object(o["v"])(t);return null==e?e:parseInt(e)}},methods:{getMaxZIndex:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=this.$el,a=[this.stackMinZIndex,Object(o["v"])(e)],i=[].concat(Object(n["a"])(document.getElementsByClassName("v-menu__content--active")),Object(n["a"])(document.getElementsByClassName("v-dialog__content--active"))),s=0;s<i.length;s++)t.includes(i[s])||a.push(Object(o["v"])(i[s]));return Math.max.apply(Math,a)}}})},2909:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));a("277d");var n=a("6b75");function i(t){if(Array.isArray(t))return Object(n["a"])(t)}a("a4d3"),a("e01a"),a("d28b"),a("a630"),a("d3b7"),a("3ca3"),a("ddb0");function o(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}var s=a("06c5");function r(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t){return i(t)||o(t)||Object(s["a"])(t)||r()}},"2dbe":function(t,e,a){},"4ad4":function(t,e,a){"use strict";a("caad"),a("45fc"),a("b0c0"),a("b64b");var n=a("53ca"),i=a("16b7"),o=a("f2e7"),s=a("58df"),r=a("80d2"),c=a("d9bd"),d=Object(s["a"])(i["a"],o["a"]);e["a"]=d.extend({name:"activatable",props:{activator:{default:null,validator:function(t){return["string","object"].includes(Object(n["a"])(t))}},disabled:Boolean,internalActivator:Boolean,openOnHover:Boolean,openOnFocus:Boolean},data:function(){return{activatorElement:null,activatorNode:[],events:["click","mouseenter","mouseleave","focus"],listeners:{}}},watch:{activator:"resetActivator",openOnFocus:"resetActivator",openOnHover:"resetActivator"},mounted:function(){var t=Object(r["u"])(this,"activator",!0);t&&["v-slot","normal"].includes(t)&&Object(c["b"])('The activator slot must be bound, try \'<template v-slot:activator="{ on }"><v-btn v-on="on">\'',this),this.addActivatorEvents()},beforeDestroy:function(){this.removeActivatorEvents()},methods:{addActivatorEvents:function(){if(this.activator&&!this.disabled&&this.getActivator()){this.listeners=this.genActivatorListeners();for(var t=Object.keys(this.listeners),e=0,a=t;e<a.length;e++){var n=a[e];this.getActivator().addEventListener(n,this.listeners[n])}}},genActivator:function(){var t=Object(r["t"])(this,"activator",Object.assign(this.getValueProxy(),{on:this.genActivatorListeners(),attrs:this.genActivatorAttributes()}))||[];return this.activatorNode=t,t},genActivatorAttributes:function(){return{role:"button","aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genActivatorListeners:function(){var t=this;if(this.disabled)return{};var e={};return this.openOnHover?(e.mouseenter=function(e){t.getActivator(e),t.runDelay("open")},e.mouseleave=function(e){t.getActivator(e),t.runDelay("close")}):e.click=function(e){var a=t.getActivator(e);a&&a.focus(),e.stopPropagation(),t.isActive=!t.isActive},this.openOnFocus&&(e.focus=function(e){t.getActivator(e),e.stopPropagation(),t.isActive=!t.isActive}),e},getActivator:function(t){if(this.activatorElement)return this.activatorElement;var e=null;if(this.activator){var a=this.internalActivator?this.$el:document;e="string"===typeof this.activator?a.querySelector(this.activator):this.activator.$el?this.activator.$el:this.activator}else if(1===this.activatorNode.length||this.activatorNode.length&&!t){var n=this.activatorNode[0].componentInstance;e=n&&n.$options.mixins&&n.$options.mixins.some((function(t){return t.options&&["activatable","menuable"].includes(t.options.name)}))?n.getActivator():this.activatorNode[0].elm}else t&&(e=t.currentTarget||t.target);return this.activatorElement=e,this.activatorElement},getContentSlot:function(){return Object(r["t"])(this,"default",this.getValueProxy(),!0)},getValueProxy:function(){var t=this;return{get value(){return t.isActive},set value(e){t.isActive=e}}},removeActivatorEvents:function(){if(this.activator&&this.activatorElement){for(var t=Object.keys(this.listeners),e=0,a=t;e<a.length;e++){var n=a[e];this.activatorElement.removeEventListener(n,this.listeners[n])}this.listeners={}}},resetActivator:function(){this.removeActivatorEvents(),this.activatorElement=null,this.getActivator(),this.addActivatorEvents()}}})},"4bc5":function(t,e,a){"use strict";a("2dbe")},"71a3":function(t,e,a){"use strict";a("c975"),a("ac1f"),a("5319");var n=a("5530"),i=a("4e82"),o=a("1c87"),s=a("7560"),r=a("80d2"),c=a("58df"),d=Object(c["a"])(o["a"],Object(i["a"])("tabsBar"),s["a"]);e["a"]=d.extend().extend().extend({name:"v-tab",props:{ripple:{type:[Boolean,Object],default:!0}},data:function(){return{proxyClass:"v-tab--active"}},computed:{classes:function(){return Object(n["a"])(Object(n["a"])({"v-tab":!0},o["a"].options.computed.classes.call(this)),{},{"v-tab--disabled":this.disabled},this.groupClasses)},value:function(){var t=this.to||this.href||"";if(this.$router&&this.to===Object(this.to)){var e=this.$router.resolve(this.to,this.$route,this.append);t=e.href}return t.replace("#","")}},mounted:function(){this.onRouteChange()},methods:{click:function(t){this.href&&this.href.indexOf("#")>-1&&t.preventDefault(),t.detail&&this.$el.blur(),this.$emit("click",t),this.to||this.toggle()}},render:function(t){var e=this,a=this.generateRouteLink(),i=a.tag,o=a.data;return o.attrs=Object(n["a"])(Object(n["a"])({},o.attrs),{},{"aria-selected":String(this.isActive),role:"tab",tabindex:0}),o.on=Object(n["a"])(Object(n["a"])({},o.on),{},{keydown:function(t){t.keyCode===r["y"].enter&&e.click(t),e.$emit("keydown",t)}}),t(i,o,this.$slots["default"])}})},"75eb":function(t,e,a){"use strict";a("4160"),a("277d"),a("159b");var n=a("ade3"),i=a("53ca"),o=a("9d65"),s=a("80d2"),r=a("58df"),c=a("d9bd");function d(t){var e=Object(i["a"])(t);return"boolean"===e||"string"===e||t.nodeType===Node.ELEMENT_NODE}e["a"]=Object(r["a"])(o["a"]).extend({name:"detachable",props:{attach:{default:!1,validator:d},contentClass:{type:String,default:""}},data:function(){return{activatorNode:null,hasDetached:!1}},watch:{attach:function(){this.hasDetached=!1,this.initDetach()},hasContent:function(){this.$nextTick(this.initDetach)}},beforeMount:function(){var t=this;this.$nextTick((function(){if(t.activatorNode){var e=Array.isArray(t.activatorNode)?t.activatorNode:[t.activatorNode];e.forEach((function(e){if(e.elm&&t.$el.parentNode){var a=t.$el===t.$el.parentNode.firstChild?t.$el:t.$el.nextSibling;t.$el.parentNode.insertBefore(e.elm,a)}}))}}))},mounted:function(){this.hasContent&&this.initDetach()},deactivated:function(){this.isActive=!1},beforeDestroy:function(){try{if(this.$refs.content&&this.$refs.content.parentNode&&this.$refs.content.parentNode.removeChild(this.$refs.content),this.activatorNode){var t=Array.isArray(this.activatorNode)?this.activatorNode:[this.activatorNode];t.forEach((function(t){t.elm&&t.elm.parentNode&&t.elm.parentNode.removeChild(t.elm)}))}}catch(e){console.log(e)}},methods:{getScopeIdAttrs:function(){var t=Object(s["q"])(this.$vnode,"context.$options._scopeId");return t&&Object(n["a"])({},t,"")},initDetach:function(){var t;this._isDestroyed||!this.$refs.content||this.hasDetached||""===this.attach||!0===this.attach||"attach"===this.attach||(t=!1===this.attach?document.querySelector("[data-app]"):"string"===typeof this.attach?document.querySelector(this.attach):this.attach,t?(t.appendChild(this.$refs.content),this.hasDetached=!0):Object(c["c"])("Unable to locate target ".concat(this.attach||"[data-app]"),this))}}})},"9d65":function(t,e,a){"use strict";var n=a("d9bd"),i=a("2b0e");e["a"]=i["a"].extend().extend({name:"bootable",props:{eager:Boolean},data:function(){return{isBooted:!1}},computed:{hasContent:function(){return this.isBooted||this.eager||this.isActive}},watch:{isActive:function(){this.isBooted=!0}},created:function(){"lazy"in this.$attrs&&Object(n["e"])("lazy",this)},methods:{showLazyContent:function(t){return this.hasContent&&t?t():[this.$createElement()]}}})},a293:function(t,e,a){"use strict";a("45fc"),a("4795");var n=a("53ca");function i(){return!0}function o(t,e,a){var o="function"===typeof a.value?a.value:a.value.handler,s="object"===Object(n["a"])(a.value)&&a.value.closeConditional||i;if(t&&!1!==s(t)){var r=("object"===Object(n["a"])(a.value)&&a.value.include||function(){return[]})();r.push(e),!r.some((function(e){return e.contains(t.target)}))&&setTimeout((function(){s(t)&&o&&o(t)}),0)}}var s={inserted:function(t,e){var a=function(a){return o(a,t,e)},n=document.querySelector("[data-app]")||document.body;n.addEventListener("click",a,!0),t._clickOutside=a},unbind:function(t){if(t._clickOutside){var e=document.querySelector("[data-app]")||document.body;e&&e.removeEventListener("click",t._clickOutside,!0),delete t._clickOutside}}};e["a"]=s},b848:function(t,e,a){"use strict";var n=a("2909"),i=a("58df");function o(t){for(var e=[],a=0;a<t.length;a++){var i=t[a];i.isActive&&i.isDependent?e.push(i):e.push.apply(e,Object(n["a"])(o(i.$children)))}return e}e["a"]=Object(i["a"])().extend({name:"dependent",data:function(){return{closeDependents:!0,isActive:!1,isDependent:!0}},watch:{isActive:function(t){if(!t)for(var e=this.getOpenDependents(),a=0;a<e.length;a++)e[a].isActive=!1}},methods:{getOpenDependents:function(){return this.closeDependents?o(this.$children):[]},getOpenDependentElements:function(){for(var t=[],e=this.getOpenDependents(),a=0;a<e.length;a++)t.push.apply(t,Object(n["a"])(e[a].getClickableDependentElements()));return t},getClickableDependentElements:function(){var t=[this.$el];return this.$refs.content&&t.push(this.$refs.content),this.overlay&&t.push(this.overlay.$el),t.push.apply(t,Object(n["a"])(this.getOpenDependentElements())),t}}})},e4d3:function(t,e,a){"use strict";a("4795");var n=a("2b0e");e["a"]=n["a"].extend({name:"returnable",props:{returnValue:null},data:function(){return{isActive:!1,originalValue:null}},watch:{isActive:function(t){t?this.originalValue=this.returnValue:this.$emit("update:return-value",this.originalValue)}},methods:{save:function(t){var e=this;this.originalValue=t,setTimeout((function(){e.isActive=!1}))}}})}}]);
//# sourceMappingURL=views-Config.73cac503.js.map