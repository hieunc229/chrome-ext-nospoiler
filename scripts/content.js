function refresh() {

    chrome.storage.sync.get(['items'], function (result) {
        var all = document.querySelectorAll("h1,p,h3,h2,a,span");
        var items = result.items;
        var i = 0;
        all.forEach(el => {
            let content = el.innerText.replace(/\s/g, "").toLowerCase();
            items.some(term => {
                if (content.indexOf(term.replace(/\s/g, "")) !== -1) {
                    el.style.background = "transparent";
                    el.style.color = "transparent";
                    i++;
                    return true;
                }
                return false;
            })
        });

        // console.log("No Spoiler removes", i, "related content");
        chrome.runtime.sendMessage({ type: "nsupdate", count: i });
    })
}


setTimeout(refresh, 3000);

var frameId = "no-spoider-frame";
var iframe = document.createElement('iframe');
iframe.style.height = "0px";
iframe.style.width = "280px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "99999";
iframe.frameBorder = "none";
iframe.id = frameId;
iframe.src = chrome.extension.getURL("pages/popup.html");
document.body.appendChild(iframe);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type == "nsrefresh") {
		refresh();
	}
});