
;Z.$package('Z.util', ['Z.message', 'Z.string', 'Z.util'], function(z){
    
    /**
     * Http请求的缓存封装
     */
    this.HttpRequest = new z.$class({
        init: function(option){
            this._require = option.require;//must fill
            
            this._requestCollection = new z.util.Collection({
                keyName: 'id'
            });
        },
        /**
         * 
         * @param {Object} param 底层 require 方法需要的参数
         * @param {Object} option httpRequest 需要的配置参数
         * { 
         *  cacheTime: 0 @default
         *  }
         */
        require: function(url, param, option){
            var argus = z.string.toQueryString(param.data);
            var key;
            if(url.indexOf('?') == -1){
                key = url + '?' + argus;
            }else{
                key = url + '&' + argus;
            }
            option = option || {};
            var onSuccessOld = param.onSuccess;
            var onErrorOld = param.onError;
            var onTimeoutOld = param.onTimeout;
            var oldRequest = this._requestCollection.get(key);
            if(oldRequest){
                if(oldRequest.status === 'loading'){
                    return false;//-----------------return
                }
                if(option.cacheTime && (oldRequest.responseTime - oldRequest.requireTime) < option.cacheTime){
                    //有cacheTime 且未过期的时候直接使用cache
                    var context = param.context || window;
                    if(onSuccessOld){
                        onSuccessOld.call(context, oldRequest.response);
                    }
                    return true;//-----------------return
                }else{//否则删除cache , 重新请求
                    this._requestCollection.remove(key);
                }
            }
            
            var requestItem = {
                id: key,
                param: param,
                requireTime: +new Date,
                status: 'loading'
            };
            this._requestCollection.add(requestItem);
            param.onSuccess = function(data){
                if(option.cacheTime){
                    requestItem.responseTime = +new Date;
                    requestItem.status = 'loaded';
                    requestItem.response = data;
                }else{
                    this._requestCollection.remove(key);
                }
                var context = param.context || window;
                if(onSuccessOld){
                    onSuccessOld.call(context, data);
                }
            };
            param.onError = function(data){
                this._requestCollection.remove(key);
                var context = param.context || window;
                if(onErrorOld){
                    onErrorOld.call(context, data);
                }
            };
            param.onTimeout = function(data){
                this._requestCollection.remove(key);
                var context = param.context || window;
                if(onTimeoutOld){
                    onTimeoutOld.call(context, data);
                }
            };

            this._require(url, param);
        }
    });
    
});
