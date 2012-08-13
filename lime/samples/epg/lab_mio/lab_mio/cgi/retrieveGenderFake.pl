#! /usr/bin/perl -w

use strict;

########################################
sub main {
	my( @pszReturn) = qw( f m u);
	my( $i) = int( rand( scalar( @pszReturn))); 

	print( "Content-type: text/plain", $/, $/);
	print( $pszReturn[ $i], $/);
};

####################
&main( @ARGV);

