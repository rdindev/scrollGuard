console.log('Content script loaded');

function normalizeURL(url) {
  try {
    // Create a URL object to ensure it's a valid URL
    const normalizedUrl = new URL(url.trim());
    return normalizedUrl.hostname;
  } catch (e) {
    console.error('Invalid URL:', url, e);
    return null;
  }
}

  

chrome.storage.sync.get(['sites'], (result) => {
  const sites = (result.sites || []).map(normalizeURL).filter(Boolean);
  const currentSite = window.location.hostname;
  console.log('Sites from storage:', sites);
  console.log('Current site:', currentSite);

  if (sites.includes(currentSite)) {
    console.log(`Tracking scroll on site: ${currentSite}`);

    let scrollDistance = 0;
    let warningOn = false;
    let warningEnabled = false;
    let flashID;

    const warning = document.createElement('div');
    warning.id = 'doomscroll';
    warning.style =
      'height: 100%; position: fixed; width: 100%; z-index: 9000; display: flex; justify-content: center; flex-direction: column; color: #f94144; font-weight: bolder; text-align: center; font-size: 7vw; transition-property: opacity; transition-duration: 0.3s';
    warning.innerText = 'SCROLL HELL!';

    addEventListener('scroll', () => {
      console.log('Scroll event detected');

      const SCROLL_LIMIT = 4000;
      const FLASH_INTERVAL = 400;
      const SCREEN_DECAY_TIME = 7;

      const scrollDelta = document.documentElement.scrollTop - scrollDistance;
      scrollDistance = document.documentElement.scrollTop;

      if (scrollDelta > 0) {
        if (!warningEnabled && scrollDistance > SCROLL_LIMIT) {
          warningEnabled = true;

          // Create Warning
          document.body.insertAdjacentElement('afterbegin', warning);

          // Page Animation
          const children = document.body.children;
          for (let child of children) {
            if (child.id !== 'doomscroll') {
              child.style.opacity = 1;
              child.style.transitionProperty = 'opacity';
              child.style.transitionDuration = SCREEN_DECAY_TIME + 's';
            }
          }

          // Enable Flash
          flashID = setInterval(() => {
            warning.style.opacity = warningOn ? 0 : 1;
            warningOn = !warningOn;
          }, FLASH_INTERVAL);

          for (let child of children) {
            if (child.id !== 'doomscroll') child.style.opacity = 0;
          }


          // After Fade
setTimeout(() => {
  // Clear the body content
  document.body.innerHTML = '';

  // Stop the flashing warning
  clearInterval(flashID);

  // Fetch and Display Quote
  chrome.runtime.sendMessage({ action: 'fetchQuote' }, (response) => {
    if (response) {
      // Update warning with the fetched quote
      warning.innerText = `${response.quote}\n\n- ${response.author}`;
      warning.style.opacity = 1;
      warning.style.color = "#8ac926";
      warning.style.fontFamily = "sans-serif";
    }
  });

  // Append the warning to the body and ensure it's visible
  document.body.appendChild(warning);
  warning.style.opacity = 1;

}, SCREEN_DECAY_TIME * 1000);

        }
      }
    });
  } else {
    console.log(`Site not in the tracking list: ${currentSite}`);
  }
});
