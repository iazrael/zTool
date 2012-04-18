
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

});
