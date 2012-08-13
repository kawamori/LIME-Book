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
###########################declaration for the CGI. from_year...............################################################
	 my( $q) = new CGI();

#	print "Content-type: text/html \n\n"; # the header fill-out form,
	my $retrieve_from_year = $q->url_param( 'fyear'); ### url_param is for POST--> retrieve information from URL
	#######################################################################
	#To retrieve URL parameters, call the url_param() method.             #
	# Use it in the same way as param().                                  #
	# Allows you to read the parameters, but not set them.                # 
	# this is for web-browser......                                       #
	#######################################################################
	
	defined ( $retrieve_from_year) or ($retrieve_from_year = $q->param( 'fyear')); 
	if ($retrieve_from_year eq ""){
		$retrieve_from_year = '2010';
	}

	#######################################################################
	#receive CGI parameters in the URL									  #
	#receive CGI parameters in the fill-out form that POSTs to a URL      #
	#containing a query string (a "?" mark followed by arguments).        #
	#The param() method will always return the contents of the POSTed     #
	#fill-out form,ignoring the URL's query string.                       # 
	#Checking from command prompt, posting parameters to URL.		      #
	#######################################################################
#	print( $retrieve_from_year);
#	print("\n");


#####################################################################################################################	
###########################from_month...............################################################

	my $retrieve_from_month = $q->url_param( 'fmonth'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_from_month) or ($retrieve_from_month = $q->param( 'fmonth')); 
	if ($retrieve_from_month eq ""){
		$retrieve_from_month = '02';
	}

#	print( $retrieve_from_month);
#	print("\n");


#####################################################################################################################
###########################from_day..............################################################

	my $retrieve_from_day = $q->url_param( 'fday'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_from_day) or ($retrieve_from_day = $q->param( 'fday')); 
	if ($retrieve_from_day eq ""){
		$retrieve_from_day = '01';
	}

#	print( $retrieve_from_day);
#	print("\n");


#####################################################################################################################
###########################to_year...............################################################

	my $retrieve_to_year = $q->url_param( 'tyear'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_to_year) or ($retrieve_to_year = $q->param( 'tyear')); 
	if ($retrieve_to_year eq ""){
		$retrieve_to_year = '2010';
	}

#	print( $retrieve_to_year);
#	print("\n");


#####################################################################################################################
###########################to_month...............################################################

	my $retrieve_to_month = $q->url_param( 'tmonth'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_to_month) or ($retrieve_to_month = $q->param( 'tmonth')); 
	if ($retrieve_to_month eq ""){
		$retrieve_to_month = '03';
	}

#	print( $retrieve_to_month);
#	print("\n");


#####################################################################################################################
###########################to_day..............################################################

	my $retrieve_to_day = $q->url_param( 'tday'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_to_day) or ($retrieve_to_day = $q->param( 'tday')); 
	if ($retrieve_to_day eq ""){
		$retrieve_to_day = '12';
	}

#	print( $retrieve_to_day);
#	print("\n");


#####################################################################################################################
###########################MovieList...........################################################


	my $retrieve_movie = $q->url_param( 'movielist'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_movie) or ($retrieve_movie = $q->param( 'movielist')); 
#	if ($retrieve_movie eq ""){
#		$retrieve_movie = "/moviebox/1min.mp4";
#	}

#	print( $retrieve_movie);
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

my( %pszInputValue) = (
####  'cntpath' => $retrieve_movie,
######  'cntpath' => $movielist,
  'size' => "10",
  'update' => "on",
  'upyear' => "$retrieve_from_year",
  'upmon' => "$retrieve_from_month",
  'upday' => "$retrieve_from_day",
  'uptoyear' => "$retrieve_to_year",
  'uptomon' => "$retrieve_to_month",
  'uptoday' => "$retrieve_to_day",
);
########################################## my( %pszInputValue) = ('cntpath' => $retrievecode);
#print "\n",%pszInputValue;
#print "\n","abc";
##########################################################################################################################
sub main {
	
  my( $ua) = LWP::UserAgent->new();
	
  my( $req);
  my( $res);
 

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
  #$f->value( $k, $v)$f->value( $k, $v)
  my( $f) = shift( @pszForms);

#	for my $key (keys(%pszInputValue)){
		while( my ($k, $v) = each (%pszInputValue)) {
	

			
			defined( $f->find_input( $k)) or
			die( 'Error: form does not contain selector "', $k, '"', $/);

			#print( 'Setting "', $k, '" -> "', $v, '"', $/);
		$f->value( $k, $v);
	
		};
#	}
  #######################################################################
  ############### Post the form back to server.##########################
  #
  $req = $f->click();
  $req->authorization_basic( @gpszUserPass);

  $res = $ua->request( $req);

  $res->is_success() or die( 'Request failed: ', $res->status_line(), $/);
  #print header( -attachment=>'temp_CID.tsv');

  my $record =  $res->content();
	$record =~ s/<(([^ >]|\n)*)>//g;
;
print header(-type=>'text/tab-separated-values',  -attachment=>'temp_CID1.tsv');
	my( @pRecord);
	my( @pMovieName);
	my $i =0;
	my $m =0;
#	my $pRecord =0;
	my @pMovieName1;
@pRecord = ($record =~ m/id value="([^"]*)"/g);
@pMovieName = ($record =~ m/moviebox((.*))/g);

##print @pMovieName,"\n\n";




for($i=0,$m=0;$i<=$#pMovieName;$i+=2,$m+=1){
	print $pMovieName[$i],"\n";
	print $pRecord[$m],"\n\n";
}

#if(@pRecord = ($record =~ m/id value="([^"]*)"/g)) {
#	if(@pMovieName = ($record =~ m/(moviebox(.*))/g)) {
#		map( { print( $_, $/); } $pMovieName[$i]);
#		map( { print( $_, $/); } $pRecord[$i]);
#		$i+=1;
#}
		
###xi
#print "\n", @pRecord;



#print header( -type=>'text/tab-separated-values',  -attachment=>'http://10.24.138.136/lab_demo/cgi/temp_CID.tsv');
#########  print $record;
###  print( $res->content(), $/);
  return;
	
};
###########################################################################################################################

&main( @ARGV);
