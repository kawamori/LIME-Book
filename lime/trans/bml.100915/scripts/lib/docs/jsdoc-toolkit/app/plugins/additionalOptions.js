JSDOC.PluginManager.registerPlugin(
	"aias.additionalOptions",
	{
		onInit: function(opts) {
			JSDOC.Parser.conf.ignoreAnonymous = !(opts.D.anonymous=="true"||opts.D.anonymous==true);
			JSDOC.Parser.conf.treatUnderscoredAsPrivate = !(opts.D.A=="true"||opts.D.A==true);
			JSDOC.Parser.conf.explain = (opts.D.shortExplain=="true"||opts.D.shortExplain==true);

//LOG.warn("ignoreAnonymous = "+JSDOC.Parser.conf.ignoreAnonymous);
//LOG.warn("treatUnderscoredAsPrivate = "+JSDOC.Parser.conf.treatUnderscoredAsPrivate);
//LOG.warn("explain = "+JSDOC.Parser.conf.explain);
			
		}
	}
);
