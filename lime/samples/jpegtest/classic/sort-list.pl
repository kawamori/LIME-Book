#$DirName = "G:\\ToshibaPCMI\\MISC\\VAPNIK\\Pics";
$DirName = ".";
$Prefix="pic";
$ct=0;

open(OUT,">outlist.txt");

# Get a list of the files
opendir(DIR, $DirName);
@Files1 = readdir(DIR);
closedir(DIR);

# Loop thru each of these files
foreach $File (@Files1) { 
	$ct++;	
	# Get information (including last modified date) about file
	@FileData = stat($DirName."/".$File);
	
	# Push this into a new array with date at front
	push(@Files, $ct,@FileData[9]."&&".$File);


	
}

# Sort this array
#@Files = reverse(sort(@Files));

@Files = sort(@Files);



# Loop thru the files
foreach $File (@Files) { 
	
	# Get the filename back from the string
	($Date,$FileName) = split(/\&\&/,$File);
	if (length($FileName)>2){
	# Print the filename
	    print OUT "$FileName \n";}
	
}
