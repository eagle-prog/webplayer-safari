/**
 * Event listener to handle message
 */
function handleMessage(message, sender, sendResponse) {
    if (message.action === SWITCH_PREVENT_UPDATED) {
        location.reload();
    } else if (message.action === SWITCH_RATINGS_UPDATED) {
        location.reload();
    } else if (message.action === SWITCH_TRAILERS_UPDATED) {

    }
}

/**
 * Send a message to background script
 * @param {string} message 
 * @param {object} data 
 */
function sendMessage(message, data) {
    chrome.runtime.sendMessage(message, data);
}

function injectCSS() {
    const style = document.createElement('link');
    style.href  = 'https://fonts.googleapis.com/css2?family=Material+Icons';
    style.rel   = 'stylesheet';
    document.head.appendChild(style);
}

window.onload = async function() {
    injectCSS();
    Controls.init();
    Search.init();
    Prevent.init();
    Ratings.init();
    
    chrome.runtime.onMessage.addListener(handleMessage);
}