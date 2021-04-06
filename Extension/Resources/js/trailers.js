const Trailers = {
    init: async function() {
        this.update();
    },
    update: async function() {
        const isShowTrailersEnabled = await isShowTrailers();
        const css    = `.netflix-trailer{display : ${isShowTrailersEnabled ? 'flex' : 'none'} !important}`;
        const style  = document.createElement('style');
    
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    },
};

function addTrailerBtn(e, t, n) {
    if ($(`div[data-id="${t.id}"] .netflix-trailer`)[0]) {
        return;
    }

    if (!t.title || t.title === '') {
        const img = n.querySelector('.previewModal--player_container .previewModal--boxart');
        t.title = img ? img.getAttribute('alt') : t.title;
    }

    const trailerBtn = `
        <a no-referrer="" no-opener="" no-follow="" class="netflix-trailer">
            <span class="nf-icon-button nf-flat-button nf-flat-button-primary nf-flat-button-uppercase">
                <span class="nf-flat-button-text">Watch Trailer</span>
            </span>
        </a>
    `;
    $(`div[data-id="${t.id}"]`).append(trailerBtn);
    $(`div[data-id="${t.id}"] .netflix-trailer`).click(function(e) {
        const request = createSearchRequest({
            q: `${t.title} ${t.type} Trailer`,
            key: 'AIzaSyAUJlEoNDa9zx0njiFWms0QdFnYkvFdodA',
            part: 'snippet',
            maxResults: '1',
            type: 'video',
        });
        chrome.runtime.sendMessage({
            type: GET_TRAILER,
            url: request,
        });
        e.stopPropagation();
    });
}

function createSearchRequest(properties) {
    return `https://www.googleapis.com/youtube/v3/search?q=${properties.q}&key=${properties.key}&part=${properties.part}&maxResults=${properties.maxResults}&type=${properties.type}`;
}