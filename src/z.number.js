
;Z.$package('Z.number', function(z){
    
    /**
     * 格式化数字
     * @param {Number} number
     * @param {String} pattern "00#.###.##00"
     * @return {String}
     */
    this.format = function(number, pattern){
        var strarr = number.toString().split('.');
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr='';

        // 整数部分
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length-1;  
        var comma = false;
        for(var f=fmt.length-1;f>=0;f--){
            switch(fmt.substr(f,1)){
                case '#':
                    if(i>=0 ) retstr = str.substr(i--,1) + retstr;
                    break;
                case '0':
                    if(i>=0){
                        retstr = str.substr(i--,1) + retstr;
                    }
                    else {
                        retstr = '0' + retstr;
                    }
                    break;
                case ',':
                    comma = true;
                    retstr=','+retstr;
                    break;
            }
        }
        if(i>=0){
            if(comma){
                var l = str.length;
                for(;i>=0;i--){
                    retstr = str.substr(i,1) + retstr;
                    if(i>0 && ((l-i)%3)==0){
                        retstr = ',' + retstr;
                    }
                }
            }
            else{
                retstr = str.substr(0,i+1) + retstr;
            }
        }
        retstr = retstr+'.';
        // 处理小数部分
        str=strarr.length>1?strarr[1]:'';
        fmt=fmtarr.length>1?fmtarr[1]:'';
        i=0;
        for(var f=0;f<fmt.length;f++){
            switch(fmt.substr(f,1)){
            case '#':
                if(i<str.length){
                    retstr+=str.substr(i++,1);
                }
                break;
            case '0':
                if(i<str.length){
                    retstr+= str.substr(i++,1);
                }
                else retstr+='0';
                break;
            }
        }
        return retstr.replace(/^,+/,'').replace(/\.$/,'');
    }
    
    /**
     * 
     * 由给定数组,计算出最大值和最小值返回
     * @param {Array} array
     * @return {Object} 返回最大最小值组成的对象,{max,min}
     */
    this.getMaxMin = function(array){
        //TODO 这个方法的实现太搓, 是病, 得治
        var max = 0, min = 0, len = array.length;
        if(len > 0){
            min = array[0];
            for(var i = 0; i < len; i++){
                if(array[i] > max){
                    max = array[i];
                }else if(array[i] < min){
                    min = array[i];
                }
            }
        }
        return {max: max,min: min};
    }

    /**
     * 返回指定范围的随机整数, 如 [9, 15], 将返回 9 <= n <= 15
     * @param  {Number} start 随机数最小值
     * @param  {Number} end   随机数最大值
     * @return {Number}
     */
    this.random = function(start, end){
        return Math.floor(Math.random() * (end - start + 1) + start);
    }
    
});
