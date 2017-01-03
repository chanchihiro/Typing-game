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
		question : "なでしこジャパン",
		kana : "ナデシコジャパン",
		comment : "2011年 小倉純二（財団法人日本サッカー協会会長）"
	},
	{
		question : "スマホ",
		kana : "スマホ",
		comment : "2011年 西川征一（AND market 霞が関）"
	},
	{
		question : "どじょう内閣",
		kana : "ドジョウナイカク",
		comment : "2011年 野田佳彦（内閣総理大臣）"
	},
	{
		question : "どや顔",
		kana : "ドヤガオ",
		comment : "2011年 受賞者辞退"
	},
	{
		question : "帰宅難民",
		kana : "キタクナンミン",
		comment : "2011年 東日本大震災で帰宅難民となった約500万人の皆様　代表して帰宅難民のお一人 小川さん"
	},
	{
		question : "こだまでしょうか",
		kana : "コダマデショウカ",
		comment : "2011年 尾形敏朗（公益社団法人ＡＣジャパン）"
	},
	{
		question : "ラブ注入",
		kana : "ラブチュウニュウ",
		comment : "2011年 楽しんご（タレント）" },
	{
		question : "イクメン",
		kana : "イクメン",
		comment : "2010年 つるの剛士（タレント）" },
	{
		question : "女子会",
		kana : "ジョシカイ",
		comment : "2010年 大神輝博（モンテローザ社長）" },
	{
		question : "脱小沢",
		kana : "ダツオザワ",
		comment : "2010年 受賞者辞退" },
	{
		question : "食べるラー油",
		kana : "タベルラーユ",
		comment : "2010年 小出孝之（桃屋社長）" },
	{
		question : "ととのいました",
		kana : "トトノイマシタ",
		comment : "2010年 Ｗコロン（漫才コンビ）" },
	{
		question : "政権交代",
		kana : "セイケンコウタイ",
		comment : "2009年 鳩山由紀夫（内閣総理大臣）" },
	{
		question : "こども店長",
		kana : "コドモテンチョウ",
		comment : "2009年 加藤清史郞（俳優）" },
	{
		question : "事業仕分け",
		kana : "ジギョウシワケ",
		comment : "2009年 行政刷新会議と事業仕分け作業チーム" },
	{
		question : "草食男子",
		kana : "ソウショクダンシ",
		comment : "2009年 小池徹平（タレント）・深澤真紀（コラムニスト）" },
	{
		question : "脱官僚",
		kana : "ダツカンリョウ",
		comment : "2009年 渡辺喜美（衆議院議員）" },
	{
		question : "派遣切り",
		kana : "ハケンギリ",
		comment : "2009年 関根秀一郎（派遣ユニオン書記長）" },
	{
		question : "ファストファッション",
		kana : "ファストファッション",
		comment : "2009年 益若つばさ（タレント）" },
	{
		question : "アラフォー",
		kana : "アラフォー",
		comment : "2008年 天海祐希（女優）" },
	{
		question : "グー！",
		kana : "グー！",
		comment : "2008年 エド・はるみ（タレント）" },
	{
		question : "埋蔵金",
		kana : "マイゾウキン",
		comment : "2008年 中川秀直（元自民党幹事長）" },
	{
		question : "蟹工船",
		kana : "カニコウセン",
		comment : "2008年 長谷川仁美（ブックエキスプレス ディラ上野店店員）" },
	{
		question : "ゲリラ豪雨",
		kana : "ゲリラゴウウ",
		comment : "2008年 石橋博良（株ウェザーニューズ　代表取締役）" },
	{
		question : "後期高齢者",
		kana : "コウキコウレイシャ",
		comment : "2008年 山崎英也（マスターズ陸上競技選手）" },
	{
		question : "どげんかせんといかん",
		kana : "ドゲンカセントイカン",
		comment : "2007年 東国原英夫（宮崎県知事）" },
	{
		question : "ハニカミ王子",
		kana : "ハニカミオウジ",
		comment : "2007年 石川遼（アマチュアゴルフ選手）" },
	{
		question : "そんなの関係ねぇ",
		kana : "ソンナノカンケイネェ",
		comment : "2007年 小島よしお（タレント）"},
	{
		question : "どんだけぇー",
		kana : "ドンダケェー",
		comment : "2007年 ＩＫＫＯ（メイクアップアーティスト）" },
	{
		question : "鈍感力",
		kana : "ドンカンリョク",
		comment : "2007年 渡辺淳一（作家）"  },
	{
		question : "イナバウアー",
		kana : "イナバウアー",
		comment : "2006年 荒川静香（プロ・スケーター）" },
	{
		question : "エロカッコイイ",
		kana : "エロカッコイイ",
		comment : "2006年 倖田來未（歌手）" },
	{
		question : "格差社会",
		kana : "カクサシャカイ",
		comment : "2006年 山田昌弘（東京学芸大教授）" },
	{
		question : "ハンカチ王子",
		kana : "ハンカチオウジ",
		comment : "2006年 斎藤佑樹（早稲田実業野球部員）" },
	{
		question : "メタボリックシンドローム",
		kana : "メタボリックシンドローム",
		comment : "2006年 （社）日本内科学会" },
	{
		question : "小泉劇場",
		kana : "コイズミゲキジョウ",
		comment : "2005年 武部勤（自由民主党幹事長）ほか" },
	{
		question : "想定内",
		kana : "ソウテイナイ",
		comment : "2005年 堀江貴文（ライブドア社長）" },
	{
		question : "クールビズ",
		kana : "クールビズ",
		comment : "2005年 小池百合子（環境大臣）" },
	{
		question : "フォーー！",
		kana : "フォーー！",
		comment : "2005年 レイザーラモンＨＧ（タレント）" },
	{
		question : "ブログ",
		kana : "ブログ",
		comment : "2005年 カズマ（「鬼嫁日記」のブロガー）" },
	{
		question : "萌えー",
		kana : "モエー",
		comment : "2005年 完全メイド宣言（秋葉原のメイドさんグループ）" },
	{
		question : "チョー気持ちいい",
		kana : "チョーキモチイイ",
		comment : "2004年 北島康介（アテネオリンピック水泳代表選手）" },
	{
		question : "気合だー！",
		kana : "キアイダー！",
		comment : "2004年 アニマル浜口" },
	{
		question : "サプライズ",
		kana : "サプライズ",
		comment : "2004年 武部勤（自由民主党幹事長）" },
	{
		question : "新規参入",
		kana : "シンキサンニュウ",
		comment : "2004年 堀江貴文（ライブドア社長）" },
	{
		question : "セカチュー",
		kana : "セカチュー",
		comment : "2004年 片山恭一（作家）" },
	{
		question : "冬ソナ",
		kana : "フユソナ",
		comment : "2004年 萩原聖人（チュサン役）・田中美里（ユジン役）" },
	{
		question : "なんでだろうー",
		kana : "ナンデダロー",
		comment : "2003年 テツ and トモ（タレント）" },
	{
		question : "マニフェスト",
		kana : "マニフェスト",
		comment : "2003年 北川正恭（早稲田大学教授）" },
	{
		question : "ビフォーアフター",
		kana : "ビフォーアフター",
		comment : "2003年 加藤みどり（番組ナレーター）" },
	{
		question : "へぇー",
		kana : "ヘェー",
		comment : "2003年 高橋克実（俳優）・八嶋智人（俳優）" },
	{
		question : "タマちゃん",
		kana : "タマチャン",
		comment : "2002年 佐々木裕司（タマちゃん発見者）・黒住祐子（フジテレビレポーター）" },
	{
		question : "声に出して読みたい日本語",
		kana : "コエニダシテヨミタイニホンゴ",
		comment : "2002年 齋藤　孝（『声に出して読みたい日本語』著者。明治大学文学部助教授）" },
	{
		question : "内部告発",
		kana : "ナイブコクハツ",
		comment : "2002年 串岡弘昭（『ホイッスルブローアー＝内部告発者』の著者）" },
	{
		question : "ベッカム様",
		kana : "ベッカムサマ",
		comment : "2002年 藤本信一郎（ウェスティンホテル淡路・総支配人）" },
	{
		question : "ムネオハウス",
		kana : "ムネオハウス",
		comment : "受賞者：佐々木憲昭（衆院議員・共産党）"
	}
];
