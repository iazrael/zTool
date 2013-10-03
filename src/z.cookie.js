
;zTool.$package('zTool.cookie', function(z){

    var defaultDomain = window.location.host;
    
    /**
     * 设置一个 cookie 
     * @param {String} name 
     * @param {String},{Object} value  
     * @param {String} domain 
     * @param {String} path   
     * @param {Number} hour  
     */
    this.set = function(name, value, domain, path, hour) {
        if (hour) {
            var today = +new Date;
            var expire = new Date();
            expire.setTime(today + 3600000 * hour);
        }
        if(!z.isString(value)){
            value = JSON.stringify(value);
        }
        value = window.encodeURIComponent(value);
        window.document.cookie = name + '=' + value + '; ' 
            + (hour ? ('expires=' + expire.toGMTString() + '; ') : '') 
            + (path ? ('path=' + path + '; ') : 'path=/; ') 
            + (domain ? ('domain=' + domain + ';') : ('domain=' + defaultDomain + ';'));
    }
    
    /**
     * 取 cookie 值
     * @param  {String} name 
     * @return {String}      
     */
    this.get = function(name) {
        var r = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)');
        var m = window.document.cookie.match(r);
        var value = !m ? '' : m[1];
        value = window.decodeURIComponent(value);
        try{
            value = JSON.parse(value);
        }catch(e){

        }
        return value;
    }
    
    /**
     * 删除指定cookie
     * 
     * @param {String} name
     * @param {String} domain
     * @param {String} path 
     */
    this.remove = function(name, domain, path) {
        window.document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; ' 
            + (path ? ('path=' + path + '; ') : 'path=/; ') 
            + (domain ? ('domain=' + domain + ';') : ('domain=' + defaultDomain + ';'));
    }
    
});
