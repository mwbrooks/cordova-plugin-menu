//
// BlackBerry-Specific
//

if (navigator.userAgent.match(/blackberry/)) {

    (function() {
        PhoneGap.originalExec = PhoneGap.exec;

        PhoneGap.exec = function(success, fail, service, action, args) {
            if (serviceMap[service]) {
                try {
                    // alert('PhoneGap.exec ' + service + '::' + action);
                    serviceMap[ service ][ action ]( success, fail, args );
                } catch(e) {
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
                    serviceMap['com.phonegap.menu.context']['create'](success, fail, data);
                },
                'delete': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context']['delete'](success, fail, data);
                },
                'label': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context']['label'](success, fail, data);
                }
            },
            'com.phonegap.menu.context': {
                'create': function(success, fail, data) {
                    success(); // No need to create the menu on BlackBerry
                },
                'delete': function(success, fail, data) {
                    blackberry.ui.menu.clearMenuItems();
                    success();
                },
                'label': function(success, fail, data) {
                    success(); // There is no label on a BlackBerry context menu
                }
            },
            'com.phonegap.menu.toolbar.command': {
                'create': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context.command']['create'](success, fail, data);
                },
                'delete': function(success, fail, data ) {
                    serviceMap['com.phonegap.menu.context.command']['delete'](success, fail, data);
                },
                'accesskey': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context.command']['accesskey'](success, fail, data);
                },
                'disabled': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context.command']['disabled'](success, fail, data);
                },
                'icon': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context.command']['icon'](success, fail, data);
                },
                'label': function(success, fail, data) {
                    serviceMap['com.phonegap.menu.context.command']['label'](success, fail, data);
                }
            },
            'com.phonegap.menu.context.command': {
                'create': function(success, fail, data) {
                    var id   = data[0];
                    var item = new blackberry.ui.menu.MenuItem(false, parseInt(id), '', function() {
                        PGMenuElement.actions[id]();
                        // alert('callback');
                    });

                    blackberry.ui.menu.addMenuItem(item);
                    PGMenuElement.items[id] = item;
                    success();
                },
                'delete': function(success, fail, data) {
                    var id   = data[0];
                    var item = PGMenuElement.items[id];

                    blackberry.ui.menu.removeMenuItem(item);
                    PGMenuElement.items[id] = undefined;
                    success();
                },
                'accesskey': function(success, fail, data) {
                    success();
                },
                'disabled': function(success, fail, data) {
                    var id       = data[0];
                    var disabled = data[1];
                    var item     = PGMenuElement.items[id];

                    if (disabled && blackberry.ui.menu.hasMenuItem(item)) {
                        blackberry.ui.menu.removeMenuItem(item);
                    }
                    else if (!disabled && !blackberry.ui.menu.hasMenuItem(item)) {
                        blackberry.ui.menu.addMenuItem(item);
                    }

                    success();
                },
                'icon': function(success, fail, data) {
                    success();
                },
                'label': function(success, fail, data) {
                    var id    = data[0];
                    var label = data[1];
                    PGMenuElement.items[id].caption = label;
                    success();
                }
            }
        };

        // Store the BlackBerry menu items for easy retrieval
        // Cannot rely on blackberry.ui.menu.getMenuItems
        // because disabled items are removed.
        PGMenuElement.items = {};
    })(window);
}
