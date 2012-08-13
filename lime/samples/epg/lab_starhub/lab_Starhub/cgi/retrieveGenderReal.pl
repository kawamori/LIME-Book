#! /usr/bin/perl -w

use strict;

#use CGI qw/:standard/;
use LWP::Simple;

########################################
sub main {
 # my( $q) = new CGI();

  #print header( -type=>'image/jpeg');
	print "Content-type: text/plain \n\n";
#	print "Content-type";
	getprint("http://10.24.138.147/genderModify.pl");
};

####################
&main( @ARGV);

