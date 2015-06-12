function getSelectedText(message, sender, responseListener) {
    message.text= window.getSelection() + "";
    responseListener(message);
}

chrome.runtime.onMessage.addListener(getSelectedText);