(function() {
  // Post-load simulator effects. This file intentionally patches a few globals
  // from client.js so old game-over flows can trigger the newer fake OS screens.
  var helpGimmicks = [
    'Default 100x dial-up acceleration: by default the simulator speeds up transfers 100x so downloads complete quickly; click the footer Mode link to switch to real-time speeds.',
    '56k modem math: file sizes are converted into real estimated download times over a 56k line.',
    'Shared bandwidth: multiple active downloads split the same simulated 56k connection instead of each getting its own full speed.',
    'Frustrating speed swings: downloads randomly fluctuate, dip, queue, reconnect, or show Need More Sources.',
    'Slow search population: results appear gradually instead of all at once, like an old client finding hosts.',
    'Rotating search permutations: repeated searches draw from different generated title patterns instead of dumping every variant into one list.',
    'Bitrate bait: some titles include 128kbps, 192kbps, 320kbps, and similar labels.',
    'Suspicious result types: searches include junk like lyrics files, cover art, playlists, corrupt MP3s, archives, and disguised executables.',
    'Virus payoff waits for completion: virus mode triggers only after the bad download reaches 100%.',
    'Blue screen on virus: completing a malware-like result shows a fake Windows BSOD.',
    'Idle blue screen: leaving the app alone for roughly 5 to 8 minutes can trigger a generic BSOD.',
    'Legal scare screens: starting too many downloads can trigger either an FBI-style warning or ISP-style cease-and-desist notice.',
    'Random legal threshold: the scare screen can happen after a random limit from 3 to 10 active downloads.',
    'Post-download seeding: clean completed downloads start seeding at slow, uneven upload rates.',
    'Right-click to stop seeding: right-click a seeding row in the Downloads area to stop it.',
    'LEECHER shame: after stopping seeding 3 times, a big LEECHER!!!!!!! message scrolls across the screen once.',
    'Upload footer: the footer tracks active seeds and their current upload rate.',
    'Compact-window survival: the LimeWire window stays accessible on small browser windows instead of disappearing.',
    'Era-appropriate chrome: tabs, toolbar buttons, footer icons, legal notices, and the logo use local image assets from public/img.',
    'Embedded easter-song: the built-in player will display and play You Are a Pirate - LazyTown from public/audio/limewire.mp3 when you hit play.',
    'Audio stutter for BSODs: when a BSOD or crash overlay triggers, the player is intentionally seeked and briefly stuttered/looped for dramatic effect.',
    'Typos and leetspeak in bait titles: some bait/virus results intentionally contain typos, leetspeak, or odd separators to feel like spammy file shares.'
  ];

  function ensureHelpWindow() {
    var existing = document.querySelector('.sim-help-overlay');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.className = 'sim-help-overlay';
    overlay.innerHTML = [
      '<div class="window popup sim-help-window" role="dialog" aria-modal="true" aria-labelledby="sim-help-title">',
      '<div class="window_header">',
      '<div class="title"><span id="sim-help-title">LimeWire Help</span></div>',
      '<div class="buttons"><a class="minimize"></a><a class="fullscreen"></a><a class="close sim-help-close"></a></div>',
      '</div>',
      '<div class="content">',
      '<div class="sim-help-main">',
      '<h1>What is this?</h1>',
      '<p>This is a browser-based LimeWire nostalgia simulator. Nothing is actually downloaded, installed, shared, or reported. The search results, downloads, warnings, crashes, and transfer speeds are simulated UI events.</p>',
      '<p><strong>Disclaimer:</strong> This is an unofficial fan-made nostalgia simulator. It is not affiliated with, endorsed by, sponsored by, or connected to LimeWire, LimeWire GmbH, or any original creators or rights holders. All trademarks belong to their respective owners.</p>',
      '<h2>How to interact</h2>',
      '<ul>',
      '<li>Search for a song or artist, then select a row and click Download.</li>',
      '<li>Use Junk on a selected search result if it looks suspicious.</li>',
      '<li>Select a download row to Clear, Pause, or Resume it.</li>',
      '<li>Right-click a completed seeding row if you want to stop seeding.</li>',
      '<li>Use the footer Mode link to switch between accelerated and slower transfer timing.</li>',
      '</ul>',
      '<h2>Credits</h2>',
      '<p><a href="https://github.com/milagrofrost/limewire-simulator" target="_blank" rel="noopener noreferrer">milagrofrost/limewire-simulator</a><br>',
      '<a href="https://www.milagrofrost.com/" target="_blank" rel="noopener noreferrer">milagrofrost.com</a></p>',
      '<div class="sim-help-spoiler">',
      '<h2>Spoiler warning</h2>',
      '<p>The next section lists the hidden jokes, traps, and gimmicks. If you want to discover them naturally, stop here.</p>',
      '<button type="button" class="sim-help-reveal">Show Easter Eggs</button>',
      '</div>',
      '<div class="sim-help-gimmicks" hidden>',
      '<h2>Easter eggs and gimmicks</h2>',
      '<ul>',
      helpGimmicks.map(function(item) { return '<li>' + item + '</li>'; }).join(''),
      '</ul>',
      '</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);

    overlay.querySelector('.sim-help-close').addEventListener('click', function(event) {
      event.preventDefault();
      closeHelpWindow();
    });

    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) closeHelpWindow();
    });

    overlay.querySelector('.sim-help-reveal').addEventListener('click', function() {
      overlay.querySelector('.sim-help-gimmicks').hidden = false;
      overlay.querySelector('.sim-help-spoiler').classList.add('revealed');
      this.style.display = 'none';
    });

    return overlay;
  }

  function openHelpWindow() {
    var overlay = ensureHelpWindow();
    overlay.classList.add('show');
  }

  function closeHelpWindow() {
    var overlay = document.querySelector('.sim-help-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  document.addEventListener('click', function(event) {
    var helpLink = event.target.closest && event.target.closest('.sim-help-menu');
    if (!helpLink) return;
    event.preventDefault();
    openHelpWindow();
  });

  function ensureBsod() {
    var existing = document.querySelector('.sim-bsod');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.className = 'sim-bsod';
    overlay.innerHTML = [
      '<div class="sim-bsod-inner">',
      '<p class="sim-bsod-intro"></p>',
      '<p class="sim-bsod-file"></p>',
      '<p><strong class="sim-bsod-code"></strong></p>',
      '<p class="sim-bsod-help"></p>',
      '<p>Technical information:</p>',
      '<p class="sim-bsod-stop"></p>',
      '<p>Beginning dump of physical memory<br>Physical memory dump complete.</p>',
      '<button type="button" class="sim-bsod-restart">Restart LimeWire</button>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    overlay.querySelector('.sim-bsod-restart').addEventListener('click', function() {
      try {
        sessionStorage.setItem('limewire_play_startup_after_bsod', '1');
      } catch (e) {}
      if (typeof window.stopLimeWirePlayerAudio === 'function') {
        window.stopLimeWirePlayerAudio();
      }
      location.reload();
    });

    return overlay;
  }

  function bsodCopy(type) {
    if (type === 'virus') {
      return {
        intro: 'A problem has been detected and LimeWire has been shut down to prevent damage to your computer.',
        file: 'The problem seems to be caused by the following file: LWSEARCH_DOWNLOAD.SYS',
        code: 'VIRUS_CAUGHT_IN_P2P_DOWNLOAD',
        help: 'If this is the first time you have seen this Stop error screen, restart the simulator. If this screen appears again, choose safer files next time.',
        stop: '*** STOP: 0x0000007E (0xC0000005, 0xF7A2B8E4, 0xF7A2B5E0, 0xF7A2B2DC)'
      };
    }

    return {
      intro: 'A problem has been detected and Windows has been shut down to prevent damage to your computer.',
      file: 'The problem seems to be caused by the following file: LIMEWIRE_IDLE_TIMEOUT.SYS',
      code: 'DRIVER_IRQL_NOT_LESS_OR_EQUAL',
      help: 'If this is the first time you have seen this Stop error screen, restart your computer. If this screen appears again, blame the peer-to-peer client.',
      stop: '*** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF86B5A89)'
    };
  }

  function showBsod(type) {
    var copy = bsodCopy(type);
    var overlay = ensureBsod();
    overlay.querySelector('.sim-bsod-intro').textContent = copy.intro;
    overlay.querySelector('.sim-bsod-file').innerHTML = 'The problem seems to be caused by the following file: <strong>' + copy.file.split(': ')[1] + '</strong>';
    overlay.querySelector('.sim-bsod-code').textContent = copy.code;
    overlay.querySelector('.sim-bsod-help').textContent = copy.help;
    overlay.querySelector('.sim-bsod-stop').textContent = copy.stop;
    overlay.classList.add('show');
    if (typeof window.stutterLimeWireAudioForBsod === 'function') {
      window.stutterLimeWireAudioForBsod();
    }
    if (typeof resetActiveDownloads === 'function') {
      resetActiveDownloads();
    }
    if (typeof tickingClock !== 'undefined') {
      clearInterval(tickingClock);
    }
    document.body.classList.add('game_over');
    document.querySelectorAll('.window:not(.popup)').forEach(function(windowElement) {
      windowElement.classList.add('locked');
    });
  }

  var hangBsodTimer;
  var hangBsodTriggered = false;

  function randomHangDelay() {
    return (5 * 60 * 1000) + Math.floor(Math.random() * (3 * 60 * 1000));
  }

  function resetHangBsodTimer() {
    if (hangBsodTriggered) return;
    clearTimeout(hangBsodTimer);
    hangBsodTimer = setTimeout(function() {
      if (document.body.classList.contains('game_over')) return;
      hangBsodTriggered = true;
      showBsod('generic');
    }, randomHangDelay());
  }

  ['click', 'keydown', 'submit', 'dblclick', 'contextmenu'].forEach(function(eventName) {
    document.addEventListener(eventName, resetHangBsodTimer, true);
  });
  resetHangBsodTimer();
  window.resetHangBsodTimer = resetHangBsodTimer;

  function ensureLegalWarning() {
    var existing = document.querySelector('.sim-legal-warning');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.className = 'sim-legal-warning';
    overlay.innerHTML = [
      '<div class="sim-legal-panel">',
      '<img class="sim-legal-image" alt="">',
      '<div class="sim-legal-fallback">',
      '<div class="sim-legal-kicker">Simulated Notice</div>',
      '<h1></h1>',
      '<p class="sim-legal-primary"></p>',
      '<p class="sim-legal-secondary"></p>',
      '<div class="sim-legal-meta"></div>',
      '</div>',
      '<button type="button" class="sim-legal-restart">Disconnect and Restart LimeWire</button>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    overlay.querySelector('.sim-legal-image').addEventListener('error', function() {
      overlay.classList.add('image-missing');
    });

    overlay.querySelector('.sim-legal-restart').addEventListener('click', function() {
      location.reload();
    });

    return overlay;
  }

  function legalWarningCopy() {
    var warnings = [
      {
        type: 'fbi',
        title: 'FBI Anti-Piracy Warning',
        image: '/img/fbi.png',
        primary: 'You are violating the rights of multimillion-dollar publishing companies.',
        secondary: 'Please think of the executives and their starving children. Maximum simulated punishment: death.',
        meta: 'Case Ref: P2P-56K-' + Math.floor(100000 + Math.random() * 900000)
      },
      {
        type: 'isp',
        title: 'Notice From Your Internet Service Provider',
        image: '/img/isp.png',
        primary: 'Peer-to-peer file sharing has been detected on your internet connection.',
        secondary: 'This activity violates your Acceptable Use Policy and Terms of Service. Stop this activity immediately to avoid suspension of service.',
        meta: 'Subscriber Notice ID: DMCA-' + Math.floor(1000000 + Math.random() * 9000000)
      }
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  }

  function showLegalWarning() {
    var warning = legalWarningCopy();
    var overlay = ensureLegalWarning();
    overlay.className = 'sim-legal-warning show ' + warning.type;
    var image = overlay.querySelector('.sim-legal-image');
    image.src = warning.image;
    image.alt = warning.title;
    overlay.querySelector('h1').textContent = warning.title;
    overlay.querySelector('.sim-legal-primary').textContent = warning.primary;
    overlay.querySelector('.sim-legal-secondary').textContent = warning.secondary;
    overlay.querySelector('.sim-legal-meta').textContent = warning.meta;

    if (typeof resetActiveDownloads === 'function') {
      resetActiveDownloads();
    }
    if (typeof tickingClock !== 'undefined') {
      clearInterval(tickingClock);
    }
    document.body.classList.add('game_over');
    document.querySelectorAll('.window:not(.popup)').forEach(function(windowElement) {
      windowElement.classList.add('locked');
    });
  }

  window.showLegalWarning = showLegalWarning;

  // client.js defines the original gameOverPopup(). Keep this override last so
  // malware downloads route to the BSOD while other legacy calls stay harmless.
  window.gameOverPopup = function(type) {
    if (type === 'virus') {
      showBsod('virus');
      return;
    }

    document.body.classList.remove('game_over');
    document.querySelectorAll('.window.locked').forEach(function(windowElement) {
      windowElement.classList.remove('locked');
    });
    var finishedPopup = document.querySelector('.popup.game_finished');
    if (finishedPopup) finishedPopup.style.display = 'none';
  };
})();
