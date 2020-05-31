TestObj = {
	"Ecchi": { //found at id 1 (bookmark bar)
		"2015": { //sub folder 1 - YEAR
			"01": { //subfolder 2 - MONTH 
				"29": {
					"Eroge": { //subfolder 3 - Category 
						"WorkName": { //subfolder - has to be a static syntax for matching purposes [Circle][Title]
							"Title":"http://www.blah.com/" //the actual url - [Circle][Title][ID][TAG0,TAG1,...]
						}
					}
				}
			}
		}
	}
};

//{bookmark: {nodes:TestObj, id:"1"}}

chrome.runtime.sendMessage({message:"get", url:"http://www.blah.com/"}, function(outline) {
  //console.log(outline.year + ' > ' + outline.month + ' > ' + outline.day + ' > ' + outline.genre + ' > ' + outline.title);
	console.log(outline);
  });

