chrome.browserAction.onClicked.addListener(
    async (tab) => {
        const url = `http://liferacing.ru/garage/add-link?link=${encodeURIComponent(tab.url)}`;
        console.log('request url', url);
        try {
            const response = await fetch(url, {credentials: 'include'});
            console.log(response.status, response.headers.get('Location'));
        } catch (err) {
            console.error('an error', err);
        }
    }
);