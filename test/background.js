document.getElementById("login=button").addEventListener("click", function () {
    chrome.tabs.create({ url: "/find" });
});