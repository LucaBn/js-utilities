/*
	Most of these functions/mothods require JQuery to work
	Each time you read if(variable === undefined) is because of IE
	Always use var because of IE
*/

// Detect if element is in viewport
$.fn.isInViewport = function(margin) {
	if(margin === undefined) {
		margin = 0;
	}

	var elementTop = $(this).offset().top + margin;
	var elementBottom = elementTop + $(this).outerHeight();

	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();

	return elementBottom > viewportTop && elementTop < viewportBottom;
};

// Back to top/bottom animation
var scroll_to_position = {
	starting_position: 0,
	animate: function(margin, speed) {
		$('html, body').animate({scrollTop: margin}, speed);
	},
	back_to_top: function(margin, speed) {
		if(margin === undefined) {
			margin = 0;
		}
		if(speed === undefined) {
			speed = "medium";
		}
		scroll_to_position.starting_position = window.scrollY;
		animate(margin, speed);
	},
	back_to_bottom: function(margin, speed) {
		if(margin === undefined) {
			margin = 0;
		}
		if(speed === undefined) {
			speed = "medium";
		}
		// When you call scroll_to_position.back_to_top method starting position is saved in scroll_to_position.starting_position, it can be used to go back to that point
		animate((scroll_to_position.starting_position + margin), speed);
	}
}
$("body").on("click", ".back-to-top", function() {
	scroll_to_position.back_to_top();
});
$("body").on("click", ".back-to-bottom", function() {
	scroll_to_position.back_to_top();
});

/* Cookie handler */
var cookie_handler = {
	set: function(cname, cvalue, exdays, cbk) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		cbk();
	},
	get: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	del: function(cname, cbk) {
		cookie_handler.set(cname, "", -1, cbk); // Set it in the past
	}
}

/* URLs handler */
var urls_handler = {
	curr_url: location.href,
	curr_url_has_vars: function() { // Use this to detect Home Page
		if(location.pathname == "" || location.pathname == "/" || location.pathname == "/index.php") {
			return false;
		} else {
			return true;
		}
	}
}

var gl = {
	// Detect if tablet
	is_tablet: /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase()),

	// Detect if IE
	is_ie: !!document.documentMode,

	// Lazy load: loads images when they get close to viewport (or if they should be already visible when the page loads), called on scroll/resize
	lazy_load_picture: function() {
		$('img[realsrc]').each(function() {
			if($(this).isInViewport() || $(this).isInViewport(-500)) {
				var t = $(this);
				t.attr('src', t.attr('realsrc'));
				t.removeAttr('realsrc');
				t.onload = console.log(t);
			}
		});
	},

	// Copy to clipboard
	copy_to_clipboard: function(str_to_topy) {
		var dummy = document.createElement("textarea");
		document.body.appendChild(dummy).style.position="fixed";
		dummy.value = str_to_topy;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
		// console.log("Copied!");
	},

	random_number: function(from, to) {
		if(from === undefined) {
			from = 0;
		}
		if(to === undefined) {
			to = from + 10;
		}

		return Math.floor(Math.random()*(to-from+1)+from);
	},

	random_element_from_array: function(array) {
		return array[Math.floor(Math.random()*array.length)];
	},

	shuffle_array: function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle
		while (0 !== currentIndex) {
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},

	check_key: function(e) {
		e = e || window.event;

		// Usage example
		if (e.keyCode == '38') {
			// Up arrow clicked
		}
	},

	/* Ajax call */
	// Examples:
	// ajax_handler.post("https://my-api.azurewebsites.net/videos", "post", "", callback_fn);
	// ajax_handler.post("https://my-api.azurewebsites.net/videos", "post");
	ajax: function(url, type, data, cbk) {
		$.ajax({
			url: url,
			// async: true,
			// cache: false,
			// crossDomain: true,
			type: type,
			method: type,
			data: data,
			datatype: 'json'
		})
		.done(function(data) {
			console.log(data);
			if(cbk === undefined || cbk == "") {
				// No callback
			} else {
				cbk(data);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		});
	},

	/* JS equivalent of php htmlentitites */
	html_entities: function(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
}

// Run gl.copy_to_clipboard on elements with .ctc-this class, the content of data-link attribute will be passed and saved
$('body').on('click', '.ctc-this', function () {
	gl.copy_to_clipboard($(this).attr("data-link"));
});

var date_handler = {
	today: new Date(),
	current_year: date_handler.today.getUTCFullYear(),
	current_month: date_handler.today.getUTCMonth() + 1, // Months from 1-12
	current_day: date_handler.today.getUTCDate(),

	get_date: function(days_offset, as_string, date_separator) { // days_offset [int] (it can also be negative for past dates), as_string [boolean], date_separator [string]
		if(days_offset == undefined) {
			days_offset = 0;
		}
		var date_to_return, date_to_build = new Date();
		date_to_build.setDate(date_to_build.getDate() + days_offset);

		if(as_string == undefined || as_string == false) {
			date_to_return = new Date(date_to_build);
		} else {
			if(date_separator == undefined) {
				date_separator = "/";
			}
			date_to_return = String(date_to_build.getUTCDate()).padStart(2, '0') + date_separator + String(date_to_build.getMonth() + 1).padStart(2, '0') + date_separator + date_to_build.getFullYear();
		}

		return date_to_return;
	},

	seconds_in_period: {
		"year": 31536000,
		"month": 2592000, // 86400*30=2592000, 31536000/12=2628000
		"day": 86400,
		"hour": 3600,
		"minute": 60,
		"second": 1
	},
	time_dictionary: {
		"en": {
			"year": ["year", "years"],
			"month": ["month", "months"],
			"day": ["day", "days"],
			"hour": ["hour", "hours"],
			"minute": ["minute", "minutes"],
			"second": ["second", "seconds"],
		},
		"it": {
			"year": ["anno", "anni"],
			"month": ["mese", "mesi"],
			"day": ["giorno", "giorni"],
			"hour": ["ora", "ore"],
			"minute": ["minuto", "minuti"],
			"second": ["secondo", "secondi"],
		}
	},
	get_time_since_lang_utility: {
		"en": {
			"ago": "ago"
		},
		"it": {
			"ago": "fa"
		}
	},
	get_time_since: function(date) { // Parameter date must be timestamp in seconds
		var time_passed = "";
		var interval = 0;
		var time_diff = ((Date.now())/1000) - (parseInt(date));
		var seconds = Math.floor(time_diff);

		$.each(gl.seconds_in_period, function(key, value) {
			interval = seconds / value;
			if (interval > 1 && time_passed == "") {
				if(Math.floor(interval) == 1) {
					time_passed = Math.floor(interval) + " " + gl.time_dictionary["it"][key][0] + " " + gl.get_time_since_lang_utility["it"]["ago"];
				} else {
					time_passed = Math.floor(interval) + " " + gl.time_dictionary["it"][key][1] + " " + gl.get_time_since_lang_utility["it"]["ago"];
				}
			}
		});

		return time_passed;
	}
}

/* Share on socials */
var share = {
	/*
	 We have two possibilities to share a page on facebook/twitter/linkedin/etc:
	 - add onclick(function_name("url_to_share")) to the html element
	 - add .js-fb-share .js-tw-share .js-li-share classes and data-share-url attribute to the html element
	*/
	facebook:function(url) {
		var res = encodeURIComponent(url);
		var fb = "https://www.facebook.com/sharer/sharer.php?u=";
		var risultato = fb.concat(res);
		window.open(risultato);
	},
	twitter: function(url) {
		var res = encodeURIComponent(url);
		var tw = "https://twitter.com/intent/tweet?text=&url=";
		var risultato = tw.concat(res);
		window.open(risultato);
	},
	linkedin: function(url) {
		var res = encodeURIComponent(url);
		var lk = "https://www.linkedin.com/shareArticle?mini=true&title=&url=";
		var risultato = lk.concat(res);
		window.open(risultato);
	},
	whatsapp: function(url) {
		var res = encodeURIComponent(url);
		var wa = "whatsapp://send?text=";
		var risultato = wa.concat(res);
		window.open(risultato);
	},
	telegram: function(url) {
		var res = encodeURIComponent(url);
		var tg = "https://t.me/share/url?url=";
		var risultato = tg.concat(res);
		window.open(risultato);
	}
}

$("body").on("click", ".js-fb-share", function() {
	share.facebook($(this).attr("data-share-url"));
});
$("body").on("click", ".js-tw-share", function() {
	share.twitter($(this).attr("data-share-url"));
});
$("body").on("click", ".js-li-share", function() {
	share.linkedin($(this).attr("data-share-url"));
});
$("body").on("click", ".js-wa-share", function() {
	share.whatsapp($(this).attr("data-share-url"));
});
$("body").on("click", ".js-tg-share", function() {
	share.telegram($(this).attr("data-share-url"));
});

// document.ready
$(document).ready(function() {
	// Do something
});

// DOM loaded (but images and css could be not!)
document.addEventListener('DOMContentLoaded', function() {
	// Do something
});

// scroll/resize
$(window).on('scroll resize', function() {
	gl.lazy_load_picture();
});

// Only scroll, detecting direction
window.onscroll = function() {
	if(this.oldScroll < this.scrollY) {
		// Scrolled down
	} else {
		// Scrolled up
	}
	this.oldScroll = this.scrollY;
}

// Mousewheel scroll
$('body').on('mousewheel DOMMouseScroll', function() {
	// Do something
});

// Keyboard events
document.onkeydown = gl.check_key;