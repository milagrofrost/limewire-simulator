(function(window, $) {
  if (!$ || !$.ajax) return;

  var originalAjax = $.ajax;
  var sessions = {};
  var games = {};
  var globalSearchCounter = 0;

  var highscore = [
    { rank: 1, user: 'KazaaKing', score: 9999 },
    { rank: 2, user: 'NapsterKid', score: 8000 },
    { rank: 3, user: 'BearShareFan', score: 7200 },
    { rank: 4, user: 'GnutellaGuru', score: 6500 },
    { rank: 5, user: 'WinMXWizard', score: 6100 },
    { rank: 6, user: 'FrostWireKid', score: 5800 },
    { rank: 7, user: 'LocalPlayer', score: 3200 }
  ];

  var baseResults = [
    ['sg-outshined', 'clean', 'hash-sg-001', 'Soundgarden - Outshined', 'mp3', 4852, 'T3 or Higher', '128'],
    ['sg-black-hole-sun', 'clean', 'hash-sg-002', 'Soundgarden - Black Hole Sun', 'mp3', 4968, 'T3 or Higher', '128'],
    ['sg-spoonman-a', 'clean', 'hash-sg-003', 'Soundgarden - Spoonman', 'mp3', 3864, 'T3 or Higher', '128'],
    ['sg-pretty-noose', 'clean', 'hash-sg-004', 'Soundgarden - Pretty Noose', 'mp3', 3961, 'T3 or Higher', '128'],
    ['sg-rusty-cage', 'clean', 'hash-sg-005', 'Johnny Cash - Rusty Cage (Soundgarden Cover)', 'mp3', 2690, 'T1', '128'],
    ['sg-fell-on-black-days', 'clean', 'hash-sg-006', 'Soundgarden - Fell On Black Days', 'mp3', 4732, 'T3 or Higher', '192'],
    ['sg-burden', 'clean', 'hash-sg-007', 'Soundgarden - Burden In My Hand', 'mp3', 5240, 'Cable', '192'],
    ['sg-day-i-tried', 'clean', 'hash-sg-008', 'Soundgarden - The Day I Tried To Live', 'mp3', 7487, 'T3 or Higher', '192'],
    ['numb-clean', 'clean', 'hash-numb-001', 'Linkin Park - Numb.mp3', 'mp3', 4300, 'T3', '192'],
    ['bring-clean', 'clean', 'hash-bring-002', 'Evanescence - Bring Me To Life.mp3', 'mp3', 5200, 'Cable', '256'],
    ['virus-a', 'virus', 'hash-virus-006', 'Soundgarden - Full Discography 320kbps.mp3.exe', 'exe', 640, 'T3', '320'],
    ['virus-b', 'virus', 'hash-virus-007', 'Metallica - One [RARE LIVE] mp3.scr', 'scr', 420, 'Cable', '128']
  ];

  function nowSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  function stableHash(value) {
    var hash = 2166136261;
    var input = String(value || '');
    for (var i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRng(seedText) {
    var seed = stableHash(seedText) || 1;
    return function rand() {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) / 4294967296);
    };
  }

  function pick(rand, values) {
    return values[Math.floor(rand() * values.length)];
  }

  function shuffle(rand, rows) {
    var copy = rows.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function slug(value) {
    return String(value || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 36) || 'file';
  }

  function titleCase(value) {
    return String(value || 'unknown').replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }

  function parseData(data) {
    var result = {};
    if (!data) return result;
    if (typeof data === 'string') {
      data.split('&').forEach(function(pair) {
        var parts = pair.split('=');
        if (!parts[0]) return;
        result[decodeURIComponent(parts[0].replace(/\+/g, ' '))] = decodeURIComponent(String(parts[1] || '').replace(/\+/g, ' '));
      });
      return result;
    }
    Object.keys(data).forEach(function(key) {
      result[key] = data[key];
    });
    return result;
  }

  function getUrl(options) {
    return typeof options === 'string' ? options : String(options.url || '');
  }

  function getPath(url) {
    var anchor = document.createElement('a');
    anchor.href = url;
    return anchor.pathname || url.split('?')[0];
  }

  function getQueryParams(url) {
    var query = String(url || '').split('?')[1] || '';
    return parseData(query);
  }

  function getUser(email) {
    var safeEmail = email || 'simulator@example.local';
    if (!sessions[safeEmail]) {
      sessions[safeEmail] = {
        id: 'local-user-' + stableHash(safeEmail).toString(16).slice(0, 8),
        email: safeEmail,
        created: new Date().toISOString().slice(0, 10),
        permanent_score: Number(localStorage.getItem('lwg_permanentScore')) || 0,
        highscore: Number(localStorage.getItem('lwg_highscore')) || 0,
        user_score_rank: Number(localStorage.getItem('lwg_userScoreRank')) || 999
      };
    }
    updateUserRank(sessions[safeEmail]);
    return sessions[safeEmail];
  }

  function updateUserRank(user) {
    var scores = highscore.map(function(row) { return row.score; }).concat([user.highscore]).sort(function(a, b) { return b - a; });
    user.user_score_rank = scores.indexOf(user.highscore) + 1;
  }

  function legacyRows(query) {
    var lower = String(query || '').toLowerCase();
    var stopWords = { the: true, a: true, an: true, and: true, or: true, to: true, of: true, in: true, on: true, all: true };
    var terms = lower.split(/\s+/).map(function(term) {
      return term.replace(/[^a-z0-9]/g, '');
    }).filter(function(term) {
      return term && !stopWords[term];
    });

    return baseResults.filter(function(row) {
      var title = row[3].toLowerCase();
      return !terms.length || terms.every(function(term) { return title.indexOf(term) !== -1; });
    }).map(function(row) {
      return {
        id: row[0],
        var: row[1],
        h: row[2],
        title: row[3],
        ext: row[4],
        size: row[5],
        speed: row[6],
        bitrate: row[7]
      };
    });
  }

  function row(idPrefix, variant, query, index, title, ext, size, speed, bitrate, risk, reason) {
    return {
      id: idPrefix + '-' + slug(query) + '-' + index + '-' + stableHash(title).toString(16).slice(0, 5),
      var: variant,
      h: 'hash-' + idPrefix + '-' + stableHash(query + ':' + index + ':' + title).toString(16),
      title: title,
      ext: ext,
      size: size,
      speed: speed,
      bitrate: bitrate || '',
      risk: risk || 20,
      reason: reason || ''
    };
  }

  function proceduralSearchResults(query, counter) {
    var q = String(query || 'unknown').trim() || 'unknown';
    var display = titleCase(q);
    var rand = createRng(q + ':' + counter + ':' + Date.now().toString().slice(-4));
    var rows = [];

    var cleanTemplates = [
      function() { return display + '.mp3'; },
      function() { return display + ' [' + pick(rand, ['128kbps', '192kbps', '256kbps', '320kbps']) + '].mp3'; },
      function() { return display + ' (Radio Edit).mp3'; },
      function() { return display + ' live.mp3'; },
      function() { return display + ' acoustic.mp3'; },
      function() { return '01 - ' + display + '.mp3'; },
      function() { return q.toLowerCase().replace(/\s+/g, '_') + '.mp3'; },
      function() { return display + ' ' + pick(rand, ['NapsterRip', 'Kazaa', 'LimeWireRip', 'BearShare', 'CD Rip', 'remix']) + '.mp3'; },
      function() { return display + ' (Live at ' + pick(rand, ['MadisonSquareGarden', 'TownHall', 'KROQ', 'MTV', 'Basement']) + ').mp3'; },
      function() { return display + ' - ' + pick(rand, ['Remix', 'Bootleg', 'Demo', 'Version', 'Alt Take']) + '.mp3'; },
      function() { return pick(rand, ['Track 03', 'Unknown Artist', 'Shared Folder']) + ' - ' + display + '.mp3'; }
    ];

    var junkTemplates = [
      function() { return [display + ' ringtone.mp3', 'mp3', 180 + Math.floor(rand() * 720), '96', 'Tiny MP3 is likely a ringtone or preview.']; },
      function() { return [display + ' preview.mp3', 'mp3', 260 + Math.floor(rand() * 900), '96', 'Small preview-like file.']; },
      function() { return [display + ' lyrics.txt', 'txt', 3 + Math.floor(rand() * 25), '', 'Lyrics text file mixed into audio search.']; },
      function() { return [display + ' album cover.jpg', 'jpg', 80 + Math.floor(rand() * 500), '', 'Cover art, not audio.']; },
      function() { return [display + '.m3u', 'm3u', 2 + Math.floor(rand() * 8), '', 'Playlist file, not music data.']; },
      function() { return [display + ' Complete Discography.zip', 'zip', 28000 + Math.floor(rand() * 90000), '', 'Large archive is tempting but suspicious.']; },
      function() { return [display + ' corrupted.mp3', 'mp3', 1200 + Math.floor(rand() * 1400), '', 'Missing bitrate and corrupt label.']; },
      function() { return [display + ' - Tracklist.txt', 'txt', 4 + Math.floor(rand() * 36), '', 'Small text file; not audio.']; }
    ];

    var baitPrefixes = ['NEW', 'FULL', 'REAL', 'HQ', 'RARE', 'UNRELEASED', 'FAST', 'MEGA', 'COMPLETE', '!!!', 'Xx'];
    var baitSuffixes = ['FREE', 'WORKING', 'FINAL', 'NO VIRUS', '100%', 'DOWNLOAD', 'NOSCAN', 'ULTRA', 'HOT', 'REPACK'];
    var baitBits = ['full_album', 'discography', 'live', 'acoustic', 'rare_demo', 'unreleased', 'radio_edit', 'lyrics', '320kbps', 'bonus_track'];
    var exts = ['exe', 'scr', 'pif', 'vbs', 'bat', 'cmd'];
    var speeds = ['Modem', 'Cable', 'DSL', 'T1', 'T3', 'T3 or Higher'];
    var bitrates = ['96', '128', '160', '192', '256', '320'];

    legacyRows(q).forEach(function(item) {
      rows.push(item);
    });

    var totalTarget = 10 + Math.floor(rand() * 10);
    var cleanCount = 4 + Math.floor(rand() * 6);
    var junkCount = 2 + Math.floor(rand() * 5);
    var virusCount = 2 + Math.floor(rand() * 5);

    for (var i = 0; i < cleanCount; i++) {
      var bitrate = pick(rand, bitrates);
      var title = pick(rand, cleanTemplates)();
      rows.push(row('clean', 'clean', q, i, title, 'mp3', 2600 + Math.floor(rand() * 6400), pick(rand, speeds.slice(1)), bitrate, 5 + Math.floor(rand() * 20), 'Plausible audio extension, size, and bitrate.'));
    }

    for (var j = 0; j < junkCount; j++) {
      var junk = pick(rand, junkTemplates)();
      var junkVar = junk[1] === 'mp3' && junk[2] < 1000 ? 'fake' : 'junk';
      rows.push(row('junk', junkVar, q, j, junk[0], junk[1], junk[2], pick(rand, speeds), junk[3], 35 + Math.floor(rand() * 35), junk[4]));
    }

    for (var k = 0; k < virusCount; k++) {
      var sep = pick(rand, ['__', '--', '_-_', '..', '~~', '++', '---']);
      var fakeMusicExt = pick(rand, ['.mp3', '.wma', '.m4a']);
      var ext = pick(rand, exts);
      var queryBits = q.split(/\s+/).filter(Boolean).map(function(part) {
        return rand() > 0.5 ? part.toUpperCase() : titleCase(part);
      }).join(pick(rand, ['_', '-', '.']));
      var virusTitle = [
        pick(rand, baitPrefixes),
        queryBits || 'unknown_artist',
        pick(rand, baitBits),
        pick(rand, ['HQ', '128kbps', '320kbps', 'CDRip', 'LimeWireRip', 'FLAC']),
        Math.floor(100 + rand() * 9900),
        pick(rand, baitSuffixes)
      ].join(sep) + fakeMusicExt + '.' + ext;
      if (rand() > 0.85) {
        virusTitle = virusTitle.replace(/e/gi, '3').replace(/o/gi, '0');
      }
      rows.push(row('virus', 'virus', q, k, virusTitle, ext, 48 + Math.floor(rand() * 1400), pick(rand, speeds.slice(1)), pick(rand, ['', '128', '192', '320']), 90 + Math.floor(rand() * 11), 'Executable malware trap disguised as music.'));
    }

    var unique = {};
    var dynamicRows = shuffle(rand, rows).filter(function(item) {
      var key = String(item.title).toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (unique[key]) return false;
      unique[key] = true;
      return true;
    });

    return dynamicRows.slice(0, Math.min(dynamicRows.length, totalTarget));
  }

  function handleApi(path, params) {
    if (path === '/api/login') {
      return getUser(params.email);
    }

    if (path === '/api/start_game') {
      var id = 'local-game-' + Date.now().toString(36);
      games[id] = {
        id: id,
        email: params.email || 'simulator@example.local',
        score: 0,
        endTime: nowSeconds() + 60,
        downloaded: {}
      };
      return { game_id: id, started: true, status: 'running', time_left: 60, end_time: games[id].endTime, score: 0 };
    }

    if (path === '/api/search') {
      globalSearchCounter = (globalSearchCounter + 1) >>> 0;
      return proceduralSearchResults(params.search, globalSearchCounter);
    }

    if (path === '/api/confirm_download') {
      var gameId = params.game_id || 'local-sim-session';
      var game = games[gameId] || {
        id: gameId,
        email: localStorage.getItem('lwg_email') || 'simulator@example.local',
        score: Number(localStorage.getItem('lwg_game_score')) || 0,
        endTime: nowSeconds() + 3600,
        downloaded: {}
      };
      games[gameId] = game;

      if (params.var === 'virus' || String(params.id || '').indexOf('virus') !== -1) {
        game.endTime = nowSeconds();
        return { game_id: gameId, status: 'ended_virus', end_time: game.endTime, score: game.score };
      }

      if (!game.downloaded[params.h]) {
        game.downloaded[params.h] = true;
        game.score += 150;
      }
      game.endTime = Math.max(game.endTime, nowSeconds() + 12);
      localStorage.setItem('lwg_game_score', game.score);

      var user = getUser(game.email);
      user.highscore = Math.max(user.highscore, game.score);
      localStorage.setItem('lwg_highscore', user.highscore);
      updateUserRank(user);

      return { game_id: gameId, status: 'running', end_time: game.endTime, score: game.score };
    }

    if (path === '/api/highscore') {
      return highscore;
    }

    if (path === '/api/send_desktop_link') {
      return { success: true };
    }

    return { message: 'Unknown API endpoint.' };
  }

  $.ajax = function(urlOrOptions, maybeOptions) {
    var options = typeof urlOrOptions === 'string' ? $.extend({}, maybeOptions || {}, { url: urlOrOptions }) : $.extend({}, urlOrOptions || {});
    var url = getUrl(options);
    var path = getPath(url);

    if (path.indexOf('/api/') !== 0) {
      return originalAjax.apply($, arguments);
    }

    var deferred = $.Deferred();
    var jqXHR = deferred.promise({
      readyState: 4,
      status: 200,
      statusText: 'OK',
      responseJSON: null,
      getResponseHeader: function(name) {
        return String(name || '').toLowerCase() === 'content-type' ? 'application/json; charset=utf-8' : null;
      },
      getAllResponseHeaders: function() {
        return 'content-type: application/json; charset=utf-8';
      },
      setRequestHeader: function() { return this; },
      overrideMimeType: function() { return this; },
      abort: function() {
        this.status = 0;
        this.statusText = 'abort';
        deferred.rejectWith(options.context || options, [this, 'abort', 'abort']);
        return this;
      }
    });

    setTimeout(function() {
      var params = $.extend({}, getQueryParams(url), parseData(options.data));
      try {
        var data = handleApi(path, params);
        jqXHR.responseJSON = data;
        if (typeof options.success === 'function') options.success.call(options.context || options, data, 'success', jqXHR);
        deferred.resolveWith(options.context || options, [data, 'success', jqXHR]);
        if (options.global !== false) {
          $(document).trigger('ajaxSuccess', [jqXHR, options, data]);
        }
      } catch (error) {
        jqXHR.status = 500;
        jqXHR.statusText = 'error';
        if (typeof options.error === 'function') options.error.call(options.context || options, jqXHR, 'error', error);
        deferred.rejectWith(options.context || options, [jqXHR, 'error', error]);
        if (options.global !== false) {
          $(document).trigger('ajaxError', [jqXHR, options, error]);
        }
      }

      if (typeof options.complete === 'function') options.complete.call(options.context || options, jqXHR, jqXHR.statusText === 'OK' ? 'success' : 'error');
      if (options.global !== false) {
        $(document).trigger('ajaxComplete', [jqXHR, options]);
      }
    }, 120 + Math.floor(Math.random() * 260));

    return jqXHR;
  };

  window.limeWireApiSimulator = {
    search: proceduralSearchResults,
    login: getUser
  };
})(window, window.jQuery);
