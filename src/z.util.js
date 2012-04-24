
;Z.$package('Z.util', function(z){
    
    /**
     * 计算 object 的长度
     * @param  {Object} o 
     * @return {Number}
     */
    this.size = function(o){  
        var n, count = 0;  
        for(n in o){  
            if(o.hasOwnProperty(n)){  
                count++;  
            }  
        }  
        return count;  
    };

    /**
     * 判断是否为空对象
     * @param  {Object} 
     * @return {Boolean}
     */
    this.isEmptyObject = function(o){
        for(var n in o){  
            return false;
        }  
        return true;
    };
    
});
