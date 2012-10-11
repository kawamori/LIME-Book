import flash.events.Event;
import flash.events.TimerEvent;
import flash.events.IOErrorEvent;
import flash.external.ExternalInterface;
import flash.media.Sound;
//import flash.media.SoundChannel;
//import flash.media.SoundTransform;
import flash.net.URLRequest;
import flash.utils.Timer;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
private class BMLSound {
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function new(id:String, url:String) {
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function load(autoPlay:Bool) {
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function start() {
  }
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
class BMLSoundManager  {
  static var instance = null;
  static var jsBase   = '';
  static var debug    = true;

  private var ids    :Array<String>;
  private var objects:Hash<BMLSound>;
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function new() {
    this.ids     = new Array();
    this.objects = new Hash();

    
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  static function callJavaScript(funcName:String, ?p1, ?p2, ?p3, ?p4, ?p5) {
    ExternalInterface.call(funcName, p1, p2, p3, p4, p5);
  }
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  static function main() {
    if (instance == null) instance = new BMLSoundManager();

    callJavaScript('console.debug', "hoge");
    var timer:Timer = new Timer(1000);
    timer.addEventListener(TimerEvent.TIMER, untyped {
      function() {
        var sound:Sound = new Sound();
        sound.addEventListener(Event.COMPLETE, function(event:Event) {
          callJavaScript('console.debug', 'loaded');
          callJavaScript('console.debug', sound.length+'[ms]');
          sound.play();
        });
        sound.addEventListener(IOErrorEvent.IO_ERROR, function(event:Event) {
          callJavaScript('console.debug', 'error:'+event);
        });
        
//        sound.load(new URLRequest('../sound/ehon.aac'));
        sound.load(new URLRequest('../sound/focus.mp3'));
        timer.stop();
      };
    });
    timer.start();
  }
}
