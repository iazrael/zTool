
;Z.$package('Z', function(z){
    
    var toString = Object.prototype.toString;
    
    var isArray = function(obj){
        return toString.call(obj) === '[object Array]';
    }
    
    var isArguments = function(obj){
        return toString.call(obj) === '[object Arguments]';
    }
    
    var isObject = function(obj){
        return toString.call(obj) === '[object Object]';
    }
    
    var isFunction = function(obj){
        return toString.call(obj) === '[object Function]';
    }
    
    /**
	 * 合并几个对象并返回 baseObj,
     * 如果 extendObj 有数组属性, 则直接拷贝引用
     * @param {Object} baseObj 基础对象
     * @param {Object} extendObj ... 
     * 
     * @return {Object} a new baseObj
     * 
	 **/
    var merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
        var argu = arguments;
        var extendObj;
        for(var i = 1; i < argu.length; i++){
            extendObj = argu[i];
            for(var j in extendObj){
                if(isArray(extendObj[j])){
                    baseObj[j] = extendObj[j].concat();
                }else if(isObject(extendObj[j])){
                    if(baseObj[j] && isArray(baseObj[j])){
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
        if(isArray(obj)){
            return obj.concat();
        }else if(isArguments(obj)){
            var result = [];
            for(var a = 0, p; p = obj[a]; a++){
                result.push(duplicate(p));
            }
            return result;
        }else if(isObject(obj)){
            return merge({}, obj);
        }else{
            throw new Error('the argument isn\'t an object or array');
        }
    }
    
    /**
	 * 定义类
	 * @param {Object} option , 可指定 extend 和 implements, statics
     * {extend: {Class}, //继承的父类
     * implements: [{Interface}],//所实现的接口
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
        if(typeof(prototype.init) !== 'function'){
            throw new Error('a class must have a "init" method');
        }
        var newClass = function(){
            return this.init.apply(this, arguments);
        };
        var superClass = option.extend;
        if(superClass){
            if(isInterface(superClass)){
                throw new Error('can not extend a interface!');
            }
            var superInit = superClass.prototype.init;
            var superPrototype = duplicate(superClass.prototype);
            delete superPrototype.init;
            newClass.prototype = merge({}, superClass.prototype, prototype);
            newClass.prototype.init = function(){
                var argus = duplicate(arguments);
                superInit.apply(this, argus);
                argus = duplicate(arguments);
                prototype.init.apply(this, argus);
                //把父类被重写的方法赋给子类实例
                var that = this;
                this.superClass = {};//TODO 这里有问题, 不能向上找父类的父类
                for(var prop in superPrototype){
                    if(isFunction(superPrototype[prop]) && prototype[prop]){
                        this.superClass[prop] = (function(prop){
                            return function(){
                                superPrototype[prop].apply(that, arguments);
                            }
                        })(prop);
                    }
                }
            }
        }else{
            newClass.prototype = prototype;
        }
        newClass.type = 'class';
        newClass.className = option.name || 'anonymous';
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
            merge(newClass, option.statics);
        }
        return newClass;
    }
    
    /**
	 * 判断传入类是否是接口
	 **/
    var isInterface = function(cls){
        if(cls.type === 'interface' && isArray(cls.methods) && isFunction(cls.checkImplements)){
            return true;
        }
        return false;
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
        newInterface.checkImplements = function(instance){
            var unImplMethods = [], impl;
            for(var i in methods){
                impl = instance[methods[i]];
                if(!impl || typeof(impl) !== 'function'){
                    unImplMethods.push(methods[i]);
                }
            }
            return unImplMethods;
        }
        return newInterface;
    }
    
    /**
	 * 定义类或接口
     * @example
     * var A = define('class', {
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
    
    this.merge = merge;
    this.define = define;
    
    /* //test code
    var A = define('class', {
        init: function(option){
            console.log('A init');
            console.log(arguments);
        },
        alertA: function(){
            alert('A');
        },
        foo: function(){
            console.log('a foo');
        }
    });
    
    var B = define('class', { extend: A , statics: {
        kill: function(){
            alert('kill B');
        }
        
    }}, {
        init: function(option){
            console.log('B init');
            option.b='c';
        },
        alertB: function(){
            alert('B');
        },
        bar: function(){
            console.log('b bar');
        },
        foo: function(){
            console.log('b foo');
        }
    });
    
    var C = define('interface', [
        'foo',
        'bar'
    ]);
    
    var D = define('class', { extend: B, 'implements': [ C ]}, {
        init: function(){
            console.log('D init');
            console.log(arguments);
        },
        foo: function(){
            console.log('foooooo');
        },
        bar: function(){
        }
    });
    
    // var a = new A();
    // console.log(a);
    // console.log(a.constructor);
    
    // var b = new B();
    // console.log(b);
    // console.log(b.constructor);
//    console.log(B);
    var d = new D({'a': 123});
//    console.log(D);
    console.log(d);
    console.log(d.constructor); */
});