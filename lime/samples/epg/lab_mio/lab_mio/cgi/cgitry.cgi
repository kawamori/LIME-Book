#!/usr/local/bin/perl

# hello.pl -- my first perl script!
use CGI ':standard';

print header();
print start_html();

#print "Content-type: text/html\n\n";
for $i (param()) {
	print "<b>", $i, "</b>:", param($i), "<br>\n";
}
print end_html();
