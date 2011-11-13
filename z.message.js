/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z){
    
    var listenerList = {};
    
    var executeElement;
    
    var getExecuteElement = function(){
        if(!executeElement){
            executeElement = document.createElement('div');
            if(!document.createEvent){
                executeElement.style.cssText = 'position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;';
                document.body.appendChild(executeElement);
            }
        }
        return executeElement;
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
        element = getExecuteElement();
        if(element.addEventListener){
            wrapFunc = function(e){
                func.apply(window, e.params);
            }
            element.addEventListener(type, wrapFunc, false);
        }else{
            wrapFunc = function(e){
                e = window.event;
                //TODO onpropertychange 触发的事件执行顺序倒过来了
                if(type === e.propertyName){
                    func.apply(window, e.params);
                }
            }
            element.attachEvent('onpropertychange', wrapFunc);
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
        element = getExecuteElement();
        if(!func){
            for(var i in listenerList[type]){
                listener = listenerList[type][i];
                if(element.removeEventListener){
                    element.removeEventListener(type, listener.wrapFunc, false);
                }else{
                    //TODO
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
                    //TODO
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
        if(!listenerList[type]){
            return false;
        }
        element = getExecuteElement();
        if(document.createEvent){
            event = document.createEvent('Events');
            event.initEvent(type, false, false);
            event.params = [type, message];
            element.dispatchEvent(event);
        }else{
            event = document.createEventObject('onpropertychange');
            event.propertyName = type;
            event.params = [type, message];
            element.fireEvent('onpropertychange', event);
        }
        return listenerList[type].length !== 0;
    }
    
    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});