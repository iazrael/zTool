
;Z.$package('Z', function(z){
    
    var browser = new function(){
        this.set = function(name, version){
            this.name = name;
            this.version = version;
            this[name] = version;
        };
        var s, ua = navigator.userAgent.toLowerCase();
        (s = ua.match(/msie ([\d.]+)/)) ? this.set("ie",(s[1])):
        (s = ua.match(/firefox\/([\d.]+)/)) ? this.set("firefox",(s[1])) :
        (s = ua.match(/chrome\/([\d.]+)/)) ? this.set("chrome",(s[1])) :
        (s = ua.match(/opera.([\d.]+)/)) ? this.set("opera",(s[1])) :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? this.set("safari",(s[1])) : 0;
    };
    
    z.browser = browser;
});