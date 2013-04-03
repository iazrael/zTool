
;Z.$package('Z.util', function(z){
    
    //防止 hasOwnProperty 被污染
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * 计算对象的属性数量
     * @param  {Object} obj 
     * @return {Number}
     */
    this.sizeof = function(obj){
        if(z.isArray(obj)){
            return obj.length;
        }else{
            var n, count = 0;  
            for(n in obj){  
                if(hasOwnProperty.call(obj, n)){  
                    count++;  
                }  
            }  
            return count;  
        }
    };

    
});
