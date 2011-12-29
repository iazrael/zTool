
;Z.$package('Z', function(z){
    
    /**
	 * 合并几个对象
	 **/
    var merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
        var argu = arguments;
        var extendObj;
        for(var i = 1; i < argu.length; i++){
            extendObj = argu[i];
            for(var j in extendObj){
                if(extendObj[j].constructor === Array){
                    baseObj[j] = extendObj[j].concat();
                }else if(extendObj[j].constructor === Object){
                    if(baseObj[j] && baseObj[j].constructor === Array){
                    //避免给数组做merge
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
            var subInit = prototype.init;
            //TODO 实例如何调用父类被重写的方法?
            newClass.prototype = merge({}, superClass.prototype, prototype);
            newClass.prototype.init = function(){
                superInit.apply(this, arguments);
                subInit.apply(this, arguments);
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
        if(cls.type === 'interface' && 
            cls.methods.constructor === Array && 
            cls.checkImplements.constructor === Function )
        {
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
    
    // var a = new A();
    // console.log(a);
    // console.log(a.constructor);
    
    // var b = new B();
    // console.log(b);
    // console.log(b.constructor);
//    console.log(B);
    var d = new D();
    console.log(D);
    console.log(d);
    console.log(d.constructor); */
});