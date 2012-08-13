#! /usr/bin/perl -w

use strict;

use CGI qw/:standard/;
use File::Spec;

my( $gbDebug) = 0;

my( $szPolyDataBaseDir) = File::Spec->catdir( qw( .. .. InfoCenter data));

my( %pbPolySet);
map( { $pbPolySet{ $_} = 1; } qw( BDP BMP GLP MPP OUP PRP QTP SKP TMP));

my( %pbDataType) = (TEXT => "txt", IMAGE => "jpg");

my( @pszQueueType) = qw( REGISTRATION CONSULTATION PHARMACY);

my( %pbQueueArea);
map( { $pbQueueArea{ $_} = 1; } @pszQueueType);

my( $szQueueType) = "(" . join( "|", @pszQueueType) . ")";
my( $rxQueueInfo) = qr/^$szQueueType .* : (\d+) *(mins)?$/;

########################################
sub main {
#  my( $szData) = File::Spec->catdir( $szPolyDataBaseDir, "*");
#  my( $szData) = "..";
  my( @pszFiles) = glob( File::Spec->catdir( $szPolyDataBaseDir, "*", "*"));
#  my( @pszFiles) = glob( "../../*");

  if( $gbDebug) {
    print( "#" x 40, $/);
    print( "# 1) Raw listing", $/);
    map( { print( $_, $/); } @pszFiles);
  };

  my( $szPattern);

  my( $q) = new CGI();

  ####################
  my( $szPolyCode) = $q->url_param( 'poly');
  defined( $szPolyCode) or ($szPolyCode = $q->param( 'poly'));

  if( defined( $szPolyCode) && exists( $pbPolySet{ $szPolyCode})) {
    $szPattern = quotemeta( File::Spec->catfile( '', $szPolyCode, ''));

    if( $gbDebug) {
      print( "#" x 40, $/);
      print( "# 1a) grep for ", $szPattern, $/);
    };

    @pszFiles = grep( /$szPattern/, @pszFiles);

    if( $gbDebug) {
      map( { print( $_, $/); } @pszFiles);
    };
  };

  ####################
  my( $szDataType) = $q->url_param( 'data');
  defined( $szDataType) or ($szDataType = $q->param( 'data'));

  if( defined( $szDataType) && exists( $pbDataType{ $szDataType})) {
    $szPattern = quotemeta( "." . $pbDataType{ $szDataType}) . "\$";

    if( $gbDebug) {
      print( "#" x 40, $/);
      print( "# 1b) grep for ", $szPattern, $/);
    };

    @pszFiles = grep( /$szPattern/, @pszFiles);

    if( $gbDebug) {
      map( { print( $_, $/); } @pszFiles);
    };
  };

  ####################
  @pszFiles = sort( { (stat( $b))[9] <=> (stat( $a))[9]; } @pszFiles);

  if( $gbDebug) {
    print( "#" x 40, $/);
    print( "# 2) Sorted by file mod date.", $/);

    foreach my $f (@pszFiles) {
      my( $szLastMod);
      $szLastMod = localtime( (stat( $f))[9]);
      print( $szLastMod, " : ", $f, $/);
    };
  };

  ####################
  if( $gbDebug) {
    print( "#" x 40, $/);
  };

  my( @pszRawData);

  my( $szPatternTxt) = quotemeta( "." . $pbDataType{ "TEXT"}) . "\$";
  my( $szPatternImg) = quotemeta( "." . $pbDataType{ "IMAGE"}) . "\$";

  foreach my $f (@pszFiles) {
    my( $szSubDir) = (File::Spec->splitdir(
                          substr( $f, length( $szPolyDataBaseDir) + 1)))[0];

    if( (!defined( $szDataType) || ($szDataType eq "TEXT")) &&
        ($f =~ /$szPatternTxt/))
    {
      # Need to load text file(s).
      if( $gbDebug) {
        print( "# 2a) Loading data from \"", $f, "\"", $/);
      };

      my( $fpIn);

      open( $fpIn, "$f") or die( "Couldn't open \"", $f, "\" for reading.", $/);
      my( @pszLines) = <$fpIn>;
      close( $fpIn);

      foreach my $szLine (@pszLines) {
        chomp( $szLine);
        if( !( $szLine)) {
          next;
        };
        if( $szLine =~
            s/$rxQueueInfo
             /join( "\t", $szSubDir, $1, defined( $3) ? $3 : "", $2)/ex)
        {
          push( @pszRawData, $szLine);
          if( $gbDebug) {
            print( "> ", $szSubDir, " ", $pszRawData[ -1], $/);
          };
        }
        else {
          if( $gbDebug) {
            print( "No match \"", $szLine, "\"", $/);
          };
        };
      };
    };

    if( (!defined( $szDataType) || ($szDataType eq "IMAGE")) &&
        ($f =~ /$szPatternImg/))
    {
      # Want to keep images file(s).
      if( $gbDebug) {
        print( "# 2b) Include image file \"", $f, "\"", $/);
      };

      push( @pszRawData, join( "\t", $szSubDir, $f));
    };
  };

  if( $gbDebug) {
    print( "#" x 40, $/);
    print( "# 3) Raw text and image file information extracted.", $/);
    map( { print( $_, $/); } @pszRawData);
  };

  ####################
  my( $szQueueArea) = $q->url_param( 'area');
  defined( $szQueueArea) or ($szQueueArea = $q->param( 'area'));

  if( defined( $szQueueArea) && exists( $pbQueueArea{ $szQueueArea})) {
    if( $gbDebug) {
      print( "#" x 40, $/);
      print( "# 3a) grep for ", $szQueueArea, $/);
    };

    @pszRawData = grep( /$szQueueArea/i, @pszRawData);

    if( $gbDebug) {
      map( { print( $_, $/); } @pszRawData);
    };
  };

  ####################
  if( $gbDebug) {
    print( "#" x 40, $/);
  };

  if( defined( $szDataType) && ($szDataType eq "IMAGE")) {
    $szPattern = quotemeta( "." . $pbDataType{ "IMAGE"}) . "\$";
    my( $szImageFile) =
        (split( /\t/, (grep( /$szPattern/, @pszRawData))[0]))[-1];

    if( $gbDebug) {
      print( "# 4a) Returning image file \"", $szImageFile, "\"", $/);
    };
#    print header( -type=>'image/jpeg');
    print header( -type=>'image/jpeg',
                  -attachment=>
                      "temp-" . (File::Spec->splitdir( $szImageFile))[-1]);
    if( !( $gbDebug)) {
      my( $szBuffer);
      my( $fpIn);
      open( $fpIn, "$szImageFile") or
        die( "Couldn't open \"", $szImageFile, "\" for reading.", $/);
      binmode( $fpIn);
      while( read( $fpIn, $szBuffer, 100)) {
        print( $szBuffer);
      };
      close( $fpIn);
    };
  }
  else {
    @pszRawData = sort( @pszRawData);

    if( $gbDebug) {
      print( "# 4b) Returning tsv data.", $/);
      map( { print( $_, $/); } @pszRawData);
    };

    print header( -attachment=>'temp_poly.tsv');
# return;

    my( $szPoly);

    while( @pszRawData) {
      my( @pszTemp) = split( "\t", shift( @pszRawData));

      if( !defined( $szPoly)) {
        $szPoly = $pszTemp[0];
        print( $szPoly);
      }
      else {
        if( $szPoly ne $pszTemp[0]) {
          $szPoly = $pszTemp[0];
          print( $/, $szPoly);
        };
      };

      print( "\t");
      print( pop( @pszTemp));
    };
  };
};

####################
&main( @ARGV);

# Usage: $0 poly=QTP data=IMAGE area=CONSULTATION
# Usage: $0 poly=QTP data=TEXT area=REGISTRATION
# Usage: $0 poly=QTP area=CONSULTATION
# Usage: $0 poly=QTP
# Usage: $0
# Usage: $0 area=CONSULTATION
# Usage: $0 data=IMAGE

