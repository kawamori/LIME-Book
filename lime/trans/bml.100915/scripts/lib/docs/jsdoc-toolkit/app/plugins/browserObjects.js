JSDOC.PluginManager.registerPlugin(
	"aias.browserObjects",
	{
		onSymbol: function(symbol) {
			if (symbol.is("FILE")) return;
			
			if (/^([^\.#-]+)[\.#-](.+)$/.test(symbol.alias)) {
				var name = RegExp.$1;
				var mem  = RegExp.$2;
				
//				LOG.warn(name+","+mem);
				
				if (this.objects.some(function($){return $===name})) {
				    if (!JSDOC.Parser.symbols.hasSymbol(name)) {
						var obj = new JSDOC.Symbol(name, [], "CONSTRUCTOR", new JSDOC.DocComment(""));
						obj.srcFile = " ";
						obj.desc = "constructor cannot make this object.";
						obj.classDesc = "'"+name+"' is a built-in global object in browser.";
						
						JSDOC.Parser.addSymbol(obj);
					}
					
					symbol.alias = name + "#" + mem;
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
		
		objects: ["window", "document", "navigator", "frames", "screen", "location", "history" ]
		
	}
);
