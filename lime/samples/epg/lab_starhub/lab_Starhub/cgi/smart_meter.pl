#! /usr/bin/perl -w

use strict;

use CGI;
use LWP::UserAgent;
use XML::Parser;

my( $gbDebug) = 0;
my( $gszCurrentWebFn) = undef;
my( $gnHandled) = 0;

my( @gpszTagStack) = ();

######################################################################
my( $szProxy) =
#    'http://power.starhomeWS'
#    'http://192.168.234.6:8080'
#    'http://192.168.234.6:8080/axis2/services/PowerUsageService'
#    'http://192.168.234.6:8080/axis2/services/HomeAutomation'
#    'http://gbhs.i2r.a-star.edu.sg/CI/index.php/VideoWSVC'
    'file://E:/IPTV/NTT/lab_beta100122/cgi'
#    'file://var/www/html/lab_beta/cgi'
;

my( $szFileProxy) = $szProxy;

my( $szServer) = 'JA';

my( %pszServerMap) = (
    JA => 'http://192.168.234.6:8080/axis2/services',
    SB => 'http://192.168.234.110:8080',
);

my( %pszProxyByMeterType) = (
    POWER => 'PowerUsageService',
    WATER => 'WaterUsageService',
    CONTROL => 'HomeAutomation',
);

my( @pszMonths) = qw( jan feb mar apr may jun jul aug sep oct nov dec);
my( %pszMonthMap);

map( { $pszMonthMap{ $_} = $pszMonths[ $_ - 1]; } (1 .. 12));

########################################
my( %gppMeterFnDataMap) = (

  ########################################
  # Format:
  #
  # <web_function_name> => [
  #   <response_main_tag_name>,
  #   {
  #     <response_sub_tag_name> => [ <want_body_flag>, [
  #       <return_attr_to_capture_1>,
  #       ...
  #     ]]
  #   },
  #   [ [ <outbound_GET_request_param_name_1>,
  #       <inbound_GET_request_param_name_1>,
  #       <default_param_value_1> ],
  #     [ ..., ..., ... ],
  #   ]
  #   <nest_level_of_response_main_tag>
  # ]
  #

  ####################
  # Electricity / Water

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

  # Get daily usage.
  'getDailyMainUsage' => [
    'sh:DailyMainUsage',
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [],
    2,
  ],

  'getZoneDailyUsage' => [
    qr/^sh\:[A-Z][A-Z0-9_]+DailyUsage/,
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [ [ 'zone', 'zone', 'TOTAL' ]
    ],
    2,
  ],

  'getSpecificDailyUsage' => [
    qr/^sh\:[A-Z][A-Z0-9_]+DailyUsage/,
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [ [ 'zone', 'zone', 'TOTAL' ],
      [ 'date', 'to_date', '01-01-2010', \&transformDateDaily ]
    ],
    2,
  ],

  # Get monthly usage.
  'getMthlyMainUsage' => [
    'sh:MthlyMainUsage',
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [],
    2,
  ],

  'getZoneMthlyUsage' => [
    qr/^sh\:[A-Z][A-Z0-9_]+MthlyUsage/,
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [ [ 'zone', 'zone', 'TOTAL' ]
    ],
    2,
  ],

  'getSpecificMthlyUsage' => [
    qr/^sh\:[A-Z][A-Z0-9_]+MthlyUsage/,
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [ [ 'zone', 'zone', 'TOTAL' ],
      [ 'date', 'to_date', '01-01-2010', \&transformDateMonthly ]
    ],
    2,
  ],

  # Get yearly usage.
  'getYrlyMainUsage' => [
    'sh:YrlyMainUsage',
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [],
    2,
  ],

  'getZoneYrlyUsage' => [
    qr/^sh\:[A-Z][A-Z0-9_]+YrlyUsage/,
    {
      'sh:Usage' => [ 0, [
         'sh:Id',
         'sh:Value'
      ]]
    },
    [ [ 'zone', 'zone', 'TOTAL' ]
    ],
    2,
  ],

  ####################
  # Remote Device Control

  # Get light status.
  'isLightOn' => [
    'ns:isLightOnResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'X_ZONE' ]
    ]
  ],

  # Set light on.
  'lightOn' => [
    'ns:lightOnResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'X_ZONE' ]
    ]
  ],

  # Set light off.
  'lightOff' => [
    'ns:lightOffResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'X_ZONE' ]
    ]
  ],

  # List devices.
  'listDevices' => [
    'ns:listDevicesResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [],
  ],

  ####################
  # Remote Device Control (Standalone)

  # Get power status.
  'isPowerOn' => [
    'ns:isPowerOnResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'AC0' ]
    ]
  ],

  # Set power on.
  'powerOn' => [
    'ns:powerOnResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'AC0' ]
    ]
  ],

  # Set power off.
  'powerOff' => [
    'ns:powerOffResponse',
    {
      'ns:return' => [ 1, undef ],
    },
    [ [ 'grpAddressKey', 'device', 'AC0' ]
    ]
  ],

  ####################
  # News Search

  # Get video search result page.
  'VideoWSVC.CTRL_getResultPage' => [
    'videoSearchResult',
    {
      'videoId' => [ 1, undef ],
      'location' => [ 1, undef ],
    },
    [ [ 'searchId', 'int' ],
      [ 'pageLength', 'int' ],
      [ 'pageIdx', 'int' ],
    ]
  ],

  # Get video genre list.
  'VideoWSVC.CTRL_getGenreListASMP' => [
    'genreListResult',
    {
      'GenreID' => [ 1, undef ],
      'GenreName' => [ 1, undef ],
    },
    []
  ],
);

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
#    print( 'XXXX.2 ', scalar( @gpszTagStack), ' v.s. ', $nNestSkip, $/);
    return( undef);
  };

#  print( ref( $gppMeterFnDataMap{ $gszCurrentWebFn}[0]), $/);

  if( ref( $gppMeterFnDataMap{ $gszCurrentWebFn}[0]) eq "Regexp") {
    if( !( $gpszTagStack[ $nNestSkip] =~
           /$gppMeterFnDataMap{ $gszCurrentWebFn}[0]/))
    {
#      print( 'XXXX.3a', $/);
      return( undef);
    };
  }
  else {
    if( $gpszTagStack[ $nNestSkip] ne $gppMeterFnDataMap{ $gszCurrentWebFn}[0])
    {
#      print( 'XXXX.3b', $/);
      return( undef);
    };
  };

#  print( 'XXXX.4', $/);
  return( $gppMeterFnDataMap{ $gszCurrentWebFn}[1]);
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
        if( $i > 0) {
          print( "\t");
        };
        print( $pszAttrValMap{ $$ppHandlerTemplate{ $szElement}[1][ $i]});
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
    print( ($gbDebug ? '[EOL]' : ''), $/);
  };
};

######################################################################
sub genQueryPart {
  my( $q) = shift;
  my( $szCurrentWebFn) = shift;

  if( !exists( $gppMeterFnDataMap{ $szCurrentWebFn})) {
    return( '');
  };

  my( @pszReturn);

  foreach my $ppszTriple (@{ $gppMeterFnDataMap{ $szCurrentWebFn}[2]}) {
    my( $szQuery, $szParam, $szDefault, $pfnOpt) = @{ $ppszTriple};

    my( $szValue) = $q->param( $szParam);
    defined( $szValue) or ($szValue = $q->url_param( $szParam));
    defined( $szValue) or ($szValue = $szDefault);

    if( defined( $pfnOpt)) {
      $szValue = &$pfnOpt( $szValue);
    };

    push( @pszReturn, sprintf( "\%s=\%s", $szQuery, $szValue));
  };

  return( (scalar( @pszReturn) ? '?' : '') . join( '&', @pszReturn));
};

######################################################################
sub transformDate {
  my( $szToDate) = shift;
  my( $szScale) = shift;

  if( $szToDate =~ /^(\d{4})(\d{2})(\d{2})$/) {
    if( lc( $szScale) eq "daily") {
      $szToDate = sprintf( "\%02d-\%02d-\%04d", $3, $2, $1);
    }
    elsif( lc( $szScale) eq "monthly") {
      $szToDate = sprintf( "\%s-\%04d", $pszMonthMap{ int( $2)}, $1);
    }
    else {
      undef( $szToDate);
    };
  }
  else {
    undef( $szToDate);
  };

  return( $szToDate);
};

######################################################################
sub transformDateDaily {
  return( &transformDate( shift, "daily"));
};

######################################################################
sub transformDateMonthly {
  return( &transformDate( shift, "monthly"));
};

########################################
sub main_GET {
  my( $q) = new CGI();

  my( $szMeterType) = $q->param( 'type');
  defined( $szMeterType) or ($szMeterType = $q->url_param( 'type'));

  if( defined( $szMeterType)) {
    $szProxy = join( '/', $pszServerMap{ $szServer},
                          $pszProxyByMeterType{ uc( $szMeterType)});
  };

  defined( $szMeterType) or ($szMeterType = 'Power');

#  $szMeterType = ucfirst( lc( $szMeterType));
  $szMeterType = uc( $szMeterType);

  my( $szScale) = $q->param( 'scale');
  defined( $szScale) or ($szScale = $q->url_param( 'scale'));
  defined( $szScale) or ($szScale = 'Daily');

  my( $szAction) = $q->param( 'action');
  defined( $szAction) or ($szAction = $q->url_param( 'action'));
  defined( $szAction) or ($szAction = 'isLightOn');

  my( $szToDate) = $q->param( 'to_date');
  defined( $szToDate) or ($szToDate = $q->url_param( 'to_date'));

  if( defined( $szToDate)) {
    $szToDate = &transformDate( $szToDate, $szScale);
  };

  $szScale =~ s/^(m)on(thly)$/$1$2/i;
  $szScale =~ s/^(y)ea(rly)$/$1$2/i;
  $szScale = ucfirst( lc( $szScale));

#  $gszCurrentWebFn = sprintf( "get\%sMainUsage", $szScale);
  $gszCurrentWebFn =
      sprintf( "get\%s\%sUsage",
               defined( $szToDate) ? "Specific" : "Zone", $szScale);

  if( $szMeterType eq 'CONTROL') {
    $gszCurrentWebFn = $szAction;
    $szScale = $szAction;
  };

  my( $szDevice) = $q->param( 'device');
  defined( $szDevice) or ($szDevice = $q->url_param( 'device'));

  if( defined( $szDevice) && ($szDevice =~ /^AC[01]$/)) {
    $szServer = 'SB';
    $szProxy = join( '/', $pszServerMap{ $szServer},
                          $pszProxyByMeterType{ uc( $szMeterType)});
    $gszCurrentWebFn =~ s/([lL])ight/(($1 eq 'l') ? 'p' : 'P') . "ower"/e;
  };

  my( $szFile) = $q->param( 'file');
  defined( $szFile) or ($szFile = $q->url_param( 'file'));

  my( $szUrl) = join( '/', $szProxy, $gszCurrentWebFn)
                . &genQueryPart( $q, $gszCurrentWebFn);

  if( defined( $szFile)) {
    $szUrl = join( '/', $szFileProxy, $szFile);
  };

  if( $gbDebug) {
    print( "GET \"", $szUrl, "\"", $/);
  };

  my( $ua) = LWP::UserAgent->new();

  my( $res) = $ua->get( "$szUrl");

  $res->is_success() or die( "Couldn't access \"", $szUrl, "\"", $/);

#  print( $res->content());

  print $q->header( -attachment=>sprintf( "temp_\%s.tsv", lc( $szScale)));

  my( $xp) = new XML::Parser();

  $xp->setHandlers( Start => \&parseStart, End => \&parseEnd );
  $xp->parse( $res->content());
};

####################
&main_GET( @ARGV);

# Usage: $0
# Usage: $0 searchId=873 pageLength=10 pageIdx=0
# Usage: $0 "searchId=873&pageLength=10&pageIdx=0"
#
# Usage: $0 type=power scale=daily
# Usage: $0 type=water scale=monthly
# Usage: $0 type=power scale=yearly
#
# Usage: $0 type=power scale=daily zone=M_ZONE
# Usage: $0 type=power scale=daily zone=M_ZONE to_date=20100101
# Usage: $0 type=power scale=monthly zone=M_ZONE to_date=20100101
#
# Usage: $0 type=power scale=daily file=elect_daily_zone.xml
# Usage: $0 type=power scale=daily file=elect_daily_specific.xml
#
# Usage: $0 type=control device=M_ZONE action=lightOn
# Usage: $0 type=control device=M_ZONE action=lightOff
# Usage: $0 type=control device=M_ZONE action=isLightOn
#
# Usage: $0 type=control device=AC0 action=lightOn
# Usage: $0 type=control device=AC0 action=lightOff
# Usage: $0 type=control device=AC0 action=isLightOn

