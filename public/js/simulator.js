(function() {
  const SIMULATED_WINDOW_WIDTH = 1050;
  const SIMULATED_WINDOW_HEIGHT = 740;
  const WINDOW_FIT_PADDING = 16;
  const SAFE_MARGIN_KEYS = {
    left: ['safeLeft', 'safe-left', 'safe_left', 'left'],
    right: ['safeRight', 'safe-right', 'safe_right', 'right'],
    top: ['safeTop', 'safe-top', 'safe_top', 'top'],
    bottom: ['safeBottom', 'safe-bottom', 'safe_bottom', 'bottom']
  };

  function readSafeMargin(params, keys) {
    for (let index = 0; index < keys.length; index += 1) {
      if (!params.has(keys[index])) continue;
      const value = Number(params.get(keys[index]));
      return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
    }
    return 0;
  }

  function parseSafeMargins() {
    const params = new URLSearchParams(window.location.search);
    return {
      left: readSafeMargin(params, SAFE_MARGIN_KEYS.left),
      right: readSafeMargin(params, SAFE_MARGIN_KEYS.right),
      top: readSafeMargin(params, SAFE_MARGIN_KEYS.top),
      bottom: readSafeMargin(params, SAFE_MARGIN_KEYS.bottom)
    };
  }

  const safeMargins = parseSafeMargins();

  function getSafeViewport() {
    const rawWidth = Math.max(0, window.innerWidth || document.documentElement.clientWidth || 0);
    const rawHeight = Math.max(0, window.innerHeight || document.documentElement.clientHeight || 0);
    const horizontalMargins = Math.min(rawWidth, safeMargins.left + safeMargins.right);
    const verticalMargins = Math.min(rawHeight, safeMargins.top + safeMargins.bottom);

    return {
      left: Math.min(safeMargins.left, rawWidth),
      right: Math.min(safeMargins.right, rawWidth),
      top: Math.min(safeMargins.top, rawHeight),
      bottom: Math.min(safeMargins.bottom, rawHeight),
      width: Math.max(0, rawWidth - horizontalMargins),
      height: Math.max(0, rawHeight - verticalMargins),
      centerX: Math.min(safeMargins.left, rawWidth) + Math.max(0, rawWidth - horizontalMargins) / 2,
      centerY: Math.min(safeMargins.top, rawHeight) + Math.max(0, rawHeight - verticalMargins) / 2
    };
  }

  function syncSafeViewport() {
    const safe = getSafeViewport();
    const root = document.documentElement;
    root.style.setProperty('--safe-left', safe.left + 'px');
    root.style.setProperty('--safe-right', safe.right + 'px');
    root.style.setProperty('--safe-top', safe.top + 'px');
    root.style.setProperty('--safe-bottom', safe.bottom + 'px');
    root.style.setProperty('--safe-width', safe.width + 'px');
    root.style.setProperty('--safe-height', safe.height + 'px');
    root.style.setProperty('--safe-width-px', safe.width + 'px');
    root.style.setProperty('--safe-height-px', safe.height + 'px');
    document.body.classList.toggle('safe-area-active', safeMargins.left + safeMargins.right + safeMargins.top + safeMargins.bottom > 0);
    return safe;
  }

  window.limeWireSafeViewport = {
    margins: Object.assign({}, safeMargins),
    getSafeViewport: getSafeViewport,
    sync: syncSafeViewport
  };

  Object.defineProperties(window, {
    safeInnerWidth: {
      configurable: true,
      get: function() { return getSafeViewport().width; }
    },
    safeInnerHeight: {
      configurable: true,
      get: function() { return getSafeViewport().height; }
    },
    safeCenterX: {
      configurable: true,
      get: function() { return getSafeViewport().centerX; }
    },
    safeCenterY: {
      configurable: true,
      get: function() { return getSafeViewport().centerY; }
    }
  });

  function syncCompactScreenMode() {
    const safe = syncSafeViewport();
    const compact = safe.width <= SIMULATED_WINDOW_WIDTH + WINDOW_FIT_PADDING ||
      safe.height <= SIMULATED_WINDOW_HEIGHT + WINDOW_FIT_PADDING ||
      new URLSearchParams(window.location.search).has('compact');
    document.body.classList.toggle('compact_screen', compact);
  }

  syncCompactScreenMode();
  window.addEventListener('resize', syncCompactScreenMode);

  localStorage.setItem('lwg_id', 'local-sim-user');
  localStorage.setItem('lwg_email', 'simulator@example.local');
  localStorage.setItem('lwg_created', 'local');
  localStorage.setItem('lwg_permanentScore', '0');
  localStorage.setItem('lwg_highscore', '0');
  localStorage.setItem('lwg_userScoreRank', '0');
  localStorage.setItem('lwg_game_id', 'local-sim-session');

  document.addEventListener('submit', function(event) {
    const form = event.target;
    if (!form || form.getAttribute('name') !== 'search_for_downloads') return;

    document.body.classList.remove('game_over');
    document.querySelectorAll('.window.locked').forEach(function(windowElement) {
      windowElement.classList.remove('locked');
    });
    const resultsScreen = document.querySelector('.results_screen');
    if (resultsScreen) resultsScreen.classList.add('searching');

    const titleInput = form.querySelector('[name="search_for_downloads[query]"]');
    const artistInput = form.querySelector('[name="search_for_downloads[artist]"]');
    const albumInput = form.querySelector('[name="search_for_downloads[album]"]');
    if (!titleInput) return;

    const originalTitle = titleInput.value;
    const parts = [artistInput && artistInput.value, originalTitle, albumInput && albumInput.value]
      .map(value => String(value || '').trim())
      .filter(Boolean);

    if (parts.length) {
      titleInput.value = parts.join(' ');
      setTimeout(function() {
        titleInput.value = originalTitle;
      }, 0);
    }
  }, true);

  if (window.jQuery) {
    jQuery(document).ajaxComplete(function(_event, _xhr, settings) {
      if (settings && settings.url && settings.url.indexOf('/api/search') !== -1) {
        jQuery('.results_screen').removeClass('searching');
      }
    });

    jQuery(document).ajaxError(function(_event, _xhr, settings) {
      if (settings && settings.url && settings.url.indexOf('/api/search') !== -1) {
        jQuery('.results_screen').removeClass('searching');
      }
    });
  }
})();
