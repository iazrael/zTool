
;Z.$package('Z.array', function(z){
    
    this.remove = function(arr, item){
        var flag = false;
        for(var i = 0, len = arr.length; i < len; i++){
            if(arr[i] === item){
                arr.splice(i, 1);
                flag = true;
            }
        }
        return flag;
    };
    
});
