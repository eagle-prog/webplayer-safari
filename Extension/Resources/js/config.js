const DEFAULTS = {
    wp_prevent_auto_play  : false,
    wp_show_ratings       : false,
    wp_show_trailers      : false,
};
const SWITCH_PREVENT_UPDATED  = 'switch_prevent_updated';
const SWITCH_RATINGS_UPDATED  = 'switch_ratings_updated';
const SWITCH_TRAILERS_UPDATED = 'switch_trailers_updated';
const ScaleMap = {
    0: 1.0,
    15: 0.7,
    30: 0.57,
    45: 0.51,
    60: 0.49,
    75: 0.5,
    90: 0.56,
    105: 0.5,
    120: 0.49,
    135: 0.51,
    150: 0.57,
    165: 0.7,
    180: 1.0,
    195: 0.7,
    210: 0.57,
    225: 0.51,
    240: 0.49,
    255: 0.5,
    270: 0.56,
    285: 0.5,
    300: 0.49,
    315: 0.51,
    330: 0.57,
    345: 0.7,
}
const NETFLIX_TWEAKED_DATA_NAME = "NETFLIX_TWEAKED_DATA";
const BILLBOARD_OBSERVER_NAME   = "BILLBOARD_OBSERVER";
const TITLE_CARDS_OBSERVER_NAME = "TITLE_CARDS_OBSERVER";
const BIG_ROW_OBSERVER_NAME     = "BIG_ROW_OBSERVER";
const JAWBONE_OBSERVER_NAME     = "JAWBONE_OBSERVER";
const LIST_ORDER_OBSERVER_NAME  = "LIST_ORDER_OBSERVER";
const NETFLIX_TWEAKED_CLASS     = "netflix-tweaked";