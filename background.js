chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.set({color: '#3aa757'}, function() {
		console.log("The color is green.");
	});

	var dict = getMFD2()
    chrome.storage.local.set({'dictionary': dict}, function() {
		//console.log('dict is set to ' + dict);
		console.log(dict)
    });
});




