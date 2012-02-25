/**
 * 节拍器, 节省设置多个setIntervel带来的性能消耗
 * 最长节拍是一分钟
 * 节拍的起点未必完全正确, 节拍越长, 起点的误差会越大
 * 不能用于节拍间距比较长(大于一分钟的那种)并且要求精度比较高的情况
 * 一秒内的情况比较好用
 */
;Z.$package('Z.class', ['Z.message'], function(z){
    
    var Beater = this.Beater = z.define('class', {
        name: 'Beater',
        statics: {
            DEFAULT_INTERVAL: 50,
            DEFAULT_INTERVALS: [50, 100, 200, 500, 1000, 5000, 10 * 1000, 30 * 1000, 60 * 1000],
            DEFAULT_MAX_INTERVAL: 60 * 1000,
            createUid: function(){
                if(!this._beaterIncreseId){
                    this._beaterIncreseId = 0;
                }
                return this._beaterIncreseId++;
            }
        }
    }, {
        init: function(option){
            option = option || {};
            this._triggers = {};
            this._beaters = {};
            this._isStart = false;
            this._interval = option.interval || Beater.DEFAULT_INTERVAL;
            this._intervals = option.intervals || Beater.DEFAULT_INTERVALS;
            this._maxInterval = option.maxInterval || Beater.DEFAULT_MAX_INTERVAL;
            this._beaterId = Beater.createUid();
        },
        checkTime: function(time){
            time = Number(time);
            if(!time){
                return false;
            }
            if(this._intervals.indexOf(time) === -1){
                return false;
            }
            if(time > this._maxInterval){
                return false;
            }
            return true;
        },
        checkBeater: function(){
            var count = 0;
            for(var i in this._beaters){
                count += this._beaters[i];
            }
            return !!count;
        },
        add: function(bid, time, func){
            if(this._triggers[bid] || !this.checkTime(time)){
                return false;
            }
            var event = 'Beater-' + this._beaterId + '-' + time;
            this._beaters[time] = this._beaters[time] || 0;
            this._triggers[bid] = {
                time: time,
                func: func
            };
            z.message.on(event, func);
            this._beaters[time]++;
            if(!this._isStart){
                this.start();
            }
            return true;
        },
        remove: function(bid){
            var trigger = this._triggers[bid];
            if(!trigger){
                return false;
            }
            var event = 'Beater-' + this._beaterId + '-' + trigger.time;
            this._beaters[trigger.time]--;
            this._triggers[bid] = null;
            delete this._triggers[bid];
            z.message.off(event, trigger.func);
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
                for(var i = 0, inter; inter = context._intervals[i]; i++){
                    if(!(timeCount % inter) && context._beaters[inter]){
                        z.message.notify('Beater-' + context._beaterId + '-' + inter, {time: inter});
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
