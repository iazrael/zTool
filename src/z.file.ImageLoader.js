
;zTool.$package('zTool.file', function(z){

    var IMAGE_NOT_LOAD = 0;
    var IMAGE_LOADING = 1;
    var IMAGE_LOADED = 2;
    var IMAGE_LOAD_ERROR = 3;

    function onImageLoad(e, loader){
        var imgObj = loader._imageList[this.src];
        imgObj.status = IMAGE_LOADED;
        imgObj.size = {
            width: this.width,
            height: this.height
        };
        for(var i = 0, cbObj; cbObj = imgObj.cbs[i]; i++){
            cbObj.cb.call(cbObj.cxt || window, true, imgObj.url, imgObj.size);
        }
        imgObj.cbs = [];
    }

    function onImageError(e, loader){
        var imgObj = loader._imageList[this.src];
        imgObj.status = IMAGE_LOAD_ERROR;
        for(var i = 0, cbObj; cbObj = imgObj.cbs[i]; i++){
            cbObj.cb.call(cbObj.cxt || window, false, imgObj.url);
        }
        imgObj.cbs = [];
    }

    /**
     * 图片的加载类, 这是一个内部类, 对外使用 z.file.loadImage 加载图片
     * @class
     * @name ImageLoader
     */
    this.ImageLoader = z.$class({
        init: function(option){
            this._imageList = {};
        },
        /**
         * 加载图片
         * @param  {String}   imgUrl   图片url
         * @param  {Function} callback 回调函数, 回调参数格式为 callback(success, imageUrl, imageSize)
         * @param  {Object}   context  回调函数的上下文, 可选 
         * @example
         * loader.load('http://xxxx', function(success, imgUrl, size){
         *     if(success){
         *         console.log('img size is: w= ' + size.width + ', h= ' + size.height);
         *     }else{
         *         console.log('load img failure');
         *     }
         * }, this);
         * 
         */
        load: function(imgUrl, callback, context){
            var imgObj = this._imageList[imgUrl];
            if(!imgObj){
                imgObj = {
                    url: imgUrl,
                    status: IMAGE_NOT_LOAD,
                    cbs: []
                };
                this._imageList[imgUrl] = imgObj;
            }
            //已经加载过或正在加载
            if(imgObj.status === IMAGE_LOADED){
                callback.call(context || window, true, imgUrl, imgObj.size);
            }else if(imgObj.status === IMAGE_LOADING){
                imgObj.cbs.push({ cb: callback, cxt: context });
            }else{
                imgObj.cbs.push({ cb: callback, cxt: context });
                imgObj.status = IMAGE_LOADING;
                
                var image = new Image();
                var that = this;
                image.onload = function(e){
                    onImageLoad.call(this, e, that);
                };
                var onErrorFunc = function(e){
                    onImageError.call(this, e, that);
                };
                image.onerror = onErrorFunc
                image.onabort = onErrorFunc;
                image.src = imgUrl;
            }
        }
    });
    
});