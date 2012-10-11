
class ServerApiImpl extends haxe.remoting.AsyncProxy<ServerApi> {
}

class Client implements ClientApi {

	var api : ServerApiImpl;
	var name : String;
	var tf : flash.TextField;
	var log : flash.TextField;

	function new() {
		var s = new flash.XMLSocket();
		s.onConnect = onConnect;
		s.connect("localhost",1024);
		var context = new haxe.remoting.Context();
		context.addObject("client",this);
		var scnx = haxe.remoting.SocketConnection.create(s,context);
		api = new ServerApiImpl(scnx.api);
	}

	function onConnect( success : Bool ) {
		if( !success ) {
			trace("Failed to connect on server !");
			return;
		}
		// create an input textfield
		tf = flash.Lib.current.createTextField("tf",0,5,flash.Stage.height - 25,flash.Stage.width-10,20);
		tf.type = "input";
		tf.border = true;
		tf.background = true;
		tf.backgroundColor = 0xEEEEEE;
		flash.Key.onKeyDown = onKeyDown;
		// create a chat log
		log = flash.Lib.current.createTextField("log",1,5,5,flash.Stage.width-10,flash.Stage.height - 35);
		log.background = true;
		log.backgroundColor = 0xFFFFFF;
		log.html = true;
		log.border = true;
		log.multiline = true;
		display("Please enter your name in the bottom textfield to login and press ENTER");
	}

	function onKeyDown() {
		// ENTER pressed ?
		if( flash.Key.getCode() == 13 ) {
			var text = tf.text;
			tf.text = "";
			send(text);
		}
	}

	function send( text : String ) {
		if( name == null ) {
			name = text;
			api.identify(name);
			return;
		}
		api.say(text);
	}

	public function userJoin( name ) {
		display("User join <b>"+name+"</b>");
	}

	public function userLeave( name ) {
		display("User leave <b>"+name+"</b>");
	}

	public function userSay( name : String, text : String ) {
		display("<b>"+name+ " :</b> "+text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;"));
	}

	function display( line : String ) {
		var bottom = (log.scroll == log.maxscroll);
		log.htmlText += line + "<br>";
		if( bottom )
			log.scroll = log.maxscroll;
	}

	// --

	static var c : Client;

	static function main() {
		c = new Client();
	}

}
