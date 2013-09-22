
;(function(undefined){
    var PACKAGE_STATUS = {
        UNDEFINED: 0,
        BUILDED: 1,
        LOADED: 2,
        INITED: 3
    };
    var LIBRARY_NAME = 'Z';

    var globalContext = this;
    if (typeof module != 'undefined'){
        module.exports = exports = globalContext = {};
        globalContext[LIBRARY_NAME] = globalContext;
    }
    
    var packageList = {};
    var dependenceQueue = {};
    
    var emptyFunction = function(){};
    
    var isDebuging = 0;
    var debug = isDebuging ? (typeof console != 'undefined' ? function(data){
        console.debug ? console.debug(data) : console.log(data);
    } : emptyFunction) : emptyFunction;
    
    var anonymousCount = 0;
    var getAnonymousPackageName = function(){
        return LIBRARY_NAME + '.' + 'anonymous' + '.' + anonymousCount++;
    }

    /**
     * @param {String} packageName
     */
    var buildPackage = function(packageName){
        var pack = packageList[packageName];
        if(!pack){
            pack = globalContext;
            var nameList = packageName.split('.');
            for(var i in nameList){
                if(!(nameList[i] in pack)){
                    pack[nameList[i]] = {};
                }
                pack = pack[nameList[i]];
            }
            packageList[packageName] = pack;
        }
        if(!('packageName' in pack)){
            pack.packageName = packageName;
        }
        if(!('packageStatus' in pack)){
            pack.packageStatus = PACKAGE_STATUS.BUILDED;
        }
        debug('buildPackage: ' + packageName);
        return pack;
    };
    
    var getPackage = function(packageName){
        if(packageList[packageName]){
            return packageList[packageName];
        }
        var nameList = packageName.split('.');
        var pack = globalContext;
        for(var i in nameList){
            if(!(nameList[i] in pack)){
                return undefined;
            }
            pack = pack[nameList[i]];
        }
        return pack;
    };
    
    var getPackageStatus = function(packageName){
        var pack = getPackage(packageName);
        var status = pack ? pack.packageStatus : PACKAGE_STATUS.UNDEFINED;
        return status;
    };
    
    var initPackage = function(pack, requirePackages, constructor){
        if(typeof pack === 'string'){
            pack = getPackage(pack);
        }
        var require = {};
        var library = getPackage(LIBRARY_NAME);
        if(requirePackages){
            for(var r in requirePackages){
                require[r] = getPackage(requirePackages[r]);
            }
        }
        debug('initPackage: ' + pack.packageName);
        if(constructor){
            constructor.call(pack, library, require);
            debug('package [[' + pack.packageName + ' inited]]');
        }
        pack.packageStatus = PACKAGE_STATUS.INITED;
        runDependenceQueue(pack.packageName);
    };
    
    var checkDependence = function(requirePackages){
        if(!requirePackages){
            return true;
        }
        var requirePackageName;
        for(var r in requirePackages){
            requirePackageName = requirePackages[r];
            if(getPackageStatus(requirePackageName) !== PACKAGE_STATUS.INITED){
                return false;
            }
        }
        return true;
    };
    
    var addToDependenceQueue = function(packageName, requirePackages, constructor){
        debug('>>>addToDependenceQueue, package: ' + packageName);
        var requirePackageName;
        for(var r in requirePackages){
            requirePackageName = requirePackages[r];
            if(!dependenceQueue[requirePackageName]){
                dependenceQueue[requirePackageName] = [];
            }
            dependenceQueue[requirePackageName].push({
                packageName: packageName, 
                requirePackages: requirePackages, 
                constructor: constructor
            });
        }
    };
    
    var runDependenceQueue = function(packageName){
        var requireQueue = dependenceQueue[packageName];
        if(!requireQueue){
            return false;
        }
        debug('<<<runDependenceQueue, dependented package: ' + packageName);
        var flag = false, require;
        for(var r = 0; r < requireQueue.length; r++ ){
            require = requireQueue[r];
            if(checkDependence(require.requirePackages)){
                flag = true;
                initPackage(require.packageName, require.requirePackages, require.constructor);
            }
        }
        delete dependenceQueue[packageName];
        return flag;
    };
    
    /**
     * @param {String} packageName
     * @param {Object} requirePackages for 异步按需加载各种依赖模块
     * { shortName: packageName } or [packageName]
     * @param {Function} constructor
     * @example 
     *  Z.$package('Z.test', function(z){
        });
        Z.$package('Z.test.test1', {
            t: 'Z.test2',
            u: 'Z.util',
            o: 'Z.tools'
        }, function(z, d){
            console.log(d.t);
        });
        Z.$package('Z.test2', function(z){
            console.log(11111111);
        });
        Z.$package('Z.test2', function(z){
            console.log(22222222);
        });
        Z.$package('Z.util', {
            t: 'Z.tools'
        }, function(z){
        });
        Z.$package('Z.tools',function(z){
        });
     */
    var $package = function(){
        var packageName, requirePackages,  constructor;
        packageName = arguments[0];
        if(arguments.length === 3){
            requirePackages = arguments[1];
            constructor = arguments[2];
        }else if(arguments.length === 2){
            constructor = arguments[1];
        }else{
            packageName = getAnonymousPackageName();
            constructor = arguments[0];
        }
        var pack = buildPackage(packageName);
        if(pack.packageStatus === PACKAGE_STATUS.BUILDED){
            pack.packageStatus = PACKAGE_STATUS.LOADED;
        }
        if(requirePackages && !checkDependence(requirePackages)){
            addToDependenceQueue(packageName, requirePackages, constructor);
        }else{
            initPackage(pack, requirePackages, constructor);
        }
        return pack;
    };
    
    /**
     * init the library
     */
    Z = $package(LIBRARY_NAME, function(z){
        
        z.PACKAGE_STATUS = PACKAGE_STATUS;
        z.$package = $package;
        z.getPackage = getPackage;
        z.getPackageStatus = getPackageStatus;

    });
    
})();
;Z.$package('Z.array', function(z){
    
    /**
     * 从给定数组移除指定元素, 只删除一个
     * @param  {Array} arr  
     * @param  {Object},{String} key or item
     * @param {Object} value @optional 指定值
     * @return {Boolean}      找到并移除返回 true
     */
    this.remove = function(arr, key, value){
        var flag = false;
        if(arguments.length === 2){//两个参数
            var item = key;
            var index = arr.indexOf(item);
            if(index !== -1){
                arr.splice(index, 1);
                flag = true;
            }
            return flag;
        }else{
            for(var i = 0, len = arr.length; i < len; i++){
                if(arr[i][key] === value){
                    arr.splice(i, 1);
                    flag = true;
                    break;
                }
            }
            return flag;
        }
    };

    /**
     * 根据指定 key 和 value 进行筛选
     * @param  {Array} arr   
     * @param  {String} key   
     * @param  {Object} value 
     * @return {Array}       
     */
    this.filter = function(arr, key, value){
        var result = [];
        for(var i in arr){
            if(arr[i][key] === value){
                result.push(arr[i]);
            }
        }
        return result;
    }

    /**
     * 判断arr是否包含元素o
     * @memberOf array
     * @param {Array} arr
     * @param {Obejct} o
     * @return {Boolean}
     */
    this.contains = function(arr, o){
        return arr.indexOf(o) > -1;
    };
    
    /**
     * 对数组进行去重
     * @memberOf array
     * @param {Array} arr
     * @return {Array} 由不重复元素构成的数组
     */
    this.uniquelize = function(arr){
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++){
            if(!this.contains(result, arr[i])){
                result.push(arr[i]);
            }
        }
        return result;
    };
    
    /**
     * 把伪数组转换成速组, 如 NodeList , Arguments等有下标和length的对象
     * @param  {Object}, {NodeList} obj 
     * @return {Array}
     */
    this.parse = function(obj){
        return Array.prototype.slice.call(obj);
    }

    this.forEach = function(array, onEach, onEnd){
        var keys = null;
        if(!this.isArray(array)){// 把对象也转换成数组来进行循环
            if(this.isObject(array)){
                keys = [];
                for(var i in array){
                    if(array.hasOwnProperty(i)){
                        keys.push(i);
                    }
                }
            }else{
                throw new Error('not an array or a object');
            }
        }
        var index = -1, count = (keys || array).length;
        var next = function() {
            if(++index >= count){
                onEnd && onEnd(count);
                return;
            }
            var key = keys ? keys[index] : index;
            onEach && onEach(array[key], key, next);
        };
        next();
    }

});
/**
 * 一些最基本的方法, 提供简单的访问方式
 */
;Z.$package('Z', function(z){
    
    /**
     * 简易的 debug 方法, 没有 console 则不起任何作用
     * @param  {Object} data 
     */
    this.debug = function(data){
        if(typeof console != 'undefined'){
            console.debug ? console.debug(data) : console.log(data);
        }else{
            //alert(data);
        }
    };

    var toString = Object.prototype.toString;

    this.is = function(type, obj) {
        var clas = toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }
    
    this.isString = function(obj){
        return toString.call(obj) === '[object String]';
    }
    
    this.isArray = Array.isArray || function(obj){
        return toString.call(obj) === '[object Array]';
    }
    
    this.isArguments = function(obj){
        return toString.call(obj) === '[object Arguments]';
    }
    
    this.isObject = function(obj){
        return toString.call(obj) === '[object Object]';
    }
    
    this.isFunction = function(obj){
        return toString.call(obj) === '[object Function]';
    }
    
    this.isUndefined = function(obj){
        return toString.call(obj) === '[object Undefined]';
    }

    this.isBoolean = function(obj){
        return toString.call(obj) === '[object Boolean]';
    }

    this.isNumber = function(obj){
        return toString.call(obj) === '[object Number]';
    }

    
    /**
     * 判断对象或数组是否为空, 如{},[]责返回false
     * @param  {Object} 
     * @return {Boolean}
     */
    this.isEmpty = function(obj){
        if(!obj){
            return false;
        }else if(this.isArray(obj)){
            return !!obj.length;
        }else{
            for(var i in obj){  
                return false;
            }
            return true;
        }
    }

    /**
     * 比较两个对象的内容是否是一样的, 只要 obj 有的属性, relatedObj 都有且完全相等, 则返回 true
     * 
     * @param  {Object}  obj         
     * @param  {Object}  relatedObj 被比较的对象
     * @param {Boolean} isDeep 是否递归比较, 对于属性有 object 的时候, 需要递归比较
     * @return {Boolean} 
     * @example
     * isSameObject({a: '1', b: 2}, {a: '1', b: 2, c: 'abc'}) === true;
     */
    var isSameObject = this.isSameObject = function(obj, relatedObj, isDeep){
        if(obj === relatedObj || (!obj && !relatedObj)){
            return true;
        }
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                if(z.isObject(obj[i]) && z.isObject(relatedObj[i]) && isDeep){
                    if(!isSameObject(obj[i], relatedObj[i], isDeep)){
                        return false;
                    }
                }else if(obj[i] !== relatedObj[i]){
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 合并几个对象并返回 baseObj,
     * 如果 extendObj 有数组属性, 则直接拷贝引用
     * @param {Object} baseObj 基础对象
     * @param {Object} extendObj ... 
     * 
     * @return {Object} baseObj
     * 
     **/
    var merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
        var argu = arguments;
        var extendObj;
        for(var i = 1; i < argu.length; i++){
            extendObj = argu[i];
            for(var j in extendObj){
                if(z.isArray(extendObj[j])){
                    baseObj[j] = extendObj[j].concat();
                }else if(z.isObject(extendObj[j])){
                    if(baseObj[j] && z.isArray(baseObj[j])){
                    //避免给数组做 merge
                        baseObj[j] = merge({}, extendObj[j]);
                    }else{
                        baseObj[j] = merge({}, baseObj[j], extendObj[j]);
                    }
                }else{
                    baseObj[j] = extendObj[j];
                }
            }
        }
        return baseObj;
    }
    
    /**
     * 把传入的对象或数组或者参数对象(arguments)复制一份
     * @param {Object}, {Array}
     * @return {Object}, {Array} 一个新的对象或数组
     */
    var duplicate = function(obj){
        if(z.isArray(obj)){
            return obj.concat();
        }else if(z.isArguments(obj)){
            var result = [];
            for(var a = 0, p; p = obj[a]; a++){
                result.push(duplicate(p));
            }
            return result;
        }else if(z.isObject(obj)){
            return merge({}, obj);
        }else{
            return obj;
            // throw new Error('the argument isn\'t an object or array');
        }
    }

    /**
     * 使子类简单继承父类, 仅仅将父类的静态属性方法和实例属性方法拷贝给子类
     * @param  {Function} child  子类
     * @param  {Function} parent 父类
     * @return {Function} child 
     * @example
     * function parent(){
     * }
     * parent.prototype {};
     * function child(){
     * }
     * child.prototype = {};
     * extend(child, parent);
     */
    var extend = function(child, parent){
        //继承 parent 的 prototype
        child.prototype = merge({}, parent.prototype, child.prototype);
        child.prototype.constructor = child;
    }

    this.merge = merge;
    this.duplicate = duplicate;
    this.extend = extend;
    
});
;Z.$package('Z.browser', function(z){
    var packageContext = this;
    
    (function(){
        var browser = {};
        browser.set = function(name, version){
            this.name = name;
            this.version = version;
            this[name] = version;
        };
        var s, ua = navigator.userAgent.toLowerCase();
        (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",(s[1])):
        (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",(s[1])) :
        (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",(s[1])) :
        (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",(s[1])) :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",(s[1])) : 0;
        
        Z.merge(packageContext, browser);
        
    })();
    
    var privatePrefixs = {
        ie: 'Ms',
        firefox: 'Moz',
        opera: 'O',
        chrome: 'Webkit',
        safari: 'Webkit'
    };
    var getPrivatePrefix = function(browserName){
        return privatePrefixs[browserName || z.browser.name];
    };
    
    var checkerElement;
    
    var getCheckerElement = function(){
        if(!checkerElement){
            checkerElement = document.createElement('div');
        }
        return checkerElement;
    }
    
    /**
     * 检测 css 的支持
     * @param {String} property 指定需要检测的属性
     * @param {String} value 检测是否支持指定值 @optional
     * @param {Boolean} checkPrivate 指定是否尝试检测浏览器的私有支持 @default false @optional
     */
    this.cssSupport = function(property, value, checkPrivate){
        // throw new Error('not support');
        var element = getCheckerElement();
        if(property in element.style){//TODO 不够完善
            element.style[property] = value;
            return element.style[property] === value;
        }else if(checkPrivate){
            var firstChar = property.charAt(0).toUpperCase();
            property = getPrivatePrefix() + firstChar + property.substr(1);
            return cssSupport(property, false, value);
        }else{
            return false;
        }
    }
    
    
});

;Z.$package('Z', function(z){
    
    var emptyFunction = function(){};

    /**
     * @ignore
     */
    var _classToString = function(){
        return this.className;
    }

    var SUPER_FUNC_REGEX = /this.\$super/;

    /**
     * 定义类
     * @param {Object} option , 可指定 extend 和 implements, statics
     * {extend: {Class}, //继承的父类
     * implements: [{Interface}],//所实现的接口
     * name: {String}, //类名
     * statics: {{String}: {Function}||{Object}},//定义的静态变量和方法
     * }
     * 
     * @param {Object} prototype, 原型链, 必须要有 init 方法
     **/
    var defineClass = function(option, prototype){
        if(arguments.length === 1){
            prototype = option;
            option = {};
        }
        prototype = prototype || {};
        if(!z.isFunction(prototype.init)){
            // throw new Error('a class must have a "init" method');
           // 没有的 init 方法的时候指定一个空的
           prototype.init = emptyFunction;
        }
        var newClass = function(){
            // z.debug( 'class [' + newClass.className + '] init');
            return this.init.apply(this, arguments);
        };
        var superClass = option.extend;
        if(superClass){
            if(isInterface(superClass)){
                throw new Error('can not extend a interface!');
            }
            var superInit = superClass.prototype.init;
            var thisInit = prototype.init;//释放传入 prototype 变量的引用, 以便内存回收
            var superPrototype = z.duplicate(superClass.prototype);
            delete superPrototype.init;
            var newPrototype = newClass.prototype = z.merge({}, superClass.prototype, prototype);
            //处理被重写的方法, 提供在子类调用 this.$super(); 的方式调用
            var subFunc, superFunc;
            for(var prop in superPrototype){
                subFunc = newPrototype[prop];
                superFunc = superPrototype[prop];
                if(z.isFunction(superFunc) && z.isFunction(subFunc) && 
                    SUPER_FUNC_REGEX.test(subFunc)){
                    newPrototype[prop] = (function(superFn, subFn){
                        return function(){
                            var tmp = this.$super;
                            this.$super = superFn;
                            subFn.apply(this, arguments);
                            this.$super = tmp;
                        }
                    })(superFunc, subFunc);
                }
            }
            newClass.prototype.init = function(){
                var argus = z.duplicate(arguments);
                superInit.apply(this, argus);
                this.$static = newClass;//提供更快速的访问类方法的途径
                thisInit.apply(this, arguments);
            }
        }else{
            var thisInit = prototype.init;
            newClass.prototype = prototype;
            newClass.prototype.init = function(){
                this.$static = newClass;//提供更快速的访问类方法的途径
                var argus = arguments;
                thisInit.apply(this, argus);
            }
        }
        newClass.prototype.constructor = newClass;
        newClass.type = 'class';
        newClass.className = option.name || 'anonymous';
        // newClass.toString = _classToString;

        var impls = option['implements'];
        if(impls){
            var unImplMethods = [], implCheckResult;
            for(var i in impls){
                implCheckResult = impls[i].checkImplements(newClass.prototype);
                unImplMethods = unImplMethods.concat(implCheckResult);
            }
            if(unImplMethods.length){
                throw new Error('the \'' + newClass.className + '\' class hasn\'t implemented the interfaces\'s methods . [' + unImplMethods + ']');
            }
        }
        if(option.statics){
            z.merge(newClass, option.statics);
        }
        return newClass;
    }
    
    /**
     * 判断传入类是否是接口
     **/
    var isInterface = function(cls){
        if(cls.type === 'interface' && z.isArray(cls.methods) && z.isFunction(cls.checkImplements)){
            return true;
        }
        return false;
    }
    
    /**
     * @ignore
     */
    var _checkImplements = function(instance){
        var unImplMethods = [], impl;
        for(var i in this.methods){
            impl = instance[this.methods[i]];
            if(!impl || !z.isFunction(impl)){
                unImplMethods.push(methods[i]);
            }
        }
        return unImplMethods;
    }

    /**
     * @ignore
     */
    var _interfaceToString = function(){
        return this.interfaceName;
    }

    /**
     * 定义接口
     **/
    var defineInterface = function(option, methods){
        if(arguments.length === 1){
            methods = option;
            option = {};
        }
        var newInterface = function(){
            throw new Error('the interface can not be Instantiated!');
        }
        newInterface.type = 'interface'
        newInterface.interfaceName = option.name || 'anonymous';
        newInterface.methods = methods;
        newInterface.checkImplements = _checkImplements;
        return newInterface;
    }
    
    /**
     * 定义类或接口
     * @example
     *  var A = define('class', {
            name: 'classA'
        }, {
            init: function(){
                console.log('A init');
            },
            alertA: function(){
                alert('A');
            }
        });
        
        var B = define('class', { extend: A , statics: {
            kill: function(){
                alert('kill B');
            }
            
        }}, {
            init: function(){
                console.log('B init');
            },
            alertB: function(){
                alert('B');
            }
        });
        
        var C = define('interface', [
            'foo',
            'bar'
        ]);
        
        var D = define('class', { extend: B, 'implements': [ C ]}, {
            init: function(){
                console.log('D init');
            },
            foo: function(){
                console.log('foooooo');
            },
            bar: function(){
            }
        });

     *
     **/
    var define = function(type, option, prototype){
        var args = Array.prototype.slice.call(arguments, 1);
        if(type === 'class'){
            return defineClass.apply(this, args);
        }else if(type === 'interface'){
            return defineInterface.apply(this, args);
        }
        
    }
    
    this.define = define;
    this.$class = defineClass;
    this.$interface = defineInterface;
});
;Z.$package('Z.cookie', function(z){

    var defaultDomain = window.location.host;
    
    /**
     * 设置一个 cookie 
     * @param {String} name 
     * @param {String},{Object} value  
     * @param {String} domain 
     * @param {String} path   
     * @param {Number} hour  
     */
    this.set = function(name, value, domain, path, hour) {
        if (hour) {
            var today = +new Date;
            var expire = new Date();
            expire.setTime(today + 3600000 * hour);
        }
        if(!z.isString(value)){
            value = JSON.stringify(value);
        }
        value = window.encodeURIComponent(value);
        window.document.cookie = name + '=' + value + '; ' 
            + (hour ? ('expires=' + expire.toGMTString() + '; ') : '') 
            + (path ? ('path=' + path + '; ') : 'path=/; ') 
            + (domain ? ('domain=' + domain + ';') : ('domain=' + defaultDomain + ';'));
    }
    
    /**
     * 取 cookie 值
     * @param  {String} name 
     * @return {String}      
     */
    this.get = function(name) {
        var r = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)');
        var m = window.document.cookie.match(r);
        var value = !m ? '' : m[1];
        value = window.decodeURIComponent(value);
        try{
            value = JSON.parse(value);
        }catch(e){

        }
        return value;
    }
    
    /**
     * 删除指定cookie
     * 
     * @param {String} name
     * @param {String} domain
     * @param {String} path 
     */
    this.remove = function(name, domain, path) {
        window.document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; ' 
            + (path ? ('path=' + path + '; ') : 'path=/; ') 
            + (domain ? ('domain=' + domain + ';') : ('domain=' + defaultDomain + ';'));
    }
    
});

;Z.$package('Z.date', function(z){
    
    /**
     * 格式化日期
     * @param {Date} date
     * @param {String} format "yyyy-MM-dd hh:mm:ss"
     */
    this.format = function(date, format) {
        /*
         * eg:format="yyyy-MM-dd hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth() + 1, // month
            "d+" : date.getDate(), // day
            "h+" : date.getHours(), // hour
            "m+" : date.getMinutes(), // minute
            "s+" : date.getSeconds(), // second
            "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
            "S" : date.getMilliseconds()
                // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
                    - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    
});

;Z.$package('Z.file', function(z){

    var IMAGE_NOT_LOAD = 0;
    var IMAGE_LOADING = 1;
    var IMAGE_LOADED = 2;
    var IMAGE_LOAD_ERROR = 3;

    function onImageLoad(e, loader){
        var imgObj = loader._imageList[this.src];
        imgObj.status = IMAGE_LOADED;
        imgObj.size = {
            width: this.width,
            height: this.height
        };
        for(var i = 0, cbObj; cbObj = imgObj.cbs[i]; i++){
            cbObj.cb.call(cbObj.cxt || window, true, imgObj.url, imgObj.size);
        }
        imgObj.cbs = [];
    }

    function onImageError(e, loader){
        var imgObj = loader._imageList[this.src];
        imgObj.status = IMAGE_LOAD_ERROR;
        for(var i = 0, cbObj; cbObj = imgObj.cbs[i]; i++){
            cbObj.cb.call(cbObj.cxt || window, false, imgObj.url);
        }
        imgObj.cbs = [];
    }

    /**
     * 图片的加载类, 这是一个内部类, 对外使用 z.file.loadImage 加载图片
     * @class
     * @name ImageLoader
     */
    this.ImageLoader = z.$class({
        init: function(option){
            this._imageList = {};
        },
        /**
         * 加载图片
         * @param  {String}   imgUrl   图片url
         * @param  {Function} callback 回调函数, 回调参数格式为 callback(success, imageUrl, imageSize)
         * @param  {Object}   context  回调函数的上下文, 可选 
         * @example
         * loader.load('http://xxxx', function(success, imgUrl, size){
         *     if(success){
         *         console.log('img size is: w= ' + size.width + ', h= ' + size.height);
         *     }else{
         *         console.log('load img failure');
         *     }
         * }, this);
         * 
         */
        load: function(imgUrl, callback, context){
            var imgObj = this._imageList[imgUrl];
            if(!imgObj){
                imgObj = {
                    url: imgUrl,
                    status: IMAGE_NOT_LOAD,
                    cbs: []
                };
                this._imageList[imgUrl] = imgObj;
            }
            //已经加载过或正在加载
            if(imgObj.status === IMAGE_LOADED){
                callback.call(context || window, true, imgUrl, imgObj.size);
            }else if(imgObj.status === IMAGE_LOADING){
                imgObj.cbs.push({ cb: callback, cxt: context });
            }else{
                imgObj.cbs.push({ cb: callback, cxt: context });
                imgObj.status = IMAGE_LOADING;
                
                var image = new Image();
                var that = this;
                image.onload = function(e){
                    onImageLoad.call(this, e, that);
                };
                var onErrorFunc = function(e){
                    onImageError.call(this, e, that);
                };
                image.onerror = onErrorFunc
                image.onabort = onErrorFunc;
                image.src = imgUrl;
            }
        }
    });
    
});/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z) {
    var IE_CUSTOM_EVENT = 'onpropertychange';
    var IE_EVENT_ELEMENT_STYLE = 'position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;';

    var eventElement;

    var increaseId = 0;

    var getEventElement = function() {
        if (!eventElement) {
            eventElement = document.createElement('div');
            if (!document.createEvent) {
                eventElement.style.cssText = IE_EVENT_ELEMENT_STYLE;
                document.body.appendChild(eventElement);
            }
        }
        return eventElement;
    }

    var getListenerId = function(){
        return +new Date + '' + increaseId++ ;
    }

    /**
     * 添加事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type 消息类型
     * @param {Function} func 监听函数
     * @param {Object} context func的执行上下文， 默认为 window
     * func 的调用参数为 ({String}: type, {Object}: message)
     * @example
     * addListener(obj, 'evt', func);
     * addListener(obj, 'evt', func, ctx);
     * addListener('evt', func);
     * addListener('evt', func, ctx);
     */
    var addListener = function(model, type, func, context) {
        var listener;
        var wrapFunc;
        var element;
        var listeners;
        var listenerId;
        if(arguments.length < 2){
            throw new Error('addListener arguments not enough');
        }else if(z.isString(model)){
            context = func;
            func = type;
            type = model;
            model = window;
        }
        if(!context){
            context = window;
        }
        if (!model.__listeners) {
            model.__listeners = {};
            model.__listenerId = getListenerId();
        }
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners[type]) {
            listeners[type] = [];
        } else {
            for (var i in listeners[type]) {
                listener = listeners[type][i];
                if (listener.func === func) {
                    return false;
                }
            }
        }
        element = getEventElement();
        if (element.addEventListener) {
            wrapFunc = function(e) {
                func.apply(context, e.params);
                context = null;
            }
            element.addEventListener(listenerId + '-' + type, wrapFunc, false);
        } else {
            wrapFunc = function(e) {
                e = window.event;
                //TODO ie8及以下的浏览器后绑定的方法先执行, 导致触发的事件执行顺序倒过来了
                //没精力去自己实现顺序执行, 先这样吧
                var lid = e.params.pop();
                if (type === e.params[1] && lid === listenerId) {
                    func.apply(context, e.params);
                    context = null;
                }
            }
            element.attachEvent(IE_CUSTOM_EVENT, wrapFunc);
        }
        listener = {
            func: func,
            wrapFunc: wrapFunc
        };
        listeners[type].push(listener);
        return true;
    }
    /**
     * 移除事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type
     * @param {Function} func 监听函数
     */
    var removeListener = function(model, type, func) {
        var listener;
        var element;
        var listeners;
        var listenerId;
        if(arguments.length < 2){
            throw new Error('removeListener arguments not enough');
        }else if (arguments.length === 2) {
            func = type;
            type = model;
            model = window;
        }
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners || !listeners[type]) {
            return false;
        }
        element = getEventElement();
        // TODO 这个支持有存在的必要吗
        // if (!func) {
        //     for (var i in listeners[type]) {
        //         listener = listeners[type][i];
        //         if (element.removeEventListener) {
        //             element.removeEventListener(type, listener.wrapFunc, false);
        //         } else {
        //             element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
        //         }
        //     }
        //     listeners[type] = null;
        //     delete listeners[type];
        //     return true;
        // }
        for (var i in listeners[type]) {
            listener = listeners[type][i];
            if (listener.func === func) {
                listeners[type].slice(i, 1);
                if (element.removeEventListener) {
                    element.removeEventListener(listenerId + '-' + type, listener.wrapFunc, false);
                } else {
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
                return true;
            }
        }
        return false;
    }

    /** 
     * 向消息的监听者广播一条消息
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type ,消息类型
     * @param {Object} message, 消息体, 可选
     * @example
     * var func1 = function(type, message){
            console.log('help!!!!! don\t kill me ..... call 110.');
            throw '110';
        }
        
        z.message.on('kill', func1);
        
        z.message.on('kill', function(type, message){
            console.log('ok, i m dead.');
            
        });
        
        //notify it
        z.message.notify('kill')
        //or 
        z.message.notify(window, 'kill')
     *
     */
    var notify = function(model, type, message) {
        var element;
        var event;
        var listeners;
        var listenerId;
        if (arguments.length === 1) {
            type = model;
            model = window;
        }else if (arguments.length === 2 && z.isString(model)) {
            message = type;
            type = model;
            model = window;
        }
        z.debug('notify message: ' + type);
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners || !listeners[type]) {
            return false;
        }

        element = getEventElement();
        if (document.createEvent) {
            event = document.createEvent('Events');
            event.initEvent(listenerId + '-' + type, false, false);
            event.params = [message, type];
            element.dispatchEvent(event);
        } else {
            event = document.createEventObject(IE_CUSTOM_EVENT);
            event.params = [message, type, listenerId];
            element.fireEvent(IE_CUSTOM_EVENT, event);
        }
        return listeners[type].length !== 0;
    }

    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});

;Z.$package('Z.number', function(z){
    
    /**
     * 格式化数字
     * @param {Number} number
     * @param {String} pattern "00#.###.##00"
     * @return {String}
     */
    this.format = function(number, pattern){
        var strarr = number.toString().split('.');
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr='';

        // 整数部分
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length-1;  
        var comma = false;
        for(var f=fmt.length-1;f>=0;f--){
            switch(fmt.substr(f,1)){
                case '#':
                    if(i>=0 ) retstr = str.substr(i--,1) + retstr;
                    break;
                case '0':
                    if(i>=0){
                        retstr = str.substr(i--,1) + retstr;
                    }
                    else {
                        retstr = '0' + retstr;
                    }
                    break;
                case ',':
                    comma = true;
                    retstr=','+retstr;
                    break;
            }
        }
        if(i>=0){
            if(comma){
                var l = str.length;
                for(;i>=0;i--){
                    retstr = str.substr(i,1) + retstr;
                    if(i>0 && ((l-i)%3)==0){
                        retstr = ',' + retstr;
                    }
                }
            }
            else{
                retstr = str.substr(0,i+1) + retstr;
            }
        }
        retstr = retstr+'.';
        // 处理小数部分
        str=strarr.length>1?strarr[1]:'';
        fmt=fmtarr.length>1?fmtarr[1]:'';
        i=0;
        for(var f=0;f<fmt.length;f++){
            switch(fmt.substr(f,1)){
            case '#':
                if(i<str.length){
                    retstr+=str.substr(i++,1);
                }
                break;
            case '0':
                if(i<str.length){
                    retstr+= str.substr(i++,1);
                }
                else retstr+='0';
                break;
            }
        }
        return retstr.replace(/^,+/,'').replace(/\.$/,'');
    }
    
    /**
     * 
     * 由给定数组,计算出最大值和最小值返回
     * @param {Array} array
     * @return {Object} 返回最大最小值组成的对象,{max,min}
     */
    this.getMaxMin = function(array){
        //TODO 这个方法的实现太搓, 是病, 得治
        var max = 0, min = 0, len = array.length;
        if(len > 0){
            min = array[0];
            for(var i = 0; i < len; i++){
                if(array[i] > max){
                    max = array[i];
                }else if(array[i] < min){
                    min = array[i];
                }
            }
        }
        return {max: max,min: min};
    }

    /**
     * 返回指定范围的随机整数, 如 [9, 15], 将返回 9 <= n <= 15
     * @param  {Number} start 随机数最小值
     * @param  {Number} end   随机数最大值
     * @return {Number}
     */
    this.random = function(start, end){
        return Math.floor(Math.random() * (end - start + 1) + start);
    }
    
});

;Z.$package('Z.storage', function(z){


    var Storage = z.$class({
        name: 'Storage'
    }, {
        init: function(storage){
            this._storage = storage;
        },

        isSupport: function(){
            return this._storage != null;
        },

        /**
         * 设置内容到本地存储
         * @param {String} key   要设置的 key
         * @param {String}, {Object} value 要设置的值, 可以是字符串也可以是可序列化的对象
         */
        set: function(key, value){
            if(this.isSupport()){
                if(!z.isString(value)){
                    value = JSON.stringify(value);
                }
                this._storage.setItem(key, value);
                return true;
            }
            return false;
            
        },

        get: function(key){
            if(this.isSupport()){
                var value = this._storage.getItem(key);
                try{
                    value = JSON.parse(value);
                }catch(e){

                }
                return value;
            }
            return false;
        },

        remove: function(key){
            if(this.isSupport()){
                this._storage.removeItem(key);
                return true;
            }
            return false;
        },

        clear: function(){
            if(this.isSupport()){
                this._storage.clear();
                return true;
            }
            return false;
        }
    });

    this.local = new Storage(window.localStorage);

    this.session = new Storage(window.sessionStorage);
    
});

;Z.$package('Z.string', function(z){
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    var toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    this.toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };
    
    /**
     * 字符串格式函数
     * 
     * @Example 
     * var a = "I Love {0}, and You Love {1},Where are {0}! {4}";
     * alert(z.string.format(a, "You","Me")); 
     */
    this.format = function(str, arg1, arg2/*...*/) {
        if( arguments.length == 0 )
            return null;
        var str = arguments[0];
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }

    /**
     * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
     * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
     * 
     * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
     * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
     * 000800 - 00D7FF 
       00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
     * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
     * 
     * 注: Unicode在范围 D800-DFFF 中不存在任何字符
     * {@link http://zh.wikipedia.org/wiki/UTF-8}
     * 
     * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
     * 000000 - 00FFFF  两个字节
     * 010000 - 10FFFF  四个字节
     * 
     * {@link http://zh.wikipedia.org/wiki/UTF-16}
     * @param  {String} str 
     * @param  {String} charset utf-8, utf-16
     * @return {Number}
     */
    this.sizeof = function(str, charset){
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if(charset === 'utf-16' || charset === 'utf16'){
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0xffff){
                    total += 2;
                }else{
                    total += 4;
                }
            }
        }else{
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0x007f) {
                    total += 1;
                }else if(charCode <= 0x07ff){
                    total += 2;
                }else if(charCode <= 0xffff){
                    total += 3;
                }else{
                    total += 4;
                }
            }
        }
        return total;
    }

    /**
     * 检查传入参数是否是空字符串或者是null
     * @param  {String}  str 
     * @return {Boolean}     空字符串“”或者null时返回true
     */
    this.isEmpty = function(str){
        if(null == str || '' == str){
            return true;
        }
        return false;
    }

    /**
     * 把首字母转换成大写
     * @param  {String} str 
     * @return {String}     
     */
    this.capital = function(str){
        if(this.isEmpty(str)){
            return '';
        }
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    this.endsWith = function(str, end){
        var index = str.lastIndexOf(end);
        return index + end.length == str.length;
    }

});
