
;Z.$package('Z.util', ['Z.message', 'Z.array'], function(z){
    
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
            this._modifyTime = 0;

            var self = this;
            function onModify(){
                self.setModify();
            }

            z.message.on(this, 'add', onModify);
            z.message.on(this, 'remove', onModify);
            z.message.on(this, 'clear', onModify);
            z.message.on(this, 'update', onModify);
        },
        /**
         * 设置一个修改状态位, 每当 collection有了变更, 这个 modifyTime 就会变
         * 通过对比 modifyTime 的值就能判断出这个 collection 是否被修改了
         */
        setModify: function(){
            this._modifyTime = +new Date();
        },
        getModify: function(){
            return this._modifyTime;
        },
        /**
         * @deprecated 已废弃, 用 get 代替
         */
        getByKey: function(key){
            return this.get(key);
        },
        /**
         * @deprecated 已废弃, 用 index 代替
         */
        getByIndex: function(index){
            return this.index(index);
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
         * 返回指定 key 的元素
         * @param  {Number},{String} key 
         * @return {Object}
         */
        get: function(key){
            return this._map[key];
        },
        /**
         * 返回指定下标的元素
         * @param  {Number} index 
         * @return {Object}
         */
        index: function(index){
            return this._arr[index];
        },
        getRange: function(start, count){
            var end = start + count;
            return this._arr.slice(start, end);
        },
        filter: function(key, value){
            return z.array.filter(this._arr, key, value);
        },
        add: function(item, index, noEvent){
            var existItem = this._map[item[this._keyName]];
            if(existItem){
                return false;
            }
            this._map[item[this._keyName]] = item;
            if(z.isUndefined(index)){
                index = this._arr.length;
                this._arr.push(item);
            }else{
                this._arr.splice(index, 0, item);
            }

            if(!noEvent){
                z.message.notify(this, 'add', {
                    items: [item],
                    index: index
                });
            }
            return item;
        },
        /**
         * 批量添加, 如果有 key 一样的将会排除掉
         */
        addRange: function(items, index, noEvent){
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
            if(z.isUndefined(index)){
                index = this._arr.length;
                this._arr = this._arr.concat(newItems);
            }else{
                var param = [index, 0].concat(newItems);
                Array.prototype.splice.apply(this._arr, param);
            }
            if(!noEvent){
                z.message.notify(this, 'add', {
                    items: newItems,
                    index: index
                });
            }
            return newItems;
        },
        removeByKey: function(key, noEvent){
            var item = this._map[key];
            if(item){
                var index = this.getIndexByKey(key);
                this._arr.splice(index, 1);
                delete this._map[key];
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: [item],
                        index: index,
                        key: key
                    });
                }
                return item;
            }
            return false;
        },
        removeByIndex: function(index, noEvent){
            var item = this._arr[index];
            if(item){
                this._arr.splice(index, 1);
                delete this._map[item[this._keyName]];
                if(!noEvent){
                    z.message.notify(this, 'remove', {
                        items: [item],
                        index: index,
                        key: item[this._keyName]
                    });
                }
                return item;
            }
            return false;
        },
        /**
         * 删除指定key的元素, removeByKey 的简写
         */
        remove: function(key){
            return this.removeByKey(key);
        },
        removeRange: function(items, noEvent){
            var removedItems = [], item, keyName = this._keyName;
            for(var i in items){
                item = items[i];
                if(this.removeByKey(item[keyName], true)){
                    removedItems.push(item);
                }
            }
            if(!removedItems.length){
                return false;
            }
            if(!noEvent){
                z.message.notify(this, 'remove', {
                    items: removedItems
                });
            }
            return removedItems;
        },
        update: function(item, noEvent){
            var exists = this.get(item.id);
            if(exists){
                z.merge(exists, item);
                if(!noEvent){
                    z.message.notify(this, 'update', {
                        items: [exists]
                    });
                }
                return exists;
            }
            return false;
        },
        updateRange: function(items){
            var updatedItems = [], newItem;
            for(var i in items){
                newItem = this.update(items[i], true);
                if(newItem){
                    updatedItems.push(newItem);
                }
            }
            if(updatedItems.length){
                z.message.notify(this, 'update', {
                    items: [updatedItems]
                });
            }
            return false;
        },
        length: function(){
            return this._arr.length;
        },
        clear: function(noEvent){
            var items = this._arr;
            this._arr = [];
            this._map = {};
            if(!noEvent){
                z.message.notify(this, 'clear', {
                    items: items
                });
            }
        },
        getFirst: function() {
            return this.index(0);
        },
        getLast: function() {
            return this.index(this.length() - 1);
        },
        getAll: function(){
            return this.getRange(0, this.length());
        },
        /**
         * 按数组下标顺序遍历 Collection 的所有元素
         * @param  {Function} callback callback(item, index)
         * 
         */
        each: function(callback){
            for(var i = 0, item; item = this._arr[i]; i ++){
                callback(item, i);
            }
        },
        /**
         * 判断指定 key 的元素是否存在
         * @param  {Number},{String} key 
         * @return {Boolean}
         */
        exist: function(key){
            return !!this.get(key);
        }
    });
    
});
