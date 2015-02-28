/**
 * @fileOverview date 28.02.2015:
 * @author <trikadin@mail.ru>
 * @version 0.1
 */

function iconClickListener(tab) {
    alert("1, сука.");
}

chrome.browserAction.onClicked.addListener(iconClickListener);