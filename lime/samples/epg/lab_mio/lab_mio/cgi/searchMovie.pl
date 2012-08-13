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
use List::Util qw[min max];

###################################################################################################################
###########################declaration for the CGI. from_year...............################################################
	 my( $q) = new CGI();

	print "Content-type: text/html \n\n"; # the header fill-out form,
	my $retrieve_info = $q->url_param( 'info'); ### url_param is for POST--> retrieve information from URL

	
	defined ( $retrieve_info) or ($retrieve_info = $q->param( 'info')); 




#####################################################################################################################	
###########################from_month...............################################################

	my $retrieve_location = $q->url_param( 'location'); ### url_param is for POST--> retrieve information from URL

	defined ( $retrieve_location) or ($retrieve_location = $q->param( 'location')); 



#####################################################################################################################


#my( $gszSearchUrl) = 'http://10.24.138.136/lab_demo/bml/tsv/MovieList11.tsv';
my( $gszSearchUrl) = 'http://10.24.138.136/lab_demo/bml/tsv/movielist.tsv';


my( %pszLocation0) = ('metadata' => $retrieve_info);
my( %pszLocation1) = ('metadata' => $retrieve_info);
#print "\n",%pszInputValue;
#print "\n","abc";
####################################################################################################################

#sub trim($);
#sub ltrim($);
#sub rtrim($);

# Create a test string
#my $string = "  \t  Hello world!   ";

# Here is how to output the trimmed text "Hello world!"
#print trim($string)."\n";
#print ltrim($string)."\n";
#print rtrim($string)."\n";

# Perl trim function to remove whitespace from the start and end of the string
sub trim($)
{
	my $string = shift;
	$string =~ s/^\s+//;
	$string =~ s/\s+$//;
	return $string;
}

##########################################################################################################################
sub main {
	
  my( $ua) = LWP::UserAgent->new();
	
  my( $req);
  my( $res);
 

  ####################
  #################### Search for the database#################

  $req = HTTP::Request->new(
    'GET' => $gszSearchUrl,
  );


  $res = $ua->request( $req);

  $res->is_success() or die( 'Request failed: ', $res->status_line(), $/);

# print( $res->content(), $/);
# print( %pszLocation0, $/);

	my $pszStorage = $res->content();
	my @pszStorageArray= split(/\n/, $pszStorage);

	my( $f) = shift( @pszStorageArray);
#	print "\n", $pszStorageArray[0],"\n";
#	print "\n", $#pszStorageArray,"\n";
	my (@tempStorageArray);
	my $m =0;
	my ($k, $v) =  (%pszLocation0);
#	print $v,"\n";
	my (@splitStorageArray);
	my (@returnArray);
	my $t;
	if( $retrieve_location <10 && $retrieve_location>4 ){
		for( my $i=0; $i<=$#pszStorageArray; $i++){
			@splitStorageArray = split(/\t/, $pszStorageArray[$i]);
			$splitStorageArray[4] = trim( $splitStorageArray[4]);

			if ($splitStorageArray[4] eq $v){
	#			print $splitStorageArray[4],"\n";
				$returnArray[$m][0]= $splitStorageArray[3];
				$returnArray[$m][1]= $splitStorageArray[0];
				$m += 1;
			}
		}

#			print( 'Setting "', $k, '" -> "', $v, '"', $/);
		for ( my $i=0; $i<=$#returnArray; $i++){
			print ($returnArray[$i][0],"\n");
			print $returnArray[$i][1],"\n";
		}
	}
	elsif ( $retrieve_location <5 && $retrieve_location>=0 ){
#		print $#pszStorageArray,"\n";
#		print @pszStorageArray;
		for( my $i=0; $i<=$#pszStorageArray; $i++){
			@tempStorageArray = split(/\t/, $pszStorageArray[$i]);
#			print $#tempStorageArray;
			$tempStorageArray[4] = trim( $tempStorageArray[4]);
			if ($tempStorageArray[4] eq $v){
				for ( my $p=0; $p<=$#tempStorageArray; $p++){
					$splitStorageArray[$m][$p] = $tempStorageArray[$p];
				}
				$m +=1;
			}

		}
#		print("\n",$splitStorageArray[0][0],"\t");
#		print($splitStorageArray[0][1],"\t");
#		print($splitStorageArray[0][2],"\t");
#		print($splitStorageArray[0][3],"\t");
#		print($splitStorageArray[0][4],"\n");
#		print($splitStorageArray[1][0],"\t");
#		print($splitStorageArray[1][1],"\t");
#		print($splitStorageArray[1][2],"\t");
#		print($splitStorageArray[1][3],"\t");
#		print($splitStorageArray[1][4],"\n");
#		print($#splitStorageArray); 

		
		for ( my $i=0; $i<$#splitStorageArray;$i++){
			if($splitStorageArray[$i+1][1]==$splitStorageArray[$i][1]){
				if(max($splitStorageArray[$i+1][2],$splitStorageArray[$i][2])==$splitStorageArray[$i+1][2]){
					$returnArray[0] = $splitStorageArray[$i+1][3];
					$returnArray[1] = $splitStorageArray[$i+1][0];
				}else{
					$returnArray[0] = $splitStorageArray[$i][3];
					$returnArray[1] = $splitStorageArray[$i][0];
				}	
			}elsif (max($splitStorageArray[$i+1][1],$splitStorageArray[$i][1])==$splitStorageArray[$i+1][1]){ 
					$returnArray[0] = $splitStorageArray[$i+1][3];
					$returnArray[1] = $splitStorageArray[$i+1][0];
			}else{
					$returnArray[0] = $splitStorageArray[$i][3];
					$returnArray[1] = $splitStorageArray[$i][0];
			}
		}
		print ($returnArray[0],"\n");
		print $returnArray[1];
	}

return;


};
###########################################################################################################################

&main( @ARGV);
