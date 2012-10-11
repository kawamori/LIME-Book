JSDOC.PluginManager.registerPlugin(
	"JSDOC.my.inlineBreak",
	{
		onDocCommentSrc: function(comment) {
			comment.src = comment.src.replace(/\*\*/ig, "\n");
		}
	}
);
