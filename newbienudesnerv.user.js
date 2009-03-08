// ==UserScript==
// @name           Newbienudes-nerv
// @description    onRightClick, window open
// @include        newbienudes.com
// ==/UserScript==

(function() {
	var allImg;
	allLinks = document.getElementsByTagName('a');
	for (var i=0; i<allLinks.length;i++) {
		var l = allLinks[i];
		var h = l.href;
		var s = h.search(/javascript:ViewPhoto/);
		if(s!=-1) {
			l.href=h.replace(/javascript:ViewPhoto\(\'/,"http://www.newbienudes.com/Photos/");
			l.target="_blank";
		}
	}
	allImg = document.getElementsByTagName('img');
	for (var i=0; i<allImg.length;i++) {
		var l = allImg[i];
		if(l.getAttribute('oncontextmenu')  ) {
			p=l.parentNode.parentNode;
			if( p )
			{
				p.removeChild(p.firstChild);
				p.appendChild(l);
			}	
			l.setAttribute('oncontextmenu','');
			l.setAttribute('galleryimg','yes');
		}
        }
})();
