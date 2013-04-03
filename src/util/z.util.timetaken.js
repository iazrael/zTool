
;Z.$package('Z.util', function(z){
    
    var pointList = {};
    var console = window.console;

    /**
     * 设置timeTaken使用的日志类, 默认使用的是浏览器的console, 
     * 传入的 console 只需实现一个log方法即可
     * @param {Object} console 日志类
     */
    this.setTimeTakenLog = function(logObj){
        console = logObj;
    }

    /**
     * 打点工具函数, 用于在多处打点, 计算执行时间
     * @param  {String} id  这个点的 id ,若已有相同的, 则输出从第一个点到这个点的时间差
     * @param  {String} msg  要输出的消息, 可选, 不填则输出id
     * @param  {Boolean} keep 是否保留这个第一个点, 可选, 用于打一个点, 多个地方统计使用
     * @return {Number}      第一个点不返回任何内容, 第二个点以后的返回距离第一个点的时间差
     * @example
     * z.util.timeTaken('systemstart', '系统加载');
     * funcA();
     * funcB();
     * z.util.timeTaken('systemstart', '系统加载');
     * z.util.timeTaken('systemstart', '绘制UI');
     * z.util.timeTaken('systemstart', '绘制桌面');
     * funcDesk();
     * z.util.timeTaken('systemstart', '绘制桌面');
     * z.util.timeTaken('systemstart', '绘制UI', true);
     * z.util.timeTaken('systemstart', '绘制主体面板');
     * funcMain();
     * z.util.timeTaken('systemstart', '绘制主体面板');
     * z.util.timeTaken('systemstart', '绘制UI');
     * // 输出: 
     * //系统加载【start】
     * //系统加载【end】time taken: 1605
     * //绘制UI【start】
     * //绘制桌面【start】
     * //绘制桌面【end】time taken: 775
     * //绘制UI【progressing】time taken: 776
     * //绘制主体面板【start】
     * //绘制主体面板【end】time taken: 812
     * //绘制UI【end】time taken: 1588
     * //
     */
    this.timeTaken = function(id, msg, keep){
        var time = Date.now();
        msg || (msg = id);
        if(!pointList[id]){
            pointList[id] = time;
            msg += '【start】';
            console.log(msg);
        }else{
            time = time - pointList[id];
            if(keep){
                msg += '【progressing】';
            }else{
                msg += '【end】';
                delete pointList[id];
            }
            msg += 'time taken: ' + time + 'ms';
            console.log(msg);
            return time;
        }
    }
    
});
