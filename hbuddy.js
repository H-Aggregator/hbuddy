function getText(parent) {
	var text = "";
	var children = [].slice.call(parent.childNodes);
	for (child of children) if (child.nodeType == 3) text += child.textContent;
	
	var ver = /[VvＶｖ](ER|er|ＥＲ|ｅｒ){0,1}(SION|sion|ＳＩＯＮ|ｓｉｏｎ){0,1}[ 　]{0,1}[\.0-9。]*$/g;
	text = text.replace(ver, "");
	
	return text;
}

function format(s) {
	var r1 = /[ -"&-\/;->\[-^`{-~　-。「-】・！（-）／；？［］｛｝-～]/g;
	//var r2 = /[#-%\:\?-@\_¡-¿〃-》〒-〾ヽ-ヿ＂-＇＊-．：＜-＞＠＼＾-｀｜｟-･￠-￮‐-⟿]/g;
	var r2 = /[^0-9A-Za-zぁ-ゖァ-ヺー０-９Ａ-Ｚａ-ｚｦ-ﾝ一-龯㐀-䶵]/g;
	s = s.replace(r1,"");
	s = s.replace(r2," ");
	return s;
}

//

var date = /(\d\d\d\d)\u5E74(\d\d)\u6708(\d\d)\u65E5/.exec(document.getElementById("work_outline").getElementsByTagName("td")[0].innerText);

var id = /R[JE]\d{6}/.exec(document.URL)[0];

var elements = document.getElementById("work_outline").getElementsByClassName("work_genre");

var categories = [];

for (var i = 0; i < elements.length; i++) {
	categories = categories.concat(elements[i].innerText.trim().split('\n'));
}

elements = document.getElementsByClassName("main_genre")[0].getElementsByTagName("a");

var genres = [];

for (var i = 0; i < elements.length; i++) {
	genres.push(elements[i].innerText);
}

var work = {
	id: id,
	maker: document.getElementById("work_maker").getElementsByClassName("maker_name")[0].innerText,
	name: getText(document.getElementById("work_name")),
	date: {
		year: date[1],
		month: date[2],
		day: date[3],
	},
	categories: categories,
	genres: genres,
	url: document.location.href
};

//

var hb_complete = false;

function init() {
	if (!hb_complete){
		var query = format(work.name);
		console.log(query);
		hbQuery(query);
		hb_complete = true;
	}
}

//---Class Start---//
function Sidebar () {
	this.create()
}

Sidebar.prototype.bar = null;
Sidebar.prototype.tab = null;
Sidebar.prototype.list = null;
Sidebar.prototype.results = [];

Sidebar.prototype.create = function() {
	this.bar = document.createElement("div");
	this.tab = document.createElement("div");
	this.list = document.createElement("div");
	
	this.bar.appendChild(this.tab);
	this.bar.appendChild(this.list);
	

	
	this.bar.style.cssText = "height:100%;background-color:rgba(0,0,0,0.75);position:fixed;top:0px;right:0px;z-index:2147483647;width:0px;";
	this.tab.style.cssText = "height:50px;width:50px;position:absolute;left:-50px;background-color:rgba(0,0,0,0.75);";
	this.list.style.cssText = "width:100%;height:100%;overflow-x:hidden;overflow-y:scroll;";
	
	document.body.appendChild(this.bar);
	console.log(this.bar);
}

Sidebar.prototype.addResult = function(r) {
	console.log(r);
	var anchor = document.createElement("a");
	var result = document.createElement("div");
	var title = document.createElement("span");
	
	title.innerText = r.title;
	
	anchor.appendChild(result);
	result.appendChild(title);
	
	anchor.href = r.link;
	result.style.cssText = 'margin:10px;width:280px;height:210px;background-color:rgba(0,0,0,0.25);position:relative;background-size:contain;background-position:center;background-repeat:no-repeat;background-image:url("'+r.preview+'");';
	
	console.log(result.style.cssText);
	
	title.style.cssText = "background-color:rgba(0,0,0,0.75);width:100%;position:absolute;bottom:0px;font-family:Meiryo,Arial;font-weight:bold;font-size:16pt;color:#FFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;text-align:center;line-height:3ex;";
	
	this.results.push(result);
	
	this.list.appendChild(anchor);
}
//---Class End---//

var sb = new Sidebar();
	sb.tab.addEventListener("click", function(){
		init();
		if (sb.bar.style.width == "0px") sb.bar.style.width = "318px";
		else sb.bar.style.width = "0px";
	});

function hbParse(responseText) {
	
	var div = document.createElement('div');
	div.innerHTML = responseText;
	console.log(div);
	var threads = div.querySelectorAll('[class^=gtr]');	//div.querySelectorAll('.threadinfo');
	console.log(threads);
	for (var i = 0; i < threads.length; ++i) {
		var result = {};
		var thread = threads[i];
		var it2 = thread.querySelector('.it2');
		var preview = it2.querySelector('img');
		if (preview) {
			//result.preview = preview.src;
			var exstring = preview.src;
			result.preview = exstring.replace("st.exhentai.net",'ehgt.org');
		}
		else {
			//get past "clever" img src protection
			var a = it2.innerHTML.split("~", 4);
			if (a.length == 4 && a[0] == "init") {
				var exstring = 'http://' + a[1] + "/" + a[2];
				result.preview = exstring.replace("st.exhentai.net",'ehgt.org');
			}
			else {
				result.preview = 'nopreview.png';
			}
		}

		var a = thread.querySelector('.it5 a');	//h3.threadtitle a
		result.title = a.innerText;
		result.link = a.getAttribute('href');	//exhentai returns full address?
		
		sb.addResult(result);
	}
}

function hbQuery(query) {
	var xhr = new XMLHttpRequest();
	var url = 'http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=0&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_apply=Apply+Filter&advsearch=1&f_sname=on&f_stags=on&f_sdesc=on&f_storr=on&f_sh=on&f_srdd=2&f_search=' + query;

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			//console.log(xhr.responseText);
			hbParse(xhr.responseText);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}





