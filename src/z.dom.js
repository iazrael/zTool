
;Z.$package('Z.dom', ['Z.string'], function(z){
    
    var packageContext = this;


    this.domReady = function(func){
        document.addEventListener('DOMContentLoaded', func, false);
    }

    this.domLoad = function(func){
        window.addEventListener('load', func, false);
    }
    

    /**
     * shot of getElementById
     * @param {String} id 
     */
    this.get = function(id){
        return document.getElementById(id);
    }

    /**
     * 简单的查找封装, 只支持一个选择符, 性能不高, 需要高性能的请使用jquery
     * 改方法只是提供用于 简单页面, 不需要jquery的场景使用
     * @param  {String} selector 选择器, 如 #id, .class, tag
     * @return {NodeList}, {Node}
     */
    this.query = function(selector, parentNode){
        parentNode = parentNode || document;
        var s = selector.charAt(0);
        var v = selector.substring(1);
        if(s === '#'){
            return this.get(v);
        }else if(s === '.'){
            return parentNode.querySelectorAll(selector);
        }else{
            return parentNode.getElementsByTagName(selector);
        }
    }
    
    var templateList = {};
    
    /**
     * 获取页面的一个 html 模板
     * @param {String} tmplId 模板的 dom id
     */
    this.getTemplate = function(tmplId){
        var tmpl = templateList[tmplId];
        if(!tmpl){
            var tmplNode = this.get(tmplId);
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
     *            level 指定寻找的层次, 默认 3
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
        if(t === end){
            return t.getAttribute(p) ? t : null;
        }
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
     *  @param {String} tmplId template dom id
     *  @param {Object} data
     *  @param {Number} position @optional the index to insert, -1 to plus to last
     */
    this.render = function(target, tmplId, data, position){
        data = data || {};
        var tabTmpl = this.getTemplate(tmplId);
        var html = z.string.template(tabTmpl, data);
        if(typeof target === 'string'){
            target = this.get(target);
        }
        if(!z.isUndefined(position) && target.childElementCount){
            var tempNode = document.createElement('div');
            tempNode.innerHTML = html;
            var nodes = tempNode.childNodes; //include text node
            var fragment = document.createDocumentFragment();
            while(nodes[0]){
                fragment.appendChild(nodes[0]);
            }
            if(position === -1 || position >= target.childElementCount){
                target.appendChild(fragment);
            }else{
                target.insertBefore(fragment, target.children[position]);
            }
            delete tempNode;
        }else{
            target.innerHTML = html;
        }
    }
    
    /**
     * @param  {HTMLElement}  targetElement   
     * @param  {String}  eventName 触发命令的事件名
     * @param {Object} commends 命令对象
     * 
     * @example
     * bindCommands(cmds);
     * bindCommands(el, cmds);
     * bindCommands(el, 'click', cmds);
     * 
     * function(param, target, event){
     * }
     */
    this.bindCommands = function(targetElement, eventName, commends){
        var defaultEvent = 'click';
        if(arguments.length === 1){
            commends = targetElement;
            targetElement = document.body;
            eventName = defaultEvent;
        }else if(arguments.length === 2){
            commends = eventName;
            eventName = defaultEvent;
        }
        if(targetElement.__commends){//已经有commends 就合并
            z.merge(targetElement.__commends, commends);
            return;
        }
        targetElement.__commends = commends;
        targetElement.addEventListener(eventName, function(e){
            var target = packageContext.getActionTarget(e, -1, 'cmd', this);
            if(target){
                var cmd = target.getAttribute('cmd');
                var param = target.getAttribute('param');
                if(target.href && target.getAttribute('href').indexOf('#') === 0){
                    e.preventDefault();
                }
                if(this.__commends[cmd]){
                    this.__commends[cmd](param, target, e);
                }
            }
        });
    }
    /**
     * 兼容以前的手误…… @2012-7-23
     * @type {[type]}
     */
    this.bindCommends = this.bindCommands;

    /**
     * 判断 element 在 reference 中是否可见, reference 必须是 relative 或 absolute  定位, 最好是可滚动的
     * @param  {HTMLElement}  element   
     * @param  {HTMLElement}  reference 
     * @param {Boolean} strict 指定严格模式, 若为 true, 则需要 element 完全在可视区才返回 true
     * @return {Boolean} 可见范围中返回 true
     */
    this.isVisible = function(element, reference, strict){
        if(strict){
            if(element.offsetTop - reference.scrollTop >= 0 && 
                element.offsetTop + element.clientHeight - reference.scrollTop <= reference.clientHeight){
                return true;
            }else{
                return false;
            }
        }else{
            if(element.offsetTop + element.clientHeight - reference.scrollTop > 0 && 
                element.offsetTop - reference.scrollTop < reference.clientHeight){
                return true;
            }else{
                return false;
            }
        }
    }

    /**
     * 批量设置样式
     * @param {HTMLElement} el element
     * @param  {Object} styles 样式的 key-value 对象
     */
    this.css = function(el, styles){
        for(var i in styles){
            el.style[i] = styles[i];
        }
    }
    
});
