var WB$wombat$assign$function=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{let window = WB$wombat$assign$function("window");let self = WB$wombat$assign$function("self");let document = WB$wombat$assign$function("document");let location = WB$wombat$assign$function("location");let top = WB$wombat$assign$function("top");let parent = WB$wombat$assign$function("parent");let frames = WB$wombat$assign$function("frames");let opener = WB$wombat$assign$function("opener");/* SCROLL UP ON ANCHOR CLICK */$(document).on('click', '[data-scroll-to-id]', function (event) {event.preventDefault();

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

/* validate email /function isValidEmailAddress(emailAddress) {var pattern = new RegExp(/^((([a-z]|\d|[!#$%&'*+-/=?^_{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+))|((\x22)((((\x20|\x09)(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))(((\x20|\x09)(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))).)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))).?$/i);return pattern.test(emailAddress);}

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

		//autoFillLoginEmail();
		//localStorage.clear();

	break;

	case 'leaderboard':

		// load leaderboard
		$.ajax({	
			type: 'GET',
			url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/highscore',
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(textStatus + ', ' + errorThrown);
			},
			success: function(data){

				console.log(data); 

				if (data.length > 0) {

					$.each(data, function(i) {

						var prize;

						switch (data[i].rank) {

							case 1:
								prize = '100,000 LMWR (worth USD $30,000)';
							break;

							case 2:
							case 3:
							case 4:
							case 5:
							case 6:
								prize = '10,000 LMWR (worth USD $3,000)';
							break;

							default: 

								if (data[i].rank > 6 && data[i].rank <= 3000) {
								prize = 'LimeWire Merch Package';
								} else {
								prize = '';
								}

							break;

						}

						var trMarked = '';

						if (parseInt(localStorage.getItem('lwg_userScoreRank')) == data[i].rank) {
							trMarked = 'highlighted';
						}

						var tr = '<div class="tr '+trMarked+'"><div class="td rank">Rank #'+data[i].rank+'</div><div class="td user">'+data[i].user+'</div><div class="td score">'+data[i].score+'</div><div class="td prize">'+prize+'</div></div>';

						$('body').find('.leader_board .table .tbody').append(tr);

					});

				}  else {

					return false;	

				}

			}

		});

	break;

	case 'challenges':

		var emailToRun = localStorage.getItem('lwg_email');

		var error = false;

		var postData = {
			'email': emailToRun,
		};

		$.ajax({	
			type: 'POST',
			url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/completed_challenges',
			data: postData,	
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(textStatus + ', ' + errorThrown);
			},
			success: function(data){

				console.log(data); 

				var bonusPoints = 0;

				$.each(data, function(i) {

					bonusPoints = bonusPoints + 100;

					$('body').find('[data-action-challenge="'+data[i]+'"]').closest('.challenge').addClass('completed');
					$('body').find('[data-action-challenge="'+data[i]+'"]').closest('.challenge').find('label').text('Completed!');

				});

				$('body').find('.collected_bonus_points span').text(bonusPoints);

			}

		});

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
		url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/login',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus + ', ' + errorThrown);
		},
		success: function(data){

			console.log(data); 

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
				$('body').find('.tab.leaderboard').text('Leaderboard & Prizes (Your Rank: '+userScoreRank+')');
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
	url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/login',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
 		console.log(textStatus + ', ' + errorThrown);
	},
	success: function(data){
									
		button.removeClass('loading');
		
		console.log(data); 
					
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
				$('body').find('.tab.leaderboard').text('Leaderboard & Prizes (Your Rank: '+userScoreRank+')');
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
		url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/start_game',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus + ', ' + errorThrown);
		},
		success: function(data){

			console.log(data); 
			let clientClockNow = new Date().getTime();
			let roundTripTimeMs = clientClockNow - preRequestTime;
			const MAX_CLOCK_DRIFT = 5_000;
			//const MAX_CLOCK_DRIFT = 1;
			
			if (Math.abs((data.end_time * 1000) - (clientClockNow + 60000)) > (MAX_CLOCK_DRIFT + roundTripTimeMs/2.0)) {
				// Drift of more than MAX_CLOCK_DRIFT milliseconds detected
				clockDrift = (preRequestTime + roundTripTimeMs/2.0)-((data.end_time-60) * 1000);
				console.log(`Clock drift detected: ${clockDrift}ms`);
			}

			if (data.game_id) {
				
				// remove tutorial background from results scree
				$('body').find('.results_screen .rows.has_tutorial').addClass('only_search');
				
				// stop ifreeclub music
				//ifreeclubSong.stop();
				
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

				console.log('startGame() error 1');

				return false;	

			}

		}

	});		

} else {
	
    console.log('startGame() error 2');

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

// close tabs and empty search input
$('body').find('.results_screen .rows').html('');
$('body').find('.tabs.search .tab').hide();
$('body').find('[name="search_for_downloads[query]"]').val('');

startGame();

});

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
	url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/search',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
 		console.log(textStatus + ', ' + errorThrown);
	},
	success: function(data){
									
		button.removeClass('loading');
		
		//console.log(data); 
					
		if (data.length > 0) {
			
			// hide tutorial arrows
			$('body').find('.results_screen .rows').removeClass('has_tutorial').removeClass('only_search');
			
			// update search tab
			$('body').find('.tabs.search .tab').show()
			$('body').find('.tabs.search .tab .term').html('<i class="close"></i> '+query+' <span class="results_number">('+data.length+')</span>');
			
			// clear rows
			$('body').find('.results_screen .rows').html('');
			
			// show result rows
			$.each(data, function(i) {
				
				console.log(data[i]);
				
				var numberToShow = i + 1;
				
				var alreadyDownloaded = '';
				
				if ($('.progress_screen .rows').find('[data-h="'+data[i].h+'"]').length) {
					alreadyDownloaded = 'downloaded';
				}
									
				var row = '<div data-id="'+data[i].id+'" data-var="'+data[i].var+'" data-h="'+data[i].h+'" class="row '+alreadyDownloaded+'"><div class="cell quality"></div><div class="cell number"><span>'+numberToShow+'</span></div><div class="cell license"><span></span></div><div class="cell name"><span>'+data[i].title+'</span></div><div class="cell type"><span>'+data[i].ext+'</span></div><div class="cell size"><span>'+formatBytes(data[i].size*1000)+'</span></div><div class="cell speed"><span>'+data[i].speed+'</span></div><div class="cell bitrate"><span>'+data[i].bitrate+'</span></div><div class="cell scroll"><span>&nbsp;</span></div></div>';
				
				$('body').find('.results_screen .rows').append(row);
			
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

/* download file */function downloadFile(url, name) {// Create a link and set the URL using createObjectURLconst link = document.createElement("a");link.style.display = "none";link.href = url;link.target = '_blank';link.download = name;

// It needs to be added to the DOM so it can be clickeddocument.body.appendChild(link);link.click();

// To make this work on Firefox we need to wait// a little while before removing it.setTimeout(() => {URL.revokeObjectURL(link.href);link.parentNode.removeChild(link);}, 0);}

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

// easter egg: ifreeclub
if (rowId == '9fc1f3181a884dacb0fe2ddb815822b1') {
			
	// stop game music
	$('body').find('.player .stop').click();

	ifreeclubSong.stop();
	ifreeclubSong.play();
	
}

// easter egg: lw whitepaper
if (rowId == 'whitepaper_download') {
	
	// download whitepaper - currently opens new tab instead of download, disabled for now
	//downloadFile('downloads/LimeWire Whitepaper 1.0.pdf', 'LimeWire Whitepaper 1.0');
	
	// mark challenge completed
	var postData = {
		'email': localStorage.getItem('lwg_email'),
		'challenge_type': 'whitepaper_in_search_download'
	};

	$.ajax({	
		type: 'POST',
		url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/complete_challenge',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus + ', ' + errorThrown);
		},
		success: function(data){

			console.log(data); 

			if (data.success == true) {
				
				console.log('bonus points collected for whitepaper download');
				
			}  else {

				
			}

		}

	});
	
}

// increase number of downloads in footer
$('body').find('.bottom_footer .part.upload_download .download i').text(parseInt($('body').find('.bottom_footer .part.upload_download .download i').text()) + 1);

// increase number of downloads in green circle
$('body').find('.bottom_footer .part.green_circle span').text(parseInt($('body').find('.bottom_footer .part.green_circle span').text()) + 1);

// mark row downloaded
$(selectedRow).addClass('downloaded');

var randomNumber = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
var randomSpeed = Math.floor(Math.random() * (500 - 10 + 1)) + 10;

// add row to progress screen
var progressRow = '<div class="row" data-h="'+rowH+'"><div class="cell name"><span>'+$(selectedRow).find('.cell.name span').text()+'</span></div><div class="cell size"><span>'+$(selectedRow).find('.cell.size span').text()+'</span></div><div class="cell status"><span>Downloading from '+randomNumber+' hosts</span></div><div class="cell progress"><div class="bar"><div class="green" style="width: 0%"></div><span>0%</span></div></div><div class="cell speed"><span>'+randomSpeed+' KB/s</span></div><div class="cell time"><span>0:10</span></div></div>';

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
    url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/confirm_download?game_id='+gameId+'&id='+rowId+'&var='+rowVar+'&h='+rowH,
    data: postData,	
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus + ', ' + errorThrown);
    },
    success: function(data){

        console.log(data); 
		
		// download completed
        if (data.game_id) {
						
			if (data.status == 'ended_virus') {
				
				// animate download in progress screen with virus animation
				animateDownload(rowH, true);
				
				// clear interval
				clearInterval(tickingClock);
				
				setTimeout(function() {
					
					gameOverPopup('virus');
					
				}, 1500);	
				
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
			
            console.log('An error occured. Please reload page and try again.');

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

$('body').on('dblclick', '.results_screen .row[data-id]', function(event) {

event.preventDefault();

var selectedRow = $(this);
var selectedRowId = selectedRow.attr('data-id');
var selectedRowVar = selectedRow.attr('data-var');
var selectedRowH = selectedRow.attr('data-h');

download(selectedRowId, selectedRowVar, selectedRowH);

});

/* animate download row in progress screen */function animateDownload(rowHash, virus) {

var row = $('body').find('.progress_screen .rows .row[data-h="'+rowHash+'"]');

var progressPercentage = 0;
var progressTimeSecondsLeft = 10;

var downloadAnimation = setInterval(function(){ 

	if (progressPercentage == 100) {
		
		clearInterval(downloadAnimation);
		
		$(row).find('.cell.time span').text('');
		$(row).find('.cell.speed span').text('');
		
		if (virus == true) {
							
			$(row).find('.cell.status span').text('You caught a virus!');
			$(row).find('.cell.progress .bar .green').css('background', '#ff0000');
			$(row).find('.cell.progress .bar .green + span').css('color', '#ffffff');
			
			// also change background color to red for row in results screen
			$('body').find('.results_screen .rows .row[data-h="'+rowHash+'"]').addClass('virus_caught');
			
			return false;
			
		}
		
		$(row).find('.cell.status span').text('Complete');
	
		// decrease number of downloads in footer
		if (parseInt($('body').find('.bottom_footer .part.upload_download .download i').text()) > 0) {
			$('body').find('.bottom_footer .part.upload_download .download i').text(parseInt($('body').find('.bottom_footer .part.upload_download .download i').text()) - 1);
		}
		
		return;
	}
	
	progressPercentage = progressPercentage + 10;
	progressTimeSecondsLeft = progressTimeSecondsLeft - 1;
	
	$(row).find('.cell.progress .bar .green').attr('style', 'width: ' + progressPercentage+'%');
	$(row).find('.cell.progress .bar .green + span').text(progressPercentage + '%');
	
	$(row).find('.cell.time span').text('0:' + progressTimeSecondsLeft.toString().padStart(2,0));
	
}, 100);
	

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
	url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/login',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
 		console.log(textStatus + ', ' + errorThrown);
	},
	success: function(data){
												
		console.log(data); 
					
		if (data.id) {
			
			var highscore = data.highscore;
			var userScoreRank = data.user_score_rank;
							
			localStorage.setItem('lwg_highscore', highscore);
			localStorage.setItem('lwg_userScoreRank', userScoreRank);
							
			// add user rank to leaderboard tab
			$('body').find('.tab.leaderboard').text('Leaderboard & Prizes (Your Rank: '+userScoreRank+')');
							
			// show highscore and rank
			$('body').find('.window.popup.game_finished .highscore span').text(highscore);
			$('body').find('.tabs .highscore').show().find('.score span').text(highscore);
			$('body').find('.tabs .highscore').show().find('.rank span').text(userScoreRank);
				
			$('body').find('.window.popup.game_finished .row.this .rank').text(userScoreRank);

			if (userScoreRank == 1) {

				$('body').find('.window.popup.game_finished .row[data-rank="2"]').before($('body').find('.window.popup.game_finished .row.this'));
				$('body').find('.window.popup.game_finished .row[data-rank="1"]').remove();

				$('body').find('.window.popup.game_finished .row.this .prize').text('100,000 LMWR');

			}

			if (userScoreRank == 2) {

				$('body').find('.window.popup.game_finished .row[data-rank="2"]').after($('body').find('.window.popup.game_finished .row.this'));
				$('body').find('.window.popup.game_finished .row[data-rank="2"]').remove();

				$('body').find('.window.popup.game_finished .row.this .prize').text('10,000 LMWR');

			}
			
			if (userScoreRank == 3 || userScoreRank == 4 || userScoreRank == 5 || userScoreRank == 6) {

				$('body').find('.window.popup.game_finished .row.this .prize').text('10,000 LMWR');

			}
			
			if (userScoreRank > 6 && userScoreRank <= 1000) {

				$('body').find('.window.popup.game_finished .row.this .prize').text('LimeWire Merch');

			}

			
		}  else {
			
			console.log('Error: Could not load statistics.');
			
		}
								
	}
	
});
		

}

/* share score twitter */$('body').on('click', '[data-action-challenge]', function(event) {

event.preventDefault();

var urlToOpen;
	
// if challenges page, check for presence of username input value
if (currentPage == 'challenges') {

	var thisChallengeObject = $(this).closest('.challenge');
	var input = thisChallengeObject.find('input');
	
	var error = false;

	if (!input.val()) {
	error = true;
	input.addClass('error');
	} else {
	input.removeClass('error');
	}

	if (error === true) {
	return false;	
	} 
	
}

var challengeType = $(this).attr('data-action-challenge');
var newTabInstead = false;

switch (challengeType) {
		
	case 'twitter_follow':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://twitter.com/limewire';
		
	break;
		
	case 'game_twitter_post':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://twitter.com/intent/tweet?text=Ready+for+a+blast+from+the+past%3F+Play+the+LimeWire+Game+now+to+win+100%2C000+LimeWire+Tokens+%28LMWR%29.+Play+here%3A+game.limewire.com+%23LimeWireGame';
		
	break;
		
	case 'score_twitter_post':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://twitter.com/intent/tweet?text=I+scored+'+localStorage.getItem('lwg_highscore')+'+points+on+the+LimeWire+Game.+Play+now+%26+win+100%2C000+LimeWire+Tokens+%28LMWR%29.+Play+here%3A+game.limewire.com+%23LimeWireGame';
								
	break;
		
	case 'lmwr_waitlist_twitter_post':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://twitter.com/intent/tweet?text=LimeWire+Token%3A+Public+Sale.+Join+the+waitlist+%26+win+up+to+100%2C000+LMWR+%40limewire+https%3A%2F%2Flmwr.com%2F%3Fref%3D2N9D75';
		
	break;
					
	case 'instagram_follow':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://www.instagram.com/limewire/';
		newTabInstead = true;
		
	break;
		
	case 'join_discord':
		
		urlToOpen = 'https://web.archive.org/web/20230420162532/https://discord.gg/limewire';
		newTabInstead = true;
		
	break;
		
}
	
// open window
if (newTabInstead == true) {
	
	window.open(urlToOpen, '_blank');
	
} else {

	window.open(urlToOpen, 'popupWindow', 'width=750,height=600,scrollbars=yes');

}

// mark challenge completed with a 10s delay
setTimeout( function() {

	// dynamically fetch user rank, then show
	var postData = {
		'email': localStorage.getItem('lwg_email'),
		'challenge_type': challengeType
	};

	$.ajax({	
		type: 'POST',
		url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/complete_challenge',
		data: postData,	
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus + ', ' + errorThrown);
		},
		success: function(data){

			console.log(data); 

			if (data.success == true) {

				// mark challenge completed
				if (currentPage == 'challenges') {
				
					$(thisChallengeObject).addClass('completed');
					$(thisChallengeObject).find('label').text('Completed!');
					
					// update collected bonus points number
					var currentBonusPoints = parseInt($('body').find('.collected_bonus_points span').text());
					
					$('body').find('.collected_bonus_points span').text(currentBonusPoints + 100);
					
				}
				
			}  else {

				
			}

		}

	});

}, 10000);				

});

var ifreeclubSongvar lwSong;

$(document).ready(function() {

lwSong = new Howl({
	src: ['downloads/limewire_song.mp3'],
	html5: true
});

ifreeclubSong = new Howl({
	src: ['downloads/ifreeclub.mp3'],
	html5: true
});

});

/* music player */$('body').on('click', '.player .play', function(event) {

$('body').find('.part.player .bar span').text('Soulja Boy - LimeWire');
	
if (!$(this).closest('.player').hasClass('playing')) {
	lwSong.play();
}

$(this).closest('.player').removeClass('paused');
$(this).closest('.player').addClass('playing');	

});

$('body').on('click', '.player .pause', function(event) {

if (!$(this).closest('.player').hasClass('paused')) {
	lwSong.pause();
}
	
$(this).closest('.player').removeClass('playing');
$(this).closest('.player').addClass('paused');

});

$('body').on('click', '.player .stop', function(event) {

$('body').find('.part.player .bar span').text('LimeWire Media Player');

$(this).closest('.player').removeClass('playing');
$(this).closest('.player').removeClass('paused');

lwSong.stop();	

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
	url: 'https://web.archive.org/web/20230420162532/https://game-backend.limewire.com/send_desktop_link',
	data: postData,	
	error: function(XMLHttpRequest, textStatus, errorThrown) {
 		console.log(textStatus + ', ' + errorThrown);
	},
	success: function(data){
									
		button.removeClass('loading');
		
		console.log(data); 
		
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





}

/*FILE ARCHIVED ON 16:25:32 Apr 20, 2023 AND RETRIEVED FROM THEINTERNET ARCHIVE ON 17:40:05 Jun 26, 2026.JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

 ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
 SECTION 108(a)(3)).

//playback timings (ms):capture_cache.get: 2.0load_resource: 264.542 (2)PetaboxLoader3.resolve: 113.722 (2)PetaboxLoader3.datanode: 148.51 (2)*/