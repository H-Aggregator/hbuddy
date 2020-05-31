function removeEmptyParent(id){
	console.log ("Checking parent folder: " + id)
	chrome.bookmarks.get(id, function(nodes) {
		chrome.bookmarks.getChildren(nodes[0].id, function(children){
			if (children.length == 0) {
				var parentId = nodes[0].parentId;
				var title = nodes[0].title;
				chrome.bookmarks.remove(nodes[0].id, function(){
					console.log ("Destroyed empty parent folder: " + title);
					removeEmptyParent(parentId);
				});
			}
			else {
				console.log ("Parent folder still contains children.")
			}
		});
	});
}

//bookmark[title] is always the next nested object
function createBookmark(bookmark, id) {
	var title = Object.keys(bookmark)[0];
	if (typeof bookmark[title] != "string") { //not url
		chrome.bookmarks.getChildren(id, function(children){
			
			for (child of children) {
				if (child.title == title){ //match found
					console.log("Bookmark folder '" + title + "' alreated exists.");
					createBookmark(bookmark[title], child.id);
					return;
				}
			}
			//no match found
			chrome.bookmarks.create({'parentId':id, 'title':title}, function(node) {
				console.log("Bookmark folder '" + title + "' created.");
				createBookmark(bookmark[title], node.id);
			});
		});
		return;
	}
	else {
		var url = bookmark[title];
		var match = false;
		chrome.bookmarks.getChildren(id, function(children){			
			for (child of children) {
				if (child.url == url) {
					
					match = true;
					break;
				}
			}
			if (match == false) {
				chrome.bookmarks.search({"url":url}, function(results){
					for (result of results){
						var parentId = result.parentId;
						chrome.bookmarks.remove(result.id, function(){
							console.log("Destroyed old instance of this bookmark.");
							removeEmptyParent(parentId);
						});
					}
					chrome.bookmarks.create({'parentId':id, 'title':title, 'url':url}, function(node){
						console.log("Bookmark created: " + node);
					});
					
				});
			}
			else {
				console.log("Bookmark already exists at specified location!");
			}
		});
	}		
}

//recursively obtain all parents of a specified bookmark node
var lineage = function (seed) {
	this.create(seed);
}

lineage.prototype.parents = [];
lineage.prototype.root = null;

lineage.prototype.getParents = function (child) {
	this.parents.push(child);
	if (child.parentId){
		chrome.bookmarks.get(this.root.parentId, function(nodes) {
			var parent = nodes[0];
			if (parent) {
				this.getParents(parent);
			}
		});
	}
}

lineage.prototype.create = function (seed) {
	this.root = seed;
	this.getParents(this.root);
	console.log(this.parents);
}



//function queryBookmark(query, sendResponse) {
//	chrome.bookmarks.search({url:query.url}, function(results) {
//		for (result of results) {
//			lineage(result);
//		}
//	});
//}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
	if (request.bookmark) {	
		sendResponse({message:"Message received."});
		//createBookmark(request.bookmark.nodes, request.bookmark.id);
		chrome.bookmarks.search({url:"http://www.dlsite.com/books/work/=/product_id/BJ011159.html"}, 
			function (results){
				for (result of results) {
					l = new lineage(result);
					
				}
			});
			
	}
});
  
