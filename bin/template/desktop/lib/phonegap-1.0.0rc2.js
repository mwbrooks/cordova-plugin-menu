(function(window) {
    //
    // Stub PhoneGap
    //

    window.PhoneGap = {
        exec: function(success, fail, service, action, args) {
            console.log('Ignored: PhoneGap.exec(success, fail, ' + service + ', ' + action + ', ' + JSON.stringify(args) + ');');
            fail();
        }
    };

    window.addEventListener('load', function() {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('deviceready', true, false);

        setTimeout(function() {
            document.dispatchEvent(event);
        }, 150);
    }, false);

})(window);
