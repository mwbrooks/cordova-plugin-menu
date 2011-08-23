//
// Generate Menu
// =============
// On deviceready generate the menus.
//

document.addEventListener('deviceready', function() {
    PGMenuElement.update();
}, false);

//
// PhoneGap Menu Element
// =====================
//
// The PhoneGap Menu plugin is a generalized menu interface
// that creates a native Android, iOS, and BlackBerry menu.
// The menu implementation is based on the
// [W3C HTMLMenuElement & HTMLCommandElement Specification]
// (http://www.w3.org/TR/html5/interactive-elements.html).
//

var PGMenuElement = (function() {

    // Manage and generate unique IDs
    // for each menu or command element.
    var Id = {
        current: 0,
        next: function() {
            return ++this.current;
        }
    };

    //
    // A Menu Object
    // -------------
    //
    // Interface between HTMLMenuElement and native Menu instance.
    //
    var Menu = function(element) {
        var element = element;

        var exec = {
            create: function(menu, callback) {
                var attributes = menu.getAttributes();

                if (attributes['pg-created']) {
                    callback();
                    return;
                }

                PhoneGap.exec(
                    function() {
                        menu.setAttributes({ 'pg-created': true });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    menu.getService(),
                    'create',
                    [attributes['pg-id'], attributes['type']]
                );
            },
            label: function(menu, callback) {
                var attributes = menu.getAttributes();

                if (attributes['label'] === attributes['pg-label']) {
                    callback();
                    return;
                }

                PhoneGap.exec(
                    function() {
                        menu.setAttributes({ 'pg-label': attributes['label'] });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    menu.getService(),
                    'label',
                    [attributes['pg-id'], attributes['label']]
                );
            }
        };

        return {
            create: function(callback) {
                var attributes = this.getAttributes();

                // check if PhoneGap has already created the menu
                if (this.isCreated()) { callback(); return; }

                // save the default attributes to the menu element
                this.setAttributes(attributes);

                // try to create the menu
                exec.create(this, callback);
            },
            update: function(callback) {
                var attributes = this.getAttributes();

                // cannot do anything until PhoneGap has created the menu
                if (!this.isCreated()) { callback(); return; }

                exec.label(this, function() {
                    var elements = element.getElementsByTagName('command');

                    asyncForEach(elements, function(element, callback) {
                        var command = new Command(element);

                        command.create(function() {
                            command.update(function() {
                                callback();
                            });
                        });
                    }, callback);
                });
            },
            getAttributes: function() {
                return {
                    'pg-created': (element.getAttribute('pg-created') === 'true') || false,
                    'pg-id':      element.getAttribute('pg-id')                   || Id.next(),
                    'type':       element.getAttribute('type')                    || '',
                    'label':      element.getAttribute('label')                   || ''
                };
            },
            setAttributes: function(attributes) {
                for(var key in attributes) {
                    element.setAttribute(key, attributes[key]);
                }
            },
            isCreated: function() {
                var attributes = this.getAttributes(element);

                return !!(attributes['pg-created']);
            },
            getService: function() {
                var type = element.getAttribute('type');
                return 'com.phonegap.menu.' + type;
            }
        };
    };

    //
    // A Command Object
    // ----------------
    //
    // Interface between HTMLCommandElement and native Menu instance.
    //
    var Command = function(element) {
        var element = element;

        var exec = {
            accesskey: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['accesskey'] === attributes['pg-accesskey']) {
                    callback();
                }

                PhoneGap.exec(
                    function() {
                        command.setAttributes({ 'pg-accesskey': attributes['accesskey'] });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    command.getService(),
                    'accesskey',
                    [attributes['pg-id'], attributes['accesskey']]
                );
            },
            action: function(command, callback) {
                var attributes = command.getAttributes();

                var action = attributes['action'];
                var fn     = action;

                if (typeof fn === 'string') {
                    fn = function() { eval.call(window, action); };
                }

                PGMenuElement.actions[attributes['pg-id']] = fn;

                callback();
            },
            create: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['pg-created']) {
                    callback();
                    return;
                }

                PhoneGap.exec(
                    function() {
                        command.setAttributes({ 'pg-created': true });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    command.getService(),
                    'create',
                    [attributes['pg-id']]
                );
            },
            disabled: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['disabled'] === attributes['pg-disabled']) {
                    callback();
                }

                PhoneGap.exec(
                    function() {
                        command.setAttributes({ 'pg-disabled': attributes['disabled'] });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    command.getService(),
                    'disabled',
                    [attributes['pg-id'], attributes['disabled']]
                );
            },
            icon: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['icon'] === attributes['pg-icon']) {
                    callback();
                }

                PhoneGap.exec(
                    function() {
                        command.setAttributes({ 'pg-icon': attributes['icon'] });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    command.getService(),
                    'icon',
                    [attributes['pg-id'], attributes['icon']]
                );
            },
            label: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['label'] === attributes['pg-label']) {
                    callback();
                }

                PhoneGap.exec(
                    function() {
                        command.setAttributes({ 'pg-label': attributes['label'] });
                        callback();
                    },
                    function() {
                        callback();
                    },
                    command.getService(),
                    'label',
                    [attributes['pg-id'], attributes['label']]
                );
            }
        };

        return {
            create: function(callback) {
                var attributes = this.getAttributes();

                // check if PhoneGap has already created the command
                if (this.isCreated()) { callback(); return; }

                // save the default attributes to the command element
                this.setAttributes(attributes);

                exec.create(this, callback);
            },
            update: function(callback) {
                var self       = this;
                var attributes = self.getAttributes();

                // cannot do anything until PhoneGap has created the command
                if (!self.isCreated()) { callback(); return; }

                exec.label(self, function() {
                    exec.icon(self, function() {
                        exec.disabled(self, function() {
                            exec.action(self, function() {
                                exec.accesskey(self, function() {
                                    callback();
                                });
                            });
                        });
                    });
                });
            },
            getAttributes: function() {
                return {
                    'pg-created': (element.getAttribute('pg-created') === 'true') || false,
                    'pg-id':      element.getAttribute('pg-id')                   || Id.next(),
                    'accesskey':  element.getAttribute('accesskey')               || '',
                    'action':     element.getAttribute('action')                  || function(){},
                    'disabled':   (element.getAttribute('disabled') === 'true')   || false,
                    'icon':       element.getAttribute('icon')                    || '',
                    'label':      element.getAttribute('label')                   || ''
                };
            },
            setAttributes: function(attributes) {
                for(var key in attributes) {
                    element.setAttribute(key, attributes[key]);
                }
            },
            isCreated: function() {
                var attributes = this.getAttributes(element);

                return !!(attributes['pg-created']);
            },
            getService: function() {
                var parent  = element;
                var tagName = '';

                // Android and iOS WebKit "bug"
                //   For non-standard elements, such as <menu> and <command<
                //   element.parentElement returns element instead of parentElement
                //   element.parentElement.parentElement returns element.parentElement
                do {
                    parent = parent.parentElement;
                    tagName = parent.tagName.toLowerCase();
                } while (tagName !== 'menu' && tagName !== 'body');

                var type = parent.getAttribute('type');
                return 'com.phonegap.menu.' + type + '.command';
            }
        };
    };

    return {
        //
        // Update Menu
        // -----------
        //
        // Brute force way to initialize new menu elements
        // and updates existing menus.
        //
        // Each menu will inturn manage its <command> elements.
        //
        update: function() {
            var elements = document.getElementsByTagName('menu');

            asyncForEach(elements, function(element, callback) {
                var menu = new Menu(element);

                menu.create(function() {
                    menu.update(function() {
                        callback();
                    });
                });
            });
        },

        //
        // Command Action Callbacks
        // ------------------------
        //
        // The callbacks are publically accessible
        // so that the native side of PhoneGap can trigger
        // a callback. Each action is referenced by the elements
        // ID.
        //
        // To fire an element's action:
        //
        //     PGMenuElement.actions[12]();
        //
        actions: {
        }
    };

})();
