$MAX_LENGTH=1000;

# 排他ロック
sub lockex {
	flock($_[0], 2);
}

# アンロック
sub unlock {
	flock($_[0], 8);
}

# リクエストパラメータの取得
sub get_parameter {
	local($s, $c, $i);
	
	# POSTかどうか、パラメータ長は適切かどうかを確認する
	if (
		$ENV{'REQUEST_METHOD'} ne 'POST' ||
		$ENV{'CONTENT_LENGTH'}>$MAX_LENGTH
	) {
		print "error,parameter";
		exit;
	}
	
	# パラメータの取得
	read(STDIN, $s, $ENV{'CONTENT_LENGTH'});

	# パラメータに不適切な文字がないかどうかを確認する
	if ($s!~/^[A-Za-z0-9,]*$/) {
		print "error,parameter";
		exit;
	}

	# パラメータの分割
	return split(',', $s);
}

# ファイルを開いて読み込む
sub open_file {
	local($s, @a);

	# ファイルを読み込みモードで開いてロックする
	$file=$_[0];
	if (open(FP, "<$file")==0) {
		print "error,file";
		exit;
	}
	lockex(FP);

	# ファイルを配列に読み込む
	while (eof(FP)!=1) {
		$s=<FP>;
		chomp($s);
		push(@a, $s);
	}

	# ファイルを閉じる
	close(FP);

	return @a;
}

# ファイルに書き込んで閉じる
sub close_file {
	local($i);
	
	# ファイルを書き込みモードで開く
	if (open(FP, ">$file")==0) {
		print "error,file";
		unlock(FP);
		exit;
	}

	# 配列をファイルに書き込む
	for ($i=0; $i<=$#_; $i++) {
		print FP "$_[$i]\n";
	}

	# ファイルを閉じてアンロックする
	close(FP);
	unlock(FP);
}

