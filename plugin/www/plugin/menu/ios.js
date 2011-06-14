if (navigator.userAgent.match(/iphone/i)) {
    (function() {

        window.Help._execute = {
            'com.phonegap.menu.toolbar': {
                'create': function(data) {
                    window.plugins.nativeControls.createToolBar();
                },
                'delete': function(data) {
                    window.plugins.nativeControls.removeToolBar();
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar :: label');
                }
            },
            'com.phonegap.menu.context': {
                'create': function(data) {
                    window.plugins.nativeControls.createTabBar();
                },
                'delete': function(data) {
                    window.plugins.nativeControls.removeTabBar();
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.context :: label');
                }
            },
            'com.phonegap.menu.toolbar.command': {
                'create': function(data) {
                    window.plugins.nativeControls.createToolBarItem(
                        data['data-uuid'],
                        data['label'],
                        data['icon'],
                        !data['disabled'],
                        { 'onSelect': data['action'] }
                    );
                },
                'delete': function(data) {
                    window.plugins.nativeControls.removeToolBarItem(data['data-uuid']);
                },
                'accesskey': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                },
                'action': function(data) {
                    window.plugins.nativeControls.toolBarCallbacks[ data['data-uuid'] ].onSelect = data['action'];
                },
                'disabled': function(data) {
                    window.plugins.nativeControls.enableToolBarItem(data['data-uuid'], !data['disabled']);
                },
                'icon': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: icon');
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: label');
                }
            },
            'com.phonegap.menu.context.command': {
                'create': function(data) {
                    window.plugins.nativeControls.createTabBarItem(
                        data['data-uuid'],
                        data['label'],
                        data['icon'],
                        !data['disabled'],
                        { 'onSelect': data['action'] }
                    );
                },
                'delete': function(data) {
                    window.plugins.nativeControls.removeTabBarItem(data['data-uuid']);
                },
                'accesskey': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                },
                'action': function(data) {
                    window.plugins.nativeControls.tabBarCallbacks[ data['data-uuid'] ].onSelect = data['action'];
                },
                'disabled': function(data) {
                    window.plugins.nativeControls.enableTabBarItem(data['data-uuid'], !data['disabled']);
                },
                'icon': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: icon');
                },
                'label': function(data) {
                    window.plugins.nativeControls.updateTabBarItem(data['data-uuid'], { 'title': data['label'] });
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