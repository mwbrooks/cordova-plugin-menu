(function(window) {
    var htmlElement;

    var toolbar = {
        'new': function(success, fail, args) {
            success();
        },

        'type': function(success, fail, args) {
            if (args[0] === 'toolbar') {
                if (document.getElementById('phonegap-menu-toolbar')) {
                    success();
                    return;
                }

                htmlElement = document.createElement('div');
                htmlElement.setAttribute('id', 'phonegap-menu-toolbar');
                document.body.appendChild(htmlElement);
                success();
            }
            else {
                fail();
            }
        },

        'label': function(success, fail, args) {
            try {
                htmlElement.innerText = args[0];
                success();
            }
            catch(e) {
                fail(e);
            }
        }
    };

    //
    // Stub PhoneGap or backup PhoneGap.exec
    //

    if (typeof window.PhoneGap === 'undefined')
        window.PhoneGap = {};

    var phonegapExec = window.PhoneGap.exec || function() {};

    //
    // Define PhoneGap.exec for HTMLMenuElement
    //

    window.PhoneGap.exec = function(success, fail, uri, action, args) {
        if (uri === 'ca.michaelbrooks.menu.toolbar') {
            try {
                toolbar[action](success, fail, args);
            }
            catch(e) {
                console.log('Unknown action for ca.michaelbrooks.menu.toolbar:');
                console.log('  => uri:    ' + uri);
                console.log('  => action: ' + action);
                console.log('  => args:   ' + args);
            }
        }
        else if (uri === 'ca.michaelbrooks.menu.command') {

        }
        else {
            phonegapExec(success, fail, uri, action, args);
        }
    };
})(window);
