window.menuItems = {};

window.Help._execute = {
    'com.phonegap.menu.toolbar': {
        'create': function(data) {
            alert('toolbar create');
            // PhoneGap.exec(null, null, "NativeControls2", "createToolBar", []);
        },
        'delete': function(data) {
            alert('toolbar delete');
            // PhoneGap.exec(null, null, "NativeControls2", "removeToolBar", []);
        },
        'label': function(data) {
            alert('toolbar label');
            // PhoneGap.exec(null, null, "NativeControls2", "updateToolBar", [ { 'label': data['label'] } ]);
        }
    },
    'com.phonegap.menu.context': {
        'create': function(data) {
            // There is no need to create the menu on BlackBerry
        },
        'delete': function(data) {
            // blackberry.ui.menu.clearMenuItems();
        },
        'label': function(data) {
            // There is no label on a BlackBerry context menu
        }
    },
    'com.phonegap.menu.toolbar.command': {
        'create': function(data) {
            alert('toolbar command create');
            // PhoneGap.exec(null, null, "NativeControls2", "createToolBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'], data['accesskey'] ]);
        },
        'delete': function(data ) {
            alert('toolbar command delete');
            // PhoneGap.exec(null, null, "NativeControls2", "removeToolBarItem", [ data['data-uuid'] ]);
        },
        'accesskey': function(data) {
            alert('toolbar command accesskey');
            // console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
        },
        'disabled': function(data) {
            alert('toolbar command disabled');
            // PhoneGap.exec(null, null, "NativeControls2", "enableToolBarItem", [ data['data-uuid'], !data['disabled'] ]);
        },
        'icon': function(data) {
            alert('toolbar command icon');
            // PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'icon': data['icon'] }]);
        },
        'label': function(data) {
            alert('toolbar command label');
            // PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'label': data['label'] }]);
        }
    },
    'com.phonegap.menu.context.command': {
        'create': function(data) {
            var id = data['data-uuid'];
            alert('create ' + id);
            window.menuItems[id] = new blackberry.ui.menu.MenuItem(false, id, data['label'], data['action']);
            blackberry.ui.menu.addMenuItem(window.menuItems[id]);
        },
        'delete': function(data) {
            // blackberry.ui.menu.removeMenuItem(window.menuItems[data['data-uuid']]);
        },
        'accesskey': function(data) {
            alert('context command accesskey');
            // console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
        },
        'disabled': function(data) {
            alert('context command disabled');
            // PhoneGap.exec(null, null, "NativeControls2", "enableTabBarItem", [ data['data-uuid'], !data['disabled'] ]);
        },
        'icon': function(data) {
            alert('context command icon');
            // PhoneGap.exec(null, null, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'icon': data['icon'] } ]);
        },
        'label': function(data) {
            // var id = data['data-uuid'];
            // window.menuItems[id] = new blackberry.ui.menu.MenuItem(false, id, data['label'], data['action']);
            // blackberry.ui.menu.addMenuItem(window.menuItems[id]);
        }
    }
};

window.Help.execute = function(options) {
    if (typeof options.data === 'undefined') options.data = [];

    var service = this.generateService(options.element);
    var action  = options.action;

    window.Help._execute[service][action](options.element.attribute);
};