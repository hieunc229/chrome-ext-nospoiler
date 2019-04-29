var version = 1;
var storageName = "noSpoier_" + version + "_items";

function getItems() {
    let items = localStorage.getItem(storageName);
    return items ? JSON.parse(items) : [];
}

function setItems(items) {

    localStorage.setItem(storageName, JSON.stringify(items));
    chrome.storage.sync.set({ items: items }, () => {

        chrome.runtime.sendMessage({ type: "nsrefresh" });
    });
}

function addItem(term) {
    let items = getItems();
    items.push(term);
    setItems(items);
}

function removeItem(term) {

    let items = getItems();
    let i = -1;
    if ((i = items.indexOf(term)) > -1) {
        items.splice(i, 1);
        setItems(items);
        refreshTerms();
    }
}

var listContainer = document.getElementById(`ns-items`);
var listElement = listContainer.querySelector("ul");
var template = listContainer.querySelector("template");

function remove(ev) {
    let term = ev.target.dataset.term;
    removeItem(term);
}
var refreshTerms = () => {

    listElement.innerHTML = "";
    let items = getItems();
    if (items.length) {
        items.forEach(term => {
            var clone = document.importNode(template.content, true);
            clone.querySelector("span").textContent = term;
            var btn = clone.querySelector("button");
            btn.onclick = remove;
            btn.setAttribute('data-term', term);

            listElement.appendChild(clone);
        })
    } else {
        var clone = document.createElement("li");
        clone.className = "placeholder";
        clone.innerText = "No keywords"
        listElement.appendChild(clone);
    }
}

// Display items
refreshTerms();

// Add item
let formElement = document.getElementById("ns-form");

if (formElement) {
    formElement.onsubmit = function (ev) {
        let term = formElement.querySelector("input").value;

        if (term) {
            addItem(term);
        }
        refreshTerms();
    }
}

