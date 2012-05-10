
;Z.$package('Z.ui', function(z){

    /**
     * 图片查看器 
     * @class
     * @name ImageViewer
     * 
     */
    this.ImageViewer  = z.$class({
        init: function(option){
            option = option || {};
            var el;
            if(option.element){
                el = this._el = option.element;
            }else{
                el = this._el = document.createElement('div');
                el.setAttribute('class', 'image-viewer');
                (option.parent || document.body).appendChild(el);
            }
            el.setAttribute('cmd', 'hide');
            el.style.display = 'none';
            this._margin = 10;
            this._defaultSize = { width: 150, height: 80 };
            this._createDom();
            this._bindEvents();
            this._loader = new z.file.ImageLoader();
        },
        show: function(imgUrl){
            this._isShow = true;
            this._resize();
            this._el.style.display = 'block';
            this._body.classList.add('animation');
            var that = this;
            z.util.delay('ImageViewerDelayLoadImage', 500, function(){
                that._loader.load(imgUrl, that._onImageLoad, that);
            });
            window.addEventListener('resize', this._onResize, false);
        },
        hide: function(){
            this._isShow = false;
            this._el.style.display = 'none';
            this._image.src = 'about:blank';
            this._image.style.display = 'none';
            this._imgSize = this._defaultSize;
            this._body.classList.remove('animation');
            window.removeEventListener('resize', this._onResize, false);
        },
        _createDom: function(){
            this._el.innerHTML = '\
            <div class="image-viewer-body" cmd="stopPropagation">\
                <a class="image-viewer-close" href="javascript:void(0);" title="close" cmd="hide">X</a>\
                <div class="image-viewer-content">\
                    <img src="about:blank">\
                </div>\
            </div>';
            this._body = this._el.querySelector('.image-viewer-body');
            this._image = this._el.querySelector('img');
        },
        _bindEvents: function(){
            var that = this;
            z.dom.bindCommends(this._el, 'click', {
                'hide': function(param, target, event){
                    that.hide();
                },
                'stopPropagation': function(param, target, event){
                    event.stopPropagation();
                }
            });
            this._onResize = z.util.debounce(200, function(){
                that._resize();
            });
        },
        _resize: function(){
            var docEl = document.documentElement;
            var docWidth = Math.max(docEl.offsetWidth, window.innerWidth);
            var docHeight = Math.max(docEl.offsetHeight, window.innerHeight);
            z.dom.css(this._el, {
                width: docWidth + 'px',
                height: docHeight + 'px'
            });
            if(this._imgLoad){
                this._resizeBody();
            }
        },
        _resizeBody: function(){
            var viewHeight = window.innerHeight, viewWidth = window.innerWidth;
            var width = this._imgSize.width;
            var height = this._imgSize.height;
            var scale = height / width;
            var newWidth = width, newHeight = height;
            if(width + 2 * this._margin >= viewWidth){
                newWidth = viewWidth - 2 * this._margin;
            }
            if(height + 2 * this._margin >= viewHeight){
                newHeight = viewHeight - 2 * this._margin;
            }
            height = scale * newWidth;
            if(height > newHeight){
                height = newHeight;
                width = height / scale;
            }else{
                width = newWidth;
            }
            z.dom.css(this._body, {
                width: width + 'px',
                'margin-left': -width / 2 + 'px',
                height: height + 'px',
                'margin-top': -height / 2 + 'px'
            });
        },
        _onImageLoad: function(success, imgUrl, size){
            if(!this._isShow){
                return;
            }
            if(success){
                if(size.width < this._defaultSize.width){
                    size.width = this._defaultSize.width;
                }
                if(size.height < this._defaultSize.height){
                    size.height = this._defaultSize.height;
                }
                this._imgSize = size;
                this._image.src = imgUrl;
                this._image.style.display = 'block';
                this._imgLoad = true;
                this._resizeBody();
            }else{
                this._image.src = imgUrl;
                this._image.style.display = 'block';
            }
        }
    });
    
});