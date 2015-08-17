const addMessageHandler = (() => {
  const handlers = {};

  chrome.runtime.onMessage.addListener(
    ({type, message}, ...rest) => {
      handlers[type](message, ...rest);
    }
  );

  return (type, callback) => {
    handlers[type] = callback;
  };
})();

function sendMessage(tabId, type, message, callback) {
  chrome.tabs.sendMessage(
    tabId,
    {type, message},
    null,
    callback
  );
}

addMessageHandler('login', (message, {tab}) => {
  chrome.tabs.create({
    index: tab ? tab.index + 1 : undefined,
    url: 'http://liferacing.ru/account/login'
  });
});

addMessageHandler('garage', (message, {tab}) => {
  chrome.tabs.create({
    index: tab ? tab.index + 1 : undefined,
    url: 'http://liferacing.ru/garage/allocate'
  });
});

function checkAuthorizing() {
  return new Promise((resolve, reject) => {
    try {
      chrome.cookies.get({url: 'http://liferacing.ru', name: 'is_authorized'}, (cookie) => {
        if (cookie && cookie.value === 'yes') {
          resolve(true);
        } else {
          resolve(false);
        }
      });

    } catch (err) {
      reject(err);
    }
  });
}

async function addLinkToFavorites(link) {
  const
    url = `http://liferacing.ru/garage/add-link?link=${encodeURIComponent(link)}`;

  const response = await fetch(url, {credentials: 'include'});

  if (!response.ok) {
    throw new Error('not ok');
  }

  return response;
}

chrome.browserAction.onClicked.addListener(
  async (tab) => {
    if (await checkAuthorizing()) {
      try {
        await addLinkToFavorites(tab.url);

        sendMessage(tab.id, 'notification', {
          level: 'success',
          title: 'Выполнено',
          text: 'Ссылка отправлена на добавление. Нажмите здесь, чтобы открыть гараж',
          reaction: 'garage'
        });

      } catch (err) {
        sendMessage(tab.id, 'notification', {
          level: 'error',
          title: 'Ошибка',
          text: 'Извините, произошла ошибка при добавлении ссылки'
        });
      }
    } else {
      sendMessage(tab.id, 'notification', {
        level: 'error',
        title: 'Ошибка',
        text: 'Вы не авторизованы на сайте LifeRacing.ru. Нажмите здесь, чтобы авторизоваться',
        reaction: 'login'
      });
    }
  }
);
