var osnURL = "https://osn-fusioncrm.oracle.com/osn/social/api/v1";
var defaultNotificationDuration = 5000;
var loggedUserId;
var previousTabId=-1, previousData=[];

function showNotification(userID, titleTxt, bodyTxt) {
  if (window.webkitNotifications) {
   console.log("Notifications are supported!");
     var notification = window.webkitNotifications.createNotification(
      osnURL+"/pictures/"+userID+"/profile",                      // The image.
      titleTxt, // The title.
      bodyTxt      // The body.
    );
    /*sessionStorage.imgSrc = imgURL+userID+"/profile";
    sessionStorage.titleText = titleTxt;
    sessionStorage.messageText = bodyTxt;
    var notification = window.webkitNotifications.createHTMLNotification('notifications/notification.html');*/
    notification.show();
    //console.log("notifications time: "+localStorage.getItem("displayDuration"));  
    setTimeout(function(){notification.cancel();}, ((localStorage.getItem("displayDuration") != null)?localStorage.getItem("displayDuration"):defaultNotificationDuration));  
  }
  else {
    console.log("Notifications are not supported for this Browser/OS version yet.");
    
    var fileExists = function(url){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.status == 404) {
          return false;
        } else {
          return true;
        }
      }
      xhr.send();
    };
    
    var imageUrl = osnURL+"/pictures/"+userID+"/profile";
    if(!fileExists(imageUrl)){
      imageUrl = chrome.extension.getURL("/img/osn_logo_128.png");
    }
    
    chrome.notifications.create("",
      {
        iconUrl: imageUrl,
        title: titleTxt,
        message: bodyTxt,
        type: "basic"
      }, function(id){}
    );
  }
  
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if((previousTabId != sender.tab.id) && (previousData.length == request.length) && (previousData.toString() == request.toString())){
      return;
    }
    previousTabId = sender.tab.id;
    previousData = request;
    console.log("cmng to notification with data: "+JSON.stringify(request));
    //console.log("loggedUserId:"+loggedUserId+"tab id is:"+sender.tab.id);
    if(loggedUserId == undefined){
      //console.log("cmng inside if..");
      chrome.tabs.sendMessage(sender.tab.id, {}, function(response){
        loggedUserId = response.loggedInUserId;
        console.log("Assigned loggedUserId is:"+loggedUserId);
      });
    }


    if("chatCreated" == request[0].MethodName){
      //console.log("inside chatCreated ...");
      var dataJSON = request[0].Arguments[0];
      var conversationName = dataJSON.ConversationName;
      var createdByUserName = dataJSON.CreatedByUserName;
      var plainText = dataJSON.PlainText;
      var createdUserID = dataJSON.CreatedByUserID;
      //console.log("Username: "+dataJSON.CreatedByUserName);
      //console.log("Text: "+dataJSON.PlainText);
      //console.log("PlainText: "+dataJSON.PlainText);
      if(createdUserID != loggedUserId){
        if((localStorage.getItem("postsNotifications") != null)?((localStorage.getItem("postsNotifications") == "true")?true:false):true){
          showNotification(createdUserID, createdByUserName+" posted in "+conversationName, plainText);  
        }
        
      }       
    }    
    if("likeAdded" == request[0].MethodName){
      //console.log("inside likeAdded ...");
      var dataJSON = request[0].Arguments[0];
      var createdUserID = dataJSON.CreatedByUserID;
      var conversationName = dataJSON.ConversationName;
      var plainText = dataJSON.PlainText;
      var likeAddedByID = request[0].Arguments[1];
      //console.log("like added by:"+likeAddedByID);
      if((createdUserID == loggedUserId) && (likeAddedByID != loggedUserId)){
        if((localStorage.getItem("likesNotifications") != null)?((localStorage.getItem("likesNotifications") == "true")?true:false):true){
          showNotification(likeAddedByID, " One person likes your post in "+conversationName, plainText);  
        }                
      }
    }
  }
);