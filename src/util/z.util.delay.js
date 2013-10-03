/**
 * setTimout 的封装, 用于处理输入检测等触发过快的事件/方法
 */
;zTool.$package('zTool.util', function(z){
    
    var DELAY_STATUS = {
        NORMAL: 0,
        ID_EXIST: 1,
        ID_NOT_EXIST: 2
    };

    var timerList = {};
    /**
     * @param {String} id @optional
     * @param {Number} time @optional
     * @param {Function} func
     * @param {Object} funcContext @optional func的执行上下文, 默认 window
     * @example
     * 1. delay('id01', 1000, func)
     * 2. delay(1000, func)
     * 3. delay(func) === delay(0, func)
     * 4. delay('id02', 1000, func, context)
     * TODO 5. delay({
     *     id: 'id03',
     *     time: 1000,
     *     func: func,
     *     context: this,
     *     onClear: func
     * })
     */
    this.delay = function(id, time, func, funcContext){
        var argu = arguments;
        var flag = DELAY_STATUS.NORMAL;
        if(argu.length === 1){
            func = id;
            time = 0;
            id = null;
        }else if(argu.length === 2){
            func = time;
            time = id;
            id = null;
        }
        time = time || 0;
        if(id && time){
            if(id in timerList){
                window.clearTimeout(timerList[id]);
                flag = DELAY_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                timerList[id] = 0;
                delete timerList[id];
                func.apply(funcContext || window, [id]);
            };
            var timer = window.setTimeout(wrapFunc, time);
            timerList[id] = timer;
        }else{
            if(funcContext){
                var wrapFunc = function(){
                    func.apply(funcContext || window);
                };
                window.setTimeout(wrapFunc, time);
            }else{
                window.setTimeout(func, time);
            }
        }
        return flag;
    }
    
    this.clearDelay = function(id){
        if(id in timerList){
            window.clearTimeout(timerList[id]);
            timerList[id] = 0;
            delete timerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
    
});