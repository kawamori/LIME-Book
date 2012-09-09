// http://d.hatena.ne.jp/amachang/20071010
/*@cc_on
eval((function(props) {
  var code = [];
  for (var i = 0, l = props.length;i<l;i++){
    var prop = props[i];
    window['_'+prop]=window[prop];
    code.push(prop+'=_'+prop)
  }
  return 'var '+code.join(',');
})('document self top parent alert setInterval clearInterval setTimeout clearTimeout'.split(' ')));
@*/
//--------------------------------------------------------------------------//
var Mastery = {};
(function() {
  var includes   =[
    'extension', 'system.sound'
  ];

  // load libraries
  (function(script) {
    Mastery.scriptPath = script.src.replace(/[^\/]+\.js.*$/, '');
    
    includes.each(function(name) {
      document.write('<script type="text/javascript" src="' + Mastery.scriptPath + name + '.js"></script>');
    });
  })($A(document.getElementsByTagName('head')[0].getElementsByTagName('script')).find(function(script) {
    return (script.src && (/soundtest\.js(\?.*)?$/).test(script.src));
  }));

  Object.extend(Mastery, {
    dataPath   : './data/',
    loginUrl   : './cgi/login.cgi',
    sessionID  : ''
  });

  Event.observe(window, 'load', function() {
    Mastery.Sound.swf = Mastery.scriptPath + 'SoundManager.swf';
    Mastery.Sound._debug = function(str) {
      console.debug(str);
    };
    Mastery.Sound.onload = function() {

      var test = {
//        sound : { file : './data/sound/town/inn.mp3', id : 'system.manager.loading' }
//        sound : { file : './data/sound/town/guild.mp3', id : 'test.sound' }
//        sound : { file : './data/sound/system/login.mp3', id : 'test.sound' }
//        sound : { file : './data/sound/town/town.mp3', id : 'test.sound' }
        sound : { file : './data/sound/system/title.mp3', id : 'test.sound', loopTo : 27621 }
      };

      Event.observe(document, 'keydown', function(event) {
        if (event.isReturn() || event.isSpace()) {
          (Mastery.Sound.playing(test.sound.id)) ?
            Mastery.Sound.pause(test.sound.id) : Mastery.Sound.resume(test.sound.id);
        }
      }.bindAsEventListener(this));

      Mastery.Sound.createSound(test.sound.id, test.sound.file, {
        loop     : true,
        autoPlay : true,
        loopTo   : test.sound.loopTo,
        volume   : 0.3
      });
    };

    Mastery.Sound.loadSwf();
  }.bindAsEventListener(this));
})();
