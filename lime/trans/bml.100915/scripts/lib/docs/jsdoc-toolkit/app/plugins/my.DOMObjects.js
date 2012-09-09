JSDOC.PluginManager.registerPlugin(
	"JSDOC.my.DOMObjects",
	{
		onSymbol: function(symbol) {
			if (symbol.is("FILE")) return;
			
			if (/^([^\.#-]+)([\.#-])(.+)$/.test(symbol.alias)) {
				var name = RegExp.$1;
				var sep  = RegExp.$2;
				var mem  = RegExp.$3;
				
//				LOG.warn(name+","+mem);
				
				if (this.objects.some(function($){return $===name})) {
				    if (!JSDOC.Parser.symbols.hasSymbol(name)) {
						var obj = new JSDOC.Symbol(name, [], "CONSTRUCTOR", new JSDOC.DocComment(""));
						obj.srcFile = " ";
						obj.desc = "HTML DOM object";
						obj.classDesc = "'"+name+"' is a HTML DOM Object related to an individual component of a HTML document.";
						obj.isBuiltin = function() { return(true); }
						
						JSDOC.Parser.addSymbol(obj);
					}
					
					symbol.alias = name + sep + mem;
				}
			}
		},
		
		onFinishedParsing: function(symbolSet) {
			for (var i=0;i<this.objects.length;i++) {
				var symbol = symbolSet.getSymbol(this.objects[i]);
				if (symbol) {
					if (!symbol.properties.length && !symbol.methods.length) {
						symbolSet.deleteSymbol(symbol.alias);
					}
				}
			}
		},
		
		objects: ['HTMLElement', 'CharacterData', 'Node', 'HTMLObjectElement' ]
		
	}
);
