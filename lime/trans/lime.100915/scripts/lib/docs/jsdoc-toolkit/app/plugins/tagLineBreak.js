JSDOC.PluginManager.registerPlugin(
	"aias.tagLineBreak",
	{
		onDocCommentSrc: function(comment) {
			comment.src = comment.src.replace(/\s+?@/g, "\n@");
		}
	}
);
