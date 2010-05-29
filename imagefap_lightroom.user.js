// ==UserScript==
// @name          ImageFap Lightroom
// @description   Show content from Imagefap.com
// @include       *imagefap.com/*
// @unwrap
// ==/UserScript==

document.cookie='popundr=1; path=/; expires='+new Date(Date.now()+24*60*60*1000*356).toGMTString();
(function(window) {
        function loadScript(url) {
                var script     = document.createElement('script');
                script.type    = 'text/javascript';
                script.charset = 'utf-8';
                script.src     = url;

                document.getElementsByTagName('head')[0].appendChild(script);
        }
	function loadCss( url ) {
                var link     = document.createElement('link');
                link.type    = 'text/css';
                link.rel     = 'stylesheet';
                link.href     = url;
		document.getElementsByTagName('head')[0].appendChild(link);

	}

        loadScript('http://extjs.cachefly.net/ext-3.2.0/adapter/ext/ext-base-debug.js');
        loadScript('http://extjs.cachefly.net/ext-3.2.0/ext-all-debug.js');
        loadCss('http://extjs.cachefly.net/ext-3.2.0/resources/css/ext-all.css');
        extjs_wait();
        function extjs_wait() {
                if( typeof window.Ext == 'undefined' || typeof window.Ext.Window == 'undefined') {
                        window.setTimeout( extjs_wait,100 );
                } else {
					var dummy = new Array();
					dummy.push('foo');
					window.Ext.each(dummy,main,window.Ext);
                }
        }

var main = function() {
    var Ext=this;
    var showDetailTimer;
    Ext.apply(Function.prototype,{createInterceptor:function(fcn,scope){var method=this;return!Ext.isFunction(fcn)?this:function(){var me=this,args=arguments;fcn.target=me;fcn.method=method;return(fcn.apply(scope||me||window,args)!==false)?method.apply(me||window,args):null;};},createCallback:function(){var args=arguments,method=this;return function(){return method.apply(window,args);};},createDelegate:function(obj,args,appendArgs){var method=this;return function(){var callArgs=args||arguments;if(appendArgs===true){callArgs=Array.prototype.slice.call(arguments,0);callArgs=callArgs.concat(args);}else if(Ext.isNumber(appendArgs)){callArgs=Array.prototype.slice.call(arguments,0);var applyArgs=[appendArgs,0].concat(args);Array.prototype.splice.apply(callArgs,applyArgs);} return method.apply(obj||window,callArgs);};},defer:function(millis,obj,args,appendArgs){var fn=this.createDelegate(obj,args,appendArgs);if(millis>0){return setTimeout(fn,millis);} fn();return 0;}});Ext.applyIf(String,{format:function(format){var args=Ext.toArray(arguments,1);return format.replace(/\{(\d+)\}/g,function(m,i){return args[i];});}});

    var picStore=new Ext.data.ArrayStore({
	    	storeId: 'picStore',
	    	fields:['imgUrl','thumbUrl','thumbImg','img','current']
        });
    var Templates = {};

    var randompage=window.location.href.match(/\/random\.php/);
    var gallerypage=window.location.href.match(/\/random\.php|\/gallery\/(.*)|\/gallery\.php\?p?gid=(.*)/);
        if( gallerypage && gallerypage[0] ) gallerypage = gallerypage[0].match(/[0-9]+/);
            if( gallerypage && gallerypage[0] ) gallerypage = gallerypage[0];
            else gallerypage = false;
    var myclubspage=window.location.href.match(/\/clubs\/myclubs\.php/)?true:false;
    var clubspage=window.location.href.match(/\/clubs\/index\.php\?cid=(.*)/);
    if( clubspage )
        clubspage=clubspage[1];

    resize_thumbs();
    if( gallerypage || randompage )
            create_alternate_gallery();


    function resize_thumbs() {
    	Ext.each(Ext.query('img'),function () {
    		var s = this.src.search(/\/images\/mini\//);
    		if( s != -1 ) {
    			var newImage = new Image();
    			newImage.src=this.src.replace(/images\/mini\//, "images/thumb/");
    			Ext.get(this).replaceWith(newImage);
    		}
    	});
    }

    function collect_Images() {
    	Ext.each(Ext.query('a[href*=image.php?id=] img'),function(){
    		var Img=new Image();
    		Img.src=this.src.replace(/thumb/,"full" );
    		var element={thumbUrl:this.src,imgUrl:this.src.replace(/thumb/,"full" ),thumbImg:this,img:Img};
    		picStore.addSorted( new picStore.recordType(element) );
    	});
    }
    
    function initTemplates() {
		Templates.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" style="padding:3px;border:1px solid #888;border-width:1px 0 0 0" >',
				'<div class="thumb" style="padding-bottom:3px"><img src="{thumbUrl}"></div>',
				'</div>',
			'</tpl>'
		);
		Templates.thumbTemplate.compile();

		Templates.detailsTemplate = new Ext.XTemplate(
				'<tpl for=".">',
					'<img style="max-width:{maxW}px; max-height:{maxH}px;" src="{imgUrl}">',
				'</tpl>'
		);
		Templates.detailsTemplate.compile();
	}

    function create_alternate_gallery() {
    	collect_Images();
    	initTemplates();
        var storeView = new Ext.grid.GridPanel({
            region: 'center',
            store: picStore,
            title: 'debug',
            colModel:new Ext.grid.ColumnModel({
	            defaults: {
	                width: 120,
	                sortable: true
	            },
	            columns: [
	                {header:'URL',width:100,dataIndex:'imgUrl'},
	                {header:'thumbURL',width:100,dataIndex:'thumbUrl',hidden:true},
	                {header:'thumb',width:100,dataIndex:'thumbImg',hidden:true},
	                {header:'img',width:100,dataIndex:'img',hidden:true},
	                {header:'current',width:100,dataIndex:'current'}
	            ]
	        })
        });
        var thumbView=new Ext.DataView({
        	region:'center',
			tpl: Templates.thumbTemplate,
			singleSelect: true,
			overClass:'x-view-over',
			itemSelector: 'div.thumb-wrap',
			emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
			store: picStore,
			listeners: {
        	    'mouseenter':{fn:function(dv,index){ 
        			if(showDetailTimer) {
        				clearTimeout(showDetailTimer);
        			}
        			
        			showDetailTimer=showDetail.defer(200,this,[index]);}},
				'beforeselect'   : {fn:function(view){
			        return thumbView.store.getRange().length > 0;
			    }}
			}
		});
        
        function showDetail(index){
			var bigPic=Ext.getCmp('big-pic');
			var record;
			currentIndex=picStore.findExact('current',true);
			if(currentIndex != -1) {
				record=picStore.getAt(currentIndex);
				record.set('current',false);
			}
			record=picStore.getAt(index);
			record.set('current',true);
			picStore.commitChanges();
			data=record.data;
			data.maxW=Ext.getCmp('main-panel').getWidth();
			data.maxH=Ext.getCmp('main-panel').getHeight();
			bigPic.update(Templates.detailsTemplate.apply( data ));
			
		 }

    
    var win = new Ext.Window({
        width:800,
        height:600,
        border:false,
        layout:'border',
        title:'Lightroom',
        maximizable:true,
        defaults: {
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed:true

        },
        items: [
                {
                        title: 'North',
                        region: 'north',
                        html: 'North',
                        id:'north-panel',
                        margins: '5 5 0 5',
                        height: 70
                    },{
                        title: 'South',
                        region: 'south',
                        html: 'South',
                        collapseMode: 'mini',
                        margins: '0 5 5 5',
                        height: 70,
                        id:'south-panel'
                    },{
                        region: 'west',
                        html: 'West',
                        margins: '0 0 0 5',
                        width: 500,
                        id:'west-panel',
                        layout:'border',
                        items:[ {xtype:'tabpanel',region:'center',items:[{title:'favs'}, storeView ]} ]
                    },{
                        title: 'East',
                        region: 'east',
                        html: 'East',
                        margins: '0 5 0 0',
                        width: 250,
                        id:'east-panel',
                        collapsed:false,
                        layout:'border',
                        
                        items:[ {
        					region: 'center',
        					autoScroll: true,
        					items: thumbView },
        					{region:'south', height:20,id:'pager-panel',collapsible:false}]
                    },{
                        region: 'center',
                        collapsible: false,
                        collapsed:false,
                        id:'main-panel',
                        layout:'fit',
                        items: [{id:'big-pic'}]
                    }
                
        ]
    });
    win.show();
    win.maximize();
	showDetail.defer(250,this,[0]);
    Ext.getCmp('pager-panel').body.appendChild(Ext.DomQuery.selectNode('div[id=gallery]').firstElementChild); // server paging


};

}})(unsafeWindow);

