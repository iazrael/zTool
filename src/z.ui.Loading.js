
;Z.$package('Z.ui', function(z){

    /**
     * 菊花滚动图 
     * @class
     * @name Loading
     * 
     */
    this.Loading  = z.$class({
        init: function(option){
            option = option || {};
            var el;
            if(option.element){
                el = this._el = option.element;
            }else{
                el = this._el = document.createElement('div');
                (option.parent || document.body).appendChild(el);
            }
            el.style.display = 'none';
            var cls = option.className || '';
            el.setAttribute('class', 'loading ' + cls);
            var size = option.size || 50;
            var duration = option.duration || 1000;
            this.setSize(size);
            this._points = 12;
            this._createDom();
            this._body = this._el.querySelector('div');
            this.setDuration(duration);

        },
        show: function(imgUrl){
            this._isShow = true;
            this._el.style.display = 'block';
            this._el.classList.add('animation');
        },
        hide: function(){
            this._el.style.display = 'none';
            this._el.classList.remove('animation');
        },
        setSize: function(size){
            z.dom.css(this._el, {
                'margin-top': -size/2 + 'px',
                'margin-left': -size/2 + 'px',
                width: size + 'px',
                height: size + 'px'
            });
        },
        setDuration: function(duration){
            z.dom.css(this._body, {
                '-webkit-animation-duration': duration + 'ms',
                '-moz-animation-duration': duration + 'ms',
                'animation-duration': duration + 'ms'
            });
        },
        _createDom: function(){
            var str = '<div>';
            for (var i = 0; i < this._points; i++) {
                str += '<span></span>';
            };
            str += '</div>';
            this._el.innerHTML = str;
        }
    });
    
});