
;Z.$package('Z.util', function(z){
    
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
                if(obj.hasOwnProperty(n)){  
                    count++;  
                }  
            }  
            return count;  
        }
    };

    
});
