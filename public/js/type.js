jQuery(function()
	{
		Typing.init();
	});

var Typing =
	{
		init : function()
		{
			Typing.readyPage = jQuery("#readyPage");
			Typing.stagePage = jQuery("#stagePage");
			Typing.closePage = jQuery("#closePage");
			Typing.questionArea = jQuery("#question");
			Typing.commentArea = jQuery("#comment");
			Typing.inputArea = jQuery("#input");
			Typing.guideArea = jQuery("#guide");
			Typing.keybords = jQuery("#keybord .key");
			Typing.timerArea = jQuery(".timer");
			Typing.rightArea = jQuery(".right");
			Typing.wrongArea = jQuery(".wrong");
			Typing.retryButton = jQuery(".retry");
			Typing.rightPoint = 1;
			Typing.wrongPoint = 3;
			Typing.startKey = "F";

			Typing.ready();
		}
	}

Typing.ready = function()
{
	Typing.second = 60;
	Typing.rightCount = 0;
	Typing.wrongCount = 0;
	Typing.datasIndex = [];

	for(var i = 0; i < Typing.datas.length; i++) Typing.datasIndex[i] = i;

	Typing.stagePage.hide();
	Typing.closePage.hide();
	Typing.right();
	Typing.wrong();

	Typing.readyPage.fadeIn();
	Typing.activeKeybord(Typing.startKey);
	Typing.setTypingHandler(Typing.readyHandler);
}

Typing.readyHandler = function(e)
{
	if(Typing.codeToChar(e.keyCode, e.shiftKey) === Typing.startKey)
	{
		Typing.readyPage.hide();
		Typing.stagePage.show();
		Typing.timer();
		Typing.chooseQuestion();
	}
}

Typing.timer = function()
{
	Typing.timerHandler();
	Typing.timerID = setInterval(Typing.timerHandler, 1000);
}

Typing.timerHandler = function()
{
	if(Typing.second == 0)
	{
		clearInterval(Typing.timerID);
		Typing.close();
	}
	var m = Math.floor(Typing.second / 60);
	var s = Typing.second % 60;
	if(m < 10) m = "0" + m;
	if(s < 10) s = "0" + s;

	Typing.timerArea.text(m + ":" + s);
	Typing.second--;
}

Typing.chooseQuestion = function()
{
	var i = Math.floor(Math.random() * Typing.datasIndex.length);

	Typing.data = Typing.datas[Typing.datasIndex[i]];

	if(Typing.datasIndex.length > 5)
	{
		Typing.datasIndex.splice(i, 1);
	}
	Typing.input = "";
	Typing.characters = Typing.kanaToChar(Typing.data.kana);

	Typing.displayQuestion();
	Typing.dsiplayComment();
	Typing.displayCharacters();
	Typing.activeKeybord();
	Typing.setTypingHandler(Typing.typing);
}

Typing.typing = function(e)
{
	var chr = Typing.codeToChar(e.keyCode, e.shiftKey);

	if(chr)
	{
		var jadge = Typing.jadge(chr);

		if(jadge !== false)
		{
			if(jadge)
			{
				Typing.displayCharacters();
				Typing.activeKeybord();
			}
			else
			{
				Typing.chooseQuestion();
			}
			Typing.rightCount++;
			Typing.right();
		}
		else
		{
			Typing.wrongCount++;
			Typing.wrong();
		}
	}
}

Typing.jadge = function(chr)
{
	for(var i = 0; i < Typing.characters[0].length; i++)
	{
		if(Typing.characters[0][i].substr(0, 1) == chr)
		{
			Typing.input += chr;

			for(var i = 0; i < Typing.characters[0].length; i++)
			{
				if(Typing.characters[0][i].substr(0, 1) == chr)
				{
					Typing.characters[0][i] = Typing.characters[0][i].substr(1);

					if(Typing.characters[0][i].length == 0)
					{
						Typing.characters.shift();
						break;
					}
				}
				else
				{
					Typing.characters[0].splice(i, 1);
					i--;
				}
			}
			return Typing.characters.length;
		}
	}
	return false;
}

Typing.close = function()
{
	Typing.setTypingHandler();
	Typing.activeKeybord(false);
	Typing.closePage.fadeIn(1000);

	Typing.closePage.find(".right").hide()
		.delay(1500)
		.fadeIn(500);
	Typing.closePage.find(".wrong").hide()
		.delay(2500)
		.fadeIn(500);
	Typing.closePage.find(".retry").hide()
		.delay(3500)
		.fadeIn(500)
		.unbind("retry")
		.click(Typing.ready);
	Typing.closePage.find(".level").hide()
		.delay(3500)
		.fadeIn(500)
		.find("span").text(Typing.mark());
}

Typing.right = function()
{
	Typing.rightArea.text("正解した文字数： " + Typing.rightCount);
}

Typing.wrong = function()
{
	Typing.wrongArea.text("間違えた文字数： " + Typing.wrongCount);
}

Typing.mark = function()
{
	var rightPoint = Typing.rightCount * Typing.rightPoint;
	var wrongPoint = Typing.wrongCount * Typing.wrongPoint;
	var point = rightPoint - wrongPoint;
	var level = "E";

	if      (point <  25) level = "E";
	else if (point <  50) level = "E+";
	else if (point <  75) level = "D-";
	else if (point < 100) level = "D";
	else if (point < 125) level = "D+";
	else if (point < 150) level = "C-";
	else if (point < 175) level = "C";
	else if (point < 200) level = "C+";
	else if (point < 225) level = "B-";
	else if (point < 250) level = "B";
	else if (point < 275) level = "B+";
	else if (point < 300) level = "A-";
	else if (point < 325) level = "A";
	else if (point < 350) level = "A+";
	else level = "S";

	return level;
}

Typing.kanaToChar = function(str)
{
	var characters = [];

	for(var i = 0; i < str.length; i++)
	{
		var list = [];
		var s1 = str.substr(i, 1);
		var s2 = str.substr(i + 1, 1);
		var s3 = str.substr(i + 2, 1);
		var s4 = str.substr(i + 3, 1);
		var c1 = s1 ? Typing.charTable[s1] : "";
		var c2 = s2 ? Typing.charTable[s2] : "";
		var c3 = s3 ? Typing.charTable[s3] : "";
		var c4 = s4 ? Typing.charTable[s4] : "";
		var cA = s1 && s2 ? Typing.charTable[s1 + s2] : "";
		var cB = s2 && s3 ? Typing.charTable[s2 + s3] : "";
		var cC = s3 && s4 ? Typing.charTable[s3 + s4] : "";

		if(cA)
		{
			for(var iA in cA) list.push(cA[iA]);
			for(var i1 in c1) for(var i2 in c2) list.push(c1[i1] + c2[i2])

			i = i + 1;
		}
		else if(s1 == "ン")
		{
			if(s2 == "ッ")
			{
				if(!c3 || c3[0].match(/^(A|I|U|E|O|N)/) || c3[0].length == 1)
				{
					list.push("NNXTU");
					list.push("NNLTU");
					list.push("NNXTSU");
					list.push("NNLTSU");
					list.push("NXTU");
					list.push("NLTU");
					list.push("NXTSU");
					list.push("NLTSU");

					i = i + 1;
				}
				else　if(cC)
				{
					for(var iC in cC)
					{
						list.push("NN"     + cC[iC].substr(0, 1) + cC[iC]);
						list.push("NNXTU"  + cC[iC]);
						list.push("NNLTU"  + cC[iC]);
						list.push("NNXTSU" + cC[iC]);
						list.push("NNLTSU" + cC[iC]);
						list.push("N"      + cC[iC].substr(0, 1) + cC[iC]);
						list.push("NXTU"   + cC[iC]);
						list.push("NLTU"   + cC[iC]);
						list.push("NXTSU"  + cC[iC]);
						list.push("NLTSU"  + cC[iC]);
					}
					for(var i3 in c3) for(var i4 in c4)
					{
						list.push("NN"     + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
						list.push("NNXTU"  + c3[i3] + c4[i4]);
						list.push("NNLTU"  + c3[i3] + c4[i4]);
						list.push("NNXTSU" + c3[i3] + c4[i4]);
						list.push("NNLTSU" + c3[i3] + c4[i4]);
						list.push("N"      + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
						list.push("NXTU"   + c3[i3] + c4[i4]);
						list.push("NLTU"   + c3[i3] + c4[i4]);
						list.push("NXTSU"  + c3[i3] + c4[i4]);
						list.push("NLTSU"  + c3[i3] + c4[i4]);
					}
					i = i + 3;
				}
				else
				{
					for(var i3 in c3)
					{
						list.push("NN"     + c3[i3].substr(0, 1) + c3[i3]);
						list.push("NNXTU"  + c3[i3]);
						list.push("NNLTU"  + c3[i3]);
						list.push("NNXTSU" + c3[i3]);
						list.push("NNLTSU" + c3[i3]);
						list.push("N"      + c3[i3].substr(0, 1) + c3[i3]);
						list.push("NXTU"   + c3[i3]);
						list.push("NLTU"   + c3[i3]);
						list.push("NXTSU"  + c3[i3]);
						list.push("NLTSU"  + c3[i3]);
					}
					i = i + 2;
				}
			}
			else if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/))
			{
				list.push("NN");
			}
			else if(cB)
			{
				for(var iB in cB)
				{
					list.push("NN" + cB[iB]);
					list.push("N" + cB[iB]);
				}
				for(var i2 in c2) for(var i3 in c3)
				{
					list.push("NN" + c2[i2] + c3[i3]);
					list.push("N" + c2[i2] + c3[i3]);
				}
				i = i + 2;
			}
			else
			{
				for(var i2 in c2)
				{
					list.push("NN" + c2[i2]);
					list.push("N" + c2[i2]);
				}
				i = i + 1;
			}
		}
		else if(s1 == "ッ")
		{
			if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/) || c2[0].length == 1)
			{
				list.push("XTU");
				list.push("LTU");
				list.push("XTSU");
				list.push("LTSU");
			}
			else　if(cB)
			{
				for(var iB in cB)
				{
					list.push(cB[iB].substr(0, 1) + cB[iB]);
					list.push("XTU" + cB[iB]);
					list.push("LTU" + cB[iB]);
					list.push("XTSU" + cB[iB]);
					list.push("LTSU" + cB[iB]);
				}
				for(var i2 in c2) for(var i3 in c3)
				{
					list.push(c2[i2].substr(0, 1) + c2[i2] + c3[i3]);
					list.push("XTU" + c2[i2] + c3[i3]);
					list.push("LTU" + c2[i2] + c3[i3]);
					list.push("XTSU" + c2[i2] + c3[i3]);
					list.push("LTSU" + c2[i2] + c3[i3]);
				}
				i = i + 2;
			}
			else
			{
				for(var i2 in c2)
				{
					list.push(c2[i2].substr(0, 1) + c2[i2]);
					list.push("XTU" + c2[i2]);
					list.push("LTU" + c2[i2]);
					list.push("XTSU" + c2[i2]);
					list.push("LTSU" + c2[i2]);
				}
				i = i + 1;
			}
		}
		else
		{
			for(var i1 in c1) list.push(c1[i1]);
		}
		characters.push(list);
	}
	return characters;
}

Typing.codeToChar = function(keycode, shiftKey)
{
	if(Typing.codeTable[keycode])
	{
		return shiftKey ? Typing.codeTable[keycode][1] : Typing.codeTable[keycode][0];
	}
	return false;
}

Typing.charToCode = function(chr)
{
	for(var i in Typing.codeTable)
	{
		if(Typing.codeTable[i][0] == chr) return {code : i, shift : false};
		if(Typing.codeTable[i][1] == chr) return {code : i, shift : true};
	}
	return false;
}

Typing.setTypingHandler = function(eventHandler)
{
	jQuery(window).unbind("keydown");
	if(eventHandler) jQuery(window).bind("keydown", eventHandler);
}

Typing.displayQuestion = function()
{
	Typing.questionArea.text(Typing.data.question)
}

Typing.displayCharacters = function()
{
	var input = Typing.input;
	if(input.length > 5)
		input = input.substr(input.length - 5);

	var guide = input;
	for (var i in Typing.characters)
		guide += Typing.characters[i][0];

	Typing.inputArea.text(input);
	Typing.guideArea.text(guide);
}

Typing.dsiplayComment = function()
{
	Typing.commentArea.text(Typing.data.comment)
}

Typing.activeKeybord = function(nextChar)
{
	Typing.keybords.removeClass("active");

	if(nextChar !== false)
	{
		if(!nextChar)
			nextChar = Typing.guideArea.text().substr(Typing.inputArea.text().length, 1);

		var nextCode = Typing.charToCode(nextChar);

		if(nextCode.shift)
			jQuery(".shift", Typing.keybordes).addClass("active");
		jQuery(".key" + nextCode.code, Typing.keybordes).addClass("active");
	}
}

Typing.codeTable = {
	32 : [ " " , " " ],
	48 : [ "0" , ""  ],
	49 : [ "1" , "!" ],
	50 : [ "2" , '"' ],
	51 : [ "3" , "#" ],
	52 : [ "4" , "$" ],
	53 : [ "5" , "%" ],
	54 : [ "6" , "&" ],
	55 : [ "7" , "'" ],
	56 : [ "8" , "(" ],
	57 : [ "9" , ")" ],
	59 : [ ":" , "+" ], // ブラウザ差異あり
	65 : [ "A" , "A" ],
	66 : [ "B" , "B" ],
	67 : [ "C" , "C" ],
	68 : [ "D" , "D" ],
	69 : [ "E" , "E" ],
	70 : [ "F" , "F" ],
	71 : [ "G" , "G" ],
	72 : [ "H" , "H" ],
	73 : [ "I" , "I" ],
	74 : [ "J" , "J" ],
	75 : [ "K" , "K" ],
	76 : [ "L" , "L" ],
	77 : [ "M" , "M" ],
	78 : [ "N" , "N" ],
	79 : [ "O" , "O" ],
	80 : [ "P" , "P" ],
	81 : [ "Q" , "Q" ],
	82 : [ "R" , "R" ],
	83 : [ "S" , "S" ],
	84 : [ "T" , "I" ],
	85 : [ "U" , "U" ],
	86 : [ "V" , "V" ],
	87 : [ "W" , "W" ],
	88 : [ "X" , "X" ],
	89 : [ "Y" , "Y" ],
	90 : [ "Z" , "Z" ],
	107 : [ ";" , "+" ], // ブラウザ差異あり
	109 : [ "-" , "=" ], // ブラウザ差異あり
	186 : [ ":" , "*" ], // ブラウザ差異あり
	187 : [ ";" , "+" ], // ブラウザ差異あり
	188 : [ "," , "<" ],
	189 : [ "-" , "=" ], // ブラウザ差異あり
	190 : [ "." , ">" ],
	191 : [ "/" , "?" ],
	192 : [ "@" , "`" ],
	219 : [ "[" , "{" ],
	220 : [ "\\", "|" ],
	221 : [ "]" , "}" ],
	222 : [ "^" , "~" ],
	226 : [ "\\", "_" ]
}
Typing.charTable = {
	"１"		: ["1"],
	"２"		: ["2"],
	"３"		: ["3"],
	"４"		: ["4"],
	"５"		: ["5"],
	"６"		: ["6"],
	"７"		: ["7"],
	"８"		: ["8"],
	"９"		: ["9"],
	"０"		: ["0"],
	"Ａ"		: ["A"],
	"Ｂ"		: ["B"],
	"Ｃ"		: ["C"],
	"Ｄ"		: ["D"],
	"Ｅ"		: ["E"],
	"Ｆ"		: ["F"],
	"Ｇ"		: ["G"],
	"Ｈ"		: ["H"],
	"Ｉ"		: ["I"],
	"Ｊ"		: ["J"],
	"Ｋ"		: ["K"],
	"Ｌ"		: ["L"],
	"Ｍ"		: ["M"],
	"Ｎ"		: ["N"],
	"Ｏ"		: ["O"],
	"Ｐ"		: ["P"],
	"Ｑ"		: ["Q"],
	"Ｒ"		: ["R"],
	"Ｓ"		: ["S"],
	"Ｔ"		: ["T"],
	"Ｕ"		: ["U"],
	"Ｖ"		: ["V"],
	"Ｗ"		: ["W"],
	"Ｘ"		: ["X"],
	"Ｙ"		: ["Y"],
	"Ｚ"		: ["Z"],
	"ア"		: ["A"],
	"イ"		: ["I"],
	"ウ"		: ["U", "WU"],
	"エ"		: ["E"],
	"オ"		: ["O"],
	"カ"		: ["KA", "CA"],
	"キ"		: ["KI"],
	"ク"		: ["KU", "CU", "QU"],
	"ケ"		: ["KE"],
	"コ"		: ["KO", "CO"],
	"サ"		: ["SA"],
	"シ"		: ["SI", "CI", "SHI"],
	"ス"		: ["SU"],
	"セ"		: ["SE", "CE"],
	"ソ"		: ["SO"],
	"タ"		: ["TA"],
	"チ"		: ["TI", "CHI"],
	"ツ"		: ["TU", "TSU"],
	"テ"		: ["TE"],
	"ト"		: ["TO"],
	"ナ"		: ["NA"],
	"ニ"		: ["NI"],
	"ヌ"		: ["NU"],
	"ネ"		: ["NE"],
	"ノ"		: ["NO"],
	"ハ"		: ["HA"],
	"ヒ"		: ["HI"],
	"フ"		: ["HU", "FU"],
	"ヘ"		: ["HE"],
	"ホ"		: ["HO"],
	"マ"		: ["MA"],
	"ミ"		: ["MI"],
	"ム"		: ["MU"],
	"メ"		: ["ME"],
	"モ"		: ["MO"],
	"ヤ"		: ["YA"],
	"ユ"		: ["YU"],
	"ヨ"		: ["YO"],
	"ラ"		: ["RA"],
	"リ"		: ["RI"],
	"ル"		: ["RU"],
	"レ"		: ["RE"],
	"ロ"		: ["RO"],
	"ワ"		: ["WA"],
	"ヲ"		: ["WO"],
	//	"ン"		: ["NN"],
	"ガ"		: ["GA"],
	"ギ"		: ["GI"],
	"グ"		: ["GU"],
	"ゲ"		: ["GE"],
	"ゴ"		: ["GO"],
	"ザ"		: ["ZA"],
	"ジ"		: ["ZI", "JI"],
	"ズ"		: ["ZU"],
	"ゼ"		: ["ZE"],
	"ゾ"		: ["ZO"],
	"ダ"		: ["DA"],
	"ヂ"		: ["DI"],
	"ヅ"		: ["DU"],
	"デ"		: ["DE"],
	"ド"		: ["DO"],
	"バ"		: ["BA"],
	"ビ"		: ["BI"],
	"ブ"		: ["BU"],
	"ベ"		: ["BE"],
	"ボ"		: ["BO"],
	"パ"		: ["PA"],
	"ピ"		: ["PI"],
	"プ"		: ["PU"],
	"ペ"		: ["PE"],
	"ポ"		: ["PO"],
	"ァ"		: ["XA", "LA"],
	"ィ"		: ["XI", "XYI", "LI", "LYI"],
	"ゥ"		: ["XU", "LU"],
	"ェ"		: ["XE", "XYE", "LE", "LYE"],
	"ォ"		: ["XO", "LO"],
	"ャ"		: ["XYA", "LYA"],
	"ュ"		: ["XYU", "LYU"],
	"ョ"		: ["XYO", "LYO"],
	"ヶ"		: ["XKE", "LKE"],
	//	"ッ"		: ["XTU", "LTU", "XTSU", "LTSU"],
	"ウィ"	: ["WI"],
	"ウェ"	: ["WE"],
	"キャ"	: ["KYA"],
	"キィ"	: ["KYI"],
	"キェ"	: ["KYE"],
	"キュ"	: ["KYU"],
	"キョ"	: ["KYO"],
	"クァ"	: ["QA", "KWA"],
	"クィ"	: ["QI", "QYI"],
	"クェ"	: ["QE"],
	"クォ"	: ["QO"],
	"クャ"	: ["QYA"],
	"クュ"	: ["QYU"],
	"クョ"	: ["QYO"],
	"シャ"	: ["SYA", "SHA"],
	"シィ"	: ["SYI"],
	"シュ"	: ["SYU", "SHU"],
	"シェ"	: ["SYE", "SHE"],
	"ショ"	: ["SYO", "SHO"],
	"チャ"	: ["TYA", "CHA", "CYA"],
	"チィ"	: ["TYI", "CYI"],
	"チュ"	: ["TYU", "CHU", "CYU"],
	"チェ"	: ["TYE", "CHE", "CYE"],
	"チョ"	: ["TYO", "CHO", "CYO"],
	"ツァ"	: ["TSA"],
	"ツィ"	: ["TSI"],
	"ツェ"	: ["TSE"],
	"ツォ"	: ["TSO"],
	"テャ"	: ["THA"],
	"ティ"	: ["THI"],
	"テュ"	: ["THU"],
	"テェ"	: ["THE"],
	"テョ"	: ["THO"],
	"トァ"	: ["TWA"],
	"トィ"	: ["TWI"],
	"トゥ"	: ["TWU"],
	"トェ"	: ["TWE"],
	"トォ"	: ["TWO"],
	"ニャ"	: ["NYA"],
	"ニィ"	: ["NYI"],
	"ニュ"	: ["NYU"],
	"ニェ"	: ["NYE"],
	"ニョ"	: ["NYO"],
	"ヒャ"	: ["HYA"],
	"ヒィ"	: ["HYI"],
	"ヒュ"	: ["HYU"],
	"ヒェ"	: ["HYE"],
	"ヒョ"	: ["HYO"],
	"ファ"	: ["FA"],
	"フィ"	: ["FI", "FYI"],
	"フェ"	: ["FE", "FYE"],
	"フォ"	: ["FO"],
	"フャ"	: ["FYA"],
	"フュ"	: ["FYU"],
	"フョ"	: ["FYO"],
	"ミャ"	: ["MYA"],
	"ミィ"	: ["MYI"],
	"ミュ"	: ["MYU"],
	"ミェ"	: ["MYE"],
	"ミョ"		: ["MYO"],
	"リャ"	: ["RYA"],
	"リィ"	: ["RYI"],
	"リュ"	: ["RYU"],
	"リェ"	: ["RYE"],
	"リョ"		: ["RYO"],
	"ギャ"	: ["GYA"],
	"ギィ"	: ["GYI"],
	"ギュ"	: ["GYU"],
	"ギェ"	: ["GYE"],
	"ギョ"	: ["GYO"],
	"ジャ"	: ["ZYA", "JA", "JYA"],
	"ジィ"	: ["ZYI", "JYI"],
	"ジュ"	: ["ZYU", "JU", "JYU"],
	"ジェ"	: ["ZYE", "JE", "JYE"],
	"ジョ"	: ["ZYO", "JO", "JYO"],
	"ヂャ"	: ["DYA"],
	"ヂィ"	: ["DYI"],
	"ヂュ"	: ["DYU"],
	"ヂェ"	: ["DYE"],
	"ヂョ"	: ["DYO"],
	"デャ"	: ["DHA"],
	"ディ"	: ["DHI"],
	"デュ"	: ["DHU"],
	"デェ"	: ["DHE"],
	"デョ"	: ["DHO"],
	"ドァ"	: ["DWA"],
	"ドィ"	: ["DWI"],
	"ドゥ"	: ["DWU"],
	"ドェ"	: ["DWE"],
	"ドォ"	: ["DWO"],
	"ビャ"	: ["BYA"],
	"ビィ"	: ["BYI"],
	"ビュ"	: ["BYU"],
	"ビェ"	: ["BYE"],
	"ビョ"	: ["BYO"],
	"ピャ"	: ["PYA"],
	"ピィ"	: ["PYI"],
	"ピュ"	: ["PYU"],
	"ピェ"	: ["PYE"],
	"ピョ"	: ["PYO"],
	"！"		: ["!"],
	"”"		: ["\""],
	"＃"		: ["#"],
	"％"		: ["%"],
	"＆"		: ["&"],
	"’"		: ["'"],
	"（"		: ["("],
	"）"		: [")"],
	"ー"		: ["-"],
	"＝"		: ["="],
	"＾"		: ["^"],
	"～"		: ["~"],
	"￥"		: ["\\"],
	"|"		: ["|"],
	"＠"		: ["@"],
	"‘"		: ["`"],
	"「"		: ["["],
	"｛"		: ["{"],
	"＋"		: ["+"],
	"＊"		: ["*"],
	"」"		: ["]"],
	"｝"		: ["}"],
	"、"		: [","],
	"＜"		: ["<"],
	"。"		: ["."],
	"＞"		: [">"],
	"・"		: ["/"],
	"？"		: ["?"],
	"￥"		: ["\\"],
	"＿"		: ["_"],
	"　"		: [" "]
}

Typing.datas = [
	{
		question : "10キロ痩せる",
		kana : "ジュッキロヤセル",
		comment : "ちゃんちー"
	},
	{
		question : "より学ぶ",
		kana : "ヨリマナブ",
		comment : "ちゃんちー"
	},
	{
		question : "インプットインプットインプット",
		kana : "インプットインプットインプット",
		comment : "ちゃんちー"
	},
	{
		question : "フル単！！単位落とさない",
		kana : "フルタン！！タンイオトサナイ",
		comment : "しのきん"
	},
	{
		question : "好きなひとつくる",
		kana : "スキナヒトツクル",
		comment : "しのきん"
	},
	{
		question: "浪費しない",
		kana : "ロウヒシナイ",
		comment : "しのきん"
	},
	{
		question: "お腹を凹ます",
		kana : "オナカヲヘコマス",
		comment : "みーたん"
	},
	{
		question: "後回しにしない",
		kana : "アトマワシニシナイ",
		comment : "みーたん"
	},
	{
		question: "明るい表情を心がける",
		kana : "アカルイヒョウジョウヲココロガケル",
		comment : "みーたん"
	},
	{
		question : "綺麗な部屋を維持する",
		kana : "キレイナヘヤヲイジスル",
		comment : "バッハ"
	},
	{
		question : "綺麗なコードを書くようにする",
		kana : "キレイナコードヲカクヨウニスル",
		comment : "バッハ"
	},
	{
		question : "料理スキルを磨く",
		kana : "リョウリスキルヲミガク",
		comment : "バッハ"
	},
	{
		question: "アウトプットしてきちんと何か作る",
		kana : "アウトプットシテキチントナニカツクル",
		comment : "れもん"
	},
	{
		question: "金を稼ぐ",
		kana : "カネヲカセグ",
		comment : "れもん"
	},
	{
		question: "たくさん寝る",
		kana : "タクサンネル",
		comment : "れもん"
	},
	{
		question: "僕のみくりさんをみつける",
		kana : "ボクノミクリサンヲミツケル",
		comment : "とうよう"
	},
	{
		question: "みくりさんを幸せにする",
		kana : "ミクリサンヲシアワセ二スル",
		comment : "津崎平匡"
	},
	{
		qusetion : "趣味を見つける",
		kana : "シュミヲミツケル",
		comment : "フンジン"
	},
	{
		qusetion : "金を稼ぐきっかけを作る",
		kana : "カネヲカセグキッカケヲツクル",
		comment : "フンジン"
	},
	{
		qusetion : "vimを極める",
		kana : "ビムヲキワメル",
		comment : "フンジン"
	}
];
