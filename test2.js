//TODO: encapsulate args in obj
function getParentNodes (node, parents, callback) {
  if (!parents) parents = [];

  parents.push(node);
  if (node.parentId) {
    chrome.bookmarks.get(node.parentId, function(nodes){
      getParentNodes(nodes[0], parents, callback);
    });
  }
  else callback(parents.reverse()); //root will be arr[0]
}

//TODO: title OR id, encapsulate args in object
//url: child url, index: offset from root, title:parent title
function getParents (url, index, title, callback) {
  var complete = false; //prevent multiple callbacks
  chrome.bookmarks.search({url:url}, function(results){
    if (results.length > 0) {
		for (i = 0; i < results.length; ++i) {			
		  getParentNodes(results[i], null, function(parents){
			console.log(results[i]);
			//only first positive hit used
			if(complete == false && parents[index].title == title){
			  complete = true;
			  
			  callback(parents);
			  return;
			}
			//if last result and complete = false -- bookmark doesn't exist
			else if (results.length == i+1) {
				callback([]);
			}
		  }); 
		}
	  }
	  else callback([]);
  });
}

//Warning: hardcoded values
//callback is response message containing obj
function getOutline (url, callback) {
  var outline = {};
  getParents(url, 2, "Ecchi", function(parents) {
	if (parents.length == 9) {
		outline.year = parents[3].title;
		outline.month = parents[4].title;
		outline.day = parents[5].title;
		outline.genre = parents[6].title;
		outline.title = parents[7].title;

		callback(outline);
	}
	else callback({alert: "Unexpected length: " + parents.length});
  });
  
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	  switch(request.message) {
        case "get":

          getOutline(request.url, sendResponse);
          return true;	//async response
        default:
          sendResponse({message:"unknown"});
      }
  });