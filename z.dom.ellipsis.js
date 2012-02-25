
;Z.$package('Z.dom', function(z){

    
    /**
     * 文本溢出处理, 默认替换为 "…"
     * @param {HTMLElement} element
     * @param {String} ellipsisText @optional
     */
    this.ellipsis = function(element, ellipsisText){
        var limitWidth = element.clientWidth;
        ellipsisText = ellipsisText || '…';
        var temp = element.cloneNode(true);
        temp.id = 'checkTextLengthNode';
        temp.className = 'check-text-length-node';
        element.parentNode.appendChild(temp);
        var realWidth = temp.clientWidth;
        if(realWidth <= limitWidth){
            return;
        }
        temp.innerHTML = ellipsisText;
        var elliWidth = temp.clientWidth;

        var str = element.innerHTML;
        str = str.replace(/\s+/g, ' ');
        var s, totalWidth = 0;
        for(var i = 0, len = str.length; i < len; i++){
            s = str.charAt(i);
            temp.innerHTML = (s === ' ' ? '&nbsp;' : s);
            totalWidth += temp.clientWidth ;
            if(totalWidth + elliWidth > limitWidth){
                str = str.substr(0, i);
                break;
            }
        }
        element.innerHTML = str + ellipsisText;
        temp.parentNode.removeChild(temp);
    }
    
});
