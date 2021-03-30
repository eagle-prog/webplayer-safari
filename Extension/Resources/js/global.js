/**
 * Get active tab
 */
function getActiveTab() {
    return new Promise((resolve) => {
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0]);
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Get value from storage against a field.
 * If field is null, return all items in storage
 * @param {string} field 
 */
async function getValueFromStorage(field) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(DEFAULTS, (items) => {
                if (field) {
                    resolve(items[field]);
                } else {
                    resolve(items);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Store data to storage
 * @param {object} data 
 */
 async function setValueToStorage(data) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(data, () => {
                resolve(true);
            });
        } catch (err) {
            reject(err);
        }
    });
}

