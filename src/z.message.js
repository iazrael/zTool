/**
 * @namespace Z.message
 * zTool 使用全局的消息通知机制, 需要监听消息的模块调用addListener注册一个回调函数,
 * 当有指定消息到达时触发
 */
;Z.$package('Z.message', function(z) {
    var IE_CUSTOM_EVENT = 'onpropertychange';
    var IE_EVENT_ELEMENT_STYLE = 'position: absolute; top: -9999em; left: -9999em; width: 0px; height: 0px;';

    var eventElement;

    var increaseId = 0;

    var getEventElement = function() {
        if (!eventElement) {
            eventElement = document.createElement('div');
            if (!document.createEvent) {
                eventElement.style.cssText = IE_EVENT_ELEMENT_STYLE;
                document.body.appendChild(eventElement);
            }
        }
        return eventElement;
    }

    var getListenerId = function(){
        return +new Date + '' + increaseId++ ;
    }

    /**
     * 添加事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type 消息类型
     * @param {Function} func 监听函数
     * @param {Object} context func的执行上下文， 默认为 window
     * func 的调用参数为 ({String}: type, {Object}: message)
     * @example
     * addListener(obj, 'evt', func);
     * addListener(obj, 'evt', func, ctx);
     * addListener('evt', func);
     * addListener('evt', func, ctx);
     */
    var addListener = function(model, type, func, context) {
        var listener;
        var wrapFunc;
        var element;
        var listeners;
        var listenerId;
        if(arguments.length < 2){
            throw new Error('addListener arguments not enough');
        }else if(z.isString(model)){
            context = func;
            func = type;
            type = model;
            model = window;
        }
        if(!context){
            context = window;
        }
        if (!model.__listeners) {
            model.__listeners = {};
            model.__listenerId = getListenerId();
        }
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners[type]) {
            listeners[type] = [];
        } else {
            for (var i in listeners[type]) {
                listener = listeners[type][i];
                if (listener.func === func) {
                    return false;
                }
            }
        }
        element = getEventElement();
        if (element.addEventListener) {
            wrapFunc = function(e) {
                func.apply(context, e.params);
                context = null;
            }
            element.addEventListener(listenerId + '-' + type, wrapFunc, false);
        } else {
            wrapFunc = function(e) {
                e = window.event;
                //TODO ie8及以下的浏览器后绑定的方法先执行, 导致触发的事件执行顺序倒过来了
                //没精力去自己实现顺序执行, 先这样吧
                var lid = e.params.pop();
                if (type === e.params[1] && lid === listenerId) {
                    func.apply(context, e.params);
                    context = null;
                }
            }
            element.attachEvent(IE_CUSTOM_EVENT, wrapFunc);
        }
        listener = {
            func: func,
            wrapFunc: wrapFunc
        };
        listeners[type].push(listener);
        return true;
    }
    /**
     * 移除事件监听
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type
     * @param {Function} func 监听函数
     */
    var removeListener = function(model, type, func) {
        var listener;
        var element;
        var listeners;
        var listenerId;
        if(arguments.length < 2){
            throw new Error('removeListener arguments not enough');
        }else if (arguments.length === 2) {
            func = type;
            type = model;
            model = window;
        }
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners || !listeners[type]) {
            return false;
        }
        element = getEventElement();
        // TODO 这个支持有存在的必要吗
        // if (!func) {
        //     for (var i in listeners[type]) {
        //         listener = listeners[type][i];
        //         if (element.removeEventListener) {
        //             element.removeEventListener(type, listener.wrapFunc, false);
        //         } else {
        //             element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
        //         }
        //     }
        //     listeners[type] = null;
        //     delete listeners[type];
        //     return true;
        // }
        for (var i in listeners[type]) {
            listener = listeners[type][i];
            if (listener.func === func) {
                listeners[type].slice(i, 1);
                if (element.removeEventListener) {
                    element.removeEventListener(listenerId + '-' + type, listener.wrapFunc, false);
                } else {
                    element.detachEvent(IE_CUSTOM_EVENT, listener.wrapFunc);
                }
                return true;
            }
        }
        return false;
    }

    /** 
     * 向消息的监听者广播一条消息
     * @param {Object} model 消息的挂载目标, 可选, 默认为 window
     * @param {String} type ,消息类型
     * @param {Object} message, 消息体, 可选
     * @example
     * var func1 = function(type, message){
            console.log('help!!!!! don\t kill me ..... call 110.');
            throw '110';
        }
        
        z.message.on('kill', func1);
        
        z.message.on('kill', function(type, message){
            console.log('ok, i m dead.');
            
        });
        
        //notify it
        z.message.notify('kill')
        //or 
        z.message.notify(window, 'kill')
     *
     */
    var notify = function(model, type, message) {
        var element;
        var event;
        var listeners;
        var listenerId;
        if (arguments.length === 1) {
            type = model;
            model = window;
        }else if (arguments.length === 2 && z.isString(model)) {
            message = type;
            type = model;
            model = window;
        }
        z.debug('notify message: ' + type);
        listeners = model.__listeners;
        listenerId = model.__listenerId;
        if (!listeners || !listeners[type]) {
            return false;
        }

        element = getEventElement();
        if (document.createEvent) {
            event = document.createEvent('Events');
            event.initEvent(listenerId + '-' + type, false, false);
            event.params = [message, type];
            element.dispatchEvent(event);
        } else {
            event = document.createEventObject(IE_CUSTOM_EVENT);
            event.params = [message, type, listenerId];
            element.fireEvent(IE_CUSTOM_EVENT, event);
        }
        return listeners[type].length !== 0;
    }

    this.addListener = addListener;
    this.on = addListener;
    this.removeListener = removeListener;
    this.off = removeListener;
    this.notify = notify;
});
