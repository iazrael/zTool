
;Z.$package('Z.array', function(z){
    
    /**
     * 从给定数组移除指定元素, 只删除一个
     * @param  {Array} arr  
     * @param  {Object},{String} key
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
    
});
