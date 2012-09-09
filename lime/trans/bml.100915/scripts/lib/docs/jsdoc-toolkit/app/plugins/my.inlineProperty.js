JSDOC.PluginManager.registerPlugin(
  "JSDOC.my.inlineProperty", {
    onDocCommentSrc: function(comment) {
      var src = comment.src;
      if (/\s+\@propertyEx\s+/.test(src)) {
        src = RegExp.leftContext;
        var terms = RegExp.rightContext.split('|');
        src += ((terms[0] != '') ? ' @name '    + terms[0] : '') +
               ((terms[1] != '') ? ' @type '    + terms[1] : '') +
               ((terms[2] != '') ? ' @default ' + terms[2] : '');
        comment.src = src;
       }
    }
  }
);
