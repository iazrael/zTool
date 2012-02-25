;Z.$package('Z.ui', function(z){

    /**
     * 滚动条的通用逻辑封装
     *
     */
    this.ScrollAction = z.define('class', {
        init: function(option){
            this._id = 'scroll_action_' + (option.id || option.element.getAttribute('id'));
            this._el = option.element;
            
            this._step = option.step || 50;
            this._animationDuration = option.animationDuration || 10;
            this._scrollEventDelay = option.scrollEventDelay || 200; 
            
            this._onScrollToBottom = option.onScrollToBottom;
            this._onScrollToTop = option.onScrollToTop;
            this._onAnimationStart = option.onAnimationStart;
            this._onAnimationEnd = option.onAnimationEnd;
            
            
            var context = this;
            this._el.addEventListener('scroll', function(e){
                //保证这个延迟的时间比动画长, 不能在下一个动画还没执行, 这里已经触发了
                var delayTime = context._scrollEventDelay + context._animationDuration;
                z.util.delay(context._id + '_scroll', delayTime, function(){
                    if(context._el.scrollTop === 0 && context._onScrollToTop){
                        context._onScrollToTop();
                    }else if(context._el.scrollTop === (context._el.scrollHeight - context._el.clientHeight) 
                        && context._onScrollToBottom){
                        context._onScrollToBottom();
                    }
                });
            },false);
        },
        /**
         * 获取当前滚动条的位置
         */
        getScrollTop: function(){
            return this._el.scrollTop;
        },
        /**
         * 设置动画的参数
         * @param {Number} step 每次动画滚动的步长
         * @param {Number} duration 每次滚动执行的间隔
         */
        setAnimation: function(step, duration){
            if(step){
                this._step = step;
            }
            if(duration){
                this._animationDuration = duration;
            }
        },
        /**
         * 滚动到指定位置
         * @param {Number},{String} scrollTop 指定scrollTop, 或者关键字 'top'/'bottom'
         * @param {Boolean} hasAnimation 只是是否执行滚动动画
         * @example
         * 1.scrollAction.scrollTo(0);
         * 2.scrollAction.scrollTo(200);
         * 3.scrollAction.scrollTo('top', true);
         * 4.scrollAction.scrollTo('bottom');
         * 
         */
        scrollTo: function(scrollTop, hasAnimation){
            var context = this;
            z.util.clearLoop(this._id);
            var maxScrollHeight = this._el.scrollHeight - this._el.clientHeight;
            if(J.isString(scrollTop)){
                if(scrollTop === 'top'){
                    scrollTop = 0;
                }
                if(scrollTop === 'bottom'){
                    scrollTop = maxScrollHeight;
                }
            }
            if(scrollTop < 0){
                scrollTop = 0;
            }
            if(scrollTop > maxScrollHeight){
                scrollTop = maxScrollHeight;
            }
            if(scrollTop === this._el.scrollTop){
                return false;
            }
            if(!hasAnimation){
                this._el.scrollTop = scrollTop;
            }else{
                var from = context._el.scrollTop, to = scrollTop;
                var sign = (to - from > 0) ? 1 : -1;
                var isStarted = false;
                z.util.loop(this._id, this._animationDuration, function(){
                    if(!isStarted){
                        isStarted = true;
                        if(context._onAnimationStart){
                            context._onAnimationStart();
                        }
                    }
                    from = from + sign * context._step;
                    var isEnd = false;
                    if((sign > 0 && from > to) || (sign < 0 && from < to)){
                        from = to;
                        isEnd = true;
                        z.util.clearLoop(context._id);
                    }
                    context._el.scrollTop = from;
                    if(isEnd && context._onAnimationEnd){
                        context._onAnimationEnd();
                    }
                });
            }
            return true;
        }
    });
    
});