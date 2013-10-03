
;zTool.$package('zTool.browser', function(z){
    var packageContext = this;
    
    (function(){
        var browser = {};
        browser.set = function(name, version){
            this.name = name;
            this.version = version;
            this[name] = version;
        };
        var s, ua = navigator.userAgent.toLowerCase();
        (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",(s[1])):
        (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",(s[1])) :
        (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",(s[1])) :
        (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",(s[1])) :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",(s[1])) : 0;
        
        Z.merge(packageContext, browser);
        
    })();
    
    var privatePrefixs = {
        ie: 'Ms',
        firefox: 'Moz',
        opera: 'O',
        chrome: 'Webkit',
        safari: 'Webkit'
    };
    var getPrivatePrefix = function(browserName){
        return privatePrefixs[browserName || z.browser.name];
    };
    
    var checkerElement;
    
    var getCheckerElement = function(){
        if(!checkerElement){
            checkerElement = document.createElement('div');
        }
        return checkerElement;
    }
    
    /**
     * 检测 css 的支持
     * @param {String} property 指定需要检测的属性
     * @param {String} value 检测是否支持指定值 @optional
     * @param {Boolean} checkPrivate 指定是否尝试检测浏览器的私有支持 @default false @optional
     */
    this.cssSupport = function(property, value, checkPrivate){
        // throw new Error('not support');
        var element = getCheckerElement();
        if(property in element.style){//TODO 不够完善
            element.style[property] = value;
            return element.style[property] === value;
        }else if(checkPrivate){
            var firstChar = property.charAt(0).toUpperCase();
            property = getPrivatePrefix() + firstChar + property.substr(1);
            return cssSupport(property, false, value);
        }else{
            return false;
        }
    }
    
    
});
