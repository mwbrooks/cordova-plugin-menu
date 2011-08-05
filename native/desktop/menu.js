(function(window) {
    //
    // Stub PhoneGap or backup PhoneGap.exec
    //

    if (typeof window.PhoneGap === 'undefined')
        window.PhoneGap = {};

    var phonegapExec = window.PhoneGap.exec || function() {};

    //
    // Define PhoneGap.exec for HTMLMenuElement
    //

    window.PhoneGap.exec = function(success, fail, service, action, args) {
        try {
            switch(service) {
                case 'com.phonegap.menu.toolbar':
                    window.toolbar[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.toolbar.command':
                    window.toolbarCommand[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.context':
                    window.context[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.context.command':
                    window.contextCommand[action](success, fail, args);
                    break;
                default:
                    console.log('service consumed: ' + service + '::' + action);
                    phonegapExec(success, fail, service, action, args);
                    break;
            }
        }
        catch(e) {
            console.log(e);
            console.log('  Unknown action for ' + service + ':');
            console.log('    => uri:    ' + service);
            console.log('    => action: ' + action);
            console.log('    => args:   ' + args);
        }
    };

})(window);
