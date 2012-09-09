#! /usr/bin/perl -w

use strict;

use File::Spec;
use File::Temp;
use CGI;
use LWP::UserAgent;
use XML::Parser;

my( $gbDebug) = 0;
my( @pszDayOfWeek) = qw( Sun Mon Tue Wed Thu Fri Sat);

my( $grxNumber) = qr/^\d+\.\d+$/;
my( $gszCurrentWebFn) = undef;
my( $gnHandled) = 0;

my( @gpszTagStack) = ();

my( @pnTimeStamp);
my( $tFile);

######################################################################
my( %pszProxyByMeterType) = (
    POWER => 'http://192.168.234.6:8080/axis2/services/PowerUsageService',
    WATER => 'http://192.168.234.6:8080/axis2/services/WaterUsageService',
#    POWER => 'file://E:/IPTV/NTT/script/meter',
#    WATER => 'file://E:/IPTV/NTT/script/meter',
    CONTROL => 'http://192.168.234.6:8080/axis2/services/HomeAutomation',
    DEVICE => 'http://192.168.234.110:8080/PowerUsageService',
);

########################################
my( %gppMeterFnDataMap) = (
  # Get realtime usage.
  'getRealtimeMeterReading' => [
    'sh:RealtimeMeterReading',
    {
      'sh:Reading' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [],
    2,
  ],
);

########################################
my( %gppnOffsetRandPair) = (
  'L_ZONE'  => [ 10, 0],
  'E_ZONE'  => [ 20, 0],
  'K_ZONE'  => [ 30, 0],
  'B_ZONE'  => [ 40, 0],
  'C_ZONE'  => [ 50, 0],
  'M_ZONE'  => [ 60, 0],
  'T_ZONE'  => [ 70, 0],
  'X1_ZONE' => [ 80, 0],
  'X2_ZONE' => [ 90, 0],
);

my( %gpnPrevValue);

######################################################################
######################################################################
sub inRightBranch {
  if( !defined( $gszCurrentWebFn) or
      !exists( $gppMeterFnDataMap{ $gszCurrentWebFn}))
  {
#    print( 'XXXX.1', $/);
    return( undef);
  };

  my( $nNestSkip) = $gppMeterFnDataMap{ $gszCurrentWebFn}[3];

  defined( $nNestSkip) or ($nNestSkip = 0);

  if( scalar( @gpszTagStack) <= $nNestSkip) {
#    print( 'XXXX.2 ', scalar( @gpszTagStack), ' v.s. ',
#           $gppMeterFnDataMap{ $gszCurrentWebFn}[3], $/);
    return( undef);
  };

  if( $gpszTagStack[ $nNestSkip] ne $gppMeterFnDataMap{ $gszCurrentWebFn}[0]) {
#    print( 'XXXX.3', $/);
    return( undef);
  };

#  print( 'XXXX.4', $/);
  return( $gppMeterFnDataMap{ $gszCurrentWebFn}[1]);
};

######################################################################
sub magnifyNum {
  my( $szValue) = shift;
  my( $nMultiple) = shift;

  defined( $nMultiple) or ($nMultiple = 1000);

  if( !( $szValue =~ /$grxNumber/)) {
    return( $szValue);
  };

  return( int( $szValue * $nMultiple));
};

######################################################################
######################################################################
sub parseStart {
  my( $pLowLevel) = shift;
  my( $szElement) = shift;
  my( %pszAttrValMap) = @_;

  my( $ppHandlerTemplate) = &inRightBranch();

  if( defined( $ppHandlerTemplate) &&
      exists( $$ppHandlerTemplate{ $szElement}))
  {
    if( $$ppHandlerTemplate{ $szElement}[0]) {
      # Want to capture body.
      $pLowLevel->setHandlers( Char => \&parseChar);
    };

    if( ($gnHandled % scalar( keys %{ $ppHandlerTemplate})) > 0) {
      # Previous field was not last field to be captured for forming a
      # complete record, so prepend a field separator before current field.
      print( "\t");
    };

    if( $gbDebug) {
      print( $szElement, ':');
    };

    if( defined( $$ppHandlerTemplate{ $szElement}[1])) {
      for( my $i = 0; $i < scalar( @{ $$ppHandlerTemplate{ $szElement}[1]});
          $i++)
      {
        if( $i == 0) {
          print( $tFile join( "\t", @pnTimeStamp));
        };
        print( $tFile "\t");
        print( $tFile
               &magnifyNum( $pszAttrValMap{
								$$ppHandlerTemplate{ $szElement}[1][ $i]}));
      };
    };

    $gnHandled++;
  };

  push( @gpszTagStack, $szElement);
};

######################################################################
sub parseChar {
  # Skip low-level EXPAT parser.
  shift;

  print( shift);
};

######################################################################
sub parseEnd {
  my( $pLowLevel) = shift;
  my( $szElement) = shift;

  scalar( @gpszTagStack) or
    die( "Closing tag </", $szElement, "> encountered before any opening tags.",
         $/);

  my( $szLastTag) = pop( @gpszTagStack);

  if( $szLastTag ne $szElement) {
    return;
  };

  my( $ppHandlerTemplate) = &inRightBranch();

  if( !defined( $ppHandlerTemplate) ||
      !exists( $$ppHandlerTemplate{ $szElement}))
  {
    return;
  };

  if( $$ppHandlerTemplate{ $szElement}[0]) {
    # Was capturing body in just-exited field.
    $pLowLevel->setHandlers( Char => undef);
  };

  if( ($gnHandled % scalar( keys %{ $ppHandlerTemplate})) == 0) {
    # Previous field was last field to be captured for forming a complete
    # record, so prepend a newline before just-exited field.
    print( $tFile ($gbDebug ? '[EOL]' : ''), $/);
  };
};

######################################################################
######################################################################
sub genTimeStamp {
  my( @pszReturn) = (localtime())[ 5, 4, 3, 2, 1, 0, 6];

  $pszReturn[ 0] += 1900;
  $pszReturn[ 1]++;
  $pszReturn[ -1] = $pszDayOfWeek[ $pszReturn[ -1]];

  return( wantarray()
            ? @pszReturn
            : sprintf( "\%04d\%02d\%02d \%02d:\%02d:\%02d \%3s", @pszReturn));
};

########################################
sub main_GET {
  my( $szMeterType) = shift;
  my( $szFile) = shift;

  $gszCurrentWebFn = 'getRealtimeMeterReading';

  defined( $szFile) or ($szFile = $gszCurrentWebFn);

  my( $szUrl) = join( '/', $pszProxyByMeterType{ $szMeterType}, $szFile);

  if( $gbDebug) {
    print( "GET \"", $szUrl, "\"", $/);
  };

  my( $ua) = LWP::UserAgent->new();

  my( $res) = $ua->get( "$szUrl");

  $res->is_success() or die( "Couldn't access \"", $szUrl, "\"", $/);

#  print( $res->content());

  my( $xp) = new XML::Parser();

  $xp->setHandlers( Start => \&parseStart, End => \&parseEnd );
  $xp->parse( $res->content());
};

########################################
sub main {
  my( $nMaxLoop) = shift;

  if( defined( $nMaxLoop) && !( $nMaxLoop =~ /^\d+$/)) {
     unshift( @_, $nMaxLoop);
     $nMaxLoop = undef;
  };

  my( $szMeterType) = shift;

  my( $nSecPerPt) = shift;

  if( defined( $nSecPerPt) && !( $nSecPerPt =~ /^\d+$/)) {
     unshift( @_, $nSecPerPt);
     $nSecPerPt = undef;
  };

  my( $szLocalXml) = shift;

  defined( $szMeterType) or ($szMeterType = "POWER");

  $szMeterType = uc( $szMeterType);

  my( $xPixel) = 180;
  my( $xThick) = 15;
  my( $xSep) = 0;
  defined( $nSecPerPt) or ($nSecPerPt = ($szMeterType eq 'SINE') ? 1 : 30);
  my( $nBufferSec) = $nSecPerPt * 1;

  my( $szTempPrefix) = '_now_' . $szMeterType . '_' . 'X' x 4;
  my( $szCacheDir) = 'tsv_cache';

  if( !( -e "$szCacheDir")) {
    print( "Creating cache directory \"", $szCacheDir, "\"", $/);
    mkdir( "$szCacheDir", 0755);
  }
  else {
    if( !( -d "$szCacheDir")) {
      die( "Cache path \"", $szCacheDir, "\" is not a directory", $/);
    };
  };

#  my( $nBufferPt) = int( $nBufferSec / $nSecPerPt);
#
#  if( $nBufferPt == 0) {
#    $nBufferPt = 1;
#    $nBufferSec = $nBufferPt * $nSecPerPt;
#  };

  my( $nPoint) = int( ($xPixel + $xSep) / ($xThick + $xSep) +
                      $nBufferSec / $nSecPerPt);

  my( $nSecModulo) = $nSecPerPt * $nPoint;

  my( $nRandAvg) = int( rand( 99999) + 1);

  my( @pszDevices) = keys % gppnOffsetRandPair;

  if( $szMeterType eq 'SINE') {
    $nRandAvg = 0;

    foreach my $dev (@pszDevices) {
      $gppnOffsetRandPair{ $dev}[ -1] = int( rand( 99999) + 1); 
      $nRandAvg += $gppnOffsetRandPair{ $dev}[ -1];
    };

    $gppnOffsetRandPair{ 'TOTAL'} = [ 100, $nRandAvg];
    push( @pszDevices, 'TOTAL');
  };

  my( $nSeqIdx) = int( time() % $nSecModulo / $nSecPerPt);

  print( 'Window size (pts) = ', $nPoint, $/);
  print( 'Window size (sec) = ', $nSecModulo, $/);
  print( 'Average value = ', $nRandAvg, $/);

  my( $nFieldWidth) = int( log( $nPoint * 2) / log( 10) + 0.5);

  defined( $nMaxLoop) or ($nMaxLoop = ($gbDebug ? $nPoint * 2 : -1));

  my( $x) = 0;

  while( $x++ != $nMaxLoop) {
    my( $szFile) =
        File::Spec->catdir(
            $szCacheDir,
            sprintf( "rt_\%s_\%03d.tsv", $szMeterType, $nSeqIdx % $nPoint + 1));

    $tFile = new File::Temp(
        UNLINK => $gbDebug,
        DIR => $szCacheDir,
        TEMPLATE => $szTempPrefix,
        SUFFIX => '.tsv'
    );

    if( $gbDebug) {
      print( "Temp file = \"", $tFile->filename(), "\"", $/);
    };

    @pnTimeStamp = &genTimeStamp();

    if( $szMeterType eq "SINE") {
      foreach my $dev (@pszDevices) {
        my( $nVal) =
            int( $gppnOffsetRandPair{ $dev}[ -1]
                 + sin( ($nSeqIdx + $gppnOffsetRandPair{ $dev}[ 0]) % 360)
                 * $gppnOffsetRandPair{ $dev}[ -1]);

        print( $tFile join( "\t", &genTimeStamp(), $dev, $nVal), $/);

        print( sprintf( "\%*d: \%s <- \%s",
                        $nFieldWidth, $x, $tFile->filename(),
                        join( " : ", &genTimeStamp(), $dev, $nVal)), $/);
      };
    }
    else {
      &main_GET( $szMeterType, $szLocalXml);

      print( sprintf( "\%s <- \%s", $szFile, $tFile->filename()), $/);
    };

    close( $tFile);

    if( !( $gbDebug)) {
      rename( $tFile->filename(), "$szFile");
      chmod( 0644, "$szFile");
    };

    $nSeqIdx++;

    if( !( $gbDebug)) {
      sleep( $nSecPerPt);
    };
  };
};

####################
&main( @ARGV);

# Usage: $0 -1
# Usage: $0 5
# Usage: $0 5 power
# Usage: $0 5 water
# Usage: $0 5 sine
# Usage: $0 sine
# Usage: $0 device

