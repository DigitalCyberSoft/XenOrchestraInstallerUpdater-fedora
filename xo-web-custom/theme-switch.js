// Light / dark / auto theme switch for Xen Orchestra 5 (xo-web), copied to xo-web's assets/ by
// xo-install.sh, which also replaces the default mode below with XO_WEB_THEME.
//
// The dark theme is a second stylesheet, index-dark.css (<link id="xoi-dark-theme">), loaded after
// index.css. This script turns it on and off through its media attribute, so "auto" is simply the
// browser's prefers-color-scheme. It runs in <head>, before the page is drawn, so there's no flash of
// the wrong theme. The mode is kept per browser, and <html data-xoi-theme> tells the Theme entry of
// the menu (theme-switch.scss) which label to show.
;(function () {
  var KEY = 'xoi-theme'
  var DEFAULT_MODE = '@DEFAULT_MODE@'
  var MEDIA = { auto: '(prefers-color-scheme: dark)', light: 'not all', dark: 'all' }
  var ORDER = ['auto', 'light', 'dark']

  function current() {
    try {
      var mode = window.localStorage.getItem(KEY)
      if (MEDIA.hasOwnProperty(mode)) {
        return mode
      }
    } catch (error) {}
    return MEDIA.hasOwnProperty(DEFAULT_MODE) ? DEFAULT_MODE : 'auto'
  }

  function apply(mode) {
    var link = document.getElementById('xoi-dark-theme')
    if (link !== null) {
      link.media = MEDIA[mode]
    }
    document.documentElement.setAttribute('data-xoi-theme', mode)
  }

  window.xoiTheme = {
    get: current,
    set: function (mode) {
      if (!MEDIA.hasOwnProperty(mode)) {
        return
      }
      try {
        window.localStorage.setItem(KEY, mode)
      } catch (error) {}
      apply(mode)
    },
    cycle: function () {
      this.set(ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length])
    },
  }

  // keep other tabs of the same browser in step
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) {
      apply(current())
    }
  })

  apply(current())
})()
