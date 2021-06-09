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
	start: function(margin, speed) {
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
		scroll_to_position.start(margin, speed);
	},
	back_to_bottom: function(margin, speed) {
		if(margin === undefined) {
			margin = 0;
		}
		if(speed === undefined) {
			speed = "medium";
		}
		// When you call scroll_to_position.back_to_top method starting position is saved in scroll_to_position.starting_position, it can be used to go back to that point
		scroll_to_position.start((scroll_to_position.starting_position + margin), speed);
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
		if(cbk === undefined || cbk == "") {
			// No callback
		} else {
			cbk();
		}
	},
	get: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while(c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if(c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	del: function(cname, cbk) {
		if(cbk === undefined) {
			cbk == ""
		}
		cookie_handler.set(cname, "", -1, cbk); // Set it in the past
	}
}

/* Storage handler */
var storage_handler = {
	set: function(name, value, cbk) {
		localStorage.setItem(name, value);
		if(cbk === undefined || cbk == "") {
			// No callback
		} else {
			cbk();
		}
	},
	get: function(name) {
		return localStorage.getItem(name);
	},
	del: function(name, cbk) {
		localStorage.removeItem(name);
		if(cbk === undefined || cbk == "") {
			// No callback
		} else {
			cbk();
		}
	},
	del_all: function(cbk) {
		localStorage.clear();
		if(cbk === undefined || cbk == "") {
			// No callback
		} else {
			cbk();
		}
	}
}

/* URLs handler */
var urls_handler = {
	curr_url: location.href,
	url_protocol: location.protocol,
	base_url: location.origin,
	url_path: location.pathname,
	url_hash: location.hash,
	curr_url_has_vars: function() { // Use this to detect Home Page
		if(location.pathname == "" || location.pathname == "/" || location.pathname == "/index.php") {
			return false;
		} else {
			return true;
		}
	},
	get_parameter: function(url, parameter) {
		return new URL(url).searchParams.get(parameter);
	},
	get_all_parameters: function(url) {
		var params = {};
		var parser = document.createElement('a');
		parser.href = url;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			params[pair[0]] = decodeURIComponent(pair[1]);
		}
		return params;
	}
}

var gl = {
	// Detect if tablet
	is_tablet: /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase()),

	// Detect if mobile
	is_mobile: function() {
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}(),

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

		// While there are elements to shuffle
		while (0 !== currentIndex) {
			// Pick an element
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
			// console.log(data);
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
$('body').on('click', '.ctc-this', function() {
	gl.copy_to_clipboard($(this).attr("data-link"));
});

var date_handler = {
	today: Date.now(),
	current_year: new Date().getUTCFullYear(),
	current_month: new Date().getUTCMonth() + 1, // Months from 1-12
	current_day: new Date().getUTCDate(),

	update_today: function() { // Update date_handler.today
		date_handler.today = Date.now();
	},

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
			"ago": "ago"
		},
		"it": {
			"year": ["anno", "anni"],
			"month": ["mese", "mesi"],
			"day": ["giorno", "giorni"],
			"hour": ["ora", "ore"],
			"minute": ["minuto", "minuti"],
			"second": ["secondo", "secondi"],
			"ago": "fa"
		}
	},
	get_time_since: function(date, lang) { // Parameter date must be timestamp in seconds
		if(lang == undefined || date_handler.time_dictionary[lang] == undefined) {
			lang = "it";
		}

		var time_passed = -1;
		var interval = 0;
		var time_diff = ((Date.now())/1000) - (parseInt(date));
		var seconds = Math.floor(time_diff);

		$.each(date_handler.seconds_in_period, function(key, value) {
			interval = seconds / value;
			if(interval > 1) {
				if(Math.floor(interval) == 1) {
					time_passed = Math.floor(interval) + " " + date_handler.time_dictionary[lang][key][0] + " " + date_handler.time_dictionary[lang]["ago"]; // Singular
				} else {
					time_passed = Math.floor(interval) + " " + date_handler.time_dictionary[lang][key][1] + " " + date_handler.time_dictionary[lang]["ago"]; // Plural
				}
				return false; // This breaks the loop
			}
		});

		return time_passed; // If it returns -1 variable date value is future
	}
}

/* Share on socials */
var share = {
	/*
	 We have two possibilities to share a page on facebook/twitter/linkedin/etc:
	 - add onclick(function_name("url_to_share", "text_to_share")) to the html element
	 - add .js-fb-share .js-tw-share .js-li-share .js-wa-share .js-tg-share classes and data-share-url data-share-text attributes to the html element
	*/
	facebook: function(url) {
		var res = encodeURIComponent(url);
		var generated_link = "https://www.facebook.com/sharer/sharer.php?u="+res;
		window.open(generated_link);
	},
	twitter: function(url, text) {
		if(text === undefined) {
			text = "";
		}
		var res = encodeURIComponent(url);
		var generated_link = "https://twitter.com/intent/tweet?text="+text+"&url="+res;
		window.open(generated_link);
	},
	linkedin: function(url, text) {
		if(text === undefined) {
			text = "";
		}
		var res = encodeURIComponent(url);
		var generated_link = "https://www.linkedin.com/shareArticle?mini=true&title="+text+"&url="+res;
		window.open(generated_link);
	},
	whatsapp: function(url, text) {
		if(text === undefined) {
			text = "";
		}
		var res = encodeURIComponent(url);
		var generated_link = "whatsapp://send?text="+text+" "+res;
		window.open(generated_link);
	},
	telegram: function(url, text) {
		if(text === undefined) {
			text = "";
		}
		var res = encodeURIComponent(url);
		var generated_link = "https://t.me/share/url?url="+res+"&text="+text;
		window.open(generated_link);
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

function get_all_obj() {
	console.log("var scroll_to_position");
	console.log(scroll_to_position);
	console.log("var cookie_handler");
	console.log(cookie_handler);
	console.log("var urls_handler");
	console.log(urls_handler);
	console.log("var gl");
	console.log(gl);
	console.log("var date_handler");
	console.log(date_handler);
	console.log("var share");
	console.log(share);
	console.log("var animation");
	console.log(animation);
}

// DOM loaded (but images and css could be not!)
document.addEventListener('DOMContentLoaded', function() {
	console.log("Document is fully loaded");
});

// document.ready
$(document).ready(function() {
	console.log("Document is ready");
	console.log("%ci%c Run get_all_obj() to get a list of all available objects and their methods", "color:#fff;background:blue;border-radius:2px;padding-left:5px;padding-right:5px;", "");
});

// scroll/resize
$(window).on('scroll resize', function() {
	//
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
