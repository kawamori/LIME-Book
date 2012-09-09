// override default path
var BML_ROOT         = (function(){
  var uri = BML.Util.parseURI(location.href);
  var path = uri.path.split('/');
  if (path.length < 2) return(uri.host);

  path.pop(); path.pop();
  return(uri.host+path.join('/'));
})();
var STUB_PATH        = BML_ROOT + '/tsv/';
var BASE_URI         = 'http://' + location.host;
var BOOT_URI         = 'http://' + location.host;
var STARTUP_URI      = BML_ROOT + '/startup.txt';
var SUBSCRIBE_URI    = BML_ROOT + '/subscribe.txt';
var SETTING_FILE_URI = BML_ROOT + '/bml/settings/bmlconfig.txt';
var GENREMENU_URI    = BML_ROOT + '/bml/genremenus/';
var ERRORMSG_URI     = BML_ROOT + '/bml/errormsg/';

// fix bugs
getElementById = function(id) {
  // illegal element reference before DOM loaded
  //  ex: at line 30-31(startup.bml)
  var elm = document.getElementById(id);
  return(elm ?
         elm :
         {
           normalStyle : {},
           focus       : function(){},
           firstChild  : {
             dataInterface : ''
           }
         });
};
