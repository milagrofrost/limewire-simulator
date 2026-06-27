(function() {
  const SIMULATED_WINDOW_WIDTH = 1050;
  const SIMULATED_WINDOW_HEIGHT = 740;
  const WINDOW_FIT_PADDING = 16;

  function syncCompactScreenMode() {
    const compact = window.innerWidth <= SIMULATED_WINDOW_WIDTH + WINDOW_FIT_PADDING ||
      window.innerHeight <= SIMULATED_WINDOW_HEIGHT + WINDOW_FIT_PADDING ||
      window.screen.width <= SIMULATED_WINDOW_WIDTH + WINDOW_FIT_PADDING ||
      window.screen.height <= SIMULATED_WINDOW_HEIGHT + WINDOW_FIT_PADDING ||
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
