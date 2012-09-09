#! /usr/bin/perl -w

use strict;

use CGI qw/:standard/;
use File::Spec;
use File::Temp;

my( $gbDebug) = 0;

my( %pszWaterMap) = (
  MAIN_VALVE => "MainValve",
  BASIN_HAND_WASH => "BasinHandwash",
  DISH_WASHER => "DishWasher",
  FISH_TANK => "FishTank",
  KITCHEN_SINK_FRIDGE => "Kitchen-Fridge",
  SHOWER_BATH => "ShowerArea",
  TOILET_FLUSH => "ToiletFlush",
  WASHING_MACHINE => "WashingMachine",
);

######################################################################
sub getTsvWindow {
  my( $szDevice) = shift;
  my( $szTsv) = shift;
  my( $nSecPerPt) = shift;

  defined( $szDevice) or ($szDevice = "M_ZONE");
  defined( $szTsv) or ($szTsv = "POWER");

  if( exists( $pszWaterMap{ $szDevice})) {
    $szDevice = $pszWaterMap{ $szDevice};
  };

  my( $xPixel) = 180;
  my( $xThick) = 15;
  my( $xSep) = 0;
#  my( $nSecPerPt) = 30;
  my( $nBufferSec) = $nSecPerPt * 1;

  my( $szFilePattern) = 'rt_' . $szTsv . '_*.tsv';
  my( $szCacheDir) = 'tsv_cache';

  my( $nPoint) = int( ($xPixel + $xSep) / ($xThick + $xSep));

  my( $nSecModulo) = $nSecPerPt * $nPoint;

  if( $gbDebug) {
    print( 'Window size (pts) = ', $nPoint, $/);
    print( 'Window size (sec) = ', $nSecModulo, $/);
  };

  my( $nFieldWidth) = int( log( $nPoint * 2) / log( 10) + 0.5);

  my( $now) = time();
  my( $then) = $now - $nSecModulo;

  my( @pszFiles) = glob( File::Spec->catdir( $szCacheDir, $szFilePattern));

  if( $gbDebug) {
    print( scalar( @pszFiles), ' files', $/);
  };

  if( $gbDebug > 1) {
    $now = undef;
    map( { if( !defined( $now) || ($now < (stat( $_))[9])) {
             $now = (stat( $_))[9];
           };
         }
         @pszFiles);
  };

  my( $szNow);

  $szNow = localtime( $now);
  if( $gbDebug) {
    print( $szNow, $/);
  };

  $now -= $nBufferSec;

  $szNow = localtime( $now);
  if( $gbDebug) {
    print( $szNow, $/);
  };

  @pszFiles = grep( (($then < (stat( $_))[9]) && ((stat( $_))[9] < $now)),
                    @pszFiles);

  if( $gbDebug) {
    print( scalar( @pszFiles), ' files', $/);
  };

  @pszFiles = sort( { (stat( $a))[9] <=> (stat( $b))[9]; } @pszFiles);

#  map( { print( $_, $/); } @pszFiles);

  print header( -attachment=>'temp_realtime.tsv');

  my( $fpIn);
  my( $szLine);
  my( @pszRecords);

  map( { open( $fpIn, "$_")
           or die( "Couldn't open \"", $_, "\" for reading.", $/);
#         @pszRecords = <$fpIn>;
#         print( grep( /\t$szDevice\t/, @pszRecords));
         print( grep( /\t$szDevice\t/, <$fpIn>));
         close( $fpIn);
       }
       @pszFiles);
};

########################################
sub main {
  my( $nRunTimeSec) = shift;

  if( defined( $nRunTimeSec) && !( $nRunTimeSec =~ /^\d+$/)) {
    unshift( @_, $nRunTimeSec);
    $nRunTimeSec = undef;
  };

  defined( $nRunTimeSec) or ($nRunTimeSec = 0);

  my( $q) = new CGI();

  my( $nResolution) = $q->url_param( 'sec');
  defined( $nResolution) or ($nResolution = $q->param( 'sec'));
  defined( $nResolution) or ($nResolution = 30);

  my( $szDevice) = $q->url_param( 'device');
  defined( $szDevice) or ($szDevice = $q->param( 'device'));
  defined( $szDevice) or ($szDevice = "M_ZONE");

#  $szDevice = uc( $szDevice);

  my( $szMeterType) = $q->url_param( 'type');
  defined( $szMeterType) or ($szMeterType = $q->param( 'type'));

  $szMeterType = uc( $szMeterType);

  if( $szDevice =~ /^AC[01]$/) {
    $szMeterType = "DEVICE";
  };

  my( $future) = time() + $nRunTimeSec;

  while( time() < $future) {
    if( $gbDebug) {
      print( '#' x 60, $/);
    };
    &getTsvWindow( $szDevice, $szMeterType, $nResolution);
    sleep( 1);
  };

  &getTsvWindow( $szDevice, $szMeterType, $nResolution);
};

####################
&main( @ARGV);

# Usage (command line): $0 type=power device=M_ZONE
#                       $0 type=water device=M_ZONE
#                       $0 type=sine device=M_ZONE
#                       $0 type=device device=AC0
#
# Usage (url): http://10.24.138.136/lab/cgi/$0?type=power&device=L_ZONE
#              http://10.24.138.136/lab/cgi/$0?type=water&device=L_ZONE
#              http://10.24.138.136/lab/cgi/$0?type=sine&device=L_ZONE
#              http://10.24.138.136/lab/cgi/$0?type=device&device=AC0

