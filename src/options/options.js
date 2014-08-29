		// Saves options to localStorage.
		function save_options() {
		  var displayDurationEle = document.getElementById("displayDuration");
		  var displayDuration = displayDurationEle.children[displayDurationEle.selectedIndex].value;
		  localStorage.setItem("displayDuration", displayDuration);

		  var postsNotificationsEle = document.getElementById("postsNotifications");
		  localStorage.setItem("postsNotifications", postsNotificationsEle.checked);

		  var likesNotificationsEle = document.getElementById("likesNotifications");
		  localStorage.setItem("likesNotifications", likesNotificationsEle.checked);

		  // Update status to let user know options were saved.
		  var status = document.getElementById("status");
		  status.innerHTML = "Options Saved.";
		  setTimeout(function() {
		    status.innerHTML = "";
		  }, 750);
		}

		// Restores select box state to saved value from localStorage.
		function restore_options() {
			if(localStorage.getItem("displayDuration") != null){
				var displayDurationEle = document.getElementById("displayDuration");
				displayDurationEle.value = localStorage.getItem("displayDuration");
			}
			if(localStorage.getItem("postsNotifications") != null){
				var postsNotificationsEle = document.getElementById("postsNotifications");
				postsNotificationsEle.checked = (localStorage.getItem("postsNotifications") == "true")?true:false;
			}
			if(localStorage.getItem("likesNotifications") != null){
				var likesNotificationsEle = document.getElementById("likesNotifications");
				likesNotificationsEle.checked = (localStorage.getItem("likesNotifications") == "true")?true:false;
			}			  
		}
		document.addEventListener('DOMContentLoaded', restore_options);
		document.querySelector('#save').addEventListener('click', save_options);