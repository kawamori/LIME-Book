JSDOC.PluginManager.registerPlugin(
	"aias.symbolExtensions",
	{
		onSymbol: function(symbol) {

			// @interface
			var interfaces = symbol.comment.getTag("interface");
			if (interfaces.length) {
				symbol.isa = "CONSTRUCTOR";
				symbol.isInterface = true;
				symbol.classDesc = interfaces[0].desc;

				symbol.implementers = this.implementers[symbol.alias] || [];
				delete this.implementers[symbol.alias];
			}

			// @implements
			symbol.interfaces = [];
			symbol.inheritedInterfaces = [];

			var interfaces = symbol.comment.getTag("implements");
			if (interfaces.length) {
				var allInterfaces = [];
				for (var i=0;i<interfaces.length;i++) {
					if (!interfaces[i].desc) continue;
					var interfac = interfaces[i].desc.split(/\s*,\s*/);
					allInterfaces = allInterfaces.concat(interfac);
				}
				symbol.interfaces = allInterfaces;

				for (var i=0;i<allInterfaces.length;i++) {
					var alias = allInterfaces[i];
					var interfac = JSDOC.Parser.symbols.getSymbol(alias);
					if (interfac) {
						interfac.implementers.push(symbol.alias);
					}
					else {
						if (!this.implementers[alias]) this.implementers[alias] = [];
						this.implementers[alias].push(symbol.alias);
					}
				}
			}

			// @staticClass
			var staticClasses = symbol.comment.getTag("staticClass");
			if (staticClasses.length) {
				symbol.isa = "CONSTRUCTOR";
				symbol.isStaticClass = true;
				symbol.classDesc = staticClasses[0].desc;
			}

			// It is static class, too.
			if (symbol.is("CONSTRUCTOR") && symbol.isStatic) {
				symbol.isNamespace = false;
				symbol.isStaticClass = true;
			}


			// @abstactClass
			var abstractClasses = symbol.comment.getTag("abstractClass");
			if (abstractClasses.length) {
				symbol.isa = "CONSTRUCTOR";
				symbol.isAbstractClass = true;
				symbol.classDesc = abstractClasses[0].desc;
			}

			// @abstract
			var abstracts = symbol.comment.getTag("abstract");
			if (abstracts.length) {
				if (symbol.is("CONSTRUCTOR")) {
					symbol.isAbstractClass = true;
				}
				else {
					symbol.isAbstract = true;
				}
			}

			// @virtualClass
			var virtualClasses = symbol.comment.getTag("virtualClass");
			if (virtualClasses.length) {
				symbol.isa = "CONSTRUCTOR";
				symbol.isVirtualClass = true;
				symbol.classDesc = virtualClasses[0].desc;
			}


			//While processing for @property tag has bug, modify result.
			if (symbol.is("CONSTRUCTOR") || symbol.isNamespace) {
				var properties = symbol.comment.getTag("property");
				if (properties.length) {
					var symbolAlias = symbol.alias + "#";
					var thisProperties = symbol.properties;
					for (var i=0;i<properties.length;i++) {
						var prop = properties[i];
						var alias = symbolAlias + prop.name;
						var propSymbol = JSDOC.Parser.symbols.getSymbol(alias);
						if (propSymbol) {
							//is private?
							if (JSDOC.Parser.conf.treatUnderscoredAsPrivate && prop.name.indexOf("_")===0) {
								if (!JSDOC.opt.p) {
									JSDOC.Parser.symbols.deleteSymbol(alias);
									for (var j=0;j<thisProperties.length;j++) {
										if (thisProperties[j].name===prop.name) {
											thisProperties.splice(j,1);
											break;
										}
									}
								}
								else {
									propSymbol.isPrivate = true;
								}
							}

							propSymbol.memberOf = symbolAlias;
						}
					}
				}
			}

			// @constant
			var constants = symbol.comment.getTag("constant");
			if (constants.length) {
				symbol.isConstant = true;

				var constant = constants[0];

				//Resolve type.
				if (constant.type!="") symbol.type = constant.type;

				//Resolve constnatValue and desc.
				if (constant.desc!="") {
					var desc = symbol.constantValue = constant.desc;

					if (constant.type!="" || /^\(.*\).*/.test(desc)) {
						var ret = desc.match(/^(\([^)]*\))?\s*([\S\s]*)$/);
						if (ret) {
							symbol.constantValue = ret[1]?ret[1].replace(/\(\s*([^)]*)\s*\)$/,"$1"):"";
							if (ret[2]) symbol.desc = ret[2];
						}

					//LOG.warn(symbol.type+","+symbol.constantValue+","+symbol.desc);

					}
				}
			}

			// @field
			var fields = symbol.comment.getTag("field");
			if (fields.length) {
				for (var i=0;i<fields.length;i++) {
					var field = fields[i];
					var ret = field.desc.match(/^(\([^)]*\))?\s*([\S\s]*)$/);
					if (!ret) continue;

					if (ret[1]) field.defaultValue = ret[1].replace(/\(\s*([^)]*)\s*\)$/,"$1");
					field.desc = ret[2] || "";

//					if (i===0) {
					if (i===0 && symbol.desc=="") {
						if (field.defaultValue) symbol.defaultValue = field.defaultValue;
						if (field.desc)         symbol.desc = field.desc;
						if (field.type)         symbol.type = field.type;
					}
					else {
						if (!field.desc) continue;
						var ret = field.desc.match(/\.(\S+)\s+([\S\s]*)/);
						if (!ret) continue;

						field.name = ret[1];
						field.desc = ret[2] || "";

						if (!symbol.properties) symbol.properties = [];
						symbol.properties.push(field);
					}
				}
			}

			// @protected
			symbol.isProtected = false;
			var protecteds = symbol.comment.getTag("protected");
			if (protecteds.length) {
				symbol.isProtected = true;
				symbol.isInner = false;
				symbol.isPrivate = false;
			}

			// @todo
			symbol.todos = [];
			var todos = symbol.comment.getTag("todo");
			if (todos.length) {
				symbol.todos = todos.map(function($){ return $.desc });
			}

			// @readOnly, @readonly
			if (!symbol.is("CONSTRUCTOR") && !symbol.is("FUNCTION") && !symbol.isConstant &&
			     symbol.memberOf!="_global_" && !symbol.isPrivate) {
				var readOnly = symbol.comment.getTag("readOnly").concat(symbol.comment.getTag("readonly"));
				if (readOnly.length) {
					symbol.isReadOnly = true;
				}
			}

			// Set inheritedTo property to symbol.
			if (symbol.is("CONSTRUCTOR") && !symbol.inheritedTo) symbol.inheritedTo = [];

			if (JSDOC.Symbol.__inheritedTo) {
				var inheritedItems = JSDOC.Symbol.__inheritedTo[symbol.alias];
				if (inheritedItems) {
					symbol.inheritedTo = inheritedItems;
					delete JSDOC.Symbol.__inheritedTo[symbol.alias];
				}
			}

			var augments = symbol.augments;
			for (var i=0,cnt=augments.length;i<cnt;i++) {
				var augmentAlias = augments[i].desc;
				var augmentSymbol = JSDOC.Parser.symbols.getSymbol(augmentAlias);
				if (augmentSymbol) {
					if (!augmentSymbol.inheritedTo) augmentSymbol.inheritedTo = [];
					augmentSymbol.inheritedTo.push(symbol.alias);
				}
				else {
					if (!JSDOC.Symbol.__inheritedTo) JSDOC.Symbol.__inheritedTo = {};
					if (!JSDOC.Symbol.__inheritedTo[augmentAlias]) JSDOC.Symbol.__inheritedTo[augmentAlias] = [];
					JSDOC.Symbol.__inheritedTo[augmentAlias].push(symbol.alias);
				}
			}
		},

		onFinishedParsing: function(symbolSet) {
			var allSymbols = symbolSet.toArray();

			var complMap = {};
			for (var i=0,l=allSymbols.length;i<l;i++) {
				var symbol = allSymbols[i];
				if (!symbol.is("CONSTRUCTOR") || symbol.isNamespace || symbol.isInterface) continue;

				collectInheritedInterfaces(symbol, complMap);

				redefineAbstractClass(symbol);

			}

			//Traverses the inherited classes Recursively, create a non-overlapping list of
			//all the interfaces implemented by this class.
			function collectInheritedInterfaces(symbol, complMap) {
				if (complMap[symbol.alias]) return;

				for (var i=0,l=symbol.augments.length;i<l;i++) {
					var aug = symbolSet.getSymbol(symbol.augments[i]);
					if (!aug) continue;

					arguments.callee(aug, complMap);

					aug.interfaces.concat(aug.inheritedInterfaces).forEach(function($) {
						if ((symbol.inheritedInterfaces.indexOf($)===-1)) {
							symbol.inheritedInterfaces.push($);

							var intfc = symbolSet.getSymbol($);
							if (intfc && intfc.implementers.indexOf(symbol.alias)===-1) {
								intfc.implementers.push(symbol.alias);
							}
						}
					});
				}

				//delete duplication
				symbol.interfaces = symbol.interfaces.filter(function($) {
					return (symbol.inheritedInterfaces.indexOf($)===-1);
				});

				complMap[symbol.alias] = true;
			}

			//Class with abstract members is redefined as an abstract class.
			function redefineAbstractClass(symbol) {
				if (symbol.isAbstractClass) return;

				var isAbstract = function($) { return $.isAbstract };
				if (symbol.properties.some(isAbstract)) {
					symbol.isAbstractClass = true;
					return;
				}
				if (symbol.methods.some(isAbstract)) {
					symbol.isAbstractClass = true;
					return;
				}
			}

		},
		implementers: {}
	}
);

