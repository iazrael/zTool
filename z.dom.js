Z.$package('Z.dom', function(z){
    
    /**
     * shot of getElementById
     */
    this.get = function(id){
        return document.getElementById(id);
    }
    
    var templateList = {};
    
    /**
     * 获取页面的一个 html 模板
     * @param {String} tmplId 模板的 dom id
     */
    this.getTemplate = function(tmplId){
        var tmpl = templateList[tmplId];
        if(!tmpl){
            var tmplNode = document.getElementById(tmplId);
            tmpl = tmplNode.innerHTML;
            tmplNode.parentNode.removeChild(tmplNode);
            templateList[tmplId] = tmpl;
        }
        if(!tmpl){
            throw new Error('no such template. [id="' + tmplId + '"]');
        }
        return tmpl;
    }
    
    /**
     * 获取点击的事件源, 该事件源是有 cmd 属性的 默认从 event.target 往上找三层,找不到就返回null
     * 
     * @param {Event}
     *            event
     * @param {Int}
     *            level 指定寻找的层次
     * @param {String}
     *            property 查找具有特定属性的target,默认为cmd
     * @param {HTMLElement} parent 指定查找结束点, 默认为document.body
     * @return {HTMLElement} | null
     */
    this.getActionTarget = function(event, level, property, parent){
        var t = event.target,
            l = level || 3,
            s = level !== -1,
            p = property || 'cmd',
            end = parent || document.body;
        while(t && (t !== end) && (s ? (l-- > 0) : true)){
            if(t.getAttribute(p)){
                return t;
            }else{
                t = t.parentNode;
            }
        }
        return null;
    }
    
    /**
     *  @param {HTMLElement},{String} targetId, target dom or dom id
     *  @param {String} tmplId, template dom id
     *  @param {Object} data
     *  @param {Boolean} isPlus, add or replace
     */
    this.render = function(target, tmplId, data, isPlus){
        var tabTmpl = this.getTemplate(tmplId);
        var html = z.string.template(tabTmpl, data);
        if(typeof target === 'string'){
            target = this.get(target);
        }
        if(isPlus){
            var tempNode = document.createElement('div');
            tempNode.innerHTML = html;
            var nodes = tempNode.children;
            while(nodes[0]){
                target.appendChild(nodes[0]);
            }
            delete tempNode;
        }else{
            target.innerHTML = html;
        }
    }
    
    /**
     * 设置样式的简写调用
     */
    this.css = function(el, style){
        for(var i in style){
            el.style[i] = style[i];
        }
    }
    
    /**
     * 
     * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method getStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @return {String} 返回元素样式
     */
    this.getStyle = function(el, styleName){
        if(styleName === "float" || styleName === "cssFloat"){
            styleName = "cssFloat";
        }
        if(el.style[styleName]){
            return el.style[styleName];
        }else if(el.currentStyle){
            return el.currentStyle[styleName];
        }else if(window.getComputedStyle){
            return window.getComputedStyle(el, null)[styleName];
        }else if(document.defaultView && document.defaultView.getComputedStyle){
            styleName = styleName.replace(/([/A-Z])/g, "-$1");
            styleName = styleName.toLowerCase();
            var style = document.defaultView.getComputedStyle(el, "");
            return style && style.getPropertyValue(styleName);
        }
    };
    
    
    /**
     * 
     * 设置元素的样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method setStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @param {String} value css 属性值
     */
    this.setStyle = function(el, styleName, value){
        if(styleName === "float"){
            styleName = "cssFloat";
        }
        el.style[styleName] = value;
    };
    
    
    /**
     * 
     * 显示元素
     * 
     * @method show
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} displayStyle 强制指定以何种方式显示，如：block，inline，inline-block等等
     */
    this.show = function(el, displayStyle){
        var display;
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(_oldDisplay){
            display = _oldDisplay;
        }else{
            display = this.getStyle(el, "display");
        }

        if(displayStyle){
            this.setStyle(el, "display", displayStyle);
        }else{
            if(display === "none"){
                this.setStyle(el, "display", "block");
            }else{
                this.setStyle(el, "display", display);
            }
        }
    };
    
    /**
     * 
     * 判断元素是否是显示状态
     * 
     * @method isShow
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    this.isShow = function(el){
        var display = this.getStyle(el, "display");
        if(display === "none"){
            return false;
        }else{
            return true;
        }
    };
    
    /**
     * 
     * 隐藏元素
     * 
     * @method hide
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    this.hide = function(el){
        var display = this.getStyle(el, "display");
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(!_oldDisplay){
            if(display === "none"){
                el.setAttribute("_oldDisplay", "");
            }else{
                el.setAttribute("_oldDisplay", display);
            }
        }
        this.setStyle(el, "display", "none");
    };
    
    
    /**
     * 
     * 判断元素是否含有 class
     * 
     * @method hasClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    hasClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return el.classList.contains(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
            };
        }
    }();

    
    /**
     * 
     * 判断元素是否含有 class
     * 
     * @method hasClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    this.hasClass = function(el, className) {
        if (!el || !className) {
            return false;
        }
        return el.classList.contains(className);
    };
    
    /**
     * 
     * 给元素添加 class
     * 
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    this.addClass = function(el, className) {
        if (!el || !className || this.hasClass(el, className)) {
            return;
        }
        el.classList.add(className);
    };

    /**
     * 
     * 给元素移除 class
     * 
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    removeClass = function (el, className) {
        if (!el || !className || !this.hasClass(el, className)) {
            return;
        }
        el.classList.remove(className);
    };
    
});
