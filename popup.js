document.getElementById('copyBtn').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url;

        await navigator.clipboard.writeText(url);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: showPopup,
            args: [`URL copied ${url}`]
        });
    } catch (err) {
        console.error(`Error by copying URL ${err}`);
    }
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const searchWord = document.getElementById('searchInput').value;
    if (searchWord) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Buscando palabra en la pestaña:', tab);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: searchAndHighlight,
            args: [searchWord]
        });
    }
});

function showPopup(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.right = '50px';
    popup.style.top = '50px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '10000';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.fontSize = '16px';
    popup.style.textAlign = 'center';

    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

function searchAndHighlight(word) {
    const bodyText = document.body.innerHTML;
    const regex = new RegExp(`(${word})`, 'gi');
    const newText = bodyText.replace(regex, '<span style="background-color: yellow;">$1</span>');
    document.body.innerHTML = newText;
}
