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
                PhoneGap.exec(success, fail, "NativeControls2", "createToolBar", []);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeToolBar", []);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBar", [ { 'label': data['label'] } ]);
            }
        },
        'com.phonegap.menu.context': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createTabBar", []);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeTabBar", []);
            },
            'label': function(success, fail, data) {
                console.log('Unsupported: com.phonegap.menu.context :: label');
                success();
            }
        },
        'com.phonegap.menu.toolbar.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createToolBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'], data['accesskey'] ]);
            },
            'delete': function(success, fail, data ) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeToolBarItem", [ data['data-uuid'] ]);
            },
            'accesskey': function(success, fail, data) {
                console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                success();
            },
            'disabled': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "enableToolBarItem", [ data['data-uuid'], !data['disabled'] ]);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'icon': data['icon'] }]);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'label': data['label'] }]);
            }
        },
        'com.phonegap.menu.context.command': {
            'create': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "createTabBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'] ]);
            },
            'delete': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "removeTabBarItem", [ data['data-uuid'] ]);
            },
            'accesskey': function(success, fail, data) {
                console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                success();
            },
            'disabled': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "enableTabBarItem", [ data['data-uuid'], !data['disabled'] ]);
            },
            'icon': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'icon': data['icon'] } ]);
            },
            'label': function(success, fail, data) {
                PhoneGap.exec(success, fail, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'title': data['label'] } ]);
            }
        }
    };
}
