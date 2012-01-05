
/**
 * 一些常用的方法, 提供简单的访问方式
 */
;Z.$package('Z', function(z){
    
    var toString = Object.prototype.toString;
    
    this.isArray = function(obj){
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
    
    
});