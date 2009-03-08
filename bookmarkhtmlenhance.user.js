// ==UserScript==
// @name          bookmark.html.enhance
// @namespace     
// @description	  Add Functions to bookmarks.html
// @include       */bookmarks.html
// ==/UserScript==
// OpenBCUserImages.user.js

(function() {
  function addTextArea(e) {
	linkList=this.nextSibling.nextSibling.getElementsByTagName("a");
	var html="";
	for(j=0; j<linkList.length;j++) {
		html=html + linkList[j].href+"\n";
	}
	newE = document.createElement("textarea");
	newE.innerHTML=html;	
	newE.rows=5;
	newE.cols=80;
	this.removeEventListener("mousedown",addTextArea,false);
	this.appendChild(newE);
  }
  window.addEventListener("load", function(e) {
    	var h3List = document.getElementsByTagName("h3");
	for( i=0; i < h3List.length; i++) {
		h3List[i].addEventListener("mousedown",addTextArea,false);
	}
  }, false);
})();

