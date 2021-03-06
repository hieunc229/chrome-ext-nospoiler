

// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'scripts/noSpoiler.js'
	});
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "completed") {

		chrome.browserAction.setBadgeText({ text: "0" });
		chrome.runtime.sendMessage({ type: "nsrefresh" });
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type == "nsupdate") {

		if (request.total) {
			chrome.browserAction.setBadgeText({ text: request.total + "" });
		} else if (request.count) {
			chrome.browserAction.getBadgeText({}, result => {
				
				chrome.browserAction.setBadgeText({ text: (parseInt(result) + request.count) + "" });
			});
		}
	}
});