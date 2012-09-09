JSDOC.PluginManager.registerPlugin(
	"JSDOC.publishSrcHilite",
	{
		onSymbol: function(symbol) {
			if (symbol.is("FILE")) return;
			
			symbol.srcLineNum = -1;
			symbol.srcAnchor = "";
			
			var comment = symbol.comment;
			if (!comment.isUserComment) return;
			
			var src = this.srcCache[symbol.srcFile];
			if (!src) {
				src = this.srcCache[symbol.srcFile] = IO.readFile(symbol.srcFile);
				if (!src) return;
			}
			
//			LOG.warn(symbol.alias+" , "+comment.isUserComment);
//			LOG.warn(comment.originalComment);
			
			var pos = src.indexOf(comment.originalComment);
			if (pos==-1) return;
			
			var num = src.substr(0, pos).split(/\r\n|\r|\n/).length;
			
//			LOG.warn(pos+" , "+num);
			
			symbol.srcLineNum = num;
			symbol.srcAnchor = "line"+num;
			
		},
		srcCache: {},
		
		onPublishSrc: function(src) {
			if (src.path in JsHilite.cache) {
				return; // already generated src code
			}
			else JsHilite.cache[src.path] = true;
		
			try {
				var sourceCode = IO.readFile(src.path);
			}
			catch(e) {
				print(e.message);
				quit();
			}

			var hiliter = new JsHilite(sourceCode, src.charset);
			src.hilited = hiliter.hilite();
		}
	}
);

function JsHilite(src, charset) {
	var tr = new JSDOC.TokenReader();
	tr.keepComments = true;
	tr.keepDocs = true;
	tr.keepWhite = true;
	
	this.tokens = tr.tokenize(new JSDOC.TextStream(src));
	
	if (!charset) charset = "utf-8";
	
	this.header = "<html><head><meta http-equiv='content-type' content='text/html; charset="+charset+"'>\n\
	<script type='text/javascript' >\n\
	window.onload=function(){\n\
	    var num = document.getElementById(location.hash.replace(/^#/,''));\n\
	    if (num) {\n\
	        num.style.color = '"+JsHilite.styles.selLineColor+"';\n\
	        num.style.backgroundColor = '"+JsHilite.styles.selLineBgColor+"';\n\
	    }\n\
	}\n\
	</script>\n\
	<style>\n\
	body, pre {"+JsHilite.styles.body+"}\n\
	.KEYW {"+JsHilite.styles.keyWord+"}\n\
	.COMM {"+JsHilite.styles.comment+"}\n\
	.NUMB {"+JsHilite.styles.number+"}\n\
	.STRN {"+JsHilite.styles.string+"}\n\
	.REGX {"+JsHilite.styles.regExp+"}\n\
	.line {"+JsHilite.styles.lineNum+"}\n\
	.doccmt {"+JsHilite.styles.docCmt+"}\n\
	.doctag {"+JsHilite.styles.docTag+"}\n\
	.spacer {height:6px;overflow:hidden;}\n\
	</style></head>\n\
	<body lang='"+JsHilite.lang+"'><div class='spacer'><span class='line'>&nbsp;&nbsp;&nbsp;&nbsp;</span></div><pre>";
	this.footer = "</pre><div class='spacer'><span class='line'>&nbsp;&nbsp;&nbsp;&nbsp;</span></div></body></html>";
	this.showLinenumbers = true;
	
	if (!defined(JsHilite._indent)) {
		var indent = "\t";
		if (JsHilite.tabToSpace > -1) {
			indent = "";
			for (var i=0;i<JsHilite.tabToSpace;i++) {
				indent += "&nbsp;";
			}
		}
		JsHilite._indent = indent;
	}
}

JsHilite.cache = {};

JsHilite.prototype.hilite = function() {
	var hilited = this.tokens.map(JsHilite._outToken).join("");
	
	hilited = hilited.replace(/<span class="COMM">\/\*\*/g, "<span class=\"doccmt\">/**");
	
	var replaceDocTag = function() {
				return arguments[1]+"<span class=\"doctag\">"+arguments[2]+"</span>";
			};
	hilited = hilited.replace(/<span class="doccmt">(.|\s)+?<\/span>/g,
					function(m) {
						m = m.replace(/(\s)(@\w+)/g, replaceDocTag);
						m = m.replace(/({)(@link)/g, replaceDocTag);
						return m;
					});
	hilited = hilited.replace(/\t/g, JsHilite._indent);
	
	var line = 1;
	if (this.showLinenumbers) {
		hilited = hilited.replace(/(^|\r\n|\r|\n)/g, function(m) {
						var filler = ((line<10)?" ":"")+((line<100)?" ":"")+((line<1000)?" ":"");
						return m+"<span id='line"+line+"' class='line'>"+filler+(line++)+"</span> ";
					});
	}
	
	return this.header+hilited+this.footer;
}

JsHilite._outToken = function(token) {
	return "<span class=\""+token.type+"\">"+token.data.replace(/</g, "&lt;")+"</span>";
};

//----------------------------------------------------------------------------------------

JsHilite.styles = {
	"body":    "font-family: 'MS Gothic',monospace; font-size: 12px; color:RGB(48,48,48); line-height: 14px; margin: 0px;",
	"keyWord": "color: RGB(0,160,255); font-weight:bold;",
	"docCmt":  "color: RGB(150,150,255)",
	"docTag":  "color: RGB(90,90,255)",
	"comment": "color: RGB(120,192,0)",
	"number":  "color: RGB(128,99,0)",
	"string":  "color: RGB(220,160,60)",
	"regExp":  "color: RGB(230,0,0)",
	"lineNum": "border-right: 1px dotted RGB(140,140,140); color: RGB(140,140,140); background-color: RGB(240,240,240); padding: 1px 1px 1px 3px;",
	"selLineColor":   "RGB(255,255,50)",
	"selLineBgColor": "RGB(255,140,0)"
};

JsHilite.tabToSpace = 4;
JsHilite.lang = "ja";

//JsDoc Toolkit original
//JsHilite.styles = {
//	"body":    "",
//	"keyWord": "color: #933",
//	"docCmt":  "color: #bbb; font-style: italic",
//	"docTag":  "color: #bbb; font-style: italic",
//	"comment": "color: #bbb; font-style: italic",
//	"number":  "color: #393",
//	"string":  "color: #393",
//	"regexp":  "color: #339",
//	"lineNum": "border-right: 1px dotted #666; color: #666; font-style: normal;"
//};
//JsHilite.tabToSpace = -1;
//JsHilite.lang = "en";

//----------------------------------------------------------------------------------------

//Overwrite JSDOC.DocComment#parse
JSDOC.DocComment.prototype.parse = (function(){
	var _parse = JSDOC.DocComment.prototype.parse;
	
	return function(comment) {
		this.originalComment = comment;
		return _parse.call(this, comment);
	};
	
})(); 