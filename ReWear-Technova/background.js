chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "loginSuccess") {
        console.log("Login Success:", message.user);
    }
});
