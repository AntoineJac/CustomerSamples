(function detectmob() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;

    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        gads.src = (useSSL ? 'https:' : 'http:') +
        '//ads.rubiconproject.com/prebid/11964_general_mobile_test.js';
    } else {
        gads.src = (useSSL ? 'https:' : 'http:') +
        '//ads.rubiconproject.com/prebid/11964_test.js';
    }
    
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
}());
