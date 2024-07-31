chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchQuote') {
    fetch('https://zenquotes.io/api/random')
      .then(response => response.json())
      .then(data => {
        sendResponse({ quote: data[0].q, author: data[0].a });
      })
      .catch(error => {
        console.error('Error fetching the quote:', error);
        sendResponse({ quote: 'Take a break, you are doing great!', author: 'Unknown' });
      });
    return true; // Will respond asynchronously
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['contentScript.js']
    });
  }
});
