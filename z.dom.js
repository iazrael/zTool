
;Z.$package('Z.dom', function(z){
    
    var packageContext = this;

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
        if(isPlus && target.childElementCount){
            var tempNode = document.createElement('div');
            tempNode.innerHTML = html;
            var nodes = tempNode.children;
            var fragment = document.createDocumentFragment();
            while(nodes[0]){
                fragment.appendChild(nodes[0]);
            }
            target.appendChild(fragment);
            delete tempNode;
        }else{
            target.innerHTML = html;
        }
    }
    
    /**
     * @example
     * bindCommends(cmds);
     * bindCommends(el, cmds);
     * bindCommends(el, 'click', cmds);
     * 
     * function(param, target, event){
     * }
     */
    this.bindCommends = function(targetElement, eventName, commends){
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
            var target = packageContext.getActionTarget(e, 3, 'cmd', this);
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
    
});
