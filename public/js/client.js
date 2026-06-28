/* SCROLL UP ON ANCHOR CLICK */$(document).on('click', '[data-scroll-to-id]', function (event) {event.preventDefault();

var scrollToElementID = $(this).attr('data-scroll-to-id');

var offsetTop = $('body').find('[id="'+scrollToElementID+'"]').offset().top - 60;

$('html, body').animate({
    scrollTop: offsetTop
}, 500);

});

/* CHECK IF TOUCH DEVICE */window.isTouchDevice = function() {var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

var mq = function mq(query) {return window.matchMedia(query).matches;};

if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {return true;}

var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');return mq(query);}

if (isTouchDevice()) {$('body').addClass('is_touch_device');}

/* COPY TO CLIPBOARD */$('body').on('click', '[data-copy]', function() {"use strict";

var valueToCopy = $(this).attr('data-copy');

var $temp = $("<input>");
$("body").append($temp);
$temp.val(valueToCopy).select();

document.execCommand("copy");

$temp.remove();

var container = $(this);
container.addClass('copied').text('Copied');

setTimeout( function() {

	container.removeClass('copied').html('');

}, 500);				

});

/* DROPDOWN */$('body').on('click', '[data-action="dropdown_toggle"]', function() {

$('body').find('[data-action="dropdown_menu"]').not($(this).next('[data-action="dropdown_menu"]')).prev('[data-action="dropdown_toggle"]').removeClass('open');

if ($(this).hasClass('open')) {
$(this).removeClass('open');
} else {
$(this).addClass('open');
}

});

$('body').on('click', function(event) {

if ($(event.target).attr('data-action') !== 'dropdown_toggle') {
$('body').find('[data-action="dropdown_toggle"]').removeClass('open');
}

});

window.closeAllDropdownMenus = function() {$('body').find('[data-action="dropdown_toggle"]').removeClass('open');}

/* MOBILE MENU - BURGER */$('body').on('click', '[data-action="mobile_menu_toggle"]', function() {

if ($(this).hasClass('open')) {

	$(this).removeClass('open');
	$('body').find('.header_nav_center:not(.tablet_only)').removeClass('mobile_menu_open');
	$('body').css('overflow', 'visible');

} else {

	$(this).addClass('open');
	$('body').find('.header_nav_center:not(.tablet_only)').addClass('mobile_menu_open');
	$('body').css('overflow', 'hidden');

}

});

/* COLLECT GET VARIABLES FROM CURRENT URL */function currentGetVariables() {

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
	function decode(s) {
		return decodeURIComponent(s.split("+").join(" "));
	}

	$_GET[decode(arguments[1])] = decode(arguments[2]);
});

return $_GET;

}

/* validate email */function isValidEmailAddress(emailAddress) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailAddress || '')); }

/* COUNTDOWN *window.initAllCountdowns = function() {

var x;

$('body').find('[data-countdown]').each(function(i) {

	var that = $(this);

	// timestamp must be in milliseconds
	var toTimestamp = parseInt($(this).attr('data-countdown'));
	
	// Set the date we're counting down to
	var countDownDate = new Date(toTimestamp).getTime();
	
	// Update the count down every 1 second
	x = setInterval(function() {

	  // Get today's date and time
	  var now = new Date().getTime();
		
	  // Find the distance between now and the count down date
	  var distance = countDownDate - now;
		
	  // Time calculations for days, hours, minutes and seconds
	  var days =  Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)),0);
	  var hours = Math.max(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),0);
	  var minutes = Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),0);
	  var seconds = Math.max(Math.floor((distance % (1000 * 60)) / 1000),0);

	  // display results		
	  that.find('.days').html(days);
	  that.find('.hours').html(hours);
	  that.find('.minutes').html(minutes);
	  that.find('.seconds').html(seconds);

	}, 1000);

});

}*/

//initAllCountdowns();

/* format bytes */function formatBytes(bytes, decimals = 2) {if (!+bytes) return '0 KB'

const k = 1024
const dm = decimals < 0 ? 0 : decimals
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

const i = Math.floor(Math.log(bytes) / Math.log(k))

return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`

}

const MODEM_56K_BYTES_PER_SECOND = 56000 / 8;
// Core simulator state. These names are intentionally global because
// simulator-after.js calls resetActiveDownloads() and overrides gameOverPopup().
// Be careful when renaming or wrapping this block.
var DOWNLOAD_SIMULATION_SPEEDUP = parseInt(localStorage.getItem('download_simulation_speedup')) || 100;
var activeDownloads = {};
var sharedDownloadTimer = null;
var lineSpeedMultiplier = 1;
var legalWarningTriggered = false;
var legalWarningDownloadLimit = randomLegalWarningDownloadLimit();
var seededUploads = {};
var seedingTimer = null;
var stoppedSeedingCount = 0;
var leecherWarningShown = false;

function setDownloadSimulationSpeedup(value, save) {
	DOWNLOAD_SIMULATION_SPEEDUP = Number(value) || 1;
	if (save) {
		try { localStorage.setItem('download_simulation_speedup', DOWNLOAD_SIMULATION_SPEEDUP); } catch (e) {}
	}
	var $toggle = $('body').find('#download-mode-toggle');
	if ($toggle.length) {
		var compactLabel = $('body').hasClass('compact_screen');
		if (DOWNLOAD_SIMULATION_SPEEDUP <= 1) {
			$toggle.text(compactLabel ? '0x' : 'Mode: Real-time (dial-up)');
			$toggle.removeClass('mode-accelerated').addClass('mode-real');
		} else {
			$toggle.text(compactLabel ? DOWNLOAD_SIMULATION_SPEEDUP + 'x' : 'Mode: ' + DOWNLOAD_SIMULATION_SPEEDUP + 'x (accelerated)');
			$toggle.removeClass('mode-real').addClass('mode-accelerated');
		}
	}
}

// Footer mode link: compact mode deliberately shortens this label to 100x/0x.
$('body').on('click', '#download-mode-toggle', function(e) {
	e.preventDefault();
	if (DOWNLOAD_SIMULATION_SPEEDUP <= 1) {
		setDownloadSimulationSpeedup(100, true);
	} else {
		setDownloadSimulationSpeedup(1, true);
	}
});

// Initialize UI label on page load
$(function(){ setDownloadSimulationSpeedup(DOWNLOAD_SIMULATION_SPEEDUP, false); });
$(window).on('resize', function() {
	setDownloadSimulationSpeedup(DOWNLOAD_SIMULATION_SPEEDUP, false);
});
// (no animation initializer: pulsating effect removed)

function bytesFromFormattedSize(value) {
	var match = String(value || '').trim().match(/^([\d.]+)\s*(Bytes|KB|MB|GB|TB)$/i);
	if (!match) return 0;
	var amount = parseFloat(match[1]);
	var units = {
		'bytes': 1,
		'kb': 1024,
		'mb': 1024 * 1024,
		'gb': 1024 * 1024 * 1024,
		'tb': 1024 * 1024 * 1024 * 1024
	};
	return amount * (units[match[2].toLowerCase()] || 1);
}

function formatDuration(totalSeconds) {
	totalSeconds = Math.max(0, Math.ceil(totalSeconds || 0));
	var hours = Math.floor(totalSeconds / 3600);
	var minutes = Math.floor((totalSeconds % 3600) / 60);
	var seconds = totalSeconds % 60;
	if (hours > 0) {
		return hours + ':' + minutes.toString().padStart(2,0) + ':' + seconds.toString().padStart(2,0);
	}
	return minutes + ':' + seconds.toString().padStart(2,0);
}

function activeDownloadItems() {
	return Object.keys(activeDownloads).map(function(key) {
		return activeDownloads[key];
	}).filter(function(download) {
		return download && !download.complete && !download.paused;
	});
}

function modemSpeedLabel(bytesPerSecond) {
	return (Math.max(0, bytesPerSecond) / 1024).toFixed(1) + ' KB/s';
}

function randomLegalWarningDownloadLimit() {
	return Math.floor(Math.random() * 8) + 3;
}

function uploadSpeedLabel(bytesPerSecond) {
	if (!bytesPerSecond) return '0 KB/s';
	return (Math.max(0, bytesPerSecond) / 1024).toFixed(1) + ' KB/s';
}

function activeSeedItems() {
	return Object.keys(seededUploads).map(function(key) {
		return seededUploads[key];
	}).filter(function(seed) {
		return seed && seed.active;
	});
}

function refreshFooterUploadSpeed() {
	var seeds = activeSeedItems();
	var totalBytesPerSecond = seeds.reduce(function(sum, seed) {
		return sum + (seed.bytesPerSecond || 0);
	}, 0);
	$('body').find('.bottom_footer .part.upload_download .upload').text(seeds.length + ' @ ' + uploadSpeedLabel(totalBytesPerSecond));
}

function randomUploadBytesPerSecond() {
	if (Math.random() < 0.32) return 0;
	return (120 + Math.random() * 2100);
}

function showLeecherWarning() {
	if (leecherWarningShown) return;
	leecherWarningShown = true;
	var warning = $('<div class="sim-leecher-warning">LEECHER!!!!!!!</div>');
	$('body').append(warning);
	setTimeout(function() {
		warning.remove();
	}, 13000);
}

function showJunkConfetti() {
	var confetti = $('<div class="sim-confetti" aria-hidden="true"></div>');
	var colors = ['#ff3333', '#ffcc00', '#33aa33', '#3399ff', '#ff66cc', '#ffffff'];
	for (var i = 0; i < 120; i++) {
		var piece = $('<span></span>');
		piece.css({
			left: (5 + Math.random() * 90) + 'vw',
			background: colors[Math.floor(Math.random() * colors.length)],
			animationDelay: (Math.random() * 0.8) + 's',
			animationDuration: (2.6 + Math.random() * 1.8) + 's',
			transform: 'rotate(' + Math.floor(Math.random() * 360) + 'deg)'
		});
		confetti.append(piece);
	}
	$('body').append(confetti);
	setTimeout(function() {
		confetti.remove();
	}, 5200);
}

function fluctuateLineSpeed(activeCount) {
	if (Math.random() < 0.16) {
		lineSpeedMultiplier = 0.05 + Math.random() * 0.22;
	} else if (Math.random() < 0.34) {
		lineSpeedMultiplier = 0.38 + Math.random() * 0.5;
	} else {
		lineSpeedMultiplier = 0.82 + Math.random() * 0.28;
	}
	if (activeCount > 1 && Math.random() < 0.22) {
		lineSpeedMultiplier *= 0.55;
	}
	return MODEM_56K_BYTES_PER_SECOND * lineSpeedMultiplier;
}

function refreshFooterDownloadSpeed(totalBytesPerSecond) {
	var activeCount = activeDownloadItems().length;
	$('body').find('.bottom_footer .part.upload_download .download i').text(activeCount);
	$('body').find('.bottom_footer .part.upload_download .download').contents().filter(function() {
		return this.nodeType === 3;
	}).remove();
	$('body').find('.bottom_footer .part.upload_download .download').append(' @ ' + (activeCount ? modemSpeedLabel(totalBytesPerSecond) : '0 KB/s'));
}

function selectedDownloadRow() {
	return $('body').find('.progress_screen .rows .row.selected').first();
}

function updateDownloadActionState() {
	var row = selectedDownloadRow();
	var hasSelection = row.length > 0;
	var rowHash = hasSelection ? row.attr('data-h') : '';
	var download = rowHash ? activeDownloads[rowHash] : null;
	var canPause = !!(download && !download.complete && !download.paused);
	var canResume = !!(download && !download.complete && download.paused);

	$('body').find('.progress_actions .action.cancel').toggleClass('active', hasSelection);
	$('body').find('.progress_actions .action.pause').toggleClass('active', canPause);
	$('body').find('.progress_actions .action.resume').toggleClass('active', canResume);
}

function selectDownloadRow(row) {
	$('body').find('.progress_screen .rows .row').removeClass('selected');
	if (row && $(row).length) {
		$(row).addClass('selected');
	}
	updateDownloadActionState();
}

function removeDownloadRow(row) {
	if (!row || !$(row).length) return;

	var rowHash = $(row).attr('data-h');
	if (rowHash) {
		delete activeDownloads[rowHash];
		if (seededUploads[rowHash]) {
			delete seededUploads[rowHash];
		}
	}

	$(row).remove();
	updateDownloadActionState();
	refreshFooterDownloadSpeed(fluctuateLineSpeed(activeDownloadItems().length));
	refreshFooterUploadSpeed();
}

function resetActiveDownloads() {
	activeDownloads = {};
	seededUploads = {};
	legalWarningTriggered = false;
	legalWarningDownloadLimit = randomLegalWarningDownloadLimit();
	stoppedSeedingCount = 0;
	leecherWarningShown = false;
	if (sharedDownloadTimer) {
		clearInterval(sharedDownloadTimer);
		sharedDownloadTimer = null;
	}
	if (seedingTimer) {
		clearInterval(seedingTimer);
		seedingTimer = null;
	}
	refreshFooterDownloadSpeed(0);
	refreshFooterUploadSpeed();
	updateDownloadActionState();
}

function startSeedingTimer() {
	if (seedingTimer) return;

	seedingTimer = setInterval(function() {
		var seeds = activeSeedItems();

		if (!seeds.length) {
			clearInterval(seedingTimer);
			seedingTimer = null;
			refreshFooterUploadSpeed();
			return;
		}

		seeds.forEach(function(seed) {
			var row = $('body').find('.progress_screen .rows .row[data-h="'+seed.rowHash+'"]');
			seed.bytesPerSecond = randomUploadBytesPerSecond();
			seed.hosts = seed.bytesPerSecond > 0 ? Math.max(1, Math.floor(Math.random() * 4) + 1) : 0;

			if (seed.bytesPerSecond > 0) {
				$(row).find('.cell.status span').text('Seeding to ' + seed.hosts + ' host' + (seed.hosts === 1 ? '' : 's'));
			} else {
				$(row).find('.cell.status span').text('Seeding - no incoming requests');
			}
			$(row).find('.cell.speed span').text(uploadSpeedLabel(seed.bytesPerSecond));
			$(row).find('.cell.time span').text('');
		});

		refreshFooterUploadSpeed();
	}, 1800);
}

function startSeeding(rowHash) {
	var row = $('body').find('.progress_screen .rows .row[data-h="'+rowHash+'"]');
	var initialBytesPerSecond = randomUploadBytesPerSecond();

	seededUploads[rowHash] = {
		rowHash: rowHash,
		active: true,
		bytesPerSecond: initialBytesPerSecond,
		hosts: initialBytesPerSecond > 0 ? 1 : 0
	};

	$(row).addClass('seeding').attr('title', 'Right-click to stop seeding');
	$(row).find('.cell.progress .bar .green').attr('style', 'width: 100%');
	$(row).find('.cell.progress .bar .green + span').text('100%');
	$(row).find('.cell.status span').text(initialBytesPerSecond > 0 ? 'Seeding to 1 host' : 'Seeding - no incoming requests');
	$(row).find('.cell.speed span').text(uploadSpeedLabel(initialBytesPerSecond));
	$(row).find('.cell.time span').text('');

	refreshFooterUploadSpeed();
	startSeedingTimer();
}

function stopSeeding(rowHash) {
	var seed = seededUploads[rowHash];
	if (!seed || !seed.active) return;

	seed.active = false;
	delete seededUploads[rowHash];
	var row = $('body').find('.progress_screen .rows .row[data-h="'+rowHash+'"]');
	$(row).removeClass('seeding').addClass('seed_stopped').removeAttr('title');
	$(row).find('.cell.status span').text('Seeding stopped');
	$(row).find('.cell.speed span').text('');
	$(row).find('.cell.time span').text('');

	stoppedSeedingCount = stoppedSeedingCount + 1;
	if (stoppedSeedingCount >= 3) {
		showLeecherWarning();
	}

	refreshFooterUploadSpeed();
}

function finishDownload(download) {
	download.complete = true;
	delete activeDownloads[download.rowHash];
	var row = $('body').find('.progress_screen .rows .row[data-h="'+download.rowHash+'"]');

	$(row).find('.cell.time span').text('');
	$(row).find('.cell.speed span').text('');

	if (download.virus == true) {
		$(row).find('.cell.status span').text('You caught a virus!');
		$(row).find('.cell.progress .bar .green').css('background', '#ff0000');
		$(row).find('.cell.progress .bar .green + span').css('color', '#ffffff');
		$('body').find('.results_screen .rows .row[data-h="'+download.rowHash+'"]').addClass('virus_caught');
		clearInterval(tickingClock);
		setTimeout(function() {
			gameOverPopup('virus');
		}, 500);
		return;
	}

	$(row).find('.cell.status span').text('Complete');
	$(row).removeClass('paused');
	startSeeding(download.rowHash);
	refreshFooterDownloadSpeed(fluctuateLineSpeed(activeDownloadItems().length));
	updateDownloadActionState();
}

function startSharedDownloadTimer() {
	if (sharedDownloadTimer) return;

	sharedDownloadTimer = setInterval(function() {
		var downloads = activeDownloadItems();

		if (!downloads.length) {
			clearInterval(sharedDownloadTimer);
			sharedDownloadTimer = null;
			refreshFooterDownloadSpeed(0);
			updateDownloadActionState();
			return;
		}

		// All active downloads share one fake 56k line. The multiplier is
		// intentionally erratic to mimic the frustrating old-client feel.
		var totalLineBytesPerSecond = fluctuateLineSpeed(downloads.length);
		refreshFooterDownloadSpeed(totalLineBytesPerSecond);
		var shareStates = downloads.map(function(download) {
			var multiplier = 0.72 + Math.random() * 0.56;
			var status = 'Downloading';

			if (Math.random() < 0.12) {
				multiplier = 0.03 + Math.random() * 0.12;
				status = 'Queued';
			} else if (Math.random() < 0.24) {
				multiplier = 0.24 + Math.random() * 0.28;
				status = Math.random() < 0.5 ? 'Connecting' : 'Need More Sources';
			}

			return {
				download: download,
				multiplier: multiplier,
				status: status
			};
		});
		var totalShareWeight = shareStates.reduce(function(sum, state) {
			return sum + state.multiplier;
		}, 0) || 1;

		shareStates.forEach(function(state) {
			var download = state.download;
			var row = $('body').find('.progress_screen .rows .row[data-h="'+download.rowHash+'"]');
			var displayedSpeed = totalLineBytesPerSecond * (state.multiplier / totalShareWeight);
			var simulatedBytes = displayedSpeed * DOWNLOAD_SIMULATION_SPEEDUP;
			download.remainingBytes = Math.max(0, download.remainingBytes - simulatedBytes);

			var progressPercentage = Math.min(100, Math.round(((download.totalBytes - download.remainingBytes) / download.totalBytes) * 100));
			var progressTimeSecondsLeft = displayedSpeed > 0 ? Math.ceil(download.remainingBytes / displayedSpeed) : download.estimatedSeconds;

			$(row).find('.cell.progress .bar .green').attr('style', 'width: ' + progressPercentage+'%');
			$(row).find('.cell.progress .bar .green + span').text(progressPercentage + '%');
			$(row).find('.cell.status span').text(state.status);
			$(row).find('.cell.speed span').text(modemSpeedLabel(displayedSpeed));
			$(row).find('.cell.time span').text(formatDuration(progressTimeSecondsLeft));

			if (download.remainingBytes <= 0) {
				finishDownload(download);
			}
		});

		updateDownloadActionState();
	}, 1000);
}

/* GENERAL ERROR INFO SUCCESS MESSAGE */function generalInfo(showHide, type, message, specificWrapper) {"use strict";

var alertsContainer;

var wrapperToSearchIn = $('body');

if (specificWrapper) {
	wrapperToSearchIn = specificWrapper;
}

// if .alerts exists already, use existing one
if ($(wrapperToSearchIn).find('.alerts').length) {
alertsContainer = $(wrapperToSearchIn).find('.alerts');
} else {
// else shout
alert(message);
return false;
}

if (showHide == 'hide') {
alertsContainer.find('.alert:not(.static)').remove();
} else if (showHide && type && message) {
alertsContainer.html('<p class="alert '+type+'">'+message+'</p>');
}

}

var currentPage = $('body').find('[name="current_page"]').val();

$(document).ready(function() {

/* try to get email from localStorage */
autoLogin();
		

});

function init() {

switch (currentPage) {

	case 'index':
	break;

	case 'faq':
	break;

}

}
function autoLogin() {

/* try to get email from localStorage */
if (isValidEmailAddress(localStorage.getItem('lwg_email'))) {
	
	var emailToRun = localStorage.getItem('lwg_email');

	var error = false;

	var postData = {
		'email': emailToRun,
		//'g-recaptcha-response': $('body').find('[name="g-recaptcha-response"]').val()
	};

	$.ajax({	
		type: 'POST',
		url: '/api/login',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		success: function(data){


			if (data.id) {

				var id = data.id;
				var email = data.email;
				var created = data.created;
				var permanentScore = data.permanent_score;
				var highscore = data.highscore;
				var userScoreRank = data.user_score_rank;

				localStorage.setItem('lwg_id', id);
				localStorage.setItem('lwg_email', email);
				localStorage.setItem('lwg_created', created);
				localStorage.setItem('lwg_permanentScore', permanentScore);
				localStorage.setItem('lwg_highscore', highscore);
				localStorage.setItem('lwg_userScoreRank', userScoreRank);

				// hide welcome popup and unlock page
				$('body').find('.window.popup.welcome').hide();
				$('body').find('.window.locked').removeClass('locked');
				
				// set starting score
				var startingScore = permanentScore; 
				$('body').find('.time_score .score span').text(startingScore);
				
				// add user rank to leaderboard tab
				if (currentPage != 'leaderboard') {
				$('body').find('.tab.leaderboard').text('Leaderboard');
				}
					
				// show logged_in_as
				$('body').find('.logged_in_as').show().html('Logged in as User ID: '+id.substring(0, 10)+' (<a class="logout" href="#" data-action="logout">Log Out</a>)');

				// show highscore and rank
				$('body').find('.tabs .highscore').show().find('.score span').text(highscore);
				$('body').find('.tabs .highscore').show().find('.rank span').text(userScoreRank);
				
				init();
									
			}  else {

				localStorage.clear();

				// show welcome popup and lock page
				$('body').find('.window.popup.welcome').show();
				$('body').find('.window:not(.popup)').addClass('locked');
				
				return false;	

			}

		}

	});
	
} else {
	
	localStorage.clear();
	
    // show welcome popup and lock page
    $('body').find('.window.popup.welcome').show();
    $('body').find('.window:not(.popup)').addClass('locked');

    return false;	
	
}

}

function autoFillLoginEmail() {

/* try to get email from localStorage */
if (localStorage.getItem('lwg_email')) {
	$('body').find('[name="welcome[email]"]').val(localStorage.getItem('lwg_email'));
}

}

/* Welcome Popup - Enter Email */$('body').on('submit', '[name="welcome"]', function(event) {

event.preventDefault();

var button = $(this).find('button[type="submit"]');

var emailInput = $('body').find('[name="welcome[email]"]');
var emailToRun = emailInput.val();
			
var error = false;

if (!isValidEmailAddress(emailToRun)) {
error = true;
emailInput.addClass('error');
} else {
emailInput.removeClass('error');
}
		
if (error === true) {
generalInfo('show', 'error', 'Invalid email. Try again.', '.popup.welcome');
return false;	
} else {
generalInfo('hide');	
}
	
button.addClass('loading');
	
var postData = {
	'email': emailToRun,
	//'g-recaptcha-response': $('body').find('[name="g-recaptcha-response"]').val()
};
	
$.ajax({	
	type: 'POST',
	url: '/api/login',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
	},
	success: function(data){
									
		button.removeClass('loading');
		
					
		if (data.id) {
			
			var id = data.id;
			var email = data.email;
			var created = data.created;
			var permanentScore = data.permanent_score;
			var highscore = data.highscore;
			var userScoreRank = data.user_score_rank;
							
			localStorage.setItem('lwg_id', id);
			localStorage.setItem('lwg_email', email);
			localStorage.setItem('lwg_created', created);
			localStorage.setItem('lwg_permanentScore', permanentScore);
			localStorage.setItem('lwg_highscore', highscore);
			localStorage.setItem('lwg_userScoreRank', userScoreRank);
			
			// hide welcome popup and unlock page
			$('body').find('.window.popup.welcome').hide();
			$('body').find('.window.locked').removeClass('locked');
			
			// set starting score
			var startingScore = permanentScore; 
			$('body').find('.time_score .score span').text(startingScore);
			
			// add user rank to leaderboard tab
			if (currentPage !== 'leaderboard') {
				$('body').find('.tab.leaderboard').text('Leaderboard');
			}
				
			// show logged_in_as
			$('body').find('.logged_in_as').show().html('Logged in as User ID: '+id.substring(0, 10)+' (<a class="logout" href="#" data-action="logout">Log Out</a>)');
			
			// show highscore and rank
			$('body').find('.tabs .highscore').show().find('.score span').text(highscore);
			$('body').find('.tabs .highscore').show().find('.rank span').text(userScoreRank);
			
			init();
											
		}  else {
			
			localStorage.clear();
							
			generalInfo('show', 'error', 'An error occured. Please try again.');
			
			return false;	
			
		}
								
	}
	
});

});

/* Start Game */var tickingClock;let clockDrift = 0;

function startGame() {

/* try to get email from localStorage */
if (localStorage.getItem('lwg_email')) {
	
	var email = localStorage.getItem('lwg_email');
	
	var postData = {
		'email': email,
	};

	let preRequestTime = new Date().getTime();

	$.ajax({	
		type: 'POST',
		url: '/api/start_game',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		success: function(data){

			let clientClockNow = new Date().getTime();
			let roundTripTimeMs = clientClockNow - preRequestTime;
			const MAX_CLOCK_DRIFT = 5_000;
			//const MAX_CLOCK_DRIFT = 1;
			
			if (Math.abs((data.end_time * 1000) - (clientClockNow + 60000)) > (MAX_CLOCK_DRIFT + roundTripTimeMs/2.0)) {
				// Drift of more than MAX_CLOCK_DRIFT milliseconds detected
				clockDrift = (preRequestTime + roundTripTimeMs/2.0)-((data.end_time-60) * 1000);
			}

			if (data.game_id) {
				
				// remove tutorial background from results scree
				$('body').find('.results_screen .rows.has_tutorial').addClass('only_search');
				
				
				// start music
				//$('body').find('.player .play').click();
				
				// remove game_over class
				$('body').removeClass('game_over');
				
				// reset clock to 1:00
				$('body').find('.time_left .sec').text('01:00');

				var gameID = data.game_id;
				var started = data.started;
				var status = data.status;
				var timeLeft = data.time_left;
				var endTime = data.end_time;
				var score = data.score;
				
				localStorage.setItem('lwg_game_id', gameID);
				
				$('body').find('.action.start_game').hide();
				$('body').find('.in_game').fadeIn(100);
				
				$('body').find('[name="search_for_downloads[query]"]').removeAttr('disabled');
				$('body').find('[for="search_for_downloads"]').removeAttr('disabled');
				
				// convert endTime to milliseconds
				var timestampMilliseconds = endTime * 1000;
				
				// timestamp must be in milliseconds
				var toTimestamp = parseInt(timestampMilliseconds);

				// Set the date we're counting down to
				var countDownDate = new Date(toTimestamp).getTime() + clockDrift;

				// Update the count down every 1 second
				tickingClock = setInterval(function() {

				  var seconds = Math.max(Math.floor((countDownDate - new Date().getTime()) / 1000), 0);
					
				  // start countdown, and turn seconds into a two-digit string
				  $('body').find('.time_left .sec').html('00:'+seconds.toString().padStart(2,0));
					
				  if (seconds < 1) {

					  clearInterval(tickingClock);
					  
					  gameOverPopup('time_up');
					  
				  }
					
				}, 1000);
		
			}  else {


				return false;	

			}

		}

	});		

} else {
	

    return false;	
	
}


}

$('body').on('click', '[data-action="start_game"]', function(event) {

event.preventDefault();
	
startGame();

});

$('body').on('click', '[data-action="restart_game"]', function(event) {

event.preventDefault();
		
// reset score
var startingScore = localStorage.getItem('lwg_permanentScore'); 
$('body').find('.time_score .score span').text(startingScore);

// clear rows
$('body').find('.results_screen .rows').html('');
$('body').find('.progress_screen .rows').html('');
resetActiveDownloads();

// close tabs and empty search input
$('body').find('.results_screen .rows').html('');
$('body').find('.tabs.search .tab').hide();
$('body').find('[name="search_for_downloads[query]"]').val('');

startGame();

});

var latestSearchRenderBatch = 0;

/* Search for Downloads */$('body').on('submit', '[name="search_for_downloads"]', function(event) {

event.preventDefault();

var button = $(this).find('button[type="submit"]');

var queryInput = $('body').find('[name="search_for_downloads[query]"]');
var query = $('body').find('[name="search_for_downloads[query]"]').val();
				
var error = false;

// errors to handle: #1 minimum 3 chars, only 1 search per minute

if (!query) {
error = true;
queryInput.addClass('error');
} else {
queryInput.removeClass('error');
}

if (!localStorage.getItem('lwg_game_id')) {
generalInfo('show', 'error', 'Error. Please reload page and start again.');
return false;	
}
		
if (error === true) {
generalInfo('show', 'error', 'Please enter a search term.');
return false;	
} else {
generalInfo('hide');	
}
	
button.addClass('loading');
	
var postData = {
	'search': query,
	'game_id': localStorage.getItem('lwg_game_id')
};
	
$.ajax({	
	type: 'POST',
	url: '/api/search',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
	},
	success: function(data){
									
		button.removeClass('loading');
		
					
		if (data.length > 0) {
			
			// hide tutorial arrows
			$('body').find('.results_screen .rows').removeClass('has_tutorial').removeClass('only_search');
			
			// update search tab
			$('body').find('.tabs.search .tab').show()
			$('body').find('.tabs.search .tab .term').html('<i class="close"></i> '+query+' <span class="results_number">('+data.length+')</span>');
			
			// clear rows
			$('body').find('.results_screen .rows').html('');
			var resultsRows = $('body').find('.results_screen .rows');
			var renderBatch = ++latestSearchRenderBatch;
			
			// show result rows
			$.each(data, function(i) {
				
				var numberToShow = i + 1;
				var fileBytes = data[i].size * 1000;
				var downloadSeconds = Math.max(1, Math.ceil(fileBytes / MODEM_56K_BYTES_PER_SECOND));
				
				var alreadyDownloaded = '';
				
				if ($('.progress_screen .rows').find('[data-h="'+data[i].h+'"]').length) {
					alreadyDownloaded = 'downloaded';
				}
									
				var row = '<div data-id="'+data[i].id+'" data-var="'+data[i].var+'" data-h="'+data[i].h+'" data-size-bytes="'+fileBytes+'" data-download-seconds="'+downloadSeconds+'" class="row '+alreadyDownloaded+'"><div class="cell quality"></div><div class="cell number"><span>'+numberToShow+'</span></div><div class="cell license"><span></span></div><div class="cell name"><span>'+data[i].title+'</span></div><div class="cell type"><span>'+data[i].ext+'</span></div><div class="cell size"><span>'+formatBytes(fileBytes)+'</span></div><div class="cell speed"><span>'+data[i].speed+'</span></div><div class="cell bitrate"><span>'+data[i].bitrate+'</span></div><div class="cell scroll"><span>&nbsp;</span></div></div>';
				
				// stagger insertion with some randomness so results feel more dynamic
				(function(index, html) {
					var delay = 220 + Math.floor(Math.random() * 1800) + (index * 40);
					setTimeout(function() {
						if (renderBatch !== latestSearchRenderBatch) return;
						resultsRows.append(html);
					}, delay);
				})(i, row);
			
			});
											
		} else {
											
			if (data.message) {
				generalInfo('show', 'error', data.message);
				return false;
			} 
			
			if (data.length < 1) {
				generalInfo('show', 'error', 'No results found. Please try again.');
				return false;
			} 

			generalInfo('show', 'error', 'An unknown error occurred. Please reload page and start again.');
			return false;	
			
		}
								
	}
	
});

});

/* close search */$('body').on('click', '.tab .term .close', function(event) {

event.preventDefault();

$('body').find('.results_screen .rows').html('');
$('body').find('.tabs.search .tab').hide();
$('body').find('[name="search_for_downloads[query]"]').val('');

});

/* choose row to download */$('body').on('click', '.results_screen .row[data-id]', function(event) {

event.preventDefault();

if ($('body').hasClass('game_over')) {
	return;
}

$('body').find('.results_screen .row').removeClass('selected');
$(this).addClass('selected');

});

/* download file */function downloadFile(url, name) {
const link = document.createElement("a");
link.style.display = "none";
link.href = url;
link.target = "_blank";
link.download = name;
document.body.appendChild(link);
link.click();
setTimeout(function() {
	link.parentNode.removeChild(link);
}, 0);
}

/* download row */function download(rowId, rowVar, rowH) {

var selectedRow = $('body').find('.results_screen .row[data-id="'+rowId+'"][data-var="'+rowVar+'"][data-h="'+rowH+'"]');

if (!$(selectedRow).length) {
	return false;
}

if ($(selectedRow).hasClass('downloaded')) {
	return false;
}

if ($('body').hasClass('game_over')) {
	return false;
}

// increase number of downloads in footer
$('body').find('.bottom_footer .part.upload_download .download i').text(parseInt($('body').find('.bottom_footer .part.upload_download .download i').text()) + 1);

// increase number of downloads in green circle
$('body').find('.bottom_footer .part.green_circle span').text(parseInt($('body').find('.bottom_footer .part.green_circle span').text()) + 1);

// mark row downloaded
$(selectedRow).addClass('downloaded');

var randomNumber = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
var fileBytes = parseFloat($(selectedRow).attr('data-size-bytes')) || bytesFromFormattedSize($(selectedRow).find('.cell.size span').text());
var downloadSeconds = parseInt($(selectedRow).attr('data-download-seconds')) || Math.max(1, Math.ceil(fileBytes / MODEM_56K_BYTES_PER_SECOND));
var modemSpeed = (MODEM_56K_BYTES_PER_SECOND / 1024).toFixed(1);

// add row to progress screen
var progressRow = '<div class="row" data-h="'+rowH+'" data-size-bytes="'+fileBytes+'" data-download-seconds="'+downloadSeconds+'"><div class="cell name"><span>'+$(selectedRow).find('.cell.name span').text()+'</span></div><div class="cell size"><span>'+$(selectedRow).find('.cell.size span').text()+'</span></div><div class="cell status"><span>Queued</span></div><div class="cell progress"><div class="bar"><div class="green" style="width: 0%"></div><span>0%</span></div></div><div class="cell speed"><span>'+modemSpeed+' KB/s</span></div><div class="cell time"><span>'+formatDuration(downloadSeconds)+'</span></div></div>';

$('body').find('.progress_screen .rows').prepend(progressRow);

// proceed to download (GET parameters are used in AJAX call)
var gameId = localStorage.getItem('lwg_game_id');

var postData = {
    'game_id': gameId,
    'id': rowId,
    'var': rowVar,
    'h': rowH,
};

$.ajax({	
    type: 'POST',
    url: '/api/confirm_download?game_id='+gameId+'&id='+rowId+'&var='+rowVar+'&h='+rowH,
    data: postData,	
    error: function(XMLHttpRequest, textStatus, errorThrown) {
    },
    success: function(data){

		// download completed
        if (data.game_id) {
						
			if (data.status == 'ended_virus') {
				
				// animate download in progress screen with virus animation
				animateDownload(rowH, true);
				
				return false;
				
			}
			
			// animate download in progress screen
			animateDownload(rowH);
			
			// clear timer
			clearInterval(tickingClock);
			
			// update clock to new end-time
			var newEndTime = data.end_time;
			
            // convert endTime to milliseconds
            var timestampMilliseconds = newEndTime * 1000;

            // timestamp must be in milliseconds
            var toTimestamp = parseInt(timestampMilliseconds);

            // Set the date we're counting down to
            var countDownDate = new Date(toTimestamp).getTime() + clockDrift;

            // Update the count down every 1 second
            tickingClock = setInterval(function() {

              // Get today's date and time
              var now = new Date().getTime();

              // Find the distance between now and the count down date
              var distance = countDownDate - now;

              // Time calculations for days, hours, minutes and seconds
			  var minutes = Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),0);
			  var seconds = Math.max(Math.floor((distance % (1000 * 60)) / 1000),0);

              // start countdown, and turn seconds into a two-digit string
              $('body').find('.time_left .sec').html(minutes.toString().padStart(2,0)+':'+seconds.toString().padStart(2,0));

              if (minutes < 1 && seconds < 1) {

				  clearInterval(tickingClock);
				  
				  gameOverPopup('time_up');
				  
              }

            }, 1000);
			
			// update score
			var score = data.score;
			
			$('body').find('.time_score .score span').text(score);
			
			// also store score in localStorage
			localStorage.setItem('lwg_game_score', score);
			
			// animate star
			$('body').find('.time_score .score span').css({color: 'gold'});
			$('body').find('.time_score .score span').css({'text-shadow': '0px 0px 1.5px #3c3200'});
							
			setTimeout( function() {

				$('body').find('.time_score .score span').css({color: 'black'});
				$('body').find('.time_score .score span').css({'text-shadow': 'none'});

			}, 250);				
			
        }  else {

			$('body').find('.progress_screen .rows .row[data-h="'+rowH+'"]').remove();
			

            return false;	

        }

    }

});		

}

$('body').on('click', '[data-action="download"]', function(event) {

event.preventDefault();

var selectedRow = $('body').find('.results_screen .row.selected');
var selectedRowId = selectedRow.attr('data-id');
var selectedRowVar = selectedRow.attr('data-var');
var selectedRowH = selectedRow.attr('data-h');

download(selectedRowId, selectedRowVar, selectedRowH);

});

$('body').on('click', '.results_screen .main_actions .action.junk', function(event) {

event.preventDefault();

if ($('body').hasClass('game_over')) {
	return false;
}

var selectedRow = $('body').find('.results_screen .row.selected');
if (!selectedRow.length) {
	return false;
}

if (selectedRow.attr('data-var') === 'virus') {
	showJunkConfetti();
}

selectedRow.fadeOut(160, function() {
	$(this).remove();
});

});

$('body').on('dblclick', '.results_screen .row[data-id]', function(event) {

event.preventDefault();

var selectedRow = $(this);
var selectedRowId = selectedRow.attr('data-id');
var selectedRowVar = selectedRow.attr('data-var');
var selectedRowH = selectedRow.attr('data-h');

download(selectedRowId, selectedRowVar, selectedRowH);

});

$('body').on('contextmenu', '.progress_screen .row.seeding[data-h]', function(event) {

event.preventDefault();

stopSeeding($(this).attr('data-h'));
selectDownloadRow(this);

});

$('body').on('click', '.progress_screen .rows .row[data-h]', function(event) {

event.preventDefault();

selectDownloadRow(this);

});

$('body').on('click', '.progress_actions .action.cancel', function(event) {

event.preventDefault();

removeDownloadRow(selectedDownloadRow());

});

$('body').on('click', '.progress_actions .action.pause', function(event) {

event.preventDefault();

var row = selectedDownloadRow();
var rowHash = row.attr('data-h');
var download = rowHash ? activeDownloads[rowHash] : null;
if (!download || download.complete || download.paused) {
	updateDownloadActionState();
	return false;
}

download.paused = true;
row.addClass('paused');
row.find('.cell.status span').text('Paused');
row.find('.cell.speed span').text('');
refreshFooterDownloadSpeed(fluctuateLineSpeed(activeDownloadItems().length));
updateDownloadActionState();

});

$('body').on('click', '.progress_actions .action.resume', function(event) {

event.preventDefault();

var row = selectedDownloadRow();
var rowHash = row.attr('data-h');
var download = rowHash ? activeDownloads[rowHash] : null;
if (!download || download.complete || !download.paused) {
	updateDownloadActionState();
	return false;
}

download.paused = false;
row.removeClass('paused');
row.find('.cell.status span').text('Queued');
startSharedDownloadTimer();
refreshFooterDownloadSpeed(fluctuateLineSpeed(activeDownloadItems().length));
updateDownloadActionState();

});

$('body').on('click', '.progress_actions .action.clear_inactive', function(event) {

event.preventDefault();

$('body').find('.progress_screen .rows .row.seeding, .progress_screen .rows .row.seed_stopped').each(function() {
	removeDownloadRow(this);
});

});

/* animate download row in progress screen */function animateDownload(rowHash, virus) {

var row = $('body').find('.progress_screen .rows .row[data-h="'+rowHash+'"]');
var totalBytes = parseFloat($(row).attr('data-size-bytes')) || 0;
var estimatedSeconds = parseInt($(row).attr('data-download-seconds')) || 10;
if (!totalBytes) {
	totalBytes = estimatedSeconds * MODEM_56K_BYTES_PER_SECOND;
}

activeDownloads[rowHash] = {
	rowHash: rowHash,
	virus: virus == true,
	totalBytes: totalBytes,
	remainingBytes: totalBytes,
	estimatedSeconds: estimatedSeconds,
	paused: false,
	complete: false
};

if (!legalWarningTriggered && activeDownloadItems().length >= legalWarningDownloadLimit) {
	legalWarningTriggered = true;
	if (typeof showLegalWarning === 'function') {
		showLegalWarning();
	}
	return;
}

startSharedDownloadTimer();
updateDownloadActionState();

}

/* logout */$('body').on('click', '[data-action="logout"]', function(event) {

event.preventDefault();

localStorage.clear();

// reload page
location.reload();

return false;	

});

/* play again button in popup */$('body').on('click', '[data-action="play_again"]', function(event) {

event.preventDefault();

// clear rows
$('body').find('.results_screen .rows').html('');
$('body').find('.progress_screen .rows').html('');
resetActiveDownloads();

// clear score
$('body').find('.time_score .score span').text('0');

// show tutorial background
$('body').find('.results_screen .rows').addClass('has_tutorial').removeClass('only_search');

// remove caught_virus class from popup
$('body').find('.window.caught_virus').removeClass('caught_virus');

// remove locked class from window
$('body').find('.window.locked').removeClass('locked');

$('body').find('.popup.game_finished').hide();

});

/* cancel game */$('body').on('click', '[data-action="cancel_game"]', function(event) {

event.preventDefault();

// stop music
//$('body').find('.player .stop').click();

// add game_over class to body/desktop
$('body').addClass('game_over');

// clear rows
$('body').find('.results_screen .rows').html('');
$('body').find('.progress_screen .rows').html('');
resetActiveDownloads();

// show tutorial background
$('body').find('.results_screen .rows').addClass('has_tutorial').removeClass('only_search');

// clear score
$('body').find('.time_score .score span').text('0');

// clear clock
clearInterval(tickingClock);
$('body').find('.time_left .sec').html('00:00');

// reset bottom footer download counter to zero
$('body').find('.bottom_footer .part.upload_download .download i').text('0');

// reset bottom footer green circle to zero
$('body').find('.bottom_footer .part.green_circle span').text('0');

// hide download/cancel game buttons and show restart game button
$('body').find('.action.download').hide();
$('body').find('.action.stop_search').hide();

$('body').find('.action.start_game.restart').fadeIn(100);

});

/* game over popup */function gameOverPopup(type) {

// stop music
//$('body').find('.player .stop').click();
resetActiveDownloads();

// clear clock
$('body').find('.time_left .sec').html('00:00');

// reset bottom footer download counter to zero
$('body').find('.bottom_footer .part.upload_download .download i').text('0');

// reset bottom footer green circle to zero
$('body').find('.bottom_footer .part.green_circle span').text('0');

// hide download/cancel game buttons and show restart game button
$('body').find('.action.download').hide();
$('body').find('.action.stop_search').hide();

$('body').find('.action.start_game.restart').fadeIn(100);

if (type == 'virus') {
	
	$('body').find('.window.popup.game_finished').addClass('caught_virus');
	
	$('body').find('.window.popup.game_finished .window_header .title span').text('Game Over! You caught a virus.');
	$('body').find('.window.popup.game_finished .main > .heading').html('Game Over! You scored <strong><span class="you_scored">0</span></strong> points.');
	
} else {
	
	$('body').find('.window.popup.game_finished').removeClass('caught_virus');
	
	$('body').find('.window.popup.game_finished .window_header .title span').text('Time\'s up! Share your score to get extra points.');
	$('body').find('.window.popup.game_finished .main > .heading').html('Time\'s up! You scored <strong><span class="you_scored">0</span></strong> points.');
	
}

// add game_over class to body/desktop
$('body').addClass('game_over');

$('body').find('.window:not(.popup)').addClass('locked');
$('body').find('.window.popup.game_finished').show();
	
//var thisGameScore = localStorage.getItem('lwg_game_score');
var userEmail = localStorage.getItem('lwg_email');
var userHighscore =  localStorage.getItem('lwg_highscore');
var userLeaderboardRank =  localStorage.getItem('lwg_userScoreRank');
	
/*if (!thisGameScore) {
	thisGameScore = 0;
}*/

// thisGameScore is the score shown on-screen
var thisGameScore = parseInt($('body').find('.time_score .score div span').text());

$('body').find('.window.popup.game_finished .highscore span').text(userHighscore);
$('body').find('.window.popup.game_finished .row.this .rank').text(userLeaderboardRank);
	
$('body').find('.window.popup.game_finished .you_scored').text(thisGameScore);
$('body').find('.window.popup.game_finished .row.this .user').text("You");

// dynamically fetch user rank, then show
var postData = {
	'email': userEmail,
};
	
$.ajax({	
	type: 'POST',
	url: '/api/login',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
	},
	success: function(data){
												
					
		if (data.id) {
			
			var highscore = data.highscore;
			var userScoreRank = data.user_score_rank;
							
			localStorage.setItem('lwg_highscore', highscore);
			localStorage.setItem('lwg_userScoreRank', userScoreRank);
							
			// add user rank to leaderboard tab
			$('body').find('.tab.leaderboard').text('Leaderboard');
							
			// show highscore and rank
			$('body').find('.window.popup.game_finished .highscore span').text(highscore);
			$('body').find('.tabs .highscore').show().find('.score span').text(highscore);
			$('body').find('.tabs .highscore').show().find('.rank span').text(userScoreRank);
				
			$('body').find('.window.popup.game_finished .row.this .rank').text(userScoreRank);

			if (userScoreRank == 1) {

				$('body').find('.window.popup.game_finished .row[data-rank="2"]').before($('body').find('.window.popup.game_finished .row.this'));
				$('body').find('.window.popup.game_finished .row[data-rank="1"]').remove();

				$('body').find('.window.popup.game_finished .row.this .prize').text('');

			}

			if (userScoreRank == 2) {

				$('body').find('.window.popup.game_finished .row[data-rank="2"]').after($('body').find('.window.popup.game_finished .row.this'));
				$('body').find('.window.popup.game_finished .row[data-rank="2"]').remove();

				$('body').find('.window.popup.game_finished .row.this .prize').text('');

			}
			
			if (userScoreRank == 3 || userScoreRank == 4 || userScoreRank == 5 || userScoreRank == 6) {

				$('body').find('.window.popup.game_finished .row.this .prize').text('');

			}
			
			if (userScoreRank > 6 && userScoreRank <= 1000) {

				$('body').find('.window.popup.game_finished .row.this .prize').text('LimeWire Merch');

			}

			
		}  else {
			
			
		}
								
	}
	
});
		

}

var lwSong;
var lwSongId = null;
var lwSongStutterTimer;
// iOS Safari needs HTML5 audio for reliable user-gesture playback.
var useHtml5AudioForLimeWire = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
	(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function logLimeWireAudioDebug(message, data) {
	if (!window.console || typeof window.console.log !== 'function') {
		return;
	}

	window.console.log('[limewire-audio]', message, data || {});
}

function stopLimeWirePlayerAudio() {
	logLimeWireAudioDebug('stop requested', {
		songId: lwSongId,
		hasStutterTimer: !!lwSongStutterTimer
	});

	if (lwSongStutterTimer) {
		clearInterval(lwSongStutterTimer);
		lwSongStutterTimer = null;
	}

	if (lwSong) {
		if (lwSongId !== null) {
			lwSong.stop(lwSongId);
		} else {
			lwSong.stop();
		}
		lwSongId = null;
	}
}

function getActiveLimeWireSound() {
	if (!lwSong || lwSongId === null || typeof lwSong._soundById !== 'function') {
		logLimeWireAudioDebug('active sound unavailable', {
			hasSong: !!lwSong,
			songId: lwSongId,
			hasSoundById: !!(lwSong && typeof lwSong._soundById === 'function')
		});
		return null;
	}

	var activeSound = lwSong._soundById(lwSongId);
	logLimeWireAudioDebug('active sound lookup', {
		songId: lwSongId,
		found: !!activeSound,
		paused: activeSound ? activeSound._paused : null,
		seek: activeSound ? activeSound._seek : null,
		nodeCurrentTime: activeSound && activeSound._node ? activeSound._node.currentTime : null,
		nodeReadyState: activeSound && activeSound._node ? activeSound._node.readyState : null
	});

	return activeSound;
}

// BSOD audio stutter intentionally uses Howler's internal sound node so the loop
// happens near the current playback position, not from the beginning of the song.
window.stutterLimeWireAudioForBsod = function() {
	logLimeWireAudioDebug('bsod stutter requested', {
		songId: lwSongId,
		playerPlayingClass: $('body').find('.part.player').hasClass('playing'),
		howlerPlaying: !!(lwSong && lwSongId !== null && lwSong.playing(lwSongId))
	});

	if (!lwSong || lwSongId === null || !$('body').find('.part.player').hasClass('playing') || !lwSong.playing(lwSongId)) {
		logLimeWireAudioDebug('bsod stutter skipped', {
			hasSong: !!lwSong,
			songId: lwSongId,
			playerPlayingClass: $('body').find('.part.player').hasClass('playing')
		});
		return;
	}

	if (lwSongStutterTimer) {
		clearInterval(lwSongStutterTimer);
	}

	var activeSound = getActiveLimeWireSound();
	var useHtmlAudioNode = !!(activeSound && activeSound._node && typeof activeSound._node.currentTime === 'number');
	var crashSeek = useHtmlAudioNode ? activeSound._node.currentTime : lwSong.seek(lwSongId);
	if (typeof crashSeek !== 'number' || isNaN(crashSeek)) {
		crashSeek = 0;
	}

	var stutterStart = Math.max(0, crashSeek - 0.3);
	logLimeWireAudioDebug('bsod stutter starting', {
		songId: lwSongId,
		crashSeek: crashSeek,
		stutterStart: stutterStart,
		usingHtmlAudioNode: useHtmlAudioNode,
		duration: useHtmlAudioNode ? activeSound._node.duration : lwSong.duration(lwSongId)
	});

	if (useHtmlAudioNode) {
		activeSound._node.currentTime = stutterStart;
	} else {
		lwSong.seek(stutterStart, lwSongId);
	}
	lwSong.volume(0.7);

	lwSongStutterTimer = setInterval(function() {
		if (!lwSong || lwSongId === null || !$('body').find('.part.player').hasClass('playing')) {
			clearInterval(lwSongStutterTimer);
			lwSongStutterTimer = null;
			return;
		}
		var stutterSound = getActiveLimeWireSound();
		var useStutterHtmlAudioNode = !!(stutterSound && stutterSound._node && typeof stutterSound._node.currentTime === 'number');
		if (useStutterHtmlAudioNode) {
			var beforeResetCurrentTime = stutterSound._node.currentTime;
			stutterSound._node.currentTime = stutterStart;
			logLimeWireAudioDebug('bsod stutter reset node', {
				songId: lwSongId,
				stutterStart: stutterStart,
				beforeResetCurrentTime: beforeResetCurrentTime,
				afterResetCurrentTime: stutterSound._node.currentTime
			});
		} else {
			var beforeResetSeek = lwSong.seek(lwSongId);
			lwSong.seek(stutterStart, lwSongId);
			logLimeWireAudioDebug('bsod stutter reset howler', {
				songId: lwSongId,
				stutterStart: stutterStart,
				beforeResetSeek: beforeResetSeek,
				afterResetSeek: lwSong.seek(lwSongId)
			});
		}
	}, 300);
};

window.stopLimeWirePlayerAudio = stopLimeWirePlayerAudio;

$(document).ready(function() {

lwSong = new Howl({
	src: ['/audio/limewire.mp3'],
	html5: useHtml5AudioForLimeWire,
	format: ['mp3'],
	preload: true,
	loop: true,
	onloaderror: function(id, error) {
		logLimeWireAudioDebug('song load error', {
			songId: id,
			error: error
		});
	},
	onplayerror: function(id, error) {
		logLimeWireAudioDebug('song play error', {
			songId: id,
			error: error
		});
		if (lwSong && typeof lwSong.once === 'function') {
			lwSong.once('unlock', function() {
				lwSong.play(id);
			});
		}
	}
});
logLimeWireAudioDebug('howl initialized', {
	src: '/audio/limewire.mp3',
	html5: useHtml5AudioForLimeWire,
	loop: true,
	userAgent: navigator.userAgent
});

try {
	if (sessionStorage.getItem('limewire_play_startup_after_bsod') === '1') {
		// Fake Windows restart sequence after a BSOD:
		// black screen -> startup sound/desktop wait -> LimeWire load image -> app.
		sessionStorage.removeItem('limewire_play_startup_after_bsod');
		$('body').addClass('boot-after-bsod boot-black');
		setTimeout(function() {
			var startupSound = new Howl({
				src: ['/audio/startup.mp3'],
				html5: useHtml5AudioForLimeWire,
				format: ['mp3'],
				volume: 0.8
			});

			startupSound.play();
			$('body').removeClass('boot-black').addClass('boot-desktop-wait');
			logLimeWireAudioDebug('startup sound played after bsod restart', {
				src: '/audio/startup.mp3',
				blackScreenDelayMs: 2000,
				desktopDelayMs: 2000,
				loadDelayMs: 2000
			});

			setTimeout(function() {
				$('body').removeClass('boot-desktop-wait').addClass('boot-load');
				logLimeWireAudioDebug('boot load screen shown after bsod restart', {
					src: '/img/load.png'
				});

				setTimeout(function() {
					$('body').removeClass('boot-after-bsod boot-load');
					logLimeWireAudioDebug('boot window revealed after bsod restart');
				}, 2000);
			}, 2000);
		}, 2000);
	}
} catch (e) {
	logLimeWireAudioDebug('startup sound after bsod restart failed', {
		error: e && e.message ? e.message : String(e)
	});
}

});

/* music player */$('body').on('click', '.player .play', function(event) {

event.preventDefault();
$(this).blur();

$('body').find('.part.player .bar span').text('You Are a Pirate - LazyTown');
	
if (!$(this).closest('.player').hasClass('playing')) {
	if (lwSongStutterTimer) {
		clearInterval(lwSongStutterTimer);
		lwSongStutterTimer = null;
	}
	if (window.Howler && Howler.ctx && Howler.ctx.state === 'suspended' && typeof Howler.ctx.resume === 'function') {
		Howler.ctx.resume();
	}
	lwSong.volume(1);
	lwSongId = lwSong.play();
	logLimeWireAudioDebug('play clicked', {
		songId: lwSongId,
		playing: lwSong.playing(lwSongId),
		html5: useHtml5AudioForLimeWire,
		howlerState: window.Howler ? Howler.state : null,
		audioContextState: window.Howler && Howler.ctx ? Howler.ctx.state : null
	});
}

$(this).closest('.player').removeClass('paused');
$(this).closest('.player').addClass('playing');	

});

$('body').on('click', '.player .pause', function(event) {

event.preventDefault();
$(this).blur();

if (!$(this).closest('.player').hasClass('paused')) {
	if (lwSongStutterTimer) {
		clearInterval(lwSongStutterTimer);
		lwSongStutterTimer = null;
	}
	if (lwSongId !== null) {
		logLimeWireAudioDebug('pause clicked', {
			songId: lwSongId,
			seekBeforePause: lwSong.seek(lwSongId)
		});
		lwSong.pause(lwSongId);
	}
}
	
$(this).closest('.player').removeClass('playing');
$(this).closest('.player').addClass('paused');

});

$('body').on('click', '.player .stop', function(event) {

event.preventDefault();
$(this).blur();

$('body').find('.part.player .bar span').text('LimeWire Media Player');

$(this).closest('.player').removeClass('playing');
$(this).closest('.player').removeClass('paused');

stopLimeWirePlayerAudio();	

});

/* switch welcome popup between rules and prizes */$('body').on('click', '.quickstart .quickstart_heading a', function(event) {

event.preventDefault();

if ($(this).hasClass('prizes')) {
	
	$(this).closest('.popup').find('.quickstart.rules').hide();
	$(this).closest('.popup').find('.quickstart.prizes').fadeIn();
	
} else {
	
	$(this).closest('.popup').find('.quickstart.prizes').hide();
	$(this).closest('.popup').find('.quickstart.rules').fadeIn();
	
}

});

/* MOBILE SEND LINK */$('body').on('submit', '[name="mobile_send_link"]', function(event) {

event.preventDefault();

var button = $(this).find('button[type="submit"]');

var emailInput = $('body').find('[name="mobile_send_link[email]"]');
var emailToRun = emailInput.val();
			
var error = false;

if (!isValidEmailAddress(emailToRun)) {
error = true;
emailInput.addClass('error');
} else {
emailInput.removeClass('error');
}
		
if (error === true) {
generalInfo('show', 'error', 'Invalid email. Try again.', '.popup.mobile');
return false;	
} else {
generalInfo('hide');	
}
	
button.addClass('loading');
	
var postData = {
	'email': emailToRun,
};
	
$.ajax({	
	type: 'POST',
	url: '/api/send_desktop_link',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
	},
	success: function(data){
									
		button.removeClass('loading');
		
		
		if (data.success == true) {
			
			generalInfo('show', 'success', 'A link has been sent to your inbox.');
											
		}  else {
			
			localStorage.clear();
							
			generalInfo('show', 'error', 'An error occured. Please try again.');
			
			return false;	
			
		}
								
	}
	
});

});




