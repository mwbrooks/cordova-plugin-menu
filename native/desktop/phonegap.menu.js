(function(window) {
    if (typeof window.PhoneGap === 'undefined') window.PhoneGap = {};
    var phonegapExec = window.PhoneGap.exec || function() {};

    var toolbarElement;

    var toolbar = {
        'new': function(success, fail, args) {
            toolbarElement = document.createElement('div');
            toolbarElement.setAttribute('id', 'phonegap-menu-toolbar');
            document.body.appendChild(toolbarElement);
            success();
        },

        'type': function(success, fail, args) {
            // should create the toolbar here
        },

        'label': function(success, fail, args) {
            try {
                toolbarElement.innerText = args[0];
                success();
            }
            catch(e) {
                fail(e);
            }
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
