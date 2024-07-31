document.getElementById('add-site-button').addEventListener('click', () => {
    // Get and trim the new site URL
    let newSite = document.getElementById('new-site').value.trim();
  
    // Ensure the URL has a scheme (default to 'https://')
    if (!/^https?:\/\//i.test(newSite)) {
      newSite = `https://${newSite}`;
    }
  
    try {
      // Normalize the URL
      const normalizedUrl = new URL(newSite);
      const standardizedUrl = `https://${normalizedUrl.hostname.toLowerCase()}`;
  
      chrome.storage.sync.get(['sites'], (result) => {
        const sites = result.sites || [];
        if (!sites.includes(standardizedUrl)) {
          sites.push(standardizedUrl);
          chrome.storage.sync.set({ sites }, () => {
            console.log('Sites after adding new site:', sites);
            displaySites();
          });
        } else {
          alert('Site already added!');
        }
      });
    } catch (e) {
      alert('Invalid URL. Please enter a valid URL.');
    }
  
    // Clear the input field
    document.getElementById('new-site').value = '';
  });
  function displaySites() {
    chrome.storage.sync.get(['sites'], (result) => {
      const sitesList = document.getElementById('sites-list');
      sitesList.innerHTML = '';
      const sites = result.sites || [];
      sites.forEach((site) => {
        const listItem = document.createElement('li');
        listItem.textContent = site;
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          removeSite(site);
        });
  
        listItem.appendChild(deleteButton);
        sitesList.appendChild(listItem);
      });
    });
  }

  function removeSite(siteToRemove) {
    chrome.storage.sync.get(['sites'], (result) => {
      let sites = result.sites || [];
      sites = sites.filter(site => site !== siteToRemove);
      chrome.storage.sync.set({ sites }, () => {
        displaySites();
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', displaySites);