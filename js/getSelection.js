/**
 * @fileOverview Нужен для получения выделения, date 01.03.2015:
 * @author <trikadin@mail.ru>
 */

function getSelectedText(message, sender, responseListener) {
    message.text= window.getSelection() + "";
    responseListener(message);
}

chrome.runtime.onMessage.addListener(getSelectedText);