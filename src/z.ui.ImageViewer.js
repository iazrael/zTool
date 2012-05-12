
;Z.$package('Z.ui', function(z){

    /**
     * 图片查看器 
     * @class
     * @name ImageViewer
     * 
     */
    this.ImageViewer  = z.$class({
        statics: {
            FIXED_WIDTH: 1,
            FIXED_HEIGHT: parseInt('10', 2),
            FIXED_BOTH: parseInt('11', 2),
            KEEP_BOTH: parseInt('100', 2)
        }
    }, {
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
            this._margin = option.margin || 10;
            this._mode = option.mode || this.$static.FIXED_BOTH;
            this._defaultSize = option.defaultSize || { width: 150, height: 80 };
            this._imgSize = this._defaultSize;
            this._createDom();
            this._bindEvents();
            this._loader = new z.file.ImageLoader();
            this._loading = new z.ui.Loading({
                element: this._loading
            });

        },
        show: function(imgUrl){
            this._isShow = true;
            this._resize();
            // if(this._mode === this.$static.FIXED_BOTH){
            //     this._body.style.position = 'fixed';
            // }else{
            //     this._body.style.position = 'absolute';
            // }
            this._el.style.display = 'block';
            this._body.classList.add('animation');
            this._loading.show();
            var that = this;
            z.util.delay('ImageViewerDelayLoadImage', 500, function(){
                that._loader.load(imgUrl, that._onImageLoad, that);
            });
            window.addEventListener('resize', this._onResize, false);
        },
        isShow: function(){
            return this._isShow;
        },
        hide: function(){
            this._isShow = false;
            this._el.style.display = 'none';
            this._image.src = '';
            this._loading.hide();
            this._image.style.display = 'none';
            this._imgSize = this._defaultSize;
            this._body.classList.remove('animation');
            this._close.classList.remove('animation');
            window.removeEventListener('resize', this._onResize, false);
        },
        _createDom: function(){
            this._el.innerHTML = '\
            <div class="image-viewer-body" cmd="stopPropagation">\
                <a class="image-viewer-close" href="javascript:void(0);" title="close" cmd="hide">X</a>\
                <div class="image-viewer-content">\
                    <img src="">\
                    <div class="image-viewer-loading"></div>\
                </div>\
            </div>';
            this._body = this._el.querySelector('.image-viewer-body');
            this._image = this._el.querySelector('img');
            this._loading = this._el.querySelector('.image-viewer-loading');
            this._close = this._el.querySelector('.image-viewer-close');
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
            var onScroll = function(){
                that._scroll();
            }
            // window.addEventListener('scroll', onScroll, false);
            var onTransitionEnd = function(){
                that._resizeMasker();
            }
            this._el.addEventListener('webkitTransitionEnd', onTransitionEnd, false);

        },
        _scroll: function(){
            if(!this._isShow || !this._rect){
                return;
            }
            var docEl = this._el.parentNode;
            var docWidth = Math.max(docEl.offsetWidth, window.innerWidth, docEl.scrollWidth);
            var docHeight = Math.max(docEl.offsetHeight, window.innerHeight, docEl.scrollHeight);
            var scrollTop = docEl.scrollTop, scrollLeft = docEl.scrollLeft;
            var left = this._rect.left + scrollLeft;
            var top = this._rect.top +  scrollTop;
            if(top + this._rect.height > docHeight){
                top = docHeight - this._rect.height;
            }
            if(top < this._margin){
                top = this._margin;
            }
            if(left + this._rect.width > docWidth){
                left = docWidth - this._rect.width;
            }
            if(left < this._margin){
                left = this._margin;
            }
            z.dom.css(this._body, {
                left: left + 'px',
                top: top + 'px'
            });
        },
        _resize: function(){
            // this._resizeMasker();
            this._resizeBody();
        },
        _resizeMasker: function(){
            var docEl = this._el.parentNode;
            var docWidth = Math.max(docEl.offsetWidth, window.innerWidth, docEl.scrollWidth);
            var docHeight = Math.max(docEl.offsetHeight, window.innerHeight, docEl.scrollHeight);
            z.dom.css(this._el, {
                width: docWidth + 'px',
                height: docHeight + 'px'
            });
        },
        _resizeBody: function(){
            var viewHeight = window.innerHeight, viewWidth = window.innerWidth;
            var docEl = this._el.parentNode;
            var scrollTop = docEl.scrollTop, scrollLeft = docEl.scrollLeft;
            var width = this._imgSize.width;
            var height = this._imgSize.height;
            var scale = height / width;
            var newWidth = width, newHeight = height;
            if(this._mode & this.$static.FIXED_BOTH){
                if((this._mode & this.$static.FIXED_WIDTH) && width + 2 * this._margin >= viewWidth){
                    newWidth = viewWidth - 2 * this._margin;
                }
                if((this._mode & this.$static.FIXED_HEIGHT) && height + 2 * this._margin >= viewHeight){
                    newHeight = viewHeight - 2 * this._margin;
                }

                height = height / width * newWidth;
                if(height > newHeight){
                    height = newHeight;
                    width = height / scale;
                }else{
                    width = newWidth;
                }
            }
            var left = (viewWidth > width + 2 * this._margin) ? (viewWidth - width) / 2 : this._margin;
            var top = (viewHeight > height + 2 * this._margin) ? (viewHeight - height) / 2 : this._margin;
            this._rect = {
                width: width,
                height: height,
                left: left,
                top: top
            };
            // left += scrollLeft;
            // top += scrollTop;
            z.dom.css(this._body, {
                width: width + 'px',
                // left: left + 'px',
                height: height + 'px'
                // top: top + 'px'
            });
            this._scroll();
            //在重新设置一下遮罩的大小
            this._resizeMasker();
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
                this._loading.hide();
                this._image.style.display = 'block';
                this._image.classList.add('animation');
                this._resizeBody();
                this._close.classList.add('animation');
            }else{
                this._image.src = imgUrl;
                this._image.style.display = 'block';
            }
        }
    });
    
});