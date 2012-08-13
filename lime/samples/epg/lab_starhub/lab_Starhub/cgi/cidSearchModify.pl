#! /usr/bin/perl -w

use strict;

use CGI qw/:standard/;
#use LWP::Simple;



use HTML::Form;
#use HTML::Element;

#use HTML::TreeBuilder;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;
#use HTML::Parser();
use File::Spec;
#require HTML::Filter;
###################################################################################################################
###########################declaration for the CGI................################################################
	 my( $q) = new CGI();

#	print "Content-type: text/html \n\n"; # the header fill-out form,
	my $retrievecode = $q->url_param( 'text'); ### url_param is for POST--> retrieve information from URL
	#######################################################################
	#To retrieve URL parameters, call the url_param() method.             #
	# Use it in the same way as param().                                  #
	# Allows you to read the parameters, but not set them.                # 
	# this is for web-browser......                                       #
	#######################################################################
	
	defined ( $retrievecode) or ($retrievecode = $q->param( 'text')); 
	#######################################################################
	#receive CGI parameters in the URL									  #
	#receive CGI parameters in the fill-out form that POSTs to a URL      #
	#containing a query string (a "?" mark followed by arguments).        #
	#The param() method will always return the contents of the POSTed     #
	#fill-out form,ignoring the URL's query string.                       # 
	#Checking from command prompt, posting parameters to URL.		      #
	#######################################################################
#	print( $retrievecode);
#	print("\n");


#####################################################################################################################	
my( @gpszUserPass) = qw( vodadmin vodadmin);
my( $gszSearchUrl) = 'http://10.24.138.146/okims/cid/search.html';

my( @gpszColumnLabel) = (
  "",
  "Content ID", 
  "User-defined identification",
  "Content Path",
  "Title",
  "Date issued",
  "Updated",
  "",
  "",
  "",
#  "Content management configuration attributes",
#  "License Manager configuration attributes",
#  "Distributed delivery management configuration attributes",
);
  print header( -attachment=>'temp_CID.tsv');
#my( %pszInputValue) = (
#  'cntpath' => '/moviebox/2010_2_229aaac.mp4',
###  'cntpath' => $movielist,
#  'size' => '1000',
#  'update' => 'on',
#  'upyear' => '2010',
#  'upmon' => '02',
#  'upday' => '21',
#  'uptoyear' => '2010',
#  'uptomon' => '03',
#  'uptoday' => '12',
#);
my( %pszInputValue) = ('cntpath' => "$retrievecode");
print $retrievecode;
print "\n";

##########################################################################################################################
sub main {
	
  my( $ua) = LWP::UserAgent->new();
	
  my( $req);
  my( $res);
  my( $q) = new CGI();


  ####################
  #################### Get the search form page.##################

  $req = HTTP::Request->new(
    'GET' => $gszSearchUrl,
  );
  $req->authorization_basic( @gpszUserPass);

  $res = $ua->request( $req);

  $res->is_success() or die( 'Request failed: ', $res->status_line(), $/);

#  print( $res->content(), $/);
#  return;

  my( @pszForms) = HTML::Form->parse( $res->content(), $gszSearchUrl);

  scalar( @pszForms) or
    die( 'Error: no forms found in page (', $gszSearchUrl, ')', $/);

#  print( scalar( @pszForms), ' form(s) found in page.', $/);

  #####################################################################
  #############Fill in the first form in the page.#####################
  #
  my( $f) = shift( @pszForms);

  while( my ($k, $v) = each (%pszInputValue)) {
    defined( $f->find_input( $k)) or
      die( 'Error: form does not contain selector "', $k, '"', $/);

#    print( 'Setting "', $k, '" -> "', $v, '"', $/);
    $f->value( $k, $v);
  };

  #######################################################################
  ############### Post the form back to server.##########################
  #
  $req = $f->click();
  $req->authorization_basic( @gpszUserPass);

  $res = $ua->request( $req);

  $res->is_success() or die( 'Request failed: ', $res->status_line(), $/);


 my $record =  $res->content();
 $record =~ s/<(([^ >]|\n)*)>//g;

#print header(-type=>'text/tab-separated-values',  -attachment=>'temp_CID.tsv');

if($record =~ m/(id value="(.*)")/) {
	my $CIDretrieve = $1;
	#print " $1";
	my @CIDretrieves=split('"',$CIDretrieve);
	print $CIDretrieves[1];
}

#print header( -type=>'text/tab-separated-values',  -attachment=>'http://10.24.138.136/lab_demo/cgi/temp_CID.tsv');


  return;

};
###########################################################################################################################

&main( @ARGV);
