
var frameId = "no-spoider-frame";
var el = document.querySelector(`#${frameId}`);
if (el) {
    el.style.height = el.style.height === "0px" ? "100%" : "0px";
}
