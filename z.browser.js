Z.$package('Z.browser', function(z){
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
    var getPrivatePrefix = function(){
        return privatePrefixs[browser.name];
    };

    var cssSupport = function(property, checkPrivate, value){
        var element = document.createElement('div');
        if(property in element.style){
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
