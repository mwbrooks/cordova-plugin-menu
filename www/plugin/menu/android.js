if (navigator.userAgent.match(/android/i)) {
    (function() {
        window.Help._execute = {
            'com.phonegap.menu.toolbar': {
                'create': function(data) {
                    window.Help._execute['com.phonegap.menu.context']['create'](data);
                },
                'delete': function(data) {
                    window.Help._execute['com.phonegap.menu.context']['delete'](data);
                },
                'label': function(data) {
                    window.Help._execute['com.phonegap.menu.context']['label'](data);
                }
            },
            'com.phonegap.menu.context': {
                'create': function(data) {
                    PhoneGap.exec(
                        function() {},
                        function() {},
                        'appMenu',
                        'setupMenu',
                        []
                    );
                },
                'delete': function(data) {
                    console.log('Unsupported: com.phonegap.menu.context :: delete');
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.context :: label');
                }
            },
            'com.phonegap.menu.toolbar.command': {
                'create': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['create'](data);
                },
                'delete': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['delete'](data);
                },
                'accesskey': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['accesskey'](data);
                },
                'action': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['action'](data);
                },
                'disabled': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['disabled'](data);
                },
                'icon': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['icon'](data);
                },
                'label': function(data) {
                    window.Help._execute['com.phonegap.menu.context.command']['label'](data);
                }
            },
            'com.phonegap.menu.context.command': {
                'create': function(data) {
                    PhoneGap.exec(
                        function() {},
                        function() {},
                        'appMenu',
                        'addItem',
                        [{
                            label:    data['label'],
                            icon:     data['icon'],
                            callback: ''
                        }]
                    );
                },
                'delete': function(data) {
                    PhoneGap.exec(
                        function() {},
                        function() {},
                        'appMenu',
                        'removeItem',
                        [ data['data-uuid'] ]
                    );
                },
                'accesskey': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
                },
                'action': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: action');
                },
                'disabled': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: disabled');
                },
                'icon': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: icon');
                },
                'label': function(data) {
                    console.log('Unsupported: com.phonegap.menu.toolbar.command :: label');
                }
            }
        };
    
        window.Help.execute = function(options) {
            if (typeof options.data === 'undefined') options.data = [];

            var service = this.generateService(options.element);
            var action  = options.action;

            window.Help._execute[service][action](options.element.attribute);
        };
    
        window.addEventListener('load', function() {
            document.addEventListener('deviceready', function() {
                PhoneGap.addConstructor(function() {
                    console.log('Adding the plugin');
                    // PhoneGap.addPlugin('nativeMenu', new NativeMenu());
                    // This causes cancer
                    navigator.app.addService('appMenu', 'com.phonegap.menu.AppMenu');
                });
            }, false);
        }, false);

    })();
}