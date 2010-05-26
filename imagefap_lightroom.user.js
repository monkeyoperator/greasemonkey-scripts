// ==UserScript==
// @name          ImageFap Lightroom
// @description   Show content from Imagefap.com
// @include       *imagefap.com/*
// @unwrap
// ==/UserScript==

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

    var randompage=window.location.href.match(/\/random\.php/);
    var gallerypage=window.location.href.match(/\/random\.php|\/gallery\/(.*)|\/gallery\.php\?p?gid=(.*)/);
        if( gallerypage && gallerypage[0] ) gallerypage = gallerypage[0].match(/[0-9]+/);
            if( gallerypage && gallerypage[0] ) gallerypage = gallerypage[0];
            else gallerypage = false;
    var myclubspage=window.location.href.match(/\/clubs\/myclubs\.php/)?true:false;
    var clubspage=window.location.href.match(/\/clubs\/index\.php\?cid=(.*)/);
    if( clubspage )
        clubspage=clubspage[1];

    if( gallerypage || randompage )
            create_alternate_gallery();

function create_alternate_gallery() {

    var picStore=new Ext.data.ArrayStore({
	storeId: 'picStore',
	fields:['imgUrl','thumbUrl','thumbImg','img']
    });
    
    var win = new Ext.Window({
        width:800,
        height:600,
        layout:'border',
        title:"picStore"
    });
    win.add(new Ext.grid.GridPanel({
        region: 'center',
        store: picStore,
        colModel:new Ext.grid.ColumnModel({
        defaults: {
            width: 120,
            sortable: true
        },
        columns: [
            {header:'URL',width:100,dataIndex:'imgUrl'},
            {header:'thumbURL',width:100,dataIndex:'thumbUrl'},
            {header:'thumb',width:100,dataIndex:'thumbImg'}
        ]
    })
  

    }));
    win.show();

Ext.each(Ext.query('a[href*=image.php?id=] img'),function(){
    var element={imgUrl:this.src,thumbUrl:this.src.replace(/thumb/,"full" ),thumbImg:this}
    picStore.addSorted( new picStore.recordType(element) );
});
};




}})(unsafeWindow);

