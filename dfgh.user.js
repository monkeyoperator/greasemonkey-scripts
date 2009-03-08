// ==UserScript==
// @name           dfgh  
// @namespace      http://localhost/userscripts
// @description    Ausfuellen von Textfeldern die email-adressen erwarten
// @include        *
// ==/UserScript==

(function() {
    function randstring() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = Math.floor(Math.random()*5)+10;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
    }
    window.addEventListener("load",function(e) {
	    var names= new Array(/^login$/,/^email$/,/^EMAIL$/,/email_address/,/email$/);
	    var email;
	    var RE = /\.(.*\..*)$/
	    RE.exec(location.host)
	    email=RegExp.$1 + '.argl@dfgh.net';
	    allText = document.evaluate(
		 "//input[@type='text']",
	//        "//input",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);
	    for (var i = 0; i < allText.snapshotLength; i++) {
		thisText = allText.snapshotItem(i);
	    for(var j = 0; j < names.length; j++)
		if(names[j].exec(thisText.name)) thisText.value=email;
	    }
	    var foo=document.getElementsByTagName('a');
	    referReg=/(ref=|affid=|aff=|ccbill(=|\/)|campaignid=)/;
	    for(i=0;i<foo.length;i++) {
		item=foo[i];
		if(item.href.search(referReg)!=-1){
			try {
				item.firstChild.style.border="2px dashed green";
				item.firstChild.style.MozBorderRadius='5px';
				item.firstChild.style.padding='3px';
			} catch(e){}
			item.href=item.href.replace(referReg,'$1'+randstring());
		}
	    }
    },false);

})();

