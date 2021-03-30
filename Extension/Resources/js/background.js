init();

/**
 * Initialization
 */
async function init() {
    setPopup('html/popup.html');
}

/**
 * Set extension popup
 */
function setPopup(popup) {
    chrome.browserAction.setPopup({popup: popup});
}

/*------------- Ratings -------------- */
const m = "https://unogs.com/",
    p = {
        series: "tv",
        movie: "movie"
    };
async function b(e) {
    const t = await s({
        doubanId: e
    });
    let n = null;
    return t && t.subject && (n = {
        rating: t.subject.rate,
        id: t.subject.id,
        comments: t.subject.short_comment,
        url: t.subject.url
    }), n
}
async function f({
    imdbId: e,
    title: t,
    year: n,
    type: o
}, i = !0) {
    const r = await
    function({
        imdbId: e,
        title: t,
        year: n,
        type: o
    }, i = !0) {
        let r = "http://private.omdbapi.com/?apikey=1e0ce2f6";
        return e ? (r += "&i=" + e, c(r)) : (r += (i ? "&s=" : "&t=") + encodeURIComponent(t), o && (r += "&type=" + ("tv" === o ? "series" : "movie")), n && (r += "&y=" + n), c(r))
    }({
        imdbId: e,
        title: t,
        year: n,
        type: o
    }, i);
    if ("True" !== r.Response) return {};
    let a, s;
    if (r.Search && r.Search.length) {
        let e, n = r.Search;
        return o && (n = r.Search.filter(e => o === p[e.Type])), n.length && 1 !== n.length && (e = n.find(e => e.Title === t)), e = e || n[0] || r.Search[0], f({
            imdbId: e.imdbID
        })
    }
    const d = r.imdbID ? {
        id: r.imdbID,
        rating: h(r.imdbRating),
        url: y(r.imdbID),
        awards: h(r.Awards)
    } : null;
    r.Ratings.length && r.Ratings.forEach(e => {
        /tomatoes/i.test(e.Source) && (a = e.Value), /metacritic/i.test(e.Source) && (s = e.Value)
    });
    const u = a ? {
        rating: a.replace(/\W/g, "")
    } : null;
    return metascore = s ? {
        rating: s.slice(0, -4)
    } : null, {
        title: r.Title,
        year: r.Year.slice(0, 4),
        type: p[r.Type],
        imdb: d,
        rt: u,
        metascore: metascore
    }
}

function g(e) {
    return (e = +e) >= 1e3 && e < 1e6 ? +(e / 1e3).toFixed(2) + "K" : e >= 1e6 && e < 1e12 ? +(e / 1e6).toFixed(2) + "M" : e > 1e12 ? "1 billion +" : void 0
}

function h(e) {
    return "N/A" === e ? null : e
}

function y(e) {
    return "https://www.imdb.com/title/" + e
}
chrome.tabs.onActivated.addListener(t => {
    l(e === t.tabId)
}), 
chrome.runtime.onMessage.addListener(({
    type: e
} = {}, t, n) => {
    "activation" === e && (! function(e = !1) {
        const t = +new Date;
        chrome.storage.local.get(null, ({
            date: n,
            settings: o,
            hasReviewed: i,
            ...r
        }) => {
            if ("number" == typeof n && t - n > 864e5 || e) {
                chrome.storage.local.clear(), chrome.storage.local.set({
                    hasReviewed: Boolean(i)
                }), o && chrome.storage.local.set({
                    settings: o
                }), chrome.storage.local.set({
                    date: t
                });
                const e = Object.keys(r).reduce((e, t) => (/^nf\d+$/.test(t) && (e[t] = r[t]), e), {});
                chrome.storage.local.set(e)
            } else "number" != typeof n && chrome.storage.local.set({
                date: t
            })
        })
    }(), function(e) {
        const t = document.createElement("iframe");
        t.referrerPolicy = "no-referrer", t.src = e, setTimeout(() => {
            t.remove()
        }, 1e3)
    }(m), n({
        id: t.tab.id
    }))
});
const o = "__production__",
i = "__production__" === o ? "https://us-central1-popcorn-plugin.cloudfunctions.net/api/v1" : "http://localhost:5001/popcorn-plugin/us-central1/api/v1",
r = {
    mode: "cors",
    headers: {
        "X-Popcorn": "true"
    }
},
a = {
    credentials: "omit",
    referrerPolicy: "no-referrer"
};

function c(e, t = a) {
    return fetch(e, t).then(e => {
        if (e.ok && /json/.test(e.headers.get("Content-Type"))) return e.json();
        e.text().then(e => (console.error(e), !1))
    })
}

function s({
    doubanId: e,
    title: t,
    imdbId: n
}) {
    const o = "https://movie.douban.com/j",
        i = o + "/subject_suggest?q=";
    if (e) return c("https://movie.douban.com/j/subject_abstract?subject_id=" + e);
    return c(n ? i + n : i + encodeURIComponent(t))
}
c.post = function(e, t) {
    return c(e, {
        method: "POST",
        body: JSON.stringify(t),
        ...r
    })
};
let d = [];
const u = [{
    id: 1,
    version: "0.2.3",
    title: "v0.2.3 update and important notice.",
    link: "https://www.patreon.com/posts/46435066"
}];

function l(e) {
    const n = e && d.length ? d.length.toString() : "";
    if (!t && e) return chrome.browserAction.setBadgeBackgroundColor({
        color: "#E54728"
    }), chrome.browserAction.setBadgeText({
        text: n
    }), void(t = !t);
    t && (chrome.browserAction.setBadgeText({
        text: n
    }), t = !t)
}
chrome.runtime.onConnect.addListener(t => {
    if (e = t && t.sender && t.sender.tab.id, l(!0), "rating" === t.name) return function(e) {
        e.onMessage.addListener(async ({
            msgId: t,
            service: o = "netflix",
            data: a
        } = {}) => {
            const d = a.id;
            let u = !0;
            if (d) {
                const {
                    imdb: e,
                    douban: t
                } = await async function(e, t = "netflix") {
                    let o, a;
                    const s = await (d = n[t] + e, new Promise((e, t) => {
                        chrome.storage.local.get(d, n => {
                            Object.keys(n).length ? e("object" == typeof d ? n : n[d]) : e(), chrome.runtime.lastError && t(chrome.runtime.lastError.message)
                        })
                    }));
                    var d;
                    if (s) o = s.imdb, a = s.douban;
                    else try {
                        const n = await
                        function({
                            id: e,
                            service: t
                        }) {
                            return c(`${i}/${t}/${e}`, r)
                        }({
                            id: e,
                            service: t
                        });
                        n && Object.keys(n).length && (o = n.imdb, a = n.douban)
                    } catch (e) {}
                    return {
                        imdb: o,
                        douban: a
                    }
                }(d, o);
                e && t && (u = !1), a = {
                    ...a,
                    imdbId: e,
                    doubanId: t
                }
            }
            movie = await async function({
                id: e,
                title: t,
                year: n,
                type: o,
                imdbId: i,
                doubanId: r
            } = {}) {
                const a = {
                    id: e,
                    title: t,
                    year: n,
                    type: o
                };
                if (i) a.imdbId = i;
                else {
                    const e = await async function({
                        id: e
                    }) {
                        const t = await
                        function(e) {
                            return c("https://unogs.com/api/title/detail?netflixid=" + e)
                        }(e);
                        if (t && t[0] && t[0].title) {
                            const e = t[0],
                                {
                                    year: n,
                                    top250: o,
                                    top250tv: i
                                } = e,
                                r = p[e.vtype],
                                a = e.title.replace(/&#(\d+);/g, (function(e, t) {
                                    return String.fromCharCode(t)
                                })),
                                c = e.imdbid && "notfound" !== e.imdbid ? {
                                    id: e.imdbid,
                                    rating: e.imdbrating,
                                    awards: h(e.imdbawards),
                                    votes: g(e.imdbvotes),
                                    top250: o,
                                    top250tv: i,
                                    url: y(e.imdbid)
                                } : null,
                                s = h(e.imdbmetascore) ? {
                                    rating: e.imdbmetascore
                                } : null;
                            return {
                                title: a,
                                year: n,
                                type: r,
                                imdb: c,
                                metascore: s
                            }
                        }
                        return {}
                    }(a);
                    if (e.imdb) {
                        for (const t in e) a[t] = e[t];
                        a.imdbId = a.imdb.id
                    }
                    a.year = e.year || a.year, a.type = e.type || a.type, a.title = e.title || a.title
                }
                let d = await f(a);
                i || (d = await
                    function(e, t) {
                        const n = !e.type || e.type === t.type,
                            o = !e.year || Math.abs(e.year - t.year) <= 1,
                            i = n && o;
                        if (e.imdbId && !i) return f({
                            title: e.title,
                            year: e.year,
                            type: e.type
                        }, !1);
                        return t
                    }(a, d));
                for (const e in d) d[e] && (a[e] = d[e]);
                a.imdb && (a.imdbId = a.imdb.id || a.imdbId);
                a.rt || (a.rt = await async function({
                    title: e,
                    year: t,
                    type: n
                }) {
                    const o = "https://www.rottentomatoes.com/napi/search/?query=" + encodeURIComponent(e) + "&offset=0&limit=1",
                        i = await c(o);
                    if (!i) return null;
                    let r;
                    "tv" === n && i.tvCount ? r = "tvSeries" : "movie" === n && i.movieCount && (r = "movies");
                    if (r) {
                        const e = i[r],
                            n = "https://www.rottentomatoes.com";
                        if (1 !== e.length && t) {
                            const o = e.find(e => e.endYear === t || e.year === t || e.meterScore) || e[0];
                            return {
                                rating: o.meterScore,
                                url: n + o.url
                            }
                        }
                        return {
                            rating: e[0].meterScore,
                            url: n + e[0].url
                        }
                    }
                    return null
                }(a));
                a.douban = r ? await b(r) : await async function({
                    imdbId: e,
                    title: t,
                    year: n,
                    type: o
                }) {
                    let i;
                    if (e) {
                        const t = await s({
                            imdbId: e
                        });
                        t && t.length && (i = t[0].id)
                    }
                    if (!i && t) {
                        const e = await s({
                            title: t
                        });
                        if (e && e.length) {
                            const t = e.find(t => 1 === e.length || o && (o === t.type || t.episode && "tv" === o) || n && t.year === +n);
                            i = t ? t.id : i
                        }
                    }
                    if (i) return b(i);
                    return null
                }(a);
                return a
            }(a), chrome.storage.local.set({
                [movie.id]: movie
            }), u = u && (movie.imdbId || movie.douban && movie.douban.id);
            try {
                ! function(e, t, o) {
                    if (e && (e.imdbId || e.douban || e.rt)) {
                        const r = e.id,
                            a = {
                                imdb: e.imdbId,
                                douban: e.douban ? e.douban.id : null
                            };
                        if (chrome.storage.local.set({
                                [`${n[t]}${r}`]: a
                            }), o) try {
                            ! function({
                                id: e,
                                service: t
                            } = {}, n = {}) {
                                if (!e) return;
                                t = t || "netflix", c.post(`${i}/${t}/${e}`, n)
                            }({
                                id: r,
                                service: t
                            }, a)
                        } catch (e) {}
                    }
                }(movie, o, u)
            } catch (e) {}
            return e.postMessage({
                msgId: t,
                data: movie
            }), !0
        })
    }(t), !0;
}); 
let e, t = !1;
const n = {
    netflix: "nf"
};