window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');
require('./_common/lib/polyfills/nodelist.foreach');
require('./_common/lib/polyfills/element.closest');

require('@binary-com/binary-style');
require('@binary-com/binary-style/binary.more');

// used by gtm to update page after a new release
window.check_new_release = require('./_common/check_new_release').checkNewRelease;

require('event-source-polyfill');
require('./_common/lib/jquery.sparkline.js');
require('./_common/lib/plugins');
require('jquery.scrollto');

const BinaryLoader = require('./app/base/binary_loader');
const isProduction = require('./config').isProduction;

if (isProduction()) {
    const isFromIframe = () => {
        if (window && window.frameElement) return true;
        if (window && window.self !== window.top) return true;
        if (window && window.parent && window.location !== window.parent.location) return true;

        return false;
    };
    const page_location = (window && window.location && window.location.href) ? encodeURIComponent(window.location.href) : 'UNKNOWN';
    const device_language = (navigator && navigator.language) ? navigator.language : 'UNKNOWN';
    const referrer_full_path = (document && document.referrer) ? encodeURIComponent(document.referrer) : 'UNKNOWN';
    const is_loaded_from_iframe = isFromIframe() ? '1' : '0';
    const collector_url = `https://ga-tracker-dot-business-intelligence-240201.appspot.com/collect?v=1&_v=j79&a=1782300344&t=binary-ping&dl=${page_location}&ul=${device_language}&dr=${referrer_full_path}&dt=Binary.com&cid=1496860339.1563518559&tid=UA-139927388-1&ec=systemEvent&ea=${is_loaded_from_iframe}&el=initialJSLoad&ev=1`;

    fetch(collector_url)
        .then(data => {
            const data_holder = data;
            // do nothing
            return data_holder;
        });
}

document.addEventListener('DOMContentLoaded', BinaryLoader.init);
$(window).on('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.originalEvent.persisted) {
        BinaryLoader.init();
    }
});
