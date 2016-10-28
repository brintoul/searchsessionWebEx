

function doSession() {
    chrome.runtime.sendMessage({greeting: "greeting from the content script"});
    window.close();
}

document.getElementById('firstdiv').addEventListener('click', doSession);
