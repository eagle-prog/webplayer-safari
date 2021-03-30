const Ratings = {
    init: async function() {
        this.update();
    },
    update: async function() {
        const isShowRatingsEnabled = await isShowRatings();
        const css    = `.popcorn-source{display : ${isShowRatingsEnabled ? 'flex' : 'none'} !important}`;
        const style  = document.createElement('style');
    
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    },
}

const e = {};
let t, n, o = {
    imdb: true,
    rt: true,
    metascore: true,
};
chrome.runtime.sendMessage({
    type: "activation"
}), 
chrome.storage.local.get("settings", e => {
    e.settings && (o = e.settings)
}), 
chrome.runtime.onMessage.addListener(e => {
    if ("settings" === e.name) {
        let t;
        Object.keys(o).forEach(n => {
            o[n] !== e.data[n] && (o[n] = e.data[n], t = n)
        }), 
        t && function(e) {
            document.querySelectorAll(f).forEach(t => {
                const n = t.querySelector("." + e);
                if (n) n.parentElement.remove();
                else {
                    const n = t.getAttribute("data-id");
                    chrome.storage.local.get(n, o => {
                        const r = o[n];
                        r && r[e] && t.querySelector(".popcorn-source").append(d(e, r[e]))
                    })
                }
            })
        }(t)
    }
});
const r = chrome.runtime.connect({
    name: "rating"
});
async function a(t, n = "netflix", o) {
    try {
        if (t.id) {
            const e = await (a = t.id, new Promise((e, t) => {
                chrome.storage.local.get(a, n => {
                    Object.keys(n).length ? 
                        e("object" == typeof a ? n : n[a]) : 
                        e(), 
                        chrome.runtime.lastError && t(chrome.runtime.lastError.message)
                })
            }));
            if (e && Object.keys(e).length) return o(e)
        }
        var a;
        if (t.id || t.title) {
            const a = +new Date + t.id;
            r.postMessage({
                msgId: a,
                service: n,
                data: t
            }), e[a] = o
        }
    } catch (err) {
        console.log(err);
    }
}

function i(e) {
    const t = e.hasAttribute("id") && e.className.includes("jawBoneContainer") ? e : e.querySelector("div.jawBoneContainer[id]");
    if (t) return t.id;
    const n = e.querySelector(".ptrack-content");
    if (n) {
        const e = n.getAttribute("data-ui-tracking-context").match(/%22video_id%22:(\d+)/);
        return e && e[1] ? e[1] : null
    }
    const o = e.querySelector('a[data-uia="play-button"]');
    if (o) {
        const e = o.href.match(/watch\/(\d+)\?/);
        return e && e[1] ? e[1] : null
    }
}
r.onMessage.addListener((function(t) {
    const n = t.msgId;
    e[n] && (e[n](t.data), delete e[n])
}));
const c = "popcorn-",
    s = ["imdb", "rt", "metascore", "douban"];

function d(e, t, n = !1) {
    let o, r;
    "imdb" === e ? r = "IMDb" : "rt" === e ? (r = "Tomatometer", o = e, t.rating >= 75 ? o += "certified" : o += t.rating >= 65 || null === t.rating ? "fresh" : "rotten") : r = e[0].toUpperCase() + e.slice(1);
    const a = l("div", {
            className: c + "logo",
            attrs: {
                title: r,
                "aria-label": r,
                style: `background-image:url(${chrome.runtime.getURL(`images/${o||e}.png`)})`
            }
        }),
        i = t.rating ? "" : "Not enough votes or our data is outdated. Click to check in the source page.",
        s = l("div", {
            className: c + "rating",
            text: t.rating || "-",
            attrs: {
                title: i,
                "aria-label": i
            }
        });
    let d;
    !n && t.votes && (d = l("div", {
        className: c + "votes",
        text: t.votes + " votes"
    }));
    const u = l("div", {
            className: c + "main"
        }, [s, d]),
        m = l("div", {
            className: e
        }, [a, u]),
        p = {
            "no-referrer": "",
            "no-opener": "",
            "no-follow": "",
            target: "_blank"
        };
    t.url && (p.href = t.url);
    const w = l("a", {
        attrs: p
    }, m);
    return w.addEventListener("click", e => {
        e.stopPropagation()
    }), w
}

function l(e = "div", {
    className: t,
    attrs: n = {},
    text: o
} = {}, r) {
    const a = document.createElement(e);
    t && (a.className = "string" == typeof t ? t : t.join(" "));
    const i = Object.keys(n);
    return i.length && i.forEach(e => {
        a.setAttribute(e, n[e])
    }), o && (a.textContent = o), r && (r instanceof Array ? r.forEach(e => {
        e && a.append(e)
    }) : a.append(r)), a
}

function u(e, t, r) {
    const a = function(e = "bigrow", t = {}, n = !1) {
        let r;
        !n && t.imdb && t.imdb.awards && (r = l("div", {
            className: c + "awards",
            text: t.imdb.awards
        }));
        const a = s.reduce((e, r) => (o[r] && t[r] && e.push(d(r, t[r], n)), e), []),
            i = l("div", {
                className: c + "source"
            }, a),
            u = ["popcorn-container-" + e];
        return n && u.push("popcorn--minimal"), l("div", {
            className: u,
            attrs: {
                "data-id": t.id
            }
        }, [i, r])
    }(e, t, "mini" === e || "titlecard" === e);
    let i;
    if (n = new Date, "billboard" === e || "jawbone" === e) {
        const e = r.querySelector(".info-wrapper-fade") || r.querySelector(".info-wrapper");
        if (e) return void e.prepend(a);
        i = r.querySelector(".meta") || r.querySelector(".video-title")
    }
    if ("bigrow" === e && (i = r.querySelector(".billboard-title")), "modal" !== e)
        if ("mini" === e && (i = r.querySelector(".buttonControls--container")), "titlecard" !== e) i && i.after(a);
        else {
            const e = r.querySelector(".videoMetadata--container");
            e && e.prepend(a)
        }
    else {
        r.querySelector(".previewModal--detailsMetadata-left").prepend(a)
    }
}
let m = [];

function p(e) {
    m = m.filter(t => t.id !== e.id), 
    chrome.runtime.sendMessage({
        type: "notification",
        data: m
    }), 
    chrome.runtime.sendMessage({
        type: "notification",
        method: "POST",
        data: m
    })
}
const w = {
    subtree: !0,
    childList: !0
},
f = 'div[class*="popcorn-container"]',
b = new MutationObserver((e, t) => {
    const n = document.querySelector(".mainView");
    document.querySelector(".mainView") && (t.disconnect(), g.observe(n, w), M(n), C(n))
}),
g = new MutationObserver(e => {
    e.forEach(e => {
        const t = e.addedNodes && e.addedNodes[0];
        t && 1 === t.nodeType && (M(t), E(t))
    })
}),
y = new MutationObserver(e => {
    let t = e.find(e => "overview" === e.target.getAttribute("data-popcorn") && !e.target.querySelector(f) && e.addedNodes.length && !e.addedNodes[0].classList.contains("js-transition-node") && e.target.querySelector('.jawBonePane[id*="overview" i]:not(.js-transition-node)'));
    t && (t = t.target.closest(".jawBoneContent") || t.target.closest(".jawBoneContainer[id]"), B("jawbone", t))
}),
v = new MutationObserver(e => {
    let t = e.find(e => e.addedNodes.length && /mainView|genre|is-fullbleed/.test(e.target.className));
    if (t) {
        t = t.target;
        const e = t.querySelector(f);
        e && e.getAttribute("data-id") === i(t) || C(t)
    }
}),
h = new MutationObserver(e => {
    let t = e.find(e => "jawbone" === e.target.getAttribute("data-popcorn") && e.addedNodes.length);
    if (t) {
        t = t.target.closest(".jawBoneContent") || t.target, x(t.querySelector(".jawBoneOpenContainer"), "jawbone");
        !t.querySelector(".title .text") ? B("jawbone", t) : S.observe(t, w)
    }
}),
S = new MutationObserver(e => {
    let t = e.find(e => e.target.classList.contains("title") && e.target.querySelector("img"));
    if (t) {
        t = t.target;
        const e = t.closest(".jawBoneContent") || t.closest(".jawBoneContainer[id]");
        if (e) {
            B(e.classList.contains("jawBoneContent") ? "jawbone" : "billboard", e)
        }
    }
}),
q = new MutationObserver(e => {
    let t = e.find(e => e.addedNodes.length && /section-container/.test(e.addedNodes[0].className));
    if (t) {
        t = t.addedNodes[0];
        const e = t.querySelector(".moreLikeThis--container");
        e && Array.from(e.children).forEach(e => {
            B("titlecard", e)
        })
    }
}),
j = new MutationObserver(e => {
    let t = e.find(e => e.addedNodes.length && e.addedNodes[0]);
    if (t) {
        t = t.addedNodes[0];
        k(t.closest(".previewModal--wrapper"))
    }
}),
N = new MutationObserver(e => {
    let t = e.find(e => e.addedNodes.length && e.addedNodes[0].classList.contains("previewModal--wrapper"));
    if (t)
        if (t = t.addedNodes[0], /mini-modal/.test(t.className)) {
            ! function(e) {
                if (e.querySelector(".duration") || e.querySelector(".previewModal-progress") || e.querySelector(".previewModal-episodeDetails")) B("mini", e);
                else {
                    new MutationObserver((t, n) => {
                        t.find(e => e.addedNodes.length && /duration|progress|episodeDetail/.test(e.addedNodes[0].className)) && (B("mini", e), n.disconnect())
                    }).observe(e, w)
                }
            }(t);
            const e = t.querySelector(".previewModal--info");
            e && j.observe(e, {
                childList: !0
            })
        } else /detail-modal/.test(t.className) && k(t)
});

function M(e) {
    e.querySelectorAll(".jawBoneContent").forEach(e => {
        x(e, "jawbone"), h.observe(e, w), e.classList.contains("open") && !e.querySelector(f) && (x(e.querySelector(".jawBoneOpenContainer"), "jawbone"), B("jawbone", e))
    });
    const t = e.querySelector(".jawBoneContainer[id] .jawBone");
    if (t) {
        const e = t.querySelector(".jawBonePanes");
        e && (x(e, "overview"), y.observe(e, w))
    }
}

function C(e) {
    const t = e.querySelector(".jawBoneContainer[id]") || e.querySelector(".billboard-row");
    if (!t || t.querySelector(f)) return;
    !t.querySelector(".title .text") ? B("billboard", t) : S.observe(t, w)
}

function B(e, n) {
    a(function(e) {
        let n, o;
        const r = e.querySelector(".jawBone > h3 .title") || e.querySelector(".jawBone > h1") || e.querySelector(".billboard-title") || e.querySelector(".previewModal--player_container") || e.querySelector(".titleCard-imageWrapper");
        if (r) {
            const e = r.querySelector('img:not([alt=""])');
            n = e ? e.alt : null, n = r.querySelector('img:not([alt=""])') ? r.querySelector('img:not([alt=""])').alt : null
        } else n = null;
        const a = e.querySelector(".meta .year") || e.querySelector(".videoMetadata--container .year");
        o = a ? a.textContent : null;
        const c = i(e),
            s = function(e) {
                if (e.querySelector(".previewModal-episodeDetails")) return "tv";
                const t = e.querySelector(".info-wrapper") || e.querySelector(".duration") || e.querySelector(".previewModal-progress");
                return t ? /(^S\d+)|[sS]eason|[pP]art/.test(t.textContent) ? "tv" : "movie" : null
            }(e);
        return t = new Date, {
            title: n,
            id: c,
            year: o,
            type: s
        }
    }(n), "netflix", t => {
        u(e, t, n)
    })
}

function E(e) {
    const t = e.classList.contains("lolomoBigRow") ? e : e.querySelector(".lolomoBigRow");
    t && !t.querySelector(f) && B("bigrow", t)
}

function x(e, t) {
    e && !e.hasAttribute("data-popcorn") && e.setAttribute("data-popcorn", t)
}

function k(e) {
    B("modal", e);
    const t = e.querySelector(".moreLikeThis--wrapper");
    t && q.observe(t, w);
    const n = e.querySelector(".moreLikeThis--container");
    n && Array.from(n.children).forEach(e => {
        B("titlecard", e)
    })
}

function A() {
    const e = document.querySelector(".mainView"),
        t = document.querySelector("div[dir] > div");
    if (N.observe(t, {
            childList: !0
        }), e) {
        g.observe(e, w), M(e), E(e), C(e), v.observe(e, w);
        const t = document.querySelector(".detail-modal");
        t && k(t), document.querySelector('style[data-name="popcorn"]') || function() {
            const e = document.querySelector(".jawBoneContainer") || document.querySelector(".billboard-pane");
            if (!e || !e.clientHeight) return;
            const t = document.createElement("style");
            t.setAttribute("data-name", "popcorn");
            const n = (e.clientHeight + 80) / window.innerWidth * 100;
            t.textContent = `\n    .billboard-row .billboard {\n      height: ${n}vw !important;\n    }\n    .lolomoRow.jawBoneOpen~.lolomoRow, .rowContainer.jawBoneOpen~.rowContainer {\n      transform: translate3d(0, ${n}vw, 0) !important;\n    }\n    .jawBoneContainer {\n      height: ${n}vw !important;\n    }\n    .lolomo.has-open-jaw {\n      padding: 0 0 ${n+2}vw !important;\n    }\n    @media screen and (max-width: 1099px) and (min-width: 800px){\n      .VideoMerchPlayer--in-jaw video {\n        height: ${n}vw !important;\n      }\n    }\n  `, document.head.append(t)
        }()
    } else b.observe(document, w)
}
window.addEventListener("popstate", () => {
    /browse|title|search/.test(window.location.href) && (N.disconnect(), g.disconnect(), v.disconnect(), A())
}), A();