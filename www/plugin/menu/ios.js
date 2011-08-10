//
// iOS-Specific
//

if (navigator.userAgent.match(/iphone/i) && typeof window.PhoneGap !== 'undefined') {
    PhoneGap.originalExec = PhoneGap.exec;

    PhoneGap.exec = function(success, fail, service, action, args) {
        if (serviceMap[service]) {
            try {
                console.log("serviceMap: " + service + '::' + action);
                serviceMap[ service ][ action ]( success, fail, args );
            } catch(e) {
                console.log('Unsupported NativeControls service and action.');
                console.log(e);
            }
        }
        else {
            PhoneGap.originalExec(success, fail, service, action, args);
        }
    };

    var serviceMap = {
        'com.phonegap.menu.toolbar': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createToolBar", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeToolBar", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBar", data);
            }
        },
        'com.phonegap.menu.context': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createTabBar", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeTabBar", data);
            },
            'label': function(success, fail, data) {
                success(); // No label for a TabBar
            }
        },
        'com.phonegap.menu.toolbar.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createToolBarItem", data);
            },
            'delete': function(success, fail, data ) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeToolBarItem", data);
            },
            'accesskey': function(success, fail, data) {
                success();
            },
            'disabled': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "enableToolBarItem", data);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBarItemImage", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBarItemTitle", data);
            }
        },
        'com.phonegap.menu.context.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createTabBarItem", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeTabBarItem", data);
            },
            'accesskey': function(success, fail, data) {
                success();
            },
            'disabled': function(success, fail, data) {
                data[1] = !data[1];
                PhoneGap.exec(success, fail, "NativeControls2", "enableTabBarItem", data);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateTabBarItemImage", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateTabBarItemTitle", data);
            }
        }
    };
}
