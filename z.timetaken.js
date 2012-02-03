
;Z.$package('Z', function(z){
    
    var timeTaken = function(func){
        var name = '>>>', beforeCb, afterCb;
        if(arguments.length === 2){
            if(typeof(arguments[1]) === 'function'){
                afterCb = arguments[1];
            }else{
                name = '\"' + arguments[1] + '\"';
            }
        }else if(arguments.length === 3){
            beforeCb = arguments[1];
            afterCb = arguments[2];
        }
        z.debug(name + ' time test start.');
        beforeCb && beforeCb();
        var start = +new Date;
        func();
        var taken = +new Date - start;
        afterCb && afterCb(taken);
        z.debug(name + ' time test end. time taken: ' + taken);
    }
    
    this.timeTaken = timeTaken;
});
