
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
            this._createDom();
            this._bindEvents();
            this._loader = new z.file.ImageLoader();
        },
        show: function(imgUrl){
            var docEl = document.documentElement;
            var docWidth = docEl.offsetWidth;
            var docHeight = docEl.offsetHeight;
            z.dom.css(this._el, {
                width: docWidth + 'px',
                height: docHeight + 'px',
                display: 'block'
            });
            this._loader.load(imgUrl, this._onImageLoad, this);
        },
        hide: function(){
            this._el.style.display = 'none';
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
        },
        _onImageLoad: function(success, imgUrl, size){
            if(success){
                if(size.width > 150){
                    z.dom.css(this._body, {
                        width: size.width + 'px',
                        'margin-left': -size.width / 2 + 'px'
                    });
                }
                if(size.height > 80){
                    z.dom.css(this._body, {
                        height: size.height + 'px',
                        'margin-top': -size.height / 2 + 'px'
                    });
                }
                this._image.src = imgUrl;
            }else{
                this._image.src = imgUrl;
            }
        }
    });
    
});