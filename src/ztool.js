;(function(name, definition){
    this[name] = definition();
    if (typeof module !== 'undefined'){
        module.exports = exports = this[name];
    }
})('zTool', function(){

    var globalContext = this;

    var context = {
        varsion: '1.0',
        author: 'azrael'
    };


    /**
     * @param {String} packageName
     */
    var buildPackage = function(packageName){
        var pack =  globalContext;
        var nameList = packageName.split('.');
        for(var i in nameList){
            if(!(nameList[i] in pack)){
                pack[nameList[i]] = {};
            }
            pack = pack[nameList[i]];
        }
        return pack;
    };

    /**
     * 简单的包管理
     * @param  {String} packageName 
     * @param  {Function} initFunc    
     */
    context.$package = function(packageName, initFunc){
        var pack = packageName ? buildPackage(packageName) : globalContext;
        initFunc.call(pack, context);
    };

    return context;
});