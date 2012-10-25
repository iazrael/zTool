
;Z.$package('Z.string', function(z){
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    var toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    this.toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };
    
    var templateCache = {};
      
    /**
     * 多行或单行字符串模板处理
     * 
     * @method template
     * @memberOf string
     * 
     * @param {String} str 模板字符串
     * @param {Object} obj 要套入的数据对象
     * @return {String} 返回与数据对象合成后的字符串
     * 
     * @example
     * <script type="text/html" id="user_tmpl">
     *   <% for ( var i = 0; i < users.length; i++ ) { %>
     *     <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
     *   <% } %>
     * </script>
     * 
     * Jx().$package(function(J){
     *  // 用 obj 对象的数据合并到字符串模板中
     *  J.template("Hello, {name}!", {
     *      name:"Kinvix"
     *  });
     * };
     */
    var template = this.template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          templateCache[str] = templateCache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var z_tmp=[],print=function(){z_tmp.push.apply(z_tmp,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){z_tmp.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("z_tmp.push('")
              .split("\r").join("\\'")
          + "');}return z_tmp.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
    
    /**
     * 字符串格式函数
     * 
     * @Example 
     * var a = "I Love {0}, and You Love {1},Where are {0}! {4}";
     * alert(z.string.format(a, "You","Me")); 
     */
    this.format = function(str, arg1, arg2/*...*/) {
        if( arguments.length == 0 )
            return null;
        var str = arguments[0];
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }

    /**
     * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
     * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
     * 
     * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF) 两个字节
     * 000800 - 00D7FF 
       00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz 三个字节
     * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
     * 
     * 注: Unicode在范围 D800-DFFF 中不存在任何字符
     * {@link http://zh.wikipedia.org/wiki/UTF-8}
     * 
     * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
     * 000000 - 00FFFF  两个字节
     * 010000 - 10FFFF  四个字节
     * 
     * {@link http://zh.wikipedia.org/wiki/UTF-16}
     * @param  {String} str 
     * @param  {String} charset utf-8, utf-16
     * @return {Number}
     */
    this.sizeof = function(str, charset){
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if(charset === 'utf-16' || charset === 'utf16'){
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0xffff){
                    total += 2;
                }else{
                    total += 4;
                }
            }
        }else{
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0x007f) {
                    total += 1;
                }else if(charCode <= 0x07ff){
                    total += 2;
                }else if(charCode <= 0xffff){
                    total += 3;
                }else{
                    total += 4;
                }
            }
        }
        return total;
    }
});
