
;Z.$package('Z.ui', function(z){

    /**
     * 图片查看器 
     * @class
     * @name ImageViewer
     * 
     */
    this.ImageViewer  = z.$class({
        init: function(option){
            var el;
            if(option.element){
                el = this._el = option.element;
            }else{
                el = this._el = document.createElement('div');
                el.setAttribute('class', 'image-viewer');
                (option.parent || document.body).appendChild(el);
            }
            this._createDom();
        },
        show: function(imgUrl){

        },
        hide: function(){
            
        }
    });
    
});