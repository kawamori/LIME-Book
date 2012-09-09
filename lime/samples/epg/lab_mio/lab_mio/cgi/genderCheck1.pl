#! /usr/bin/perl -w

use strict;
use IO::Select;
use IO::Socket;
use CGI qw/:standard :cgi-lib/;
#use XML::Simple;
use Sys::Hostname;





my( $bAsCgi) = exists( $ENV{ 'REQUEST_METHOD'});
# my( $bLog) = 1;
my( $bLog) = url_param( "log");
my( $q) = new CGI();
print "Content-type: text/html \n\n";
my( $bServerCgi) = $q->url_param( 'server_cgi');
#my( $bServerCgi) = url_param( "server_cgi");
defined ( $bServerCgi) or ($bServerCgi = $q->param( 'server_cgi'));
print $bServerCgi;

my( $szLog);
# my( $szLog) = ($0 =~ /^(.+)\.pl$/);
my( $fpLog);

if( $bLog) {
  $szLog = $0;
  $szLog =~ s/^(.+)\.pl$/$1.log/;
  ($szLog ne $0) or die( "Oops...", $/);
};

############################################################
sub debug {
  if( $bAsCgi && !defined( $szLog)) {
    return;
  };

  if( defined( $szLog)) {
    if( !defined( $fpLog)) {
      if( $bLog > 1) {
        unlink( "$szLog");
      };
      open( $fpLog, ">> $szLog") or
        warn( "Couldn't open \"", $szLog, "\" for writing.", $/);
    };
  }
  else {
    $fpLog = *STDOUT;
  };

  my( $szNow);

  $szNow = localtime();

  print( $fpLog $szNow, ": ", @_);
};

############################################################
sub initialiseSocket {
  my( $host) = shift;
  my( $port) = shift;
  my( $nTry) = shift;

  defined( $nTry) or ($nTry = 4);

  my( $sock);

  my( $szMesgHead) = "Start";

  while( !defined( $sock) && ($nTry--)) {
      &debug( $szMesgHead, " socket initialisation", $/);

      $sock = new IO::Socket::INET(
          PeerAddr => $host,
          PeerPort => $port,
          Proto => 'tcp',
          Reuse => 0,
          Timeout => 1,
          Blocking => 0,
      );

      $szMesgHead = "Retrying";
  };

  &debug( "End socket initialisation.", $/);

  return( $sock);
};

############################################################
sub sendAndRecv {
  my( $sock) = shift;
  my( $nWait) = shift;

  &debug( $$, ": Sending request through socket.", $/);
  print( $sock "GetGender", $/);

  my( $szResponse);

  my( $s) = new IO::Select( $sock);

  while( !( $s->can_read( 1)) && $nWait--) {
    &debug( 'Socket not ready for reading.', $/);
  };

  if( $nWait < 0) {
    return( $szResponse);
  };

  &debug( $$, ": Reading one line from socket.", $/);
  chomp( $szResponse = <$sock>);

  &debug( $$, ": One line read from socket: \"", $szResponse, "\"", $/);

  return( $szResponse);
};

############################################################
sub parseResponse {
  my( $szResponse) = shift;

  if( defined( $szResponse)) {
    if( $szResponse =~ s/^Gender:\s+(\w+)[\r\n]*$/$1/) {
      if( $szResponse eq "Female") {
        $szResponse = 'f';
      }
      elsif( $szResponse eq "Male") {
        $szResponse = 'm';
      }
      elsif( $szResponse eq "Unknown") {
        $szResponse = 'u';
      }
      else {
#        &debug( "\"", $szResponse, "\"", $/);
        $szResponse = '?';
      };
    }
    else {
#      &debug( "\"", $szResponse, "\"", $/);
      $szResponse = '! ' . $szResponse;
    };
  }
  else {
    $szResponse = 'NULL';
  };

  return( $szResponse);
};

############################################################
sub getGender {
  my( $host) = shift || (($bAsCgi && $bServerCgi) ? remote_host() : hostname());
  my( $port) = shift || 2000;
  my( $nWait) = shift || 2;
  my( $nTimeout) = shift || 2;

  &debug( "Host: ", $host, $/);

  my( $sock) = &initialiseSocket( $host, $port, shift);

  defined( $sock) or return( 'x');

  $sock->autoflush( 1);

  my( $szResponse);

  while( !defined( $szResponse = &sendAndRecv( $sock, $nWait)) && $nTimeout--)
  {
    sleep( 1);
  };

  $szResponse = &parseResponse( $szResponse);

  close( $sock);

  return( $szResponse);
};

############################################################
sub returnXML {
  my( $szResult) = shift;

  my( %pszXmlCfg) =
  (
    ContentKey => 'body',
    RootName => 'GenderRecognition',
    XMLDecl => 1,
    AttrIndent => 1,
  );

  my( %ppAllHash) =
  (
    Gender => [ $szResult ],
  );

  $| = 1;

  print( header( 'text/xml'));
  print( XMLout( \%ppAllHash, %pszXmlCfg));
};

########################################
sub main {
  &returnXML( &getGender( @_));

  if( defined( $fpLog) && defined( $szLog)) {
    close( $fpLog);
    $fpLog = undef;
  };
};

####################
&main( @ARGV);

