export function correctHeight() {
    var pageWrapper = $('#page-wrapper');
    var navbarHeigh = 0;
    if ($('nav.navbar-default').length > 0) {
        navbarHeigh = $('nav.navbar-default')[0].clientHeight;
    }

    var wrapperHeigh = pageWrapper.height();

    if (navbarHeigh > wrapperHeigh) {
        pageWrapper.css("min-height", navbarHeigh + "px");
    }

    if (navbarHeigh < wrapperHeigh) {
        if (navbarHeigh < $(window).height()) {
            pageWrapper.css("min-height", $(window).height() + "px");
        } else {
            pageWrapper.css("min-height", navbarHeigh + "px");
        }
    }

    if ($('body').hasClass('fixed-nav')) {
        if (navbarHeigh > wrapperHeigh) {
            pageWrapper.css("min-height", navbarHeigh + "px");
        } else {
            pageWrapper.css("min-height", $(window).height() - 40 + "px");
        }
    }
}

export function detectBody() {
    if ($(document).width() < 769) {
        $('body').addClass('body-small');
    } else {
        $('body').removeClass('body-small');
    }
}

export function smoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // For smoothly turn on menu
        $('#side-menu').fadeIn(400);
    }
    else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').fadeIn(400, "linear", $('.footer').css("left", $('#side-menu').width()));
    }
    else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
    }
}
