function getQueryString() {
	var result = {}, queryString = location.search.slice(1),
	re = /([^&=]+)=([^&]*)/g, m;

	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	return result;
}
window.addEventListener("load", function() {
	url = getQueryString().url;

	if(url) document.getElementById("frame").src = url;
})

