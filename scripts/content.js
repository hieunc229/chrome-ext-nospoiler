var observer;
var keywords = [];

function isContentMatchKeywords(content) {

    var rs = false;
    content = content.replace(/\s/g, "").toLowerCase();

    keywords.some(term => {
        if (content.indexOf(term.replace(/\s/g, "").toLowerCase()) !== -1) {
            rs = true;
        }
        return rs;
    });
    return rs;
}

function recursiveFilter(node, opts) {

    if (node.childElementCount) {
        for (var i = 0; i < node.childElementCount; i++) {
            recursiveFilter(node.children[i], opts);
        }
    } else {
        if (node && isContentMatchKeywords(node.textContent)) {
            opts.results.push(node);
        }
    }
}

function observeDOMChanges() {

    observer = new MutationObserver(function (mutationsList, observer) {
        let opts = { results: [] };

        for (var mutation of mutationsList) {
            mutation.addedNodes.forEach(node => {
                recursiveFilter(node, opts);
            })
        };

        opts.results.forEach(node => {
            
            if (node.style) {
                node.style.opacity = 0;
            } else {
                console.log("No style", node);
            }
        })
    });

    // Start observing the target node for configured mutations
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function refresh() {

    chrome.storage.sync.get(['items'], function (result) {

        keywords = result.items;

        var all = document.querySelectorAll("h1,p,h3,h2,a,span");

        var i = 0;
        all.forEach(el => {

            if (isContentMatchKeywords(el.innerText)) {
                el.style.background = "transparent";
                el.style.color = "transparent";
                i++;
            }
        });

        // console.log("No Spoiler removes", i, "related content");
        chrome.runtime.sendMessage({ type: "nsupdate", count: i });
    })
}

setTimeout(() => {
    refresh();
    observeDOMChanges();
}, 3000);

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