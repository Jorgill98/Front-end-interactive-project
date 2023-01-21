(function( $ ) {
    'use strict';
    
    // Tippy JS
    let elements = document.querySelectorAll('[title]');
    tippy(elements);
    
    // Change header colour
    $(window).scroll(function() {
        $('nav').toggleClass('scrolled', $(this).scrollTop() > 5);
    });
    
    // MFP
    $('.open-popup-link').magnificPopup({
        type: 'inline',
        midClick: true,
    });
    
})( jQuery );