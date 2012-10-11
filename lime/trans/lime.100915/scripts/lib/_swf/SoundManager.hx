import flash.events.Event;
import flash.events.TimerEvent;
import flash.events.IOErrorEvent;
import flash.external.ExternalInterface;
import flash.media.Sound;
import flash.media.SoundChannel;
import flash.media.SoundTransform;
import flash.net.URLRequest;
import flash.utils.Timer;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
private class SoundObject {
  private static var firstLoopMargin:Float    =  300.0;
  private static var loopMargin:Float         =  250.0;
  private static var resumeMargin:Float       =  150.0;
//  private static var firstLoopMargin:Float    =    0.0;
//  private static var loopMargin:Float         =    0.0;
//  private static var resumeMargin:Float       =    0.0;
  private static var posCheckInterval:Float   =  500.0;
  private static var fadeoutSpan:Float        =   20.0;
  private static var defFadeoutInterval:Float = 1000.0;
  private static var minFadeoutInterval:Float =  500.0;
  private static var STATUS_STOP:Int          =  0;
  private static var STATUS_PLAY:Int          =  1;
  private static var STATUS_PAUSE:Int         =  2;
  private static var STATUS_FADEOUT:Int       = -1;
  
  public var id          : String;
  public var url_        : URLRequest;
  public var volume      : Float;
  public var pan         : Float;
  public var loaded      : Bool;
  public var autoPlay    : Bool;

  public var channel     : SoundChannel;
  public var position    : Float;
  public var status      : Int;

  public var current     : Sound;
  public var next        : Sound;

  public var timer       : Timer;
  public var loop        : Bool;
  public var loopTo      : Float;
  public var isFirstLoop : Bool;

  public var fadeoutTimer    : Timer;
  public var fadeoutStart    : Float;
  public var fadeoutInterval : Float;

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function new(id:String, url:String) {
    this.id              = id;
    this.url_            = new URLRequest(url);
    this.volume          = 1.0;
    this.pan             = 0;
    this.loaded          = false;
    this.autoPlay        = false;

    this.channel         = null;
    this.position        = 0.0;
    this.status          = SoundObject.STATUS_STOP;
    
    this.current         = null;
    this.next            = null;

    this.timer           = null;
    this.loop            = false;
    this.loopTo          = 0.0;
    this.isFirstLoop     = true;

    this.fadeoutTimer    = null;
    this.fadeoutStart    = 0.0;
    this.fadeoutInterval = SoundObject.defFadeoutInterval;
    
    SoundManager.debuglog('create sound object:' + this + '(' + this.url_.url + ')');
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function load(autoPlay:Bool) {
    this.autoPlay = autoPlay;

    if (this.loaded) return(true);
    this.loaded = true;

    var soundObj = this;
    this.current = new Sound();
    this.current.addEventListener(Event.COMPLETE, function(event:Event) {
      SoundManager.debuglog('load complate:' + soundObj);
      SoundManager.callJScript('onSoundLoaded', soundObj.id);

      if (soundObj.loop) {
        // I anticipate flash/browser cache:-(
        soundObj.next = new Sound();
        soundObj.next.load(soundObj.url_);
      };
      
      if (soundObj.autoPlay) soundObj.start();
    });
    this.current.addEventListener(IOErrorEvent.IO_ERROR, function(event:Event) {
      SoundManager.debuglog('load failed:' + soundObj);
      SoundManager.callJScript('onSoundLoadFailed', soundObj.id);
    });
    this.current.load(this.url_);

    SoundManager.debuglog('load:' + this);
    return(true);
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function start() {
    if (!this.loaded || this.current.isBuffering) {
      SoundManager.debuglog('not loaded yet:' + this + ' => load & autoPlay');
      return((!this.loaded)? this.load(true) : true);
    };
//    if (this.status > SoundObject.STATUS_STOP) return(true);

    if (this.timer != null) this.timer.stop();
    if (this.fadeoutTimer != null) this.fadeoutTimer.stop();
    if (this.channel != null) this.channel.stop();

    this.status = SoundObject.STATUS_PLAY;
    this.isFirstLoop = true;
    this.playCurrentSound(0.0);
    
    SoundManager.debuglog('play' + ((this.loop)? '(loop)' : '') + ':' +
                            this + '(' + this.current.length + ' ms)');
    return(true);
  }
  public function playing() {
    return(this.status == SoundObject.STATUS_PLAY);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function playCurrentSound(pos:Float) {
    pos = Math.max(0.0, pos);
    
    if (this.loop) {
      this.channel = this.current.play((pos > 0) ? pos : ((this.isFirstLoop) ? 0 : this.loopTo));
      this.setVolume(this.volume);

      this.prepareNextLoop(pos);

    } else {
      this.channel = this.current.play(pos);
      this.setVolume(this.volume);

      var soundObj:SoundObject = this;
      channel.addEventListener(Event.SOUND_COMPLETE, function(event:Event) {
        soundObj.status = SoundObject.STATUS_STOP;
        SoundManager.debuglog('sound complate:' + soundObj);
        SoundManager.callJScript('onSoundComplete', soundObj.id);
      });
    }
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function prepareNextLoop(pos:Float) {
    SoundManager.debuglog('prepare(swap):prepareNextLoop');
    if (this.timer != null) this.timer.stop();

    var soundObj:SoundObject = this;

    var swapPos = this.current.length -
      ((this.isFirstLoop) ? SoundObject.firstLoopMargin :
       ((pos > 0) ? SoundObject.resumeMargin : SoundObject.loopMargin));

    var swapFunc = function() {
      SoundManager.debuglog('prepare(swap):' + swapPos + ' channelPos:' + soundObj.channel.position);
      var tmp = soundObj.current;
      soundObj.current = soundObj.next;
      soundObj.next = tmp;
      soundObj.channel.stop();
      
      soundObj.isFirstLoop = false;
      soundObj.playCurrentSound(0.0);
    };

    this.timer = new Timer(SoundObject.posCheckInterval);
    this.timer.addEventListener(TimerEvent.TIMER, untyped {
      function() {
        var diff = swapPos - soundObj.channel.position;

        SoundManager.debuglog('prepare(swap):diff:' + diff);
        if (diff < 0) {
          soundObj.timer.stop();
          soundObj.timer = null;
          swapFunc();
        } else if (diff < SoundObject.posCheckInterval * 2) {
          soundObj.timer.stop();
          soundObj.timer = new Timer(diff, 1);
          soundObj.timer.addEventListener(TimerEvent.TIMER_COMPLETE, untyped {
            function() {
              swapFunc();
            };
          });
          soundObj.timer.start();
        };
      };
    });
    this.timer.start();
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function finish() {
    if (this.timer != null) this.timer.stop();
    if (this.fadeoutTimer != null) this.fadeoutTimer.stop();
    if ((this.status == SoundObject.STATUS_STOP) || (this.channel == null)) return(false);
    this.channel.stop();
    this.status = SoundObject.STATUS_STOP;

    SoundManager.debuglog('stop:' + this);
    SoundManager.callJScript('onSoundStopped', this.id);
    return(true);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function pause() {
    if (this.status != SoundObject.STATUS_PLAY) return(false);

    if (this.timer != null) this.timer.stop();
    this.position = this.channel.position;
    this.channel.stop();
    this.status = SoundObject.STATUS_PAUSE;

    SoundManager.debuglog('pause:' + this + '(' + this.position + ' ms)');
    return(true);
  }
  public function resume() {
    if (this.status != SoundObject.STATUS_PAUSE) return(false);

    this.position = Math.max(0.0, this.position);
    SoundManager.debuglog('resume:' + this + '(' + this.position + ' ms)');
    this.status = SoundObject.STATUS_PLAY;
    this.playCurrentSound(this.position);
    
    return(true);
  }
  public function isPaused() {
    return(this.status == SoundObject.STATUS_PAUSE);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function fadeOut(?interval:Float) {
    if (this.status <= 0) return(false);
    this.status = SoundObject.STATUS_FADEOUT;

    this.fadeoutStart = Date.now().getTime();
    this.fadeoutInterval = (interval != null) ?
      Math.max(SoundObject.minFadeoutInterval, interval) : SoundObject.defFadeoutInterval;

    var soundObj:SoundObject = this;
    var _doFadeout = function() {
      var t = soundObj.fadeoutInterval - (Date.now().getTime() - soundObj.fadeoutStart);
      if (t > 0) {
        if (soundObj.channel != null) {
          var transform:SoundTransform = soundObj.channel.soundTransform;
          transform.volume = soundObj.volume * t / soundObj.fadeoutInterval;
          soundObj.channel.soundTransform = transform;
        };
      } else {
        soundObj.fadeoutTimer.stop();
        SoundManager.debuglog('fadeout finished:' + soundObj);
        SoundManager.callJScript('onFadeoutComplete', soundObj.id);
        soundObj.finish();
      };
    };
    
    this.fadeoutTimer = new Timer(SoundObject.fadeoutSpan);
    this.fadeoutTimer.addEventListener(TimerEvent.TIMER, untyped { _doFadeout; });
    this.fadeoutTimer.start();
    
    
    SoundManager.debuglog('fadeout:' + this);
    return(true);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function setVolume(volume:Float) {
    this.volume = Math.min(Math.max(0, volume), 1.0);

    if (this.channel != null) {
      var transform:SoundTransform = this.channel.soundTransform;
      transform.volume = this.volume;
      this.channel.soundTransform = transform;
    };
    return(true);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function toString() {
    return('["' + this.id + '"]');
  }
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
class SoundManager  {
  static var instance = null;
  static var jsBase   = 'Mastery.Sound';
  static var debug    = true;
  
  public var IDs:Array<String>;
  public var soundObjects:Hash<SoundObject>;
  public var checkTimer:Dynamic;
  public var checkInterval:Int;
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public function new() {
    this.IDs           = new Array();
    this.soundObjects  = new Hash();
    this.checkTimer    = null;
    this.checkInterval = 10;

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // security settings
//    ExternalInterface.addCallback('setDomain', function(domain) {
//      debuglog("Security.allowDomain:[" + domain + "]");
//      flash.system.Security.allowDomain(domain);
//      });
//    callJScript('_getDomain');
    
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    ExternalInterface.addCallback('create', function(id:String, url:String, ?loop:Bool, ?loopTo:Float) {
      var obj:SoundObject = new SoundObject(id, url);
      obj.loop = loop;
      obj.loopTo = loopTo;

      instance.soundObjects.set(id, obj);
      instance.IDs.push(id);
      instance.soundObjects.get(id); // because of haxe's compile error, we needs this line..., why?
    });

    ExternalInterface.addCallback('setVolume', function(id:String, volume:Float) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.setVolume(volume));
    });

    // callback function name 'play' will cause some errors on IE(at least IE7)
    ExternalInterface.addCallback('start', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.start());
    });
    ExternalInterface.addCallback('_playing', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.playing());
    });
    // callback function name 'stop' will cause some errors on IE(at least IE7)
    ExternalInterface.addCallback('finish', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.finish());
    });
    ExternalInterface.addCallback('pause', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.pause());
    });
    ExternalInterface.addCallback('resume', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.resume());
    });
    ExternalInterface.addCallback('isPaused', function(id:String) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.isPaused());
    });

    ExternalInterface.addCallback('fadeOut', function(id:String, ?interval:Float) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.fadeOut(interval));
    });

    ExternalInterface.addCallback('load', function(id:String, autoPlay:Bool) {
      var obj:SoundObject = instance.soundObjects.get(id);
      return((obj != null) && obj.load(autoPlay));
    });

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    debuglog('initialized');
    callJScript('_swfInitialized');
  }

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public static function callJScript(name:String, ?arg1, ?arg2, ?arg3) {
    ExternalInterface.call(jsBase + "['" + name + "']", arg1, arg2, arg3);
  }

  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  public static function debuglog(str) {
    if (!debug) return;
    callJScript('_debug', "(SoundManager): " + str);
  }
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  static function main() {
    if (instance == null) instance = new SoundManager();
  }
}
