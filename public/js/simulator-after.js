(function() {
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
