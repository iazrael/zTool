/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z){
    var IE_CUSTOM_EVENT = 'onpropertychange';
    var IE_EVENT_ELEMENT_STYLE = 'position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;';
    
    var listenerList = {};
    var eventElement;
    
    var emptyFunction = function(){};
    
    var isDebuging = 1;
    var debug = isDebuging ? (window.console ? function(data){
        console.debug ? console.debug(data) : console.log(data);
    } : emptyFunction) : emptyFunction;
    
    var getEventElement = function(){
        if(!eventElement){
            eventElement = document.createElement('div');
            if(!document.createEvent){
                eventElement.style.cssText = IE_EVENT_ELEMENT_STYLE;
                document.body.appendChild(eventElement);
            }
        }
        return eventElement;
    }
    
    /**
     * 添加事件监听
     * @param {String} type 消息类型
     * @param {Function} func 监听函数
     * func 的调用参数为 ({String}: type, {Object}: message)
     */
    var addListener = function(type, func){
        var listener;
        var wrapFunc;
        var element;
        if(!listenerList[type]){
            listenerList[type] = [];
        }else{
            for(var i in listenerList[type]){
                listener = listenerList[type][i];
                if(listener.func === func){
                    return false;
                }
            }
        }
        element = getEventElement();
        if(element.addEventListener){
            wrapFunc = function(e){
                func.apply(window, e.params);
            }
            element.addEventListener(type, wrapFunc, false);
        }else{
            wrapFunc = function(e){
                e = window.event;
                //TODO ie8及以下的浏览器后绑定的方法先执行, 导致触发的事件执行顺序倒过来了
                //没精力去自己实现顺序执行, 先这样吧
                if(type === e.params[0]){
                    func.apply(window, e.params);
                }
            }
            element.attachEvent(IE_CUSTOM_EVENT, wrapFunc);
        }
        listener = {
            func: func,
            wrapFunc: wrapFunc
        };
        listenerList[type].push(listener);
        return true;
    }
    /**
     * 移除事件监听
     * @param {String} type
     * @param {Function} func 监听函数, 如果不指定, 则移除所有这个类型的监听函数
     */
    var removeListener = function(type, func){
        var listener;
        var element;
        if(!listenerList[type]){
            return false;
        }
        element = getEventElement();
        if(!func){
            for(var i in listenerList[type]){
                listener = listenerList[type][i];
                if(element.removeEventListener){
                    element.removeEventListener(type, listener.wrapFunc, false);
                }else{
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
            }
            listenerList[type] = null;
            delete listenerList[type];
            return true;
        }
        for(var i in listenerList[type]){
            listener = listenerList[type][i];
            if(listener.func === func){
                listenerList[type].slice(i, 1);
                if(element.removeEventListener){
                    element.removeEventListener(type, listener.wrapFunc, false);
                }else{
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
                return true;
            }
        }
        return false;
    }
    
    /**
     * 向消息的监听者广播一条消息
     * @param {String} type ,消息类型
     * @param {Object} message, 消息体
     */
    var notify = function(type, message){
        var element;
        var event;
        debug('notify message: ' + type);
        if(!listenerList[type]){
            return false;
        }
        element = getEventElement();
        if(document.createEvent){
            event = document.createEvent('Events');
            event.initEvent(type, false, false);
            event.params = [type, message];
            element.dispatchEvent(event);
        }else{
            event = document.createEventObject(IE_CUSTOM_EVENT);
            event.params = [type, message];
            element.fireEvent(IE_CUSTOM_EVENT, event);
        }
        return listenerList[type].length !== 0;
    }
    
    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});