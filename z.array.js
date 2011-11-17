Z.$package('Z.array', function(z){
    
    var indexOf = function(arr, item){
        var index = -1;
        for(var i = 0, len = arr.length; i < len; i++){
            if(arr[i] === item){
                index = i;
                break;
            }
        }
        return index;
    }
    
    var remove = function(arr, item){
        var flag = false;
        for(var i = 0, len = arr.length; i < len; i++){
            if(arr[i] === item){
                arr.splice(i, 1);
                flag = true;
            }
        }
        return flag;
    };
    
    this.indexOf = indexOf;
    this.remove = remove;
    
});
