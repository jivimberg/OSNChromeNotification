var s = document.createElement('script');
s.src = chrome.extension.getURL("main.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
      return;
    if (event.origin && (event.origin == "https://socialnetwork.oracle.com")) {
       //console.log("Content script received: " + JSON.stringify(event.data));             
      chrome.extension.sendMessage(event.data);
    }
}, false);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	var userNmDiv = document.getElementById("userName");
	var anchorArray = userNmDiv.getElementsByTagName("a");
	var loggedUserId;
	for(var index=0; index<anchorArray.length; index++){
		var anchorEleHref = anchorArray[index].getAttribute("href");	
		if(anchorEleHref.indexOf("userId") > 0){
			//console.log(anchorEleHref);
			var subHref = anchorEleHref.substring(anchorEleHref.indexOf("userId"));
			var ampIndex = subHref.indexOf("&");
			var equalIndex = subHref.indexOf("=");
			if(ampIndex > 0){
				loggedUserId = subHref.substring(equalIndex+1, ampIndex);
			}
			else{
				loggedUserId = subHref.substring(equalIndex+1);
			}
			//console.log("loggedInUserId:"+loggedUserId);
			sendResponse({"loggedInUserId":loggedUserId});
	 		//chrome.extension.sendMessage({"loggedInUserId": loggedUserId});
			break;
		}		
	}
});
