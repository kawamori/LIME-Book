// File named: AACtest.hx
// author: JLM at justinfront
// 20 Jan 2009
import flash.display.MovieClip;
import flash.Lib;
import flash.events.MouseEvent;
import flash.events.Event;
import flash.display.BitmapData;
import flash.display.Bitmap;
import flash.geom.Point;
import flash.geom.Rectangle;
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

class AACtest extends MovieClip
{
    
    public static var _this:            MovieClip;
    private var play_mc:                MovieClip;
    private var play_bitmapData:        BitmapData;
    private var pause_bitmapData:       BitmapData;
    private var playSkin_bitmap:        BitmapData;
    private var _hold:                  MovieClip;
    private var _nc:                    NetConnection;
    private var _media:                 Video;
    private var _ns:                    NetStream;
    private var _mediaSource:           String;
    private var _soundTransform:        SoundTransform;
    private var _started:               Bool;
    private var _sound_ns:              NetStream;
    private var _media_sound:           Sound;
    private var _infoObject:            Dynamic;
        
    public inline static var _red_:     Int             = 0x993333;
    public inline static var _black_:   Int             = 0x2a2a2a;
    public var close_mc:                MovieClip;
    
    public static function main(): Void { _this = new AACtest(); } public function new()
    {
        
        super();
        
        _started    = false;
        createPlayBtn();
        _mediaSource = 'showMusic.mp3';//'showMusic.m4a';//'vid.mov';
        _nc = new NetConnection();
        _media = new Video();
        _media.height = 1;
        _media.width = 1;
        _media.visible = false;
        _hold = new MovieClip();
        Lib.current.addChild( _hold );
        _hold.addChild( _media );
        _hold.x = 170;
        _hold.y = 40;
        _nc.addEventListener( NetStatusEvent.NET_STATUS,            netStatusHandler );
        _nc.addEventListener( SecurityErrorEvent.SECURITY_ERROR,    securityErrorHandler );
        _nc.addEventListener( IOErrorEvent.IO_ERROR,                ioErrorHandler );
        _nc.connect( null );
        
    }
    
    private function restartVid( e )
    {
        
        _media.visible = false;
        if( _ns != null )
        {
            _ns.pause();  
            _ns.seek(0);
            
        }
        
    }
    
    private function netStatusHandler( event: NetStatusEvent ):Void 
    {
        
        switch ( event.info.code ) 
        {
            case "NetStream.Play.StreamNotFound":
                trace("Stream not found: " + event.info.code);
                trace( "unfound video: " + _mediaSource );
                
            case "NetConnection.Connect.Success":
                if( _ns != null )
                {
                    _ns.close();
                    _ns = null;
                }
                
                _ns                 = new NetStream( _nc );
                _ns.bufferTime      = 3;
                
                _ns.addEventListener( NetStatusEvent.NET_STATUS,    netStatusHandler );
                _ns.addEventListener( AsyncErrorEvent.ASYNC_ERROR,  asyncErrorHandler );
                _ns.addEventListener( IOErrorEvent.IO_ERROR,        ioErrorHandler );
                _ns.client          = this;
                //_media.attachNetStream( _ns );
                
            case "NetStream.Play.Stop":
                //finished ?
                
        }
        
    }
    
    
    public function playAAC( e: Event )
    {
        
        playSkin_bitmap.draw( pause_bitmapData.clone() );
        playMedia();
        play_mc.removeEventListener(    MouseEvent.MOUSE_DOWN, playAAC );
        play_mc.addEventListener(       MouseEvent.MOUSE_DOWN, stopAAC );
        
    }
    
    public function stopAAC( e: Event )
    {
        
        playSkin_bitmap.draw( play_bitmapData.clone() );
        pauseMedia();
        play_mc.removeEventListener(    MouseEvent.MOUSE_DOWN, stopAAC );
        play_mc.addEventListener(       MouseEvent.MOUSE_DOWN, playAAC );
    }
    
    private function playMedia()
    {
        
        if( _started )
        {
            resumeMedia();
        }
        else
        {
            if( _ns != null && _mediaSource != null )
            {
                _started = true;
                _soundTransform = new SoundTransform();
                _ns.play( _mediaSource );
            }
        }
        
    }
    
    public function resumeMedia():Void
    {
        
        _ns.resume();
        
    }
    
    public function pauseMedia():Void
    {
        
        _ns.pause();
        
    }
    
    private function securityErrorHandler( event: SecurityErrorEvent ):Void {   trace("securityErrorHandler: " + event);    }
    private function asyncErrorHandler( event: AsyncErrorEvent ):Void {         trace("asyncErrorHandler: " + event );      }
    private function ioErrorHandler( event: IOErrorEvent ):Void{                trace("ioErrorHandler: " + event );      }
    
    public function copyToBitmapWithTransparency( mc: MovieClip ): BitmapData
    {
        
        var wide:       Int             = Std.int( mc.width );
        var hi:         Int             = Std.int( mc.height );
        
        var point:      Point           = new Point( 0, 0 );
        var rect:       Rectangle       = new Rectangle( 0 , 0, wide, hi );
        var abitmap:    BitmapData      = new BitmapData( wide, hi, true, 0x0000000 );
        abitmap.draw( mc );
        abitmap.copyPixels( abitmap, rect, point, abitmap, point, false );
        return abitmap;
    
    }
    
    //client should these be private??
    
    public function onCuePoint( infoObject: Dynamic ):Void {    onSubtitle( infoObject.name );  }
    public function onTextData( infoObject: Dynamic ):Void {     onSubtitle( infoObject.text );  }
    public function onSubtitle( sub: String ):Void{             trace( sub );                   }
    
    public function onMetaData( infoObject: Dynamic ):Void 
    {
        
        if( _media.visible )
        {
            
            _infoObject = infoObject;
            
        }
        
    }
    
    private function createPlayBtn()
    {
        
        play_mc = new MovieClip();
        play_mc.x = 170;
        play_mc.y = 40;
        Lib.current.addChild( play_mc );
        play_mc.graphics.clear();
        play_mc.graphics.lineStyle( 0, _red_, 1 );
        play_mc.graphics.beginFill( _red_, 1 );
        play_mc.graphics.lineTo( 18, 0 );
        play_mc.graphics.lineTo( 18, 16 );
        play_mc.graphics.lineTo( 0, 16 );
        play_mc.graphics.lineTo( 0, 0 );
        play_mc.graphics.endFill();
        
        play_mc.graphics.lineStyle( 0, _black_, 1 );
        play_mc.graphics.beginFill( _black_, 1 );
        play_mc.graphics.moveTo( 4, 4 );
        play_mc.graphics.lineTo( 4+3, 4 );
        play_mc.graphics.lineTo( 4+3, 12 );
        play_mc.graphics.lineTo( 4, 12 );
        play_mc.graphics.lineTo( 4, 4 );
        play_mc.graphics.endFill();
        
        play_mc.graphics.beginFill( _black_, 1 );
        play_mc.graphics.moveTo( 4+3+3, 4 );
        play_mc.graphics.lineTo( 4+3+3+3, 4 );
        play_mc.graphics.lineTo( 4+3+3+3, 12 );
        play_mc.graphics.lineTo( 4+3+3, 12 );
        play_mc.graphics.lineTo( 4+3+3, 4 );
        play_mc.graphics.endFill();
        
        pause_bitmapData = copyToBitmapWithTransparency( play_mc );
        
        play_mc.graphics.clear();
        
        play_mc.graphics.clear();
        play_mc.graphics.lineStyle( 0, _black_, 1 );
        play_mc.graphics.beginFill( _black_, 1 );
        play_mc.graphics.lineTo( 18, 0 );
        play_mc.graphics.lineTo( 18, 16 );
        play_mc.graphics.lineTo( 0, 16 );
        play_mc.graphics.lineTo( 0, 0 );
        play_mc.graphics.endFill();
        
        play_mc.graphics.lineStyle( 0, _red_, 1 );
        play_mc.graphics.beginFill( _red_, 1 );
        play_mc.graphics.moveTo( 5, 2 );
        play_mc.graphics.lineTo( 16, 8 );
        play_mc.graphics.lineTo( 5, 14 );
        play_mc.graphics.endFill();
          
        play_bitmapData = copyToBitmapWithTransparency( play_mc );
        
        playSkin_bitmap = new BitmapData( 18, 16, true, 0x00000 );
        play_mc.addChild( new Bitmap( playSkin_bitmap ) );
        playSkin_bitmap.draw( play_bitmapData );
        play_mc.graphics.clear();
        play_mc.mouseChildren   = false;
        play_mc.buttonMode      = true;
        
        play_mc.addEventListener( MouseEvent.MOUSE_DOWN, playAAC );
        
    }
}
