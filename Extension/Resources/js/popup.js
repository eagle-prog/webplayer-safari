window.onload = async () => {
    await initUI();
    initEvents();
}

/**
 * Initialize popup UI
 */
async function initUI() {
    const isPreventAutoPlayEnabled = await isPreventAutoPlay();
    const isShowRatingsEnabled     = await isShowRatings();
    const isShowTrailersEnabled    = await isShowTrailers();

    $('.chk-prevent-auto-play').attr('checked', isPreventAutoPlayEnabled);
    $('.chk-show-ratings').attr('checked', isShowRatingsEnabled);
    $('.chk-show-trailers').attr('checked', isShowTrailersEnabled);

    new Switchery(document.querySelector('.chk-prevent-auto-play'), {
        size: 'small'
    });
    new Switchery(document.querySelector('.chk-show-ratings'), {
        size: 'small'
    });
    new Switchery(document.querySelector('.chk-show-trailers'), {
        size: 'small'
    });
}

/**
 * Initialize event handlers
 */
function initEvents() {
    $('.chk-prevent-auto-play').change(onChangePreventAutoPlay);
    $('.chk-show-ratings').change(onChangeShowRatings);
    $('.chk-show-trailers').change(onChangeShowTrailers);
}

async function onChangePreventAutoPlay() {
    const checked = $(this).is(':checked');
    await setValueToStorage({ wp_prevent_auto_play: checked });
    sendMessage({action: SWITCH_PREVENT_UPDATED});
}

async function onChangeShowRatings() {
    const checked = $(this).is(':checked');
    await setValueToStorage({ wp_show_ratings: checked });
    sendMessage({action: SWITCH_RATINGS_UPDATED});
}

async function onChangeShowTrailers() {
    const checked = $(this).is(':checked');
    await setValueToStorage({ wp_show_trailers: checked });
    sendMessage({action: SWITCH_TRAILERS_UPDATED});
}

function sendMessage(data) {
    chrome.tabs.query({
        url: 'https://www.netflix.com/*'
    }, (tabs) => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, data);
        }
    });
}