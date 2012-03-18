
;Z.$package('Z.util', function(z){
    
    /**
     * @class
     * 一系列方法的执行依赖队列, 每个方法执行完成之后必须手动调用 next() 方法
     * 整个队列执行完成之后自动执行初始化时传入的 onFinish 方法
     */
    this.DependentQueue = new z.$class({
            name: 'DependentQueue',
            statics: {
                STATUS_INIT: 1,
                STATUS_RUNNING: 2,
                STATUS_PAUSE: 3,
                STATUS_STOP: 4
            }
        }, {
        /**
         * @param {Object} option
         * {
         *  onPause: 
         *  onFinish:
         *  onStop:
         * }
         */
        init: function(option){
            option = option || {};
            this._onFinish = option.onFinish;
            this._onPause = option.onPause;
            this._onStop = option.onStop;
            
            this._currentIndex = -1;
            this._items = [];
            
            this._status = this.$static.STATUS_INIT;
        },
        /**
         * @param {Object} item
         * {
         *  id: 'xxx'
         *  exec: function(queue, item){}
         *  
         * }
         * 
         */
        add: function(item){
            if(this.isRunning()){
                return false;
            }
            this._items.push(item);
            return true;
        },
        isRunning: function(){
            return this._status === this.$static.STATUS_RUNNING;
        },
        run: function(){
            if(this.isRunning()){
                return false;
            }
            if(this._items.length <= 0){
                return false;
            }
            if(this._currentIndex >= this._items.length - 1){
                return false;
            }
            this._status = this.$static.STATUS_RUNNING;
            this.next();
        },
        reRun: function(){
            this._currentIndex--;
            this.next();
        },
        next: function(){
            this._currentIndex++;
            var item = this._items[this._currentIndex];
            if(item){
                item.exec(this, item);
            }else{
                if(this._onFinish){
                    this._onFinish(this);
                }
            }
        },
        pause: function(){
            this._status = this.$static.STATUS_PAUSE;
            if(this._onPause){
                var item = this._items[this._currentIndex];
                this._onPause(this, item);
            }
        },
        stop: function(){
            this._status = this.$static.STATUS_STOP;
            if(this._onStop){
                var item = this._items[this._currentIndex];
                this._onStop(this, item);
            }
        }
    });

    
});
