
;Z.$package('Z.array', function(z){
    
    this.remove = function(arr, item){
        //TODO 可以重构
        var flag = false;
        for(var i = 0, len = arr.length; i < len; i++){
            if(arr[i] === item){
                arr.splice(i, 1);
                flag = true;
            }
        }
        return flag;
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
