
;Z.$package('Z', function(z){
    
    var emptyFunction = function(){};

    /**
     * @ignore
     */
    var _classToString = function(){
        return this.className;
    }

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
            z.debug( 'class [' + newClass.className + '] init');
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
            newClass.prototype = z.merge({}, superClass.prototype, prototype);
            var newPrototype = prototype;
            newClass.prototype.init = function(){
                var argus = z.duplicate(arguments);
                superInit.apply(this, argus);
                this.$static = newClass;//提供更快速的访问类方法的途径
                argus = z.duplicate(arguments);
                thisInit.apply(this, argus);
                //把父类被重写的方法赋给子类实例
                var that = this;
                this.$super = {};//TODO 这里有问题, 不能向上找父类的父类
                //TODO 严重问题, A <- B <- C
                //b调用了$super, c调用了$super的时候有死循环
                for(var prop in superPrototype){
                    if(z.isFunction(superPrototype[prop]) && newPrototype[prop]){//子类重写了的方法, 才覆盖
                        this.$super[prop] = (function(prop){
                            return function(){
                                superPrototype[prop].apply(that, arguments);
                            }
                        })(prop);
                    }
                }
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
        newClass.type = 'class';
        newClass.className = option.name || 'anonymous';
        newClass.toString = _classToString;

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
    
    this.$class = defineClass;
    this.$interface = defineInterface;
    
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