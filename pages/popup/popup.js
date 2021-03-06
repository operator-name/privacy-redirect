'use strict';

let nitterInstance = document.querySelector('#nitter-instance');
let invidiousInstance = document.querySelector('#invidious-instance');
let bibliogramInstance = document.querySelector('#bibliogram-instance');
let osmInstance = document.querySelector('#osm-instance');
let disableNitter = document.querySelector('#disable-nitter');
let disableInvidious = document.querySelector('#disable-invidious');
let disableBibliogram = document.querySelector('#disable-bibliogram');
let disableOsm = document.querySelector('#disable-osm');
let version = document.querySelector('#version');

window.browser = window.browser || window.chrome;

browser.storage.sync.get(
  [
    'nitterInstance',
    'invidiousInstance',
    'bibliogramInstance',
    'osmInstance',
    'disableNitter',
    'disableInvidious',
    'disableBibliogram',
    'disableOsm'
  ],
  result => {
    nitterInstance.value = result.nitterInstance || '';
    invidiousInstance.value = result.invidiousInstance || '';
    bibliogramInstance.value = result.bibliogramInstance || '';
    osmInstance.value = result.osmInstance || '';
    disableNitter.checked = !result.disableNitter;
    disableInvidious.checked = !result.disableInvidious;
    disableBibliogram.checked = !result.disableBibliogram;
    disableOsm.checked = !result.disableOsm;
  }
);

version.textContent = browser.runtime.getManifest().version;

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function parseURL(urlString) {
  if (urlString) {
    try {
      const url = new URL(urlString);
      if (url.username && url.password) {
        return `${url.protocol}//${url.username}:${url.password}@${url.host}`
      } else {
        return url.origin;
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
}

let nitterInstanceChange = debounce(() => {
  if (nitterInstance.checkValidity()) {
    browser.storage.sync.set({
      nitterInstance: parseURL(nitterInstance.value)
    });
  }
}, 500);
nitterInstance.addEventListener('input', nitterInstanceChange);

let invidiousInstanceChange = debounce(() => {
  if (invidiousInstance.checkValidity()) {
    browser.storage.sync.set({
      invidiousInstance: parseURL(invidiousInstance.value)
    });
  }
}, 500);
invidiousInstance.addEventListener('input', invidiousInstanceChange);

let bibliogramInstanceChange = debounce(() => {
  if (bibliogramInstance.checkValidity()) {
    browser.storage.sync.set({
      bibliogramInstance: parseURL(bibliogramInstance.value)
    });
  }
}, 500);
bibliogramInstance.addEventListener('input', bibliogramInstanceChange);

let osmInstanceChange = debounce(() => {
  if (osmInstance.checkValidity()) {
    browser.storage.sync.set({
      osmInstance: parseURL(osmInstance.value)
    });
  }
}, 500);
osmInstance.addEventListener('input', osmInstanceChange);

disableNitter.addEventListener('change', event => {
  browser.storage.sync.set({ disableNitter: !event.target.checked });
});

disableInvidious.addEventListener('change', event => {
  browser.storage.sync.set({ disableInvidious: !event.target.checked });
});

disableBibliogram.addEventListener('change', event => {
  browser.storage.sync.set({ disableBibliogram: !event.target.checked });
});

disableOsm.addEventListener('change', event => {
  browser.storage.sync.set({ disableOsm: !event.target.checked });
});

document.querySelector('#more-options').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});
