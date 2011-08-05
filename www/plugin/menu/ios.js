//
// iOS-Specific
//

if (navigator.userAgent.match(/iphone/i) && typeof window.PhoneGap !== 'undefined') {
    (function() {
        window.Help._execute = {
            'com.phonegap.menu.toolbar': {
                'create': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "createToolBar", []);
                },
                'delete': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "removeToolBar", []);
                },
                'label': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "updateToolBar", [ { 'label': data['label'] } ]);
                }
            },
            'com.phonegap.menu.context': {
                'create': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "createTabBar", []);
                },
                'delete': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "removeTabBar", []);
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.context :: label');
                }
            },
            'com.phonegap.menu.toolbar.command': {
                'create': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "createToolBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'], data['accesskey'] ]);
                },
                'delete': function(data ) {
                    PhoneGap.exec(null, null, "NativeControls2", "removeToolBarItem", [ data['data-uuid'] ]);
                },
                'accesskey': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                },
                'disabled': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "enableToolBarItem", [ data['data-uuid'], !data['disabled'] ]);
                },
                'icon': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'icon': data['icon'] }]);
                },
                'label': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'label': data['label'] }]);
                }
            },
            'com.phonegap.menu.context.command': {
                'create': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "createTabBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'] ]);
                },
                'delete': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "removeTabBarItem", [ data['data-uuid'] ]);
                },
                'accesskey': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                },
                'disabled': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "enableTabBarItem", [ data['data-uuid'], !data['disabled'] ]);
                },
                'icon': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'icon': data['icon'] } ]);
                },
                'label': function(data) {
                    PhoneGap.exec(null, null, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'title': data['label'] } ]);
                }
            }
        };

        window.Help.execute = function(options) {
            if (typeof options.data === 'undefined') options.data = [];

            var service = this.generateService(options.element);
            var action  = options.action;

            window.Help._execute[service][action](options.element.attribute);
        };
    })();
}
