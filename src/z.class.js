
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