#! /usr/bin/perl -w

use strict;

use CGI qw/:standard/;
use LWP::Simple;

########################################
sub main {
  my( $q) = new CGI();

  print header( -type=>'image/jpeg');

  getprint( $q->url_param( 'img'));
};

####################
&main( @ARGV);

