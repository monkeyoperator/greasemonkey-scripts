// ==UserScript==
// @name          ImageFap enhancer
// @description	  enlarges thumbs, alternate gallery view, enhanced 'my clubs' page on ImageFap
// @include       *imagefap.com/*
// ==/UserScript==
// imageFapThumbSize.user.js

    var visits = GM_getObject('visits',{});
    GM_setValue('foo','bar');
// Add jQuery
    var GM_JQ = document.createElement('script');
    var $;
    var threads=8;
    var piccontainer;
    var preload = new Array();
    var pics = new Array();
    var gallerypage=window.location.href.match(/\/gallery\/|\/gallery\.php\?gid/)?true:false;
    var myclubspage=window.location.href.match(/\/clubs\/myclubs\.php/)?true:false;
    var clubspage=window.location.href.match(/\/clubs\/index\.php\?cid=(.*)/);
    if( clubspage )
	clubspage=clubspage[1];
    GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.js';
    GM_JQ.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
    function GM_wait() {
        if(typeof unsafeWindow.jQuery == 'undefined') { console.log("waiting for jquery"); window.setTimeout(GM_wait,100); }
	else { $ = unsafeWindow.jQuery.noConflict(); window.setTimeout(payload,100); }
    }
    GM_wait();
    function showimg( pic, replace ) {
	piccontainer.show();
	if( gallerypage || replace ){
		piccontainer.empty();
        }
//	$('<img src="'+pic.url+'">')
	$('[src='+pic.url+']').clone()
                                .appendTo(piccontainer)
                                .css({width:'',left:'',maxHeight:'100%',maxWidth:'100%',marginRight:'255px'})
                                .click(function(){
                                    $(this).remove();
			            piccontainer.hide();
                                }); 
    }


    function payload() {
	console.log('payload started');
        resize_thumbs();
        if( gallerypage )
            create_alternate_gallery();
        if( myclubspage )
            enhance_myclubs();
        if( clubspage )
	    save_clubvisit( clubspage );
    }
    function resize_thumbs() {
	$('img').each(function () {
		var s = this.src.search(/\/images\/mini\//);
		if( s != -1 ) {
			$(this).replaceWith('<img border="0" src="'+this.src.replace(/images\/mini\//, "images/thumb/")+'">');
		}
	});
    }
    function save_clubvisit( clubid ) {
	GM_log('club '+clubid+' visited');
	dt=new Date();
	visits['club_'+clubid] = dt.getTime();
	GM_setObject('visits', visits); 
    }
    function create_alternate_gallery() {
	var numfound=0;
	favlink = $('#gallery').next('a').eq(0);
	profileLinks = $('#menubar').appendTo('body').append(favlink);
	thumbholder = $('<div style="position:static; float:right; width: 255px; height: 100%; overflow-x: hidden; overflow-y:scroll"></div>')
			.appendTo($('body'));
	thumbholder.css({marginTop:-($('#menubar').height()+2)});

	piccontainer = $('<div style="position:relative;;float:left;255px;height:100%;"></div>').appendTo($('body'));
	piccontainer.hide();
	piccontainer.css({width:$('#menubar').width()-255});
	piccontainer.css({marginTop:-($('#menubar').height()+2)});
	piccontainer.bind('DOMMouseScroll',function(e){
		var idx = 0;
		$.each(pics,function(i,item){
			lookfor = $('img',piccontainer).attr('src');
			if( item.url == lookfor ) idx=i;
                });

		if( e.detail > 0 && idx+1 < pics.length)
			showimg( pics[idx+1]);
                                   
		if( e.detail < 0 && idx-1 >= 0 )
			showimg( pics[idx-1] );
                });
	
	$('a[href*=image.php?id=]').each(function(){
	    $(this).appendTo(thumbholder);
	    var pic = $(this).find('img').eq(0);
	    if( pic.attr && pic.attr('src') ) {
	        var picurl = pic.attr('src').replace(/thumb/,"full" );
                var picobj = {pic:pic,url:picurl};
		preload.push(picobj);
		pics.push(picobj);
		pic.css({maxWidth:'120px',maxHeight:'120px'});
		$(this).mouseover(function(){ showimg(picobj); return false; });
		numfound++;
	    } 
	});
	$('body > center:first-child').remove();
	if( numfound > 0 ) {
		infodiv=$('<div>converted '+numfound+' links</div>')
                         .appendTo('body')
                         .css({position:'fixed',bottom:0,right:0,color:'#aaa',background:'#fff',padding:'5px',margin:'5px',border:'1px solid #88f'});

		var prev = false;
		loadfunction = function() {
		    try{
		        if( $(this).data('prev') ) {
			    $(this).data('prev').pic.css({outline:'3px solid #080'});
			}
		        if(preload[0]) {
			    infodiv.empty().append(preload.length+' left');
			    var next=preload.shift();
			    next.pic.css({outline:'3px dotted #f00'});
			    $(this).clone(true).appendTo('body').data('prev',next).attr('src',next.url);
		        } else {
			    infodiv.empty().append('done.');
			    setTimeout(function(){infodiv.hide();},2000);
			}
		    } catch(e){};
		}
		try {
			var img = $('<img>').css({'position':'absolute','left':'-5000px','width':'10px'});
			img.bind('load', loadfunction );
			for( var i=0; i < threads; i++ )
				setTimeout(function(){img.clone(true).trigger('load');},i*200);
		} catch(e){ console.log(e); }
	}
    }
    function enhance_myclubs() {
	GM_log('i has myclubs');
        $("td[width='100%'][valign='top'] table").each(function(){
	    var glink=$("tr:nth-child(2) ;a[href*='clubs/index.php?cid=']",this).attr('href');
	    if (glink) {
		var gid=glink.match(/cid=(.*)/)[1];
		var td=$("tr:nth-child(2) td:nth-child(2)",this);
		var display=$("tr:nth-child(2) td:nth-child(3)",this);
		td.append('<div id="club_'+gid+'">');
		var gdiv=$('#club_'+gid);
		gdiv.hide().load(glink+' font span',{},function(){
		    $('span',this).each(function(){
			if( gdate=this.innerHTML.match(/([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+):([0-9]+)/) )
			{
			    var clubid = $(this).parent().attr('id');
			    lastmod= new Date(gdate[1], gdate[2], gdate[3],gdate[4],gdate[5],gdate[6]);
			    console.log( clubid+' lastvisit: '+visits['club_'+clubid] );
			    console.log( clubid+' lastmod: '+lastmod);
			    $(this).parent().parent().next().append(lastmod.toLocaleString());
			    return false;
			}
		    });
		});
	    }
        });
    }
function GM_getObject(key, defaultValue) {
        return (new Function('', 'return (' + GM_getValue(key, 'void 0') + ')'))() || defaultValue;
}

function GM_setObject(key, value) {
        GM_setValue(key, value.toSource());
}


