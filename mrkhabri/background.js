chrome.action.onClicked.addListener(() => {
    // Open a new tab with your full-screen UI
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
