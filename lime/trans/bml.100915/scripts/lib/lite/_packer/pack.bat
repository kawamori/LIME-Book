rem perl jsPacker.pl -i ../../BML.js  -o ../BML.js -e62 -f
java -jar yuicompressor-2.4.2.jar --charset euc-jp -o ../BML.js ../../BML.js
java -jar yuicompressor-2.4.2.jar --charset euc-jp -o ../BML.IPTVFJ.js ../../BML.IPTVFJ.js
perl jsPacker.pl -i ../../BML.IptvUUI.js  -o ../BML.IptvUUI.js -e62 -f
perl jsPacker.pl -i ../../BML.B24.js  -o ../BML.B24.js -e62 -f
