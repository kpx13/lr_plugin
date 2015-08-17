const addMessageHandler = (() => {
  const handlers = {};

  chrome.runtime.onMessage.addListener(
    ({type, message}, ...rest) => {
      handlers[type](message, ...rest);
    }
  );

  return (type, callback) => {handlers[type] = callback;};
})();

function sendMessage(type, message, callback) {
  chrome.runtime.sendMessage(
    chrome.runtime.id,
    {type, message},
    null,
    callback || (() => {})
  );
}

addMessageHandler('notification', ({level, text, title, reaction}) => {
  toastr[level](text, title, {
    closeButton: true,
    onclick: () => {
      if (reaction) {
        sendMessage(reaction);
      }
    }
  });
});
