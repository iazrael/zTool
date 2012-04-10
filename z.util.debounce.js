
;Z.$package('Z.util', function(z){
    
    /**
     * debounce 返回一个方法, 在一段时间内多次调用只执行一次
     * @param  {Number} time 进行调用限制的时间范围
     * @param  {Function} func 需要包装的方法
     * @param  {Boolean} immediate 指示在第一次调用时执行, 还是间隔time毫秒之后执行
     * @return {Function}
     * 
     * @example
     * function a(){
    console.log('exec a');
}
var b = debounce(1000, a);
var c = debounce(1000, a, true);
function testCase1(){
    var i = 0; 
    var id = setInterval(function(){
        if(i++ < 30){
            console.log('call b' + i);
            b();
        }else{
            clearInterval(id)
        }
    },100);
}
function testCase2(){
    var i = 0; 
    var id = setInterval(function(){
        if(i++ < 30){
            console.log('call c' + i);
            c();
        }else{
            clearInterval(id)
        }
    },100);
}

     */
    this.debounce = function(time, func, immediate){
        var lastExecTime;
        return function(){
            if(!lastExecTime || (+new Date - lastExecTime > time)){
                immediate ? func() : setTimeout(func, time);
                lastExecTime = +new Date;
            }
        };
    }

    
});