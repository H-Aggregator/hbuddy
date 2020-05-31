console.log("Page needs framed!");

if (window.name != "frame") {
	
	var url = window.location.href;
	var frame = chrome.extension.getURL("frame.html");
	console.log(frame+"?url="+url);
//	window.location.assign(frame+"?url="+url);
//	//loadpage with url: .../...frame.html?url=blah.de/blah.html
}

