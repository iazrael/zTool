/**
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
     * 比较两个对象的内容是否是一样的, 只要 obj 有的属性, relatedObj 都有且完全相等, 则返回 true
     * 
     * @param  {Object}  obj         
     * @param  {Object}  relatedObj 被比较的对象
     * @return {Boolean} 
     * @example
     * isSameObject({a: '1', b: 2}, {a: '1', b: 2, c: 'abc'}) === true;
     */
    this.isSameObject = function(obj, relatedObj){
        for(var i in obj){
            if(obj.hasOwnProperty(i) && obj[i] !== relatedObj[i]){
                return false;
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