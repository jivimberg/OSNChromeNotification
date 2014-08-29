//console.log("Script executing..");
Oracle.OSN.Connection.BackChannel.addListener(function(a,b){
	//console.log("status: "+JSON.stringify(a)); 
	//console.log("data: "+JSON.stringify(b));
	if(a){
		if(!jQuery.isEmptyObject(b)){
			//console.log("data: "+JSON.stringify(b));
			//console.log("support"+window.webkitNotifications);
			try{				
				//window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
				window.postMessage(b, "https://osn-fusioncrm.oracle.com");
			}catch(err){
				console.log("Exception Message: "+err.message);
			}			
		}
	}
});