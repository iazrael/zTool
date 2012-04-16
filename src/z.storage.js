
;Z.$package('Z.storage', function(z){


    var Storage = z.$class({
        name: 'Storage'
    }, {
        init: function(storage){
            this._storage = storage;
        },

        isSupport: function(){
            return this._storage != null;
        },

        /**
         * 设置内容到本地存储
         * @param {String} key   要设置的 key
         * @param {String}, {Object} value 要设置的值, 可以是字符串也可以是可序列化的对象
         */
        set: function(key, value){
            if(this.isSupport()){
                if(!z.isString(value)){
                    value = JSON.stringify(value);
                }
                this._storage.setItem(key, value);
                return true;
            }
            return false;
            
        },

        get: function(key){
            if(this.isSupport()){
                var value = this._storage.getItem(key);
                try{
                    value = JSON.parse(value);
                }catch(e){

                }
                return value;
            }
            return false;
        },

        remove: function(key){
            if(this.isSupport()){
                this._storage.removeItem(key);
                return true;
            }
            return false;
        },

        clear: function(){
            if(this.isSupport()){
                this._storage.clear();
                return true;
            }
            return false;
        }
    });

    this.local = new Storage(window.localStorage);

    this.session = new Storage(window.sessionStorage);
    
});
