// Object /////////////////////////////////////////////
(function() {
  var Browser = {
    IE     : !!(window.attachEvent && (navigator.userAgent.indexOf('opera') === -1)),
    Opera  : (navigator.userAgent.indexOf('Opera') > -1),
    WebKit : (navigator.userAgent.indexOf('AppleWebKit/') > -1),
    Gecho  : ((navigator.userAgent.indexOf('Gecho') > -1) &&
              (navigator.userAgent.indexOf('KHTML') === -1)),
    MobileSafari : !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
  };

  function extend(dest, src){ for(var prop in src) { dest[prop] = src[prop]; } return(dest); }
  function clone(obj)       { return(extend({}, obj)); }
  function getClass(obj)    { return(Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1]); }
  function isArray(obj)     { return(getClass(obj) === 'Array'); }
  function isUndefined(obj) { return(typeof(obj) === 'undefined'); }
  
  extend(Object, {
    Browser     : Browser,
    extend      : extend,
    clone       : clone,
    isArray     : isArray,
    isUndefined : isUndefined
  });
})();
$break = {};

var Class = (function() {
  function create() {
    function klass() {
      this.initialize.apply(this, arguments);
    }
    Object.extend(klass, Class.Methods);

    for(var i = 0, len = arguments.length; i < len; i++)
      klass.addMethods(arguments[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Function.emptyFunction;

    klass.prototype.constructor = klass;
    return(klass);
  }

  function addMethods(methods) {
    for(var name in methods) this.prototype[name] = methods[name];
    return(this);
  }

  return({
    create  : create,
    Methods : {
      addMethods : addMethods
    }
  });
})();

// RegExp /////////////////////////////////////////////
RegExp.prototype.match = RegExp.prototype.test;

// Function /////////////////////////////////////////////
Object.extend(Function, {
  emptyFunction : function() {},
  K             : function(x) { return(x); }
});
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function bind(context) {
    if ((arguments.length < 2) && Object.isUndefined(arguments[0])) return(this);
    
    var __method = this, args = slice.call(arguments, 1);
    return(function() {
      var a = (slice.call(args, 0)).append(arguments);
      return(__method.apply(context, a));
    });
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguemnts, 1);
    return(function(event) {
      var a = [event || window.event].append(args);
      return(__method.apply(context, a));
    });
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    return(window.setTimeout(function() {
      return(__method.apply(__method, args));
    }, timeout * 1000));
  }

  function wait(timeout, context) {
    var __method = this, args = slice.call(arguments, 2);
    return(window.setTimeout(function() {
      return(__method.apply(context, args));
    }, timeout * 1000));
  }

  return({
    bind                : bind,
    bindAsEventListener : bindAsEventListener,
    delay               : delay,
    wait                : wait
  });
})());

// String /////////////////////////////////////////////
Object.extend(String.prototype, (function() {
  function blank() {
    return(/^\s*$/.test(this));
  }

  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = str.replace(/\\./g, '@').replace(/\"[^\"\\\n\r]*\"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  }

  function evalJSON() {
    var json = this;
    try {
      if (json.isJSON()) return(eval('(' + json + ')'));
    } catch(e) { }
    throw(new SyntaxError('Badly formed JSON string: ' + Object.prototype.toString(this)));
  }

  return({
    blank    : blank,
    isJSON   : isJSON,
    evalJSON : evalJSON
  });
})());


// Enumerable /////////////////////////////////////////////
var Enumerable = (function() {
  function each(iterator, context) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator.call(context, value, index++);
      });
    } catch(e) {
      if (e != $break) throw(e);
    }
    return(this);
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return(memo);
  }

  return({
    each    : each,
    inject  : inject
  });
})();

// Array /////////////////////////////////////////////
(function() {
  var arrayProto = Array.prototype;
  
  var _each = arrayProto.forEach || function(iterator) {
    for(var i = 0, length = this.length; i < length; i++) iterator(this[i]);
  };

  function append(array) {
    var thisLength = this.length, length = array.length;
    while(length--) this[thisLength + length] = array[length];
    return(this);
  }

  Object.extend(arrayProto, Enumerable);
  Object.extend(arrayProto, {
    _each  : _each,
    append : append
  });
})();


// Ajax /////////////////////////////////////////////
Ajax = {
  getTransport : function() {
    var ret = null;

    ['XMLHttpRequest()',
     "ActiveXObject('Msxml2.XMLHTTP')",
     "ActiveXObject('Microsoft.XMLHTTP')"].each(function(value) {
       try {
         ret = eval('new '+value);
//         if (ret != null) return(ret);
         $break;
       } catch(e) {}
     });

    return(ret);
  }
};

Ajax.Request = Class.create({
  _complete : false,
  
  initialize : function(url, options) {
    this.options = Object.extend({
      method       : 'POST',
      asynchronous : true,
      contentType  : 'application/x-www-form-urlencoded',
      encoding     : 'UTF-8',
      parameters   : '',
      postBody     : '',
      evalJSON     : true,
      evalJS       : true
    }, options || {});

    this.options.method = this.options.method.toUpperCase();
    this.transport      = Ajax.getTransport();
    if (url) this.request(url);
  },

  _toQueryPair : function(k,v) {
    return(Object.isUndefined(v) ? k : k+'='+encodeURIComponent(v === null? '' : v));
  },
  
  request : function(url) {
    if (!url) return(false);
    
    this.url       = url;
    this.accessUrl = url;
    this.method    = (this.options.method || '').toUpperCase() || 'POST';
    var params     = this.options.parameters || {};

    var p = [], toPair = this._toQueryPair;
    for(var key in params) {
      var val = params[key];
      key = encodeURIComponent(key);
      if (Object.isArray(val)) {
        p = val.inject(p, function(memo, v) { memo.push(toPair(key, v)); return(memo); });
      } else {
        p.push(toPair(key, val));
      }
    }
    params = p.join('&');

    if (this.method == 'GET') this.accessUrl += ((url.indexOf('?') >= 0) ? '&' : '?') + params;
    else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) params += '&_=';

    try {
      var transport = this.transport;
      transport.open(this.method, this.accessUrl, this.options.asynchronous);
      if (this.options.asynchronous) this.respondToReadyState.wait(0.01, this, 1);

      transport.onreadystatechange = this.onStateChange.bind(this);
      var headers = this.getRequestHeaders();
      for(key in headers) transport.setRequestHeader(key, headers[key]);

      this.body = (this.method == 'POST') ? (this.options.postBody || params) : null;
      transport.send(this.body);

      if (!this.options.asynchronous && transport.overrideMimeType) this.onStateChange();
      
    } catch(e) {
      this.dispatchException(e);
    }

    return(true);
  },

  onStateChange : function() {
    var readyState = this.transport.readyState;
    if ((readyState > 1) && ((readyState != 4) || !this._complete))
      this.respondToReadyState(readyState);
  },

  respondToReadyState : function(readyState) {
    var state    = Ajax.Request.Events[readyState];
    var response = new Ajax.Response(this);

    try {
      (this.options['on' + state] || Function.emptyFunction)(response);
    } catch(e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.statusCode] ||
         this.options['on' + (this.success() ? 'Success' : 'Failure')] ||
         Function.emptyFunction)(response);
      } catch(e) {
        this.dispatchException(e);
      }

      this.transport.onreadystatechange = Function.emptyFunction;
    }
  },

  success : function() {
    var status = this.getHttpStatusCode();
    return(!status || ((status >= 200) && (status < 300)));
  },

  getRequestHeaders : function() {
    var headers = {
      'X-Requested-With' : 'XMLHttpRequest',
      'Accept'           : 'text/javascript, text/html, application/xml, text/xml, */*'
    };
    if (this.method == 'POST') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');
      // Force "Connection: close" for older Mozilla browsers to work. see Mozilla Bugzilla #246651.
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    return(headers);
  },

  getHttpStatusCode : function()     { try { return(this.transport.status || 0); } catch(e) { return(0); } },
  getHeader         : function(name) { try { return(this.transport.getResponseHeader(name) || null); } catch(e) { return(null); } },
  getAllHeaders     : function()     { try { return(this.transport.getAllResponseHeaders() || null); } catch(e) { return(null); } },
  dispatchException : function(e)    { (this.options.onError || Function.emptyFunction)(this, e); }
});
Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
  initialize : function(request) {
    this.request = request;
    var transport  = this.transport  = request.transport;
    var readyState = this.readyState = transport.readyState;

    if (((readyState > 2) && !Object.Browser.IE) || (readyState == 4)) {
      this.statusCode   = this._getHttpStatusCode();
      this.statusText   = this._getStatusText();
      this.responseText = (transport.responseText === null) ? '' : transport.responseText;
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML = Object.isUndefined(xml) ? null : xml;
    }
  },

  status     : 0,
  statusText : '',

  _getHttpStatusCode     : Ajax.Request.prototype.getHttpStatusCode,
  _getResponseHeader     : Ajax.Request.prototype.getHeader,
  _getAllResponseHeaders : Ajax.Request.prototype.getAllHeaders,
  _getStatusText         : function() { try { return(this.transport.statusText || ''); } catch(e) { return(''); } }
});
