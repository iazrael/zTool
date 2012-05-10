(function(d){var a={UNDEFINED:0,BUILDED:1,LOADED:2,INITED:3},b={},c={},e=0,f=function(a){if(b[a])return b[a];var a=a.split("."),c=window,e;for(e in a){if(!(a[e]in c))return d;c=c[a[e]]}return c},g=function(b){return(b=f(b))?b.packageStatus:a.UNDEFINED},i=function(b,e,d){"string"===typeof b&&(b=f(b));var g={},h=f("Z");if(e)for(var n in e)g[n]=f(e[n]);d&&d.call(b,h,g);b.packageStatus=a.INITED;b=b.packageName;if(e=c[b]){for(g=0;g<e.length;g++)d=e[g],k(d.requirePackages)&&i(d.packageName,d.requirePackages,
d.constructor);delete c[b]}},k=function(b){if(!b)return!0;var c,e;for(e in b)if(c=b[e],g(c)!==a.INITED)return!1;return!0},h=function(){var f,d,g;f=arguments[0];3===arguments.length?(d=arguments[1],g=arguments[2]):2===arguments.length?g=arguments[1]:(f="Z.anonymous."+e++,g=arguments[0]);var h;h=f;var o=b[h];if(!o){var o=window,n=h.split("."),q;for(q in n)n[q]in o||(o[n[q]]={}),o=o[n[q]];b[h]=o}if(!("packageName"in o))o.packageName=h;if(!("packageStatus"in o))o.packageStatus=a.BUILDED;h=o;if(h.packageStatus===
a.BUILDED)h.packageStatus=a.LOADED;if(d&&!k(d))for(var r in d)h=d[r],c[h]||(c[h]=[]),c[h].push({packageName:f,requirePackages:d,constructor:g});else i(h,d,g)};h("Z",function(b){b.PACKAGE_STATUS=a;b.$package=h;b.getPackage=f;b.getPackageStatus=g})})();
Z.$package("Z.array",function(){this.remove=function(d,a,b){var c=!1;if(2===arguments.length){var e=d.indexOf(a);-1!==e&&(d.splice(e,1),c=!0)}else for(var e=0,f=d.length;e<f;e++)if(d[e][a]===b){d.splice(e,1);c=!0;break}return c};this.filter=function(d,a,b){var c=[],e;for(e in d)d[e][a]===b&&c.push(d[e]);return c};this.contains=function(d,a){return-1<d.indexOf(a)};this.uniquelize=function(d){for(var a=[],b=0,c=d.length;b<c;b++)this.contains(a,d[b])||a.push(d[b]);return a};this.parse=function(d){return Array.prototype.slice.call(d)}});
Z.$package("Z",function(d){this.debug=function(a){window.console&&(console.debug?console.debug(a):console.log(a))};var a=Object.prototype.toString;this.is=function(b,c){var e=a.call(c).slice(8,-1);return void 0!==c&&null!==c&&e===b};this.isString=function(b){return"[object String]"===a.call(b)};this.isArray=Array.isArray||function(b){return"[object Array]"===a.call(b)};this.isArguments=function(b){return"[object Arguments]"===a.call(b)};this.isObject=function(b){return"[object Object]"===a.call(b)};
this.isFunction=function(b){return"[object Function]"===a.call(b)};this.isUndefined=function(b){return"[object Undefined]"===a.call(b)};this.isEmpty=function(b){if(b){if(this.isArray(b))return!!b.length;for(var a in b)return!1;return!0}return!1};var b=this.isSameObject=function(a,c,e){if(a===c||!a&&!c)return!0;for(var k in a)if(a.hasOwnProperty(k))if(d.isObject(a[k])&&d.isObject(c[k])&&e){if(!b(a[k],c[k],e))return!1}else if(a[k]!==c[k])return!1;return!0},c=function(a,b,e){for(var k=arguments,h,l=
1;l<k.length;l++){h=k[l];for(var j in h)a[j]=d.isArray(h[j])?h[j].concat():d.isObject(h[j])?a[j]&&d.isArray(a[j])?c({},h[j]):c({},a[j],h[j]):h[j]}return a},e=function(a){if(d.isArray(a))return a.concat();if(d.isArguments(a)){for(var b=[],i=0,k;k=a[i];i++)b.push(e(k));return b}if(d.isObject(a))return c({},a);throw Error("the argument isn't an object or array");};this.merge=c;this.duplicate=e;this.extend=function(a,b){c(a,b);a.prototype=c({},b.prototype,a.prototype);a.prototype.constructor=a}});
Z.$package("Z.browser",function(d){var a=this;(function(){var b={set:function(a,b){this.name=a;this.version=b;this[a]=b}},c,d=navigator.userAgent.toLowerCase();(c=d.match(/msie ([\d.]+)/))?b.set("ie",c[1]):(c=d.match(/firefox\/([\d.]+)/))?b.set("firefox",c[1]):(c=d.match(/chrome\/([\d.]+)/))?b.set("chrome",c[1]):(c=d.match(/opera.([\d.]+)/))?b.set("opera",c[1]):(c=d.match(/version\/([\d.]+).*safari/))&&b.set("safari",c[1]);Z.merge(a,b)})();var b={ie:"Ms",firefox:"Moz",opera:"O",chrome:"Webkit",safari:"Webkit"},
c;this.cssSupport=function(a,f,g){var i;c||(c=document.createElement("div"));i=c;if(a in i.style)return i.style[a]=f,i.style[a]===f;return g?(g=a.charAt(0).toUpperCase(),a=b[d.browser.name]+g+a.substr(1),cssSupport(a,!1,f)):!1}});
Z.$package("Z",function(d){var a=function(){},b=/this.\$super/,c=function(c,e){1===arguments.length&&(e=c,c={});e=e||{};if(!d.isFunction(e.init))e.init=a;var f=function(){return this.init.apply(this,arguments)},h=c.extend;if(h){if("interface"===h.type&&d.isArray(h.methods)&&d.isFunction(h.checkImplements))throw Error("can not extend a interface!");var l=h.prototype.init,j=e.init,m=d.duplicate(h.prototype);delete m.init;var h=f.prototype=d.merge({},h.prototype,e),p,o,n;for(n in m)p=h[n],o=m[n],d.isFunction(o)&&
d.isFunction(p)&&b.test(p)&&(h[n]=function(a,b){return function(){var c=this.$super;this.$super=a;b.apply(this,arguments);this.$super=c}}(o,p));f.prototype.init=function(){var a=d.duplicate(arguments);l.apply(this,a);this.$static=f;j.apply(this,arguments)}}else j=e.init,f.prototype=e,f.prototype.init=function(){this.$static=f;j.apply(this,arguments)};f.prototype.constructor=f;f.type="class";f.className=c.name||"anonymous";if(m=c["implements"]){n=[];for(var q in m)h=m[q].checkImplements(f.prototype),
n=n.concat(h);if(n.length)throw Error("the '"+f.className+"' class hasn't implemented the interfaces's methods . ["+n+"]");}c.statics&&d.merge(f,c.statics);return f},e=function(a){var b=[],c,e;for(e in this.methods)c=a[this.methods[e]],(!c||!d.isFunction(c))&&b.push(methods[e]);return b},f=function(a,b){1===arguments.length&&(b=a,a={});var c=function(){throw Error("the interface can not be Instantiated!");};c.type="interface";c.interfaceName=a.name||"anonymous";c.methods=b;c.checkImplements=e;return c};
this.define=function(a,b,e){var d=Array.prototype.slice.call(arguments,1);if("class"===a)return c.apply(this,d);if("interface"===a)return f.apply(this,d)};this.$class=c;this.$interface=f});
Z.$package("Z.cookie",function(d){var a=window.location.host;this.set=function(b,c,e,f,g){if(g){var i=new Date;i.setTime(+new Date+36E5*g)}d.isString(c)||(c=JSON.stringify(c));c=window.encodeURIComponent(c);window.document.cookie=b+"="+c+"; "+(g?"expires="+i.toGMTString()+"; ":"")+(f?"path="+f+"; ":"path=/; ")+(e?"domain="+e+";":"domain="+a+";")};this.get=function(a){a=window.document.cookie.match(RegExp("(?:^|;+|\\s+)"+a+"=([^;]*)"));a=!a?"":a[1];a=window.decodeURIComponent(a);try{a=JSON.parse(a)}catch(c){}return a};
this.remove=function(b,c,e){window.document.cookie=b+"=; expires=Mon, 26 Jul 1997 05:00:00 GMT; "+(e?"path="+e+"; ":"path=/; ")+(c?"domain="+c+";":"domain="+a+";")}});
Z.$package("Z.date",function(){this.format=function(d,a){var b={"M+":d.getMonth()+1,"d+":d.getDate(),"h+":d.getHours(),"m+":d.getMinutes(),"s+":d.getSeconds(),"q+":Math.floor((d.getMonth()+3)/3),S:d.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(d.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a}});
Z.$package("Z.dom",function(){this.ellipsis=function(d,a){var b=d.clientWidth,a=a||"…",c=d.cloneNode(!0);c.id="checkTextLengthNode";c.style.cssText="position: absolute;left: -99999em;width: auto !important;";d.parentNode.appendChild(c);if(!(c.clientWidth<=b)){c.innerHTML=a;for(var e=c.clientWidth,f=d.innerHTML,f=f.replace(/\s+/g," "),g,i=0,k=0,h=f.length;k<h;k++)if(g=f.charAt(k),c.innerHTML=" "===g?"&nbsp;":g,i+=c.clientWidth,i+e>b){f=f.substr(0,k);break}d.innerHTML=f+a;c.parentNode.removeChild(c)}}});
Z.$package("Z.dom",["Z.string"],function(d){var a=this;this.get=function(a){return document.getElementById(a)};this.query=function(a,b){var b=b||document,d=a.charAt(0),g=a.substring(1);return"#"===d?this.get(g):"."===d?b.querySelectorAll(a):b.getElementsByTagName(a)};var b={};this.getTemplate=function(a){var e=b[a];if(!e){var d=this.get(a),e=d.innerHTML;d.parentNode.removeChild(d);b[a]=e}if(!e)throw Error('no such template. [id="'+a+'"]');return e};this.getActionTarget=function(a,b,d,g){var a=a.target,
i=b||3,b=-1!==b,d=d||"cmd",g=g||document.body;if(a===g)return a.getAttribute(d)?a:null;for(;a&&a!==g&&(b?0<i--:1);){if(a.getAttribute(d))return a;a=a.parentNode}return null};this.render=function(a,b,f,g){f=f||{};b=this.getTemplate(b);b=d.string.template(b,f);"string"===typeof a&&(a=this.get(a));if(!d.isUndefined(g)&&a.childElementCount){f=document.createElement("div");f.innerHTML=b;for(var b=f.childNodes,i=document.createDocumentFragment();b[0];)i.appendChild(b[0]);-1===g||g>=a.childElementCount?
a.appendChild(i):a.insertBefore(i,a.children[g]);delete f}else a.innerHTML=b};this.bindCommends=function(b,e,f){1===arguments.length?(f=b,b=document.body,e="click"):2===arguments.length&&(f=e,e="click");b.__commends?d.merge(b.__commends,f):(b.__commends=f,b.addEventListener(e,function(b){var c=a.getActionTarget(b,-1,"cmd",this);if(c){var d=c.getAttribute("cmd"),e=c.getAttribute("param");c.href&&0===c.getAttribute("href").indexOf("#")&&b.preventDefault();if(this.__commends[d])this.__commends[d](e,
c,b)}}))};this.isVisible=function(a,b,d){return d?0<=a.offsetTop-b.scrollTop&&a.offsetTop+a.clientHeight-b.scrollTop<=b.clientHeight?!0:!1:0<a.offsetTop+a.clientHeight-b.scrollTop&&a.offsetTop-b.scrollTop<b.clientHeight?!0:!1};this.css=function(a,b){for(var d in b)a.style[d]=b[d]}});
Z.$package("Z.file",function(d){this.ImageLoader=d.$class({init:function(){this._imageList={}},load:function(a,b,c){var d=this._imageList[a];d||(d={url:a,status:0,cbs:[]},this._imageList[a]=d);if(2===d.status)b.call(c||window,!0,a,d.size);else if(1===d.status)d.cbs.push({cb:b,cxt:c});else{d.cbs.push({cb:b,cxt:c});d.status=1;var b=new Image,f=this;b.onload=function(){var a=f._imageList[this.src];a.status=2;a.size={width:this.width,height:this.height};for(var b=0,c;c=a.cbs[b];b++)c.cb.call(c.cxt||window,
!0,a.url,a.size);a.cbs=[]};c=function(){var a=f._imageList[this.src];a.status=3;for(var b=0,c;c=a.cbs[b];b++)c.cb.call(c.cxt||window,!1,a.url);a.cbs=[]};b.onerror=c;b.onabort=c;b.src=a}}})});
Z.$package("Z.message",function(d){var a,b=0,c=function(){if(!a&&(a=document.createElement("div"),!document.createEvent))a.style.cssText="position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;",document.body.appendChild(a);return a},e=function(a,d,e){var f,l,j,m;if(2>arguments.length)throw Error("addListener arguments not enough");2===arguments.length&&(e=d,d=a,a=window);if(!a.__listeners)a.__listeners={},a.__listenerId=+new Date+""+b++;j=a.__listeners;m=a.__listenerId;if(j[d])for(l in j[d]){if(f=
j[d][l],f.func===e)return!1}else j[d]=[];l=c();l.addEventListener?(f=function(a){e.apply(window,a.params)},l.addEventListener(m+"-"+d,f,!1)):(f=function(a){var a=window.event,b=a.params.pop();d===a.params[1]&&b===m&&e.apply(window,a.params)},l.attachEvent("onpropertychange",f));f={func:e,wrapFunc:f};j[d].push(f);return!0},f=function(a,b,d){var e,f,j,m;if(2>arguments.length)throw Error("removeListener arguments not enough");2===arguments.length&&(d=b,b=a,a=window);j=a.__listeners;m=a.__listenerId;
if(!j||!j[b])return!1;f=c();for(var p in j[b])if(e=j[b][p],e.func===d)return j[b].slice(p,1),f.removeEventListener?f.removeEventListener(m+"-"+b,e.wrapFunc,!1):f.detachEvent("onpropertychange",e.wrapFunc),!0;return!1};this.on=this.addListener=e;this.off=this.removeListener=f;this.notify=function(a,b,e){var f,l,j,m;1===arguments.length?(b=a,a=window):2===arguments.length&&d.isString(a)&&(e=b,b=a,a=window);d.debug("notify message: "+b);j=a.__listeners;m=a.__listenerId;if(!j||!j[b])return!1;f=c();document.createEvent?
(l=document.createEvent("Events"),l.initEvent(m+"-"+b,!1,!1),l.params=[e,b],f.dispatchEvent(l)):(l=document.createEventObject("onpropertychange"),l.params=[e,b,m],f.fireEvent("onpropertychange",l));return 0!==j[b].length}});
Z.$package("Z.number",function(){this.format=function(d,a){for(var b=d.toString().split("."),c=a?a.split("."):[""],e="",f=b[0],g=c[0],i=f.length-1,k=!1,h=g.length-1;0<=h;h--)switch(g.substr(h,1)){case "#":0<=i&&(e=f.substr(i--,1)+e);break;case "0":e=0<=i?f.substr(i--,1)+e:"0"+e;break;case ",":k=!0,e=","+e}if(0<=i)if(k)for(g=f.length;0<=i;i--)e=f.substr(i,1)+e,0<i&&0==(g-i)%3&&(e=","+e);else e=f.substr(0,i+1)+e;e+=".";f=1<b.length?b[1]:"";g=1<c.length?c[1]:"";for(h=i=0;h<g.length;h++)switch(g.substr(h,
1)){case "#":i<f.length&&(e+=f.substr(i++,1));break;case "0":e=i<f.length?e+f.substr(i++,1):e+"0"}return e.replace(/^,+/,"").replace(/\.$/,"")};this.getMaxMin=function(d){var a=0,b=0,c=d.length;if(0<c)for(var b=d[0],e=0;e<c;e++)d[e]>a?a=d[e]:d[e]<b&&(b=d[e]);return{max:a,min:b}};this.random=function(d,a){return Math.floor(Math.random()*(a-d+1)+d)}});
Z.$package("Z.storage",function(d){var a=d.$class({name:"Storage"},{init:function(a){this._storage=a},isSupport:function(){return null!=this._storage},set:function(a,c){return this.isSupport()?(d.isString(c)||(c=JSON.stringify(c)),this._storage.setItem(a,c),!0):!1},get:function(a){if(this.isSupport()){a=this._storage.getItem(a);try{a=JSON.parse(a)}catch(c){}return a}return!1},remove:function(a){return this.isSupport()?(this._storage.removeItem(a),!0):!1},clear:function(){return this.isSupport()?(this._storage.clear(),
!0):!1}});this.local=new a(window.localStorage);this.session=new a(window.sessionStorage)});
Z.$package("Z.string",function(){this.toQueryString=function(a){var c=[],d;for(d in a)c.push(encodeURIComponent(""+d)+"="+encodeURIComponent(""+a[d]));return c.join("&")};var d={},a=this.template=function(b,c){var e=!/\W/.test(b)?d[b]=d[b]||a(document.getElementById(b).innerHTML):new Function("obj","var z_tmp=[],print=function(){z_tmp.push.apply(z_tmp,arguments);};with(obj){z_tmp.push('"+b.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("z_tmp.push('").split("\r").join("\\'")+
"');}return z_tmp.join('');");return c?e(c):e};this.format=function(a,c,d){if(0==arguments.length)return null;for(var a=arguments[0],f=1;f<arguments.length;f++)a=a.replace(RegExp("\\{"+(f-1)+"\\}","gm"),arguments[f]);return a}});
Z.$package("Z.ui",function(d){this.ImageViewer=d.$class({init:function(a){var a=a||{},b;a.element?b=this._el=a.element:(b=this._el=document.createElement("div"),b.setAttribute("class","image-viewer"),(a.parent||document.body).appendChild(b));b.setAttribute("cmd","hide");b.style.display="none";this._createDom();this._bindEvents();this._loader=new d.file.ImageLoader},show:function(a){this._resize();this._el.style.display="block";this._loader.load(a,this._onImageLoad,this)},hide:function(){this._el.style.display=
"none"},_createDom:function(){this._el.innerHTML='            <div class="image-viewer-body" cmd="stopPropagation">                <a class="image-viewer-close" href="javascript:void(0);" title="close" cmd="hide">X</a>                <div class="image-viewer-content">                    <img src="about:blank">                </div>            </div>';this._body=this._el.querySelector(".image-viewer-body");this._image=this._el.querySelector("img")},_bindEvents:function(){var a=this;d.dom.bindCommends(this._el,
"click",{hide:function(){a.hide()},stopPropagation:function(a,b,d){d.stopPropagation()}});var b=d.util.debounce(500,function(){a._resize()});window.addEventListener("resize",b,!1)},_resize:function(){var a=document.documentElement,b=Math.max(a.offsetWidth,window.innerWidth),a=Math.max(a.offsetHeight,window.innerHeight);d.dom.css(this._el,{width:b+"px",height:a+"px"})},_onImageLoad:function(a,b,c){a&&(150<c.width&&d.dom.css(this._body,{width:c.width+"px","margin-left":-c.width/2+"px"}),80<c.height&&
d.dom.css(this._body,{height:c.height+"px","margin-top":-c.height/2+"px"}));this._image.src=b}})});
Z.$package("Z.ui",["Z.util"],function(d){this.ScrollAction=d.define("class",{init:function(a){this._id="scroll_action_"+(a.id||a.element.getAttribute("id"));this._el=a.element;this._step=a.step||50;this._animationDuration=a.animationDuration||10;this._scrollEventDelay=a.scrollEventDelay||200;this._onScrollToBottom=a.onScrollToBottom;this._onScrollToTop=a.onScrollToTop;this._onAnimationStart=a.onAnimationStart;this._onAnimationEnd=a.onAnimationEnd;var b=this;this._el.addEventListener("scroll",function(){d.util.delay(b._id+
"_scroll",b._scrollEventDelay+b._animationDuration,function(){b._noScollEvent?b._noScollEvent=!1:b.isTop()&&b._onScrollToTop?b._onScrollToTop():b.isBottom()&&b._onScrollToBottom&&b._onScrollToBottom()})},!1)},getScrollTop:function(){return this._el.scrollTop},isTop:function(){return 0===this._el.scrollTop},isBottom:function(){return this._el.scrollTop===this._el.scrollHeight-this._el.clientHeight},setAnimation:function(a,b){if(a)this._step=a;if(b)this._animationDuration=b},scrollTo:function(a,b,c){var e=
this;d.util.clearLoop(this._id);var f=this._el.scrollHeight-this._el.clientHeight;d.isString(a)&&("top"===a&&(a=0),"bottom"===a&&(a=f));0>a&&(a=0);a>f&&(a=f);if(a===this._el.scrollTop)return!1;this._noScollEvent=c;if(b){var g=e._el.scrollTop,i=a,k=0<i-g?1:-1,h=!1;d.util.loop(this._id,this._animationDuration,function(){h||(h=!0,e._onAnimationStart&&e._onAnimationStart());g+=k*e._step;var a=!1;if(0<k&&g>i||0>k&&g<i)g=i,a=!0,d.util.clearLoop(e._id);e._el.scrollTop=g;a&&e._onAnimationEnd&&e._onAnimationEnd()})}else this._el.scrollTop=
a;return!0}})});
Z.$package("Z.util",["Z.message"],function(d){this.Beater=d.$class({name:"Beater",statics:{DEFAULT_INTERVAL:50,DEFAULT_MAX_INTERVAL:6E4}},{init:function(a){a=a||{};this._triggers={};this._beaters={};this._isStart=!1;this._autoStart="autoStart"in a?a.autoStart:!0;this._interval=a.interval||this.$static.DEFAULT_INTERVAL;this._maxInterval=a.maxInterval||this.$static.DEFAULT_MAX_INTERVAL},checkBeater:function(){var a=0,b;for(b in this._beaters)a+=this._beaters[b];return!!a},add:function(a,b,c){if(b%this._interval)b=
Math.round(b/this._interval)*this._interval;else if(b<this._interval)b=this._interval;else if(b>this._maxInterval)b=this._maxInterval;if(this._triggers[a])throw Error("beater is exist");this._beaters[b]=this._beaters[b]||0;this._triggers[a]={time:b,func:c};d.message.on(this,"Beater-"+b,c);this._beaters[b]++;!this._isStart&&this._autoStart&&this.start();return!0},remove:function(a){var b=this._triggers[a];if(!b)return!1;var c="Beater-"+b.time;this._beaters[b.time]--;this._triggers[a]=null;delete this._triggers[a];
d.message.off(this,c,b.func);this.checkBeater()||this.stop();return!0},start:function(){if(this._isStart)return!1;var a=this,b=0,c=this._interval;this._timer=setInterval(function(){b+=c;b>=a._maxInterval&&(b=0);var e,f;for(f in a._beaters)a._beaters[f]&&(e=Number(f),b%e||d.message.notify(a,"Beater-"+e,{time:e}))},c);return this._isStart=!0},stop:function(){if(!this._isStart)return!1;clearInterval(this._timer);this._timer=0;this._isStart=!1;return!0}})});
Z.$package("Z.util",["Z.message","Z.array"],function(d){this.Collection=new d.$class({name:"Collection"},{init:function(a){function b(){c.setModify()}a=a||{};this._keyName=a.keyName||"id";this._arr=[];this._map={};this._modifyTime=0;var c=this;d.message.on(this,"add",b);d.message.on(this,"remove",b);d.message.on(this,"clear",b);d.message.on(this,"update",b)},setModify:function(){this._modifyTime=+new Date},getModify:function(){return this._modifyTime},getByKey:function(a){return this.get(a)},getByIndex:function(a){return this.index(a)},
getIndexByKey:function(a,b){b=b||this._keyName;if(this._map[a])for(var c in this._arr)if(this._arr[c][b]==a)return c;return null},getKeyByIndex:function(a,b){var b=b||this._keyName,c=this.getByIndex(a);return c?c[b]:null},get:function(a){return this._map[a]},index:function(a){return this._arr[a]},getRange:function(a,b){return this._arr.slice(a,a+b)},filter:function(a,b){return d.array.filter(this._arr,a,b)},add:function(a,b,c){if(this._map[a[this._keyName]])return!1;this._map[a[this._keyName]]=a;
d.isUndefined(b)?(b=this._arr.length,this._arr.push(a)):this._arr.splice(b,0,a);c||d.message.notify(this,"add",{items:[a],index:b});return a},addRange:function(a,b,c){var e=[],f,g=this._keyName,i;for(i in a)f=a[i],this._map[f[g]]||(e.push(f),this._map[f[g]]=f);if(!e.length)return!1;d.isUndefined(b)?(b=this._arr.length,this._arr=this._arr.concat(e)):(a=[b,0].concat(e),Array.prototype.splice.apply(this._arr,a));c||d.message.notify(this,"add",{items:e,index:b});return e},removeByKey:function(a,b){var c=
this._map[a];if(c){var e=this.getIndexByKey(a);this._arr.splice(e,1);delete this._map[a];b||d.message.notify(this,"remove",{items:[c],index:e,key:a});return c}return!1},removeByIndex:function(a,b){var c=this._arr[a];return c?(this._arr.splice(a,1),delete this._map[c[this._keyName]],b||d.message.notify(this,"remove",{items:[c],index:a,key:c[this._keyName]}),c):!1},remove:function(a){return this.removeByKey(a)},removeRange:function(a,b){var c=[],e,f=this._keyName,g;for(g in a)e=a[g],this.removeByKey(e[f],
!0)&&c.push(e);if(!c.length)return!1;b||d.message.notify(this,"remove",{items:c});return c},update:function(a,b){var c=this.get(a.id);return c?(d.merge(c,a),b||d.message.notify(this,"update",{items:[c]}),c):!1},updateRange:function(a){var b=[],c,e;for(e in a)(c=this.update(a[e],!0))&&b.push(c);b.length&&d.message.notify(this,"update",{items:[b]});return!1},length:function(){return this._arr.length},clear:function(a){var b=this._arr;this._arr=[];this._map={};a||d.message.notify(this,"clear",{items:b})},
getFirst:function(){return this.index(0)},getLast:function(){return this.index(this.length()-1)},getAll:function(){return this.getRange(0,this.length())},each:function(a,b){for(var b=b||this,c=0,d;d=this._arr[c];c++)a.call(b,d,c)},exist:function(a){return!!this.get(a)}})});
Z.$package("Z.util",function(d){this.DependentQueue=new d.$class({name:"DependentQueue",statics:{STATUS_INIT:1,STATUS_RUNNING:2,STATUS_PAUSE:3,STATUS_STOP:4}},{init:function(a){a=a||{};this._onFinish=a.onFinish;this._onPause=a.onPause;this._onStop=a.onStop;this._currentIndex=-1;this._items=[];this._status=this.$static.STATUS_INIT},add:function(a){if(this.isRunning())return!1;this._items.push(a);return!0},isRunning:function(){return this._status===this.$static.STATUS_RUNNING},run:function(){if(this.isRunning()||
0>=this._items.length||this._currentIndex>=this._items.length-1)return!1;this._status=this.$static.STATUS_RUNNING;this.next()},reRun:function(){this._currentIndex--;this.next()},next:function(){this._currentIndex++;var a=this._items[this._currentIndex];a?a.exec(this,a):this._onFinish&&this._onFinish(this)},pause:function(){this._status=this.$static.STATUS_PAUSE;this._onPause&&this._onPause(this,this._items[this._currentIndex])},stop:function(){this._status=this.$static.STATUS_STOP;this._onStop&&this._onStop(this,
this._items[this._currentIndex])}})});
Z.$package("Z.util",["Z.message","Z.string","Z.util"],function(d){this.HttpRequest=new d.$class({init:function(a){this._require=a.require;this._requestCollection=new d.util.Collection({keyName:"id"})},require:function(a,b,c){var e=d.string.toQueryString(b.data),f;f=-1==a.indexOf("?")?a+"?"+e:a+"&"+e;var c=c||{},g=b.onSuccess,i=b.onError,k=b.onTimeout;if(e=this._requestCollection.get(f)){if("loading"===e.status)return!1;if(c.cacheTime&&e.responseTime-e.requireTime<c.cacheTime)return a=b.context||window,
g&&g.call(a,e.response),!0;this._requestCollection.remove(f)}var h={id:f,param:b,requireTime:+new Date,status:"loading"};this._requestCollection.add(h);b.onSuccess=function(a){c.cacheTime?(h.responseTime=+new Date,h.status="loaded",h.response=a):this._requestCollection.remove(f);var d=b.context||window;g&&g.call(d,a)};b.onError=function(a){this._requestCollection.remove(f);var c=b.context||window;i&&i.call(c,a)};b.onTimeout=function(a){this._requestCollection.remove(f);var c=b.context||window;k&&
k.call(c,a)};this._require(a,b)}})});Z.$package("Z.util",function(){this.debounce=function(d,a,b){var c;return function(){if(!c||+new Date-c>d)b?a():setTimeout(a,d),c=+new Date}}});
Z.$package("Z.util",function(){var d={};this.delay=function(a,b,c,e){var f=arguments,g=0;1===f.length?(c=a,b=0,a=null):2===f.length&&(c=b,b=a,a=null);b=b||0;a&&b?(a in d&&(window.clearTimeout(d[a]),g=1),f=window.setTimeout(function(){d[a]=0;delete d[a];c.apply(e||window,[a])},b),d[a]=f):e?window.setTimeout(function(){c.apply(e||window)},b):window.setTimeout(c,b);return g};this.clearDelay=function(a){return a in d?(window.clearTimeout(d[a]),d[a]=0,delete d[a],0):2}});
Z.$package("Z.util",function(d){var a=Object.prototype.hasOwnProperty;this.sizeof=function(b){if(d.isArray(b))return b.length;var c,e=0;for(c in b)a.call(b,c)&&e++;return e}});
Z.$package("Z.util",function(){var d={};this.loop=function(a,b,c,e){var f=0;2==arguments.length&&(c=b,b=a);b=b||0;if(a&&b){a in d&&(window.clearInterval(d[a]),f=1);var g=window.setInterval(function(){c.apply(e||window,[a])},b);d[a]=g}else setInterval(c,b);return f};this.clearLoop=function(a){return a in d?(window.clearInterval(d[a]),d[a]=0,delete d[a],0):2}});
Z.$package("Z.util",function(d){this.timeTaken=function(a){var b=">>>",c,e;2===arguments.length?"function"===typeof arguments[1]?e=arguments[1]:b='"'+arguments[1]+'"':3===arguments.length&&(c=arguments[1],e=arguments[2]);d.debug(b+" time test start.");c&&c();c=+new Date;a();c=+new Date-c;e&&e(c);d.debug(b+" time test end. time taken: "+c)}});
