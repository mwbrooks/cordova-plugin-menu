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
}
