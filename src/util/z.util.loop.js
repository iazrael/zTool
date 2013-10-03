/**
 * setTimout 的封装, 用于处理输入检测等触发过快的事件/方法
 */
;zTool.$package('zTool.util', function(z){
    
    var LOOP_STATUS = {
        NORMAL: 0,
        ID_EXIST: 1,
        ID_NOT_EXIST: 2
    };

    var intervalerList = {};
    
    /**
     * 定时循环执行传入的func
     */
    this.loop = function(id, time, func, funcContext){
        var argu = arguments;
        var flag = LOOP_STATUS.NORMAL;
        if(argu.length == 2){
            func = time;
            time = id;
        }
        time = time || 0;
        if(id && time){
            if(id in intervalerList){
                window.clearInterval(intervalerList[id]);
                flag = LOOP_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                func.apply(funcContext || window, [id]);
            };
            var intervaler = window.setInterval(wrapFunc, time);
            intervalerList[id] = intervaler;
        }else{
            setInterval(func, time);
        }
        return flag;
    }
    
    this.clearLoop = function(id){
        if(id in intervalerList){
            window.clearInterval(intervalerList[id]);
            intervalerList[id] = 0;
            delete intervalerList[id];
            return LOOP_STATUS.NORMAL;
        }
        return LOOP_STATUS.ID_NOT_EXIST;
    }
    
});