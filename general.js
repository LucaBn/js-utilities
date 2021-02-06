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

// Set, get and delete cookie
var cookie_handler = {
    set_cookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    get_cookie: function(cname) {
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
    delete_cookie: function(cname) {
        cookie_handler.set_cookie(cname, false, -1);
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
        open_popup("Link copiato", 3000);
    },

    random_number: function(min, max) {
        if(min === undefined) {
            min = 0;
        }
        if(max === undefined) {
            max = min + 10;
        }
        return Math.random() * (max - min) + min;
    },

    random_element_from_array: function(array) {
        return array[Math.floor(Math.random()*array.length)];
    },

    check_key: function(e) {
        e = e || window.event;

        // Usage example
        if (e.keyCode == '38') {
            // Up arrow clicked
        }
    },

    // Ajax calls
    ajax: function(type, url, data_type) {
        if(type == "get") {
            $.ajax({
                'url': url,
                'dataType': data_type,
                'success': function(data) {
                    console.log(data);
                }
            });
        }
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
    current_day: date_handler.today.getUTCDate()
}

// document.ready
$(document).ready(function() {
	
});

// DOM loaded (but images and css could be not!)
document.addEventListener('DOMContentLoaded', function() {
	
});

// scroll/resize
$(window).on('scroll resize', function () {
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

});

// Keyboard events
document.onkeydown = gl.check_key;