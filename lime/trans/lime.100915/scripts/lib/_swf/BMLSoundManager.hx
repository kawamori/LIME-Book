import flash.display.MovieClip;
import flash.Lib;
//sound
import flash.events.SampleDataEvent;
import flash.utils.ByteArray;
import flash.media.SoundChannel;
import flash.media.SoundTransform;
import flash.media.SoundMixer;
import flash.media.Sound;
//video
import flash.media.Video;
import flash.net.NetConnection;
import flash.net.NetStream;
import flash.events.NetStatusEvent;
import flash.events.SecurityErrorEvent;
import flash.events.AsyncErrorEvent;
import flash.events.IOErrorEvent;
import flash.events.EventDispatcher;
import flash.media.SoundLoaderContext;

class BMLSoundManager extends MovieClip {

  public static var _this:            MovieClip;
  private var _hold:                  MovieClip;
  private var _nc:                    NetConnection;
  private var _media:                 Video;
  private var _ns:                    NetStream;
  private var _mediaSource:           String;
  private var _soundTransform:        SoundTransform;
  private var _started:               Bool;
        
  public static function main(): Void { _this = new BMLSoundManager(); }
  public function new() {
    super();
    
    _started     = false;

    _mediaSource   = 'http://127.0.0.1/_perlscripts/bmlParser/scripts/lib/sound/ehon.aac.mp3';
    _media         = new Video();
    _media.height  = 1;
    _media.width   = 1;
    _media.visible = false;

    _hold = new MovieClip();
    Lib.current.addChild(_hold);
    _hold.addChild(_media);
    _hold.x = _hold.y = 0;

    _nc = new NetConnection();
    _nc.addEventListener(NetStatusEvent.NET_STATUS,         netStatusHandler     );
    _nc.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler );
    _nc.addEventListener(IOErrorEvent.IO_ERROR,             ioErrorHandler       );
    _nc.connect(null);
    
  }
    
  private function netStatusHandler(event: NetStatusEvent):Void {
    switch (event.info.code) {
    case "NetStream.Play.StreamNotFound":
      trace("Stream not found: " + event.info.code);
      trace( "unfound video: " + _mediaSource );
    case "NetConnection.Connect.Success":
      if(_ns != null) {
        _ns.close();
        _ns = null;
      }
      _ns            = new NetStream(_nc);
      _ns.bufferTime = 3;
      _ns.addEventListener(NetStatusEvent.NET_STATUS,   netStatusHandler  );
      _ns.addEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler );
      _ns.addEventListener(IOErrorEvent.IO_ERROR,       ioErrorHandler    );
      _ns.client = this;
      _media.attachNetStream(_ns);
      _this.playMedia();
    case "NetStream.Play.Stop":
      //finished ?
    }
  }
  private function securityErrorHandler(event: SecurityErrorEvent ):Void { trace("securityErrorHandler: " + event); }
  private function asyncErrorHandler   (event: AsyncErrorEvent    ):Void { trace("asyncErrorHandler: " + event );   }
  private function ioErrorHandler      (event: IOErrorEvent       ):Void { trace("ioErrorHandler: " + event );      }
    
  public function playMedia() {
    if(_started) {
//      resumeMedia();
    } else {
      if(_ns != null && _mediaSource != null) {
        _started = true;
        _soundTransform = new SoundTransform();
        _ns.play(_mediaSource);
        trace(_ns);
//        _soundTransform = _ns.soundTransform;
      }
    }
  }
    
/*  private function restartVid( e ) {
    _media.visible = false;
    if( _ns != null )
      {
        _ns.pause();  
        _ns.seek(0);
        
      }
  }
  public function playAAC( e: Event ) {
    playMedia();
  }
  
  public function stopAAC( e: Event ) {
    pauseMedia();
  }
    
  public function resumeMedia():Void {
    _ns.resume();
  }
    
  public function pauseMedia():Void {
    _ns.pause();
  }*/
}
