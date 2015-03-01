/**
 * @fileOverview date 28.02.2015:
 * @author <trikadin@mail.ru>
 */

function alertAllInfo(info) {
    alert("Если бы я знал, куда, то мог бы отправить на сервер вот это:\n" + JSON.stringify(info, null, 4));
}

function iconClickListener(tab) {
    var info= {
        url: tab.url,
        title: tab.title,
        favurl: tab.favIconUrl
    };
    chrome.tabs.sendMessage(tab.id, info, alertAllInfo);
}

chrome.browserAction.onClicked.addListener(iconClickListener);