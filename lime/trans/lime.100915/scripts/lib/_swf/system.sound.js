//--------------------------------------------------------------------------//
Mastery.Sound = {
  id          : '_sound_manager_object_',
  swf         : './SoundManager.swf',
  swfObj      : null,
  sounds      : $H(),
  initialized : false,
  _debugMode  : 0,
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  SoundObject : Class.create({
    defaults : {
      autoLoad     : true,
      autoPlay     : true,
      pan          : 0,
      volume       : 1.0,
      loop         : false,
      loopTo       : 0.0,
      onload       : Prototype.emptyFunction,
      onstop       : Prototype.emptyFunction,
      onfinish     : Prototype.emptyFunction,
      onfadeout    : Prototype.emptyFunction,
      onerror      : Prototype.emptyFunction
    },
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    initialize : function(id, url, options) {
      this.id      = id;
      this.url     = url;
      this.manager = Mastery.Sound;
      this.options = Object.extend(Object.clone(this.defaults), options || {});

      this.onload    = this.options.onload;
      this.onstop    = this.options.onstop;
      this.onfinish  = this.options.onfinish;
      this.onfadeout = this.options.onfadeout;
      this.onerror   = this.options.onerror;
      
      try {
        this.manager.swfObj.create(id, url, this.options.loop, this.options.loopTo || 0.0);
      }catch(e) {
        this.manager._debug('can not create sound object(' + id + "):\n  " + e);
        this.disable();
      }
      this.manager.swfObj.setVolume(id, this.options.volume);
//      this.manager.swfObj.setPan(id, this.options.pan); // not impelemnted yet

      if (this.options.autoLoad) this.load();
    },

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    load     : function() { return(this.manager.swfObj.load(this.id, this.options.autoPlay)); },
    play     : function() { return(this.manager.swfObj.start(this.id)); },
    stop     : function() { return(this.manager.swfObj.finish(this.id)); },
    pause    : function() { return(this.manager.swfObj.pause(this.id)); },
    resume   : function() { return(this.manager.swfObj.resume(this.id)); },
    playing  : function() { return(this.manager.swfObj._playing(this.id)); },
    isPaused : function() { return(this.manager.swfObj.isPaused(this.id)); },
    fadeOut  : function(interval, callback) {
      if (Object.isFunction(callback)) this.onfadeout = callback;
      return(this.manager.swfObj.fadeOut(this.id, interval));
    },
    
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    disable : function() {
      for(var key in this) {
        if (typeof(key) == 'function') this[key] = Prototype.emptyFunction;
      }
    }
  }),

  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  loadSwf : function() {
    if ($(this.id)) throw(new Error('"' + this.id + '" already exists'));

    this._debug('include:' + this.swf);

    this.swfObj = document.createChild('div');
    this.swfObj.innerHTML = (Prototype.Browser.IE) ?
      '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="' + this.id + '" align="middle" width="0" height="0">' +
        '<param name="movie" value="' + this.swf + '" /><param name="allowScriptAccess" value="always" /><param name="quality" value="high" /></object>' :
      '<embed src="' + this.swf + '" id="'+ this.id + '" name="' + this.id +
        '" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" allowScriptAccess="sameDomain" width="0" height="0"/>';
    this.swfObj = $(this.id);
    // hide swf
    this.swfObj.setDimension(1, 1);
    this.swfObj.setPosition(-1, -1);
  },
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // when swf initialized, swf calls this function
  _swfInitialized : function() {
    this.swfObj = $(this.id); // when document reloaded, reference will be broken, so reset this value

    if (this.initialized) return;
    this.initialized = true;

    this._debug('"swf<->js" connection succeeded, call Mastery.Sound.onload()');
    this.onload.delay(1000, window); // swf needs some delay...X-(
  },
  onload : Prototype.emptyFunction,

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  createSound : function(id, url, options) {
    if (this.sounds.get(id)) return(false);
    this.sounds.set(id, new Mastery.Sound.SoundObject(id, url, options));
    return(true);
  },
  call : function(id, name) {
    var sound = this.sounds.get(id);
    if (!sound) return(false);
    return(sound[name].apply(sound, $A(arguments).slice(2)));
  },

  load     : function(id) { return(this.call(id, 'load'));     },
  play     : function(id) { return(this.call(id, 'play'));     },
  stop     : function(id) { return(this.call(id, 'stop'));     },
  pause    : function(id) { return(this.call(id, 'pause'));    },
  resume   : function(id) { return(this.call(id, 'resume'));   },
  playing  : function(id) { return(this.call(id, 'playing'));  },
  isPaused : function(id) { return(this.call(id, 'isPaused')); },
  fadeOut  : function(id, interval, callback) {
    return(this.call(id, 'fadeOut', interval, callback));
  },

  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  onSoundLoaded     : function(id) { return(this.call(id, 'onload',    id)); },
  onSoundLoadFailed : function(id) { return(this.call(id, 'onerror',   id)); },
  onSoundStopped    : function(id) { return(this.call(id, 'onstop',    id)); },
  onSoundComplete   : function(id) { return(this.call(id, 'onfinish',  id)); },
  onFadeoutComplete : function(id) { return(this.call(id, 'onfadeout', id)); },
  
  //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  _debug : function(str) {
    if (!this._debugMode) return;
    console.debug(str);
  }
};

