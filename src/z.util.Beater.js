/**
 * 节拍器, 节省设置多个setIntervel带来的性能消耗
 * 最长节拍是一分钟
 * 节拍的起点未必完全正确, 节拍越长, 起点的误差会越大
 * 不能用于节拍间距比较长(大于一分钟的那种)并且要求精度比较高的情况
 * 一秒内的情况比较好用
 */
;Z.$package('Z.util', ['Z.message'], function(z){
    
    this.Beater = z.$class({
        name: 'Beater',
        statics: {
            DEFAULT_INTERVAL: 50,
            DEFAULT_MAX_INTERVAL: 60 * 1000
        }
    }, {
        init: function(option){
            option = option || {};
            this._triggers = {};
            this._beaters = {};
            this._isStart = false;
            this._autoStart = ('autoStart' in option) ? option.autoStart : true;
            this._interval = option.interval || this.$static.DEFAULT_INTERVAL;
            //maxInterval 是为了防止timecount会一直无限增上去
            this._maxInterval = option.maxInterval || this.$static.DEFAULT_MAX_INTERVAL;
        },
        checkBeater: function(){
            var count = 0;
            for(var i in this._beaters){
                count += this._beaters[i];
            }
            return !!count;
        },
        add: function(bid, time, func){
        	
        	if(time % this._interval){
        		//time 不能整除
        		time = Math.round(time / this._interval) * this._interval;
        	}else if(time < this._interval){//不能小于
                time = this._interval;
            }else if(time > this._maxInterval){
                time = this._maxInterval;
            }
            
            if(this._triggers[bid]){
                throw new Error('beater is exist');
            }
            var event = 'Beater-' + time;
            this._beaters[time] = this._beaters[time] || 0;
            this._triggers[bid] = {
                time: time,
                func: func
            };
            z.message.on(this, event, func);
            this._beaters[time]++;
            if(!this._isStart && this._autoStart){
                this.start();
            }
            return true;
        },
        remove: function(bid){
            var trigger = this._triggers[bid];
            if(!trigger){
                return false;
            }
            var event = 'Beater-' + trigger.time;
            this._beaters[trigger.time]--;
            this._triggers[bid] = null;
            delete this._triggers[bid];
            z.message.off(this, event, trigger.func);
            if(!this.checkBeater()){
                this.stop();
            }
            return true;
        },
        start: function(){
            if(this._isStart){
                return false;
            }
            var context = this;
            var timeCount = 0, interval = this._interval;
            this._timer = setInterval(function(){
                timeCount += interval;
                if(timeCount >= context._maxInterval){
                    timeCount = 0;
                }
                var inter;
                for(var i in context._beaters){
                	if(!context._beaters[i]){
                		//这下面没有挂 beater
                		continue;
                	}
                	inter = Number(i);
                	if(!(timeCount % inter)){
                        z.message.notify(context, 'Beater-' + inter, {time: inter});
                    }
                }
                
            }, interval);
            this._isStart = true;
            return true;
        },
        stop: function(){
            if(!this._isStart){
                return false;
            }
            clearInterval(this._timer);
            this._timer = 0;
            this._isStart = false;
            return true;
        }
    });
    
});
