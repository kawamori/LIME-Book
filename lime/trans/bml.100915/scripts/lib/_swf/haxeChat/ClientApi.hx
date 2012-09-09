interface ClientApi {
	public function userJoin( name : String ) : Void;
	public function userLeave( name : String ) : Void;
	public function userSay( name : String, text : String ) : Void;
}
