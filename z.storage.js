
;Z.$package('Z.storage', function(z){

    
    this.isSupport = function(){
        return window.localStorage != null;
    }

    /**
     * 设置内容到本地存储
     * @param {String} key   要设置的 key
     * @param {String}, {Object} value 要设置的值, 可以是字符串也可以是可序列化的对象
     */
    this.set = function(key, value){
        if(this.isSupport()){
            if(!z.isString(value)){
                value = JSON.stringify(value);
            }
            window.localStorage.setItem(key, value);
            return true;
        }
        return false;
        
    }

    this.get = function(key){
        if(this.isSupport()){
            var value = window.localStorage.getItem(key);
            try{
                value = JSON.parse(value);
            }catch(e){

            }
            return value;
        }
        return false;
    }

    this.remove = function(key){
        if(this.isSupport()){
            window.localStorage.removeItem(key);
            return true;
        }
        return false;
    }

    this.clear = function(){
        if(this.isSupport()){
            window.localStorage.clear();
            return true;
        }
        return false;
    }
    
});
