
;Z.$package('Z.util', ['Z.message'], function(z){
    
    /**
     * 通用 collection 类
     */
    this.Collection = new z.$class({
        name: 'Collection'
    }, {
        init: function(option){
            option = option || {};
            this._keyName = option.keyName || 'id';
            this._arr = [];
            this._map = {};
        },
        getByKey: function(key){
            return this._map[key];
        },
        getByIndex: function(index){
            return this._arr[index];
        },
        getIndexByKey: function(key, keyName){
            keyName = keyName || this._keyName;
            var item = this._map[key];
            if(item){
                for(var i in this._arr){
                    if(this._arr[i][keyName] == key){
                        return i;
                    }
                }
            }
            return null;
        },
        getKeyByIndex: function(index, keyName){
            keyName = keyName || this._keyName;
            var item = this.getByIndex(index);
            if(item){
                return item[keyName];
            }
            return null;
        },
        /**
         * 根据key的类型自动判断使用
         * string getByKey
         * number getByIndex
         */
        get: function(key){
            if(z.isString(key)){
                return this.getByKey(key);
            }else{
                return this.getByIndex(key);
            }
        },
        getRange: function(start, count){
            var end = start + count;
            return this._arr.slice(start, end);
        },
        filter: function(key, value){
            var result = [];
            for(var i in this._arr){
                if(this._arr[i][key] == value){
                    result.push(this._arr[i]);
                }
            }
            return result;
        },
        add: function(item, index){
            var existItem = this._map[item[this._keyName]];
            if(existItem){
                return false;
            }
            this._map[item[this._keyName]] = item;
            if(typeof(index) == 'undefined'){
                this._arr.push(item);
            }else{
                this._arr.splice(index, 0, item);
            }
            z.message.notify(this, 'add', {
                item: item,
                index: index
            });
            return true;
        },
        /**
         * 批量添加, 如果有 key 一样的会排出掉
         */
        addRange: function(items, index){
            var newItems = [], item, keyName = this._keyName;
            for(var i in items){
                item = items[i];
                if(!this._map[item[keyName]]){
                    newItems.push(item);
                    this._map[item[keyName]] = item;
                }
            }
            if(!newItems.length){
                return false;
            }
            if(typeof(index) == 'undefined'){
                this._arr = this._arr.concat(newItems);
            }else{
                var param = [index, 0].concat(newItems);
                Array.prototype.splice.apply(this._arr, param);
            }
            z.message.notify(this, 'addRange', {
                items: newItems,
                index: index
            });
            return true;
        },
        removeByKey: function(key, noEvent){
            var item = this._map[key];
            if(item){
                var index = this.getIndexByKey(key);
                this._arr.splice(index, 1);
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: item,
                        index: index,
                        key: key
                    });
                }
                return true;
            }
            return false;
        },
        removeByIndex: function(index, noEvent){
            var item = this._arr[index];
            if(item){
                this._arr.splice(index, 1);
                this._map[item[this._keyName]] = null;
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: item,
                        index: index,
                        key: item[this._keyName]
                    });
                }
                return true;
            }
            return false;
        },
        /**
         * 根据key的类型自动判断使用
         * string removeByKey
         * number removeByIndex
         */
        remove: function(key){
            if(J.isString(key)){
                return this.removeByKey(key);
            }else{
                return this.removeByIndex(key);
            }
        },
        removeRange: function(items){
            var removedItems = [], item, keyName = this._keyName;
            for(var i in items){
                item = items[i];
                if(this.removeByKey(item[keyName])){
                    removedItems.push(item);
                }
            }
            if(!removedItems.length){
                return false;
            }
            z.message.notify(this, 'removeRange', {
                items: removedItems
            });
            return true;
        },
        length: function(){
            return this._arr.length;
        },
        clear: function(){
            var items = this._arr;
            this._arr = [];
            this._map = {};
            z.message.notify(this, 'clear', {
                items: items
            });
        },
        getFirst: function() {
            return this.get(0);
        },
        getLast: function() {
            return this.get(this.length() - 1);
        }
    });
    
});
