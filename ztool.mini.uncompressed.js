;(function(name, definition){
    this[name] = definition();
    if (typeof module !== 'undefined'){
        module.exports = exports = this[name];
    }
})('zTool', function(){

    var globalContext = this;

    var context = {
        varsion: '1.0',
        author: 'azrael'
    };


    /**
     * @param {String} packageName
     */
    var buildPackage = function(packageName){
        var pack =  globalContext;
        var nameList = packageName.split('.');
        for(var i in nameList){
            if(!(nameList[i] in pack)){
                pack[nameList[i]] = {};
            }
            pack = pack[nameList[i]];
        }
        return pack;
    };

    /**
     * 简单的包管理
     * @param  {String} packageName 
     * @param  {Function} initFunc    
     */
    context.$package = function(packageName, initFunc){
        var pack = packageName ? buildPackage(packageName) : globalContext;
        initFunc.call(pack, context);
    };

    return context;
});/**
 * 一些最基本的方法, 提供简单的访问方式
 */
;zTool.$package('zTool', function(z){
    
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

    var is = this.is = function(obj, type) {
        var clas = toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }
    
    this.isString = function(obj){
        return is(obj, 'String');
    }
    
    this.isArray = Array.isArray || function(obj){
        return is(obj, 'Array');
    }
    
    this.isArguments = function(obj){
        return is(obj, 'Arguments');
    }
    
    this.isObject = function(obj){
        return is(obj, 'Object');
    }
    
    this.isFunction = function(obj){
        return is(obj, 'Function');
    }
    
    this.isUndefined = function(obj){
        return is(obj, 'Undefined');
    }

    this.isBoolean = function(obj){
        return is(obj, 'Boolean');
    }

    this.isNumber = function(obj){
        return is(obj, 'Number');
    }

    
    /**
     * 判断对象或数组是否为空, 如{},[]责返回false
     * @param  {Object} 
     * @return {Boolean}
     */
    var isEmpty = function(obj){
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
     * @param {Boolean} deep 是否递归比较, 对于属性有 object 的时候, 需要递归比较
     * @return {Boolean} 
     * @example
     * isSame({a: '1', b: 2}, {a: '1', b: 2, c: 'abc'}) === true;
     */
    var isSame = function(obj, relatedObj, deep){
        if(obj === relatedObj || (!obj && !relatedObj)){
            return true;
        }
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                if(z.isObject(obj[i]) && z.isObject(relatedObj[i]) && deep){
                    if(!isSame(obj[i], relatedObj[i], deep)){
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
     * parent.prototype = {};
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

    this.isEmpty = isEmpty;
    this.isSame = isSame;

    this.merge = merge;
    this.duplicate = duplicate;
    this.extend = extend;
    
});
;zTool.$package('zTool', function(z){
    
    var emptyFunction = function(){};


    var SUPER_FUNC_REGEX = /this.\$super/;

    /**
     * 定义类
     * @param {Object} option , 可指定 extend 和 implements, statics
     * {extend: {Class}, //继承的父类
     * name: {String}, //类名
     * statics: {{String}: {Function}||{Object}},//定义的静态变量和方法
     * }
     * 
     * @param {Object} prototype, 原型链, 必须要有 init 方法
     **/
    this.$class= function(option, prototype){
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

        if(option.statics){
            z.merge(newClass, option.statics);
        }
        return newClass;
    }
    
});