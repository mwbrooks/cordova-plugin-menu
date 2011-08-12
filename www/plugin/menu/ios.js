//
// iOS-Specific
//

(function(window) {
    PhoneGap.originalExec = PhoneGap.exec;

    PhoneGap.exec = function(success, fail, service, action, args) {
        if (serviceMap[service] && serviceMap[service][action]) {
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
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar", "createToolBar", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar", "removeToolBar", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar", "updateToolBar", data);
            }
        },
        'com.phonegap.menu.context': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context", "createTabBar", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context", "removeTabBar", data);
            },
            'label': function(success, fail, data) {
                success(); // No label for a TabBar
            }
        },
        'com.phonegap.menu.toolbar.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar.command", "createToolBarItem", data);
            },
            'delete': function(success, fail, data ) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar.command", "removeToolBarItem", data);
            },
            'accesskey': function(success, fail, data) {
                success();
            },
            'disabled': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar.command", "enableToolBarItem", data);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar.command", "updateToolBarItemImage", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.toolbar.command", "updateToolBarItemTitle", data);
            }
        },
        'com.phonegap.menu.context.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context.command", "createTabBarItem", data);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context.command", "removeTabBarItem", data);
            },
            'accesskey': function(success, fail, data) {
                success();
            },
            'disabled': function(success, fail, data) {
                data[1] = !data[1];
                PhoneGap.exec(success, fail, "com.phonegap.menu.context.command", "enableTabBarItem", data);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context.command", "updateTabBarItemImage", data);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "com.phonegap.menu.context.command", "updateTabBarItemTitle", data);
            }
        }
    };
})(window);
