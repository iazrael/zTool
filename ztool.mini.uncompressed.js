
;(function(undefined){
    var PACKAGE_STATUS = {
        UNDEFINED: 0,
        BUILDED: 1,
        LOADED: 2,
        INITED: 3
    };
    var LIBRARY_NAME = 'Z';
    
    var packageList = {};
    var dependenceQueue = {};
    
    var emptyFunction = function(){};
    
    var isDebuging = 0;
    var debug = isDebuging ? (window.console ? function(data){
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
            pack = window;
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
        var pack = window;
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
    };
    
    /**
     * init the library
     */
    $package(LIBRARY_NAME, function(z){
        
        z.PACKAGE_STATUS = PACKAGE_STATUS;
        z.$package = $package;
        z.getPackage = getPackage;
        z.getPackageStatus = getPackageStatus;
        
    });
    
})();/**
 * 一些最基本的方法, 提供简单的访问方式
 */
;Z.$package('Z', function(z){
    
    /**
     * 简易的 debug 方法, 没有 console 则不起任何作用
     * @param  {Object} data 
     */
    this.debug = function(data){
        if(window.console){
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
            throw new Error('the argument isn\'t an object or array');
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
        //继承 parent 的静态方法
        merge(child, parent);
        //继承 parent 的 prototype
        child.prototype = merge({}, parent.prototype, child.prototype);
        child.prototype.constructor = child;
    }

    this.merge = merge;
    this.duplicate = duplicate;
    this.extend = extend;
    
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
     * func 的调用参数为 ({String}: type, {Object}: message)
     */
    var addListener = function(model, type, func) {
        var listener;
        var wrapFunc;
        var element;
        var listeners;
        var listenerId;
        if(arguments.length < 2){
            throw new Error('addListener arguments not enough');
        }else if (arguments.length === 2) {
            func = type;
            type = model;
            model = window;
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
                func.apply(window, e.params);
            }
            element.addEventListener(listenerId + '-' + type, wrapFunc, false);
        } else {
            wrapFunc = function(e) {
                e = window.event;
                //TODO ie8及以下的浏览器后绑定的方法先执行, 导致触发的事件执行顺序倒过来了
                //没精力去自己实现顺序执行, 先这样吧
                var lid = e.params.pop();
                if (type === e.params[1] && lid === listenerId) {
                    func.apply(window, e.params);
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
