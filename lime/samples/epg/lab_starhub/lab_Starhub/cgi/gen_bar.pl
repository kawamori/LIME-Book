#! /usr/bin/perl -w

use strict;

use File::Spec;

my( $nHeight) = 500;
my( $nGridLine) = 20;
my( $nThick) = 13;
my( $nBorder) = 8;
my( $bVertical) = 1;

my( $nStepSize) = 5;

my( $szColourBg) = 'none';
my( $szColourFg) = 'red';
my( $szColourLine) = 'white';

my( $bHorizontal) = ($bVertical ? 0 : 1);
my( $nWidth) = $nThick + $nBorder * 2;

my( $szMagickExe) =
    File::Spec->catdir( qw( E: IPTV tools ImageMagick convert.exe));

########################################
sub main {
  (-e "$szMagickExe")
    or die( "ImageMagick command not found: \"", $szMagickExe, "\"", $/);

  my( $nOpIdx) = shift;

  defined( $nOpIdx) or ($nOpIdx = 0);

  my( $nInterval) = int( $nHeight / $nGridLine);

  print( $nInterval, $/);

  my( @pnDim) = ($nWidth, $nHeight);

  my( $szDrawLineFmt) = "line \%d,\%d \%d,\%d";
  my( @pnLineCoord) = (0, 0, $nWidth, 0);
  my( @pnLineDelta) = (0, $nInterval, 0, $nInterval);

  my( @pnRectCoord) = ($nBorder, $nHeight, $nBorder + $nThick, $nHeight);
  my( @pnRectDelta) = (0, 0, 0, -$nStepSize);

  if( $bHorizontal) {
    @pnDim = @pnDim[ 1, 0];
    @pnLineCoord = @pnLineCoord[ 1, 0, 3, 2];
    @pnLineDelta = @pnLineDelta[ 1, 0, 3, 2];

    @pnRectCoord = @pnRectCoord[ 1, 0, 3, 2];
    @pnRectDelta = @pnRectDelta[ 1, 0, 3, 2];
  };

  my( @pszShapes);

  for( my $i = 0; $i < $nGridLine; $i++) {
    map( { $pnLineCoord[ $_] += $pnLineDelta[ $_]; } (0 .. 3));
    push( @pszShapes, sprintf( $szDrawLineFmt, @pnLineCoord));
  };

  my( $szBaseCmdFmt) =
      $szMagickExe . " -size \%dx\%d xc:\%s -fill \%s -draw \"\%s\"";

  my( $szOpFileFmt) =
      sprintf( " \%sbar\%\%04d.\%s", $bVertical ? 'y' : 'x', "jpg");

  my( $szExtraDrawFmt) =
      " -fill \%s -draw \"rectangle \%d,\%d \%d,\%d\"";

  my( $szCmdFmt) = $szBaseCmdFmt . $szOpFileFmt;

  my( $szCmd) = sprintf( $szCmdFmt, @pnDim, $szColourBg, $szColourLine,
                                    join( " ", @pszShapes), $nOpIdx);
#  print( $szCmd, $/);
#  system( $szCmd);

  $szCmdFmt = sprintf( $szBaseCmdFmt, @pnDim, $szColourBg, $szColourLine,
                                      join( " ", @pszShapes)) .
              $szExtraDrawFmt . $szOpFileFmt;

  for( my $i = 0; $i <= $nHeight; $i += $nStepSize) {
    my( $szCmd) = sprintf( $szCmdFmt, $szColourFg, @pnRectCoord, $i);
    print( $szCmd, $/);
    map( { $pnRectCoord[ $_] += $pnRectDelta[ $_]; } (0 .. 3));
    system( $szCmd);
  };
};

####################
&main( @ARGV);

