;Z.$package('Z.test.message', ['Z.message'], function(z){
    
    z.message.on('live', function(type, message){
        console.log('live????');
        
    });
    
    z.message.on('kill', function(type, message){
        console.log('a guy want to kill me!!!!!');
        
    });
    
    var func1 = function(type, message){
        console.log('help!!!!! don\t kill me ..... call 110.');
        throw '110';
    }
    
    z.message.on('kill', func1);
    
    z.message.on('kill', function(type, message){
        console.log('ok, i m dead.');
        
    });
    
//    创建一万个测试性能
//    var i = 0;
//    while(i++ < 1000){
//        z.message.on('kill', function(type, message){
//        });
//    }
    
    document.getElementById('kill').onclick = function(){
        var start = +new Date;
//        console.log(z.message.notify('kill'));
//        console.log('time: ' + (+new Date - start));
        
        z.timeTaken(function(){
            console.log(z.message.notify('kill'));
        }, 'kill');
        
//        z.timeTaken(function(){
//            console.log(z.message.notify('kill'));
//        },function(){
//            console.error('start');
//        }, function(time){
//            console.error(time);
//        });
        
//        z.message.off('kill', func1);
//        console.log('--------------------');
//        console.log(z.message.notify('kill'));
//        
//        console.log('--------------------');
//        z.message.off('kill');
//        console.log(z.message.notify('kill'));
        
    }
});
