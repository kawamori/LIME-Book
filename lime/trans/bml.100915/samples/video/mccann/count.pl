#!c:/perl/bin/perl.exe
use CGI;
$q = new CGI;
$res=0;

$value = $q->param('Denbun');
$res =$value*2;

print "Content-Type: text/plain; Charset=EUC-JP\n\n";
print $res;
