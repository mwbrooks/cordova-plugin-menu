(function(window) {
    if (typeof window.PhoneGap === 'undefined') window.PhoneGap = {};
    var phonegapExec = window.PhoneGap.exec || function() {};

    var toolbar = {
        'new': function() {
            var element = document.createElement('div');
            element.setAttribute('id', 'phonegap-menu-toolbar');
            document.body.appendChild(element);
        }
    };

    window.PhoneGap.exec = function(success, fail, uri, action, args) {
        if (uri === 'ca.michaelbrooks.menu.toolbar') {
            try {
                toolbar[action](success, fail, args);
            }
            catch(e) {
                console.log('Unknown call to PhoneGap.exec:');
                console.log('  uri:    ' + uri);
                console.log('  action: ' + action);
                console.log('  args:   ' + args);
            }
        }
        else if (uri === 'ca.michaelbrooks.menu.command') {

        }
        else {
            phonegapExec(success, fail, uri, action, args);
        }
    };
})(window);
