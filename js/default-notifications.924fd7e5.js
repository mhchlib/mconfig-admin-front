(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["default-notifications"],{d9bb:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-menu",{attrs:{bottom:"",left:"","offset-y":"",origin:"top right",transition:"scale-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.attrs,n=e.on;return[i("v-btn",t._g(t._b({staticClass:"ml-2",attrs:{"min-width":"0",text:""}},"v-btn",a,!1),n),[i("v-badge",{attrs:{bordered:"",color:"red",overlap:""},scopedSlots:t._u([{key:"badge",fn:function(){return[i("span",[t._v("5")])]},proxy:!0}],null,!0)},[i("v-icon",[t._v("mdi-bell")])],1)],1)]}}])},[i("v-list",{attrs:{flat:"",nav:""}},t._l(t.notifications,(function(e,a){return i("app-bar-item",{key:a,attrs:{link:""}},[i("v-list-item-content",[i("v-list-item-title",[t._v(t._s(e)+" ")])],1)],1)})),1)],1)},n=[],o={name:"DefaultNotifications",data:function(){return{notifications:["Mike John Responded to your email","You have 5 new tasks","You're now friends with Andrew","Another Notification","Another one"]}}},s=o,r=i("2877"),l=i("6544"),c=i.n(l),u=(i("a9e3"),i("15fd")),f=i("5530"),d=(i("ff44"),i("132d")),h=i("a9ad"),p=i("7560"),m=i("f2e7"),b=i("f40d"),v=i("fe6c"),g=i("58df"),B=i("80d2"),y=Object(g["a"])(h["a"],Object(v["b"])(["left","bottom"]),p["a"],m["a"],b["a"]).extend({name:"v-badge",props:{avatar:Boolean,bordered:Boolean,color:{type:String,default:"primary"},content:{required:!1},dot:Boolean,label:{type:String,default:"$vuetify.badge"},icon:String,inline:Boolean,offsetX:[Number,String],offsetY:[Number,String],overlap:Boolean,tile:Boolean,transition:{type:String,default:"scale-rotate-transition"},value:{default:!0}},computed:{classes:function(){return Object(f["a"])({"v-badge--avatar":this.avatar,"v-badge--bordered":this.bordered,"v-badge--bottom":this.bottom,"v-badge--dot":this.dot,"v-badge--icon":null!=this.icon,"v-badge--inline":this.inline,"v-badge--left":this.left,"v-badge--overlap":this.overlap,"v-badge--tile":this.tile},this.themeClasses)},computedBottom:function(){return this.bottom?"auto":this.computedYOffset},computedLeft:function(){return this.isRtl?this.left?this.computedXOffset:"auto":this.left?"auto":this.computedXOffset},computedRight:function(){return this.isRtl?this.left?"auto":this.computedXOffset:this.left?this.computedXOffset:"auto"},computedTop:function(){return this.bottom?this.computedYOffset:"auto"},computedXOffset:function(){return this.calcPosition(this.offsetX)},computedYOffset:function(){return this.calcPosition(this.offsetY)},isRtl:function(){return this.$vuetify.rtl},offset:function(){return this.overlap?this.dot?8:12:this.dot?2:4},styles:function(){return this.inline?{}:{bottom:this.computedBottom,left:this.computedLeft,right:this.computedRight,top:this.computedTop}}},methods:{calcPosition:function(t){return"calc(100% - ".concat(Object(B["h"])(t||this.offset),")")},genBadge:function(){var t=this.$vuetify.lang,e=this.$attrs["aria-label"]||t.t(this.label),i=this.setBackgroundColor(this.color,{staticClass:"v-badge__badge",style:this.styles,attrs:{"aria-atomic":this.$attrs["aria-atomic"]||"true","aria-label":e,"aria-live":this.$attrs["aria-live"]||"polite",title:this.$attrs.title,role:this.$attrs.role||"status"},directives:[{name:"show",value:this.isActive}]}),a=this.$createElement("span",i,[this.genBadgeContent()]);return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[a]):a},genBadgeContent:function(){if(!this.dot){var t=Object(B["t"])(this,"badge");return t||(this.content?String(this.content):this.icon?this.$createElement(d["a"],this.icon):void 0)}},genBadgeWrapper:function(){return this.$createElement("span",{staticClass:"v-badge__wrapper"},[this.genBadge()])}},render:function(t){var e=[this.genBadgeWrapper()],i=[Object(B["t"])(this)],a=this.$attrs,n=(a["aria-atomic"],a["aria-label"],a["aria-live"],a.role,a.title,Object(u["a"])(a,["aria-atomic","aria-label","aria-live","role","title"]));return this.inline&&this.left?i.unshift(e):i.push(e),t("span",{staticClass:"v-badge",attrs:n,class:this.classes},i)}}),O=i("8336"),_=i("8860"),$=i("5d23"),w=i("e449"),k=Object(r["a"])(s,a,n,!1,null,null,null);e["default"]=k.exports;c()(k,{VBadge:y,VBtn:O["a"],VIcon:d["a"],VList:_["a"],VListItemContent:$["a"],VListItemTitle:$["c"],VMenu:w["a"]})},ff44:function(t,e,i){}}]);
//# sourceMappingURL=default-notifications.924fd7e5.js.map