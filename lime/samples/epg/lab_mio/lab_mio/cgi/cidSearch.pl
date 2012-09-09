#! /usr/bin/perl -w

use strict;

use HTML::Form;
use HTML::TreeBuilder;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;

use CGI qw/:standard/;
use File::Spec;
############################################################
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
#  'cntpath' => '/moviebox/2010_2_229aaac.mp4',
  'cntpath' => '/moviebox/1min.mp4',
#  'size' => '1000',
#  'update' => 'on',
#  'upyear' => '2010',
#  'upmon' => '02',
#  'upday' => '21',
#  'uptoyear' => '2010',
#  'uptomon' => '03',
#  'uptoday' => '12',
);

########################################
sub main {
  my( $ua) = LWP::UserAgent->new();

  my( $req);
  my( $res);

  ####################
  # Get the search form page.
  #use CGI qw/:standard/;
use File::Spec;
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

  ####################
  # Fill in the first form in the page.
  #
  my( $f) = shift( @pszForms);

  while( my ($k, $v) = each % pszInputValue) {
    defined( $f->find_input( $k)) or
      die( 'Error: form does not contain selector "', $k, '"', $/);

#    print( 'Setting "', $k, '" -> "', $v, '"', $/);
    $f->value( $k, $v);
  };

  ####################
  # Post the form back to server.
  #
  $req = $f->click();
  $req->authorization_basic( @gpszUserPass);

  $res = $ua->request( $req);

  $res->is_success() or die( 'Request failed: ', $res->status_line(), $/);

#  print( $res->content(), $/);
#  return;

  ####################
  # Parse the HTML table returned into a syntax tree.
  #
  my( $ptbObj) = HTML::TreeBuilder->new();

  $ptbObj->parse( $res->content());

  my( @pRow) = $ptbObj->look_down( '_tag', 'table')->content_list();

  # Ignore first row as it only contains the column labels.
  shift( @pRow);

  print( scalar( grep( (ref( $_) eq "HTML::Element"), @pRow)),
         " record(s) retrieved.", $/);
  print header( -attachment=>'temp_CID.tsv');
#############################################################################################
#  print( $pRow[0]->as_HTML(), $/);
#  return;

#  splice( @pRow, 10);

  ####################
  # Process each row
  #
  foreach my $tr (@pRow) {
#    print( '# ', ref( $tr), $/);

    if( ref( $tr) ne "HTML::Element") {
      next;
    };

    print( $/);
    my( @pCol) = $tr->content_list();
    my( $i) = 0;

    foreach my $td (@pCol) {
      if( !( $gpszColumnLabel[ $i++])) {
        # Skip printing of unlabelled columns.
        next;
      };
      print( $gpszColumnLabel[ $i - 1], " : ", $td->as_text(), $/);
    };
  };
};

####################
&main( @ARGV);

