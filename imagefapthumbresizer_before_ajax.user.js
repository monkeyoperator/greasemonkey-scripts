// ==UserScript==
// @name          ImageFap Thumb resizer
// @namespace     
// @description	  Shows big images when hovering over mini-Thumbs on ImageFap
// @include       *imagefap.com/*
// ==/UserScript==
// imageFapThumbSize.user.js
// Add jQuery
    var GM_JQ = document.createElement('script');
    GM_JQ.src = 'http://127.0.0.1/jquery-latest.js';
    GM_JQ.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
    function GM_wait() {
        if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,500); }
	else { $ = unsafeWindow.jQuery; letsJQuery(); }
    }
    GM_wait();
// All your GM code must be inside this function
    function letsJQuery() {
      $(function() {
    	var imgList = document.getElementsByTagName("img");
	var opened;
	$('<div id="gm_counter">opener ready.</div>').appendTo("body");
	$('#gm_counter').css( {
		position:'fixed',
		top:0,right:0,zIndex:999,
		border:"2px dashed blue",
		padding:"2px",
		cursor:"-moz-grab",
		background:"#ddd"});
	showImg = function() {
		$('.gm_newImage:first').show();
		$('#gm_counter').unbind('click').bind('click',removeImg);
		$('#gm_counter').empty().append("remove all");
		console.log("showed " +$('.gm_newImage').length + " images");
	};
	removeImg = function() {
		if( $('.gm_newImage').length > 0 ) {
			$('.gm_newImage').remove();
			console.log( 'all images removed' );
		}
		
		$('#gm_counter').unbind('click').bind('click',showImg);
		$('#gm_counter').empty().append("ready");
	}
	$('#gm_counter').bind('click',showImg)
	for( i=0; i < imgList.length; i++) {
		var imgName = imgList[i].src;
		var s = imgName.search(/\/images\/mini|thumb\//);
		if( s != -1) {

			ow=imgList[i].width;
			imgList[i].addEventListener("mouseover",
				function(e){
					$(this).css("border","2px solid darkGray");
					$(this).css("padding","2px");
					
					newImg = document.createElement("img");
					newSrc = this.src.replace(/images\/mini|thumb\//, "full/");
					newImg.src = newSrc;
					newImg.style.maxWidth=window.innerWidth;
					newImg.style.maxHeight = window.innerHeight;
					newImg.style.position="fixed";
					newImg.style.zIndex='1';
					newImg.style.top=0;
					newImg.style.left=0;
					newImg.style.display='none';
					newImg.className='gm_newImage';
				        	
					document.body.appendChild(newImg);
					var ref = this;	
					fn_error = function() {
						 $(ref).css("border","2px solid red");
						$('#gm_counter').css("background","#fdd");
						$(this).remove();
						 $('#gm_counter').empty().append("show " + $('.gm_newImage').length);
					};
					fn_load = function() {
						 $(ref).css("border","2px dotted green");
					};
					fn_click = function() {
						$(this).remove();
						 $('.gm_newImage:first').show();
					};
					newImg.addEventListener("click",fn_click,false);
					newImg.addEventListener("load",fn_load,true);
					newImg.addEventListener("error",fn_error,false);
					$('#gm_counter').empty().append("show " + $('.gm_newImage').length);
					$('#gm_counter').unbind('click').bind('click',showImg);
				},false);

		}
	}
	return;
  });
};

