//bookmark[title] is always the next nested object
function createBookmark(bookmark, id) {
	var title = bookmark[Object.keys(bookmark)[0]];
	if (typeof bookmark[title] != "string") { //not url
		chrome.bookmarks.getChildren(id, function(children){
			for (child of children) {
				if (child.title == title) //match found
				createBookmark(bookmark[title], child.id);
				return;
			}
			//no match found
			chrome.bookmarks.create({'parentId':id, 'title':title}, function(node) {
				createBookmark(bookmark[title], node.id);
			});
		});
		return;
	}
	else chrome.bookmarks.create({'parentId'id, 'title':title, 'url':bookmark[title]}, null);
}


TestObj = {
	"Ecchi": { //found at id 1 (bookmark bar)
		"2015": { //sub folder 1 - YEAR
			"01": { //subfolder 2 - MONTH 
				"29": {
					"Eroge": { //subfolder 3 - Category 
						"WorkName": { //subfolder - has to be a static syntax for matching purposes [Circle][Title]
							"Title":"blah.com" //the actual url - [Circle][Title][ID][TAG0,TAG1,...]
						}
					}
				}
			}
		}
	}
};

createBookmark(TestObj,1);