//
// Android-Specific
//

if (navigator.userAgent.match(/android/i) && typeof window.PhoneGap !== 'undefined') {
    PhoneGap.originalExec = PhoneGap.exec;

    PhoneGap.exec = function(success, fail, service, action, args) {
        if (service === 'com.phonegap.menu.toolbar') {
            window.toolbar[action](success, fail, args);
        }
        else if (service === 'com.phonegap.menu.toolbar.command') {
            try {
            window.toolbarCommand[action](success, fail, args);
            } catch(e) { console.log(e); }
        }
        else {
            PhoneGap.originalExec(success, fail, service, action, args);
        }
    };
    
    PhoneGap.addConstructor(function() {
        navigator.app.addService('com.phonegap.menu.context',         'com.phonegap.menu.AppMenu');
        navigator.app.addService('com.phonegap.menu.context.command', 'com.phonegap.menu.AppMenuItem');
        
        var version = navigator.device.version.split('.');
        version.forEach(function(value, index) {
            version[index] = parseInt(value);
        });
        
        Help.menuPosition = (version[0] > 2 || (version[0] >= 2 && version[1] >= 2)) ? 'fixed' : 'absolute';
        
        var toolbar = document.getElementById('phonegap-menu-toolbar');
        if (toolbar) {
            toolbar.style.position = Help.menuPosition;
        }
    });
}
