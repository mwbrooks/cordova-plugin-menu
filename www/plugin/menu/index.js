// Helpers

function asyncForEach(array, fn, callback) {
    // Convert a NodeList into an array
    if (typeof array.slice === 'undefined') {
        var a = [];
        for (var i = 0, l = array.length; i < l; i++) {
            a.push(array[i]);
        }
        array = a;
    }

    array    = array.slice(0);
    callback = callback || function() {};

    function nextItem() {
        if (array.length > 0) {
            processNextItem();
        } else {
            callback();
        }
    }

    function processNextItem() {
        var item = array.pop();
        fn(item, nextItem);
    }

    nextItem();
};

// Load the menu on startup

document.addEventListener('DOMContentLoaded', function() {
    PGMenuElement.update();
}, false);

// PhoneGap Menu Element

var PGMenuElement = (function() {

    // Interface between DOM Menu Element and PhoneGap Menu

    var Menu = function(element) {
        var element = element;

        var exec = {
            type: function(menu, callback) {
                var attributes = menu.getAttributes();

                if (attributes['pg-created']) {
                    callback();
                    return;
                }

                switch(attributes['type']) {
                    case 'toolbar':
                        // PhoneGap.exec
                        menu.setAttributes({ 'pg-created': true });
                        callback();
                        break;
                    case 'context':
                        // PhoneGap.exec
                        menu.setAttributes({ 'pg-created': true });
                        callback();
                        break;
                    default:
                        callback();
                        break;
                }
            },
            label: function(menu, callback) {
                var attributes = menu.getAttributes();

                if (attributes['label'] !== attributes['pg-label']) {
                    // PhoneGap.exec
                    menu.setAttributes({ 'pg-label': attributes['label'] });
                    callback();
                }
                else {
                    callback();
                }
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
                exec.type(this, callback);
            },
            update: function(callback) {
                var attributes = this.getAttributes();

                // cannot do anything until PhoneGap has created the menu
                if (!this.isCreated()) { callback(); return; }

                exec.label(this, function() {
                    console.log('updated: ', element);

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
                    'pg-created': element.getAttribute('pg-created') || false,
                    'type':       element.getAttribute('type')       || '',
                    'label':      element.getAttribute('label')      || ''
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
            }
        };
    };

    var Command = function(element) {
        var element = element;

        var exec = {
            accesskey: function(command, callback) {
                callback();
            },
            action: function(command, callback) {
                callback();
            },
            create: function(command, callback) {
                callback();
            },
            disabled: function(command, callback) {
                callback();
            },
            icon: function(command, callback) {
                callback();
            },
            label: function(command, callback) {
                var attributes = command.getAttributes();

                if (attributes['label'] !== attributes['pg-label']) {
                    // PhoneGap.exec
                    command.setAttributes({ 'pg-label': attributes['label'] });
                    callback();
                }
                else {
                    callback();
                }
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
                var attributes = this.getAttributes();

                // cannot do anything until PhoneGap has created the command
                if (!this.isCreated()) { callback(); return; }

                exec.label(this, function() {
                    exec.icon(this, function() {
                        exec.disabled(this, function() {
                            exec.action(this, function() {
                                exec.accesskey(this, function() {
                                    console.log('updated: ', element);
                                    callback();
                                });
                            });
                        });
                    });
                });
            },
            getAttributes: function() {
                return {
                    'pg-created': element.getAttribute('pg-created') || false,
                    'label':      element.getAttribute('label')      || ''
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
            }
        };
    };

    return {
        //
        // Initializes new menu elements and updates existing menus.
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
        }
    };

})();

// var something = (function() {

//     var menus = [];



//     // A Menu Element
//     //
//     var Menu = function(element) {
//         function constructor() {
//             var type    = getType(element);
//             var service = 'com.phonegap.menu.' + type;

//             PhoneGap.exec(createCommands, createHTMLMenu, service, 'create', []);
//         }

//         function getType(element) {
//             return (element.getAttribute('type') || 'toolbar');
//         }

//         constructor();

//         var createHTMLMenu = function() {
//             switch(type) {
//                 case 'toolbar':
//                     window.toolbar.create(initializeCommands, initializeCommands, []);
//                     break;
//                 case 'context':
//                     window.context.create(initializeCommands, initializeCommands, []);
//                     break;
//                 default:
//                     console.log('Ignored: menu.init with type "' + type + '"');
//             }
//         };

//         var createCommands = function() {
//             var commands = element.getElementsByTagName('command');

//             forEach(commands, function(element) {
//                 commands.pushcommand.init(element, function(){});
//             });

//             callback();
//         };
//     };
// })();

// // Utility: Loop over each element
// //
// function forEach(items, callback) {
//     for (var i = 0, l = items.length; i < l; i++) {
//         callback(items[i]);
//     }
// }

// var Help = {
//     currentId: 0,
//     nextId: function() {
//         return ++this.currentId;
//     }
// };


// var command = (function() {
//     function getAttributes(element) {
//         return {
//             id:       element.getAttribute('pg-id'),
//             icon:     element.getAttribute('icon'),
//             type:     element.parentElement.getAttribute('type'),
//             label:    element.getAttribute('label'),
//             disabled: element.getAttribute('disabled')
//         };
//     }

//     function getObject(type) {
//         switch(type) {
//             case 'toolbar':
//                 return window.toolbarCommand;
//             case 'context':
//                 return window.contextCommand;
//             default:
//                 return undefined;
//         }
//     }

//     function label(element, callback) {
//         var attr = getAttributes(element);
//         getObject(attr.type).label(callback, callback, [ attr.id, attr.label ]);
//         callback();
//     }

//     function icon(element, callback) {
//         var attr = getAttributes(element);
//         getObject(attr.type).icon(callback, callback, [ attr.id, attr.icon ]);
//         callback();
//     }

//     function disabled(element, callback) {
//         var attr = getAttributes(element);
//         getObject(attr.type).disabled(callback, callback, [ attr.id, attr.disabled ]);
//         callback();
//     }

//     function action(element, callback) {
//         var attr = getAttributes(element);
//         command.actions[ attr.id ] = attr.action;
//         callback();
//     }

//     return {
//         init: function(element, callback) {
//             var attr = getAttributes(element);
//             var service = 'com.phonegap.menu.command.' + attr.type;
//             var id = Help.nextId();
//             var createHTML = function() {
//                 getObject(attr.type).create(attributes, attributes, [ id ]);
//             };
//             var attributes = function() {
//                 label(element, function() {
//                     icon(element, function() {
//                         disabled(element, function() {
//                             action(element, callback);
//                         });
//                     });
//                 });
//             };
//             element.setAttribute('pg-id', id);
//             PhoneGap.exec(attributes, createHTML, service, 'create', [ id ]);
//         },
//         actions: []
//     };
// })();


// (function(window) {
// 
//     window.Help = {
//         menuPosition: 'fixed',
//         nextUUID: 0,
//         generateUUID: function() {
//             return ++this.nextUUID;
//         },
//         generateService: function(element) {
//             var service = ['com.phonegap.menu'];
// 
//             if (element.parentElement) service.push(element.parentElement.attribute.type);
//             
//             service.push(element.attribute['type']);
//             
//             return service.join('.');
//         },
//         execute: function(options) {
//             if (typeof options.data === 'undefined') options.data = [];
//             
//             var service = this.generateService(options.element);
//             var id      = options.element.attribute['data-uuid'];
//             
//             options.data.unshift(id);
//             
//             PhoneGap.exec(
//                 options.callback,
//                 options.callback,
//                 service,
//                 options.action,
//                 options.data
//             );
//         },
//         process: function(queue) {
//             (function next() {
//                 if (queue.length <= 0) return;
//                 queue.shift()(next);
//             })();
//         },
//         exists: function(element) {
//             return (typeof element.attribute['data-uuid'] !== 'undefined');
//         }
//     };
//     
//     /**
//      * HTMLMenuElement
//      * ===============
//      *
//      * Creates a new HTML Menu Element with a unique ID.
//      *
//      * The unique ID is stored as the attribute 'data-uuid'
//      *
//      * Since the type of menu is not yet defined, there is nothing to render.
//      */
//     window.HTMLMenuElement = function() {
//         var self = this;
//         
//         self.children = [];
//         self.attribute = {
//             'data-uuid': undefined,
//             'label':     '',
//             'type':      ''
//         };
//         
//         self.fn = {
//             'commands': function(callback) {
//                 // for each child commmand
//                 //   execute update
//                 // then
//                 //   fire callback
//             },
//             'create': function(callback) {
//                 self.attribute['data-uuid'] = Help.generateUUID();
//                 
//                 Help.execute({
//                     action:   'create',
//                     data:     [ self.attribute.type ],
//                     element:  self,
//                     callback: callback
//                 });
//             },
//             'delete': function(callback) {
//                 if (typeof self.attribute['data-uuid'] === 'undefined') {
//                     callback();
//                     return;
//                 }
//                 
//                 Help.execute({
//                     action:   'delete',
//                     element:  self,
//                     callback: function() {
//                         self.attribute['data-uuid'] = undefined;
//                         callback();
//                     }
//                 });
//             },
//             'label': function(callback) {
//                 Help.execute({
//                     action:   'label',
//                     element:  self,
//                     data:     [ self.attribute.label ],
//                     callback: callback
//                 });
//             }
//         };
//         
//         self.update = {
//             'type': function() {
//                 Help.process([
//                     self.fn['delete'],
//                     self.fn['create'],
//                     self.fn['label'],
//                     self.fn['commands']
//                 ]);
//             },
//             'label': function() {
//                 Help.process([
//                     self.fn['label']
//                 ]);
//             }
//         };
//     };
// 
//     /**
//      * getAttribute
//      * ------------
//      *
//      * Return an attribute with the given name.
//      *
//      *     menu.getAttribute('data-uuid');
//      */
//     HTMLMenuElement.prototype.getAttribute = function(name) {
//         return this.attribute[name];
//     };
// 
//     /**
//      * hasAttribute
//      * ------------
//      *
//      * Return a boolean for whether the attribute exists.
//      *
//      * An attribute exists if it has a value other than undefined.
//      *
//      *     menu.hasAttribute('data-uuid'); // true
//      */
//     HTMLMenuElement.prototype.hasAttribute = function(name) {
//         return (typeof this.attribute[name] !== 'undefined');
//     };
// 
//     /**
//      * setAttribute
//      * ------------
//      *
//      * Sets the element's attribute and invokes any actions that
//      * are consequences of the attribute.
//      *
//      * ### Type
//      *
//      *     menu.setAttribute('type', 'toolbar'); // create a toolbar
//      *     menu.setAttribute('type', 'context'); // create a context menu
//      *
//      * ### Label
//      *
//      *     menu.setAttribute('label', 'My Title'); // give menu a title
//      */
//     HTMLMenuElement.prototype.setAttribute = function(name, value) {
//         this.attribute[name] = value;
//         this.update[name]();
//     };
// 
//     HTMLMenuElement.prototype.appendChild = function(element) {
//         // add command to list
//         // phonegap.exec com.phonegap.menu.[toolbar|context].command create
//         this.children.push(element);
//         element.parentElement = this;
//         element.setAttribute('data-init', true);
//     };
// 
//     HTMLMenuElement.prototype.removeChild = function(element) {
//         var self = this;
//         // remove command from list
//         this.children.forEach(function(value, index) {
//             if (value === element) { self.children.splice(index, 1); }
//         });
//         
//         // element.parentElement is removed by setAttribute('data-init', false);
//         element.setAttribute('data-init', false);
//     };
// 
//     //
//     //
//     //
//     
//     /**
//      * HTMLCommandElement
//      * ===============
//      *
//      * Creates a new HTML Command Element with a unique ID.
//      *
//      * The unique ID is stored as the attribute 'data-uuid'
//      */
//     window.HTMLCommandElement = function() {
//         var self = this;
//         
//         self.parentElement = undefined;
//         self.attribute = {
//             'accesskey': '',
//             'action':    function(){},
//             'data-uuid': undefined,
//             'disabled':  false,
//             'icon':      '',
//             'label':     '',
//             'type':      'command'
//         };
//         
//         self.fn = {
//             'create': function(callback) {
//                 self.attribute['data-uuid'] = Help.generateUUID();
// 
//                 window.HTMLCommandElement.elements[self.attribute['data-uuid']] = self;
//                 
//                 Help.execute({
//                     action:   'create',
//                     element:  self,
//                     callback: callback
//                 });
//             },
//             'delete': function(callback) {
//                 if (typeof self.attribute['data-uuid'] === 'undefined') {
//                     callback();
//                     return;
//                 }
//                 
//                 Help.execute({
//                     action:   'delete',
//                     element:  self,
//                     callback: function() {
//                         self.attribute['data-uuid'] = undefined;
//                         self.parentElement = undefined;
//                         callback();
//                     }
//                 });
//             },
//             'accesskey': function(callback) {
//                 // if backbutton
//                 //   if supports backbutton (Android or BlackBerry)
//                 //     bind success to back
//                 //
//                 // if search
//                 //   if supports search (Android)
//                 //     bind success to search
//                 if (!Help.exists(self)) { callback(); return; }
// 
//                 Help.execute({
//                     action:   'accesskey',
//                     element:  self,
//                     data:     [ self.attribute.accesskey ],
//                     callback: callback
//                 });
//             },
//             'disabled': function(callback) {
//                 if (!Help.exists(self)) { callback(); return; }
// 
//                 Help.execute({
//                     action:   'disabled',
//                     element:  self,
//                     data:     [ self.attribute.disabled ],
//                     callback: callback
//                 });
//             },
//             'icon': function(callback) {
//                 if (!Help.exists(self)) { callback(); return; }
// 
//                 Help.execute({
//                     action:   'icon',
//                     element:  self,
//                     data:     [ self.attribute.icon ],
//                     callback: callback
//                 });
//             },
//             'label': function(callback) {
//                 if (!Help.exists(self)) { callback(); return; }
// 
//                 Help.execute({
//                     action:   'label',
//                     element:  self,
//                     data:     [ self.attribute.label ],
//                     callback: callback
//                 });
//             }
//         };
//         
//         self.update = {
//             'accesskey': function() {
//                 Help.process([ self.fn['accesskey'] ]);
//             },
//             'action': function() {
//                 // Nothing needs to be done because action is called directly from
//                 // the attribute
//             },
//             'data-init': function() {
//                 if (self.attribute['data-init']) {
//                     Help.process([
//                         self.fn['delete'],
//                         self.fn['create'],
//                         self.fn['label'],
//                         self.fn['icon'],
//                         self.fn['disabled'],
//                         self.fn['action'],
//                         self.fn['accesskey']
//                     ]);
//                 }
//                 else
//                     Help.process([ self.fn['delete'] ]);
//             },
//             'disabled': function() {
//                 Help.process([ self.fn['disabled'] ]);
//             },
//             'icon': function() {
//                 Help.process([ self.fn['icon'] ]);
//             },
//             'label': function() {
//                 Help.process([ self.fn['label'] ]);
//             }
//         };
//     };
// 
//     HTMLCommandElement.elements = {};
// 
//     /**
//      * getAttribute
//      * ------------
//      *
//      * Return an attribute with the given name.
//      *
//      *     menu.getAttribute('data-uuid');
//      */
//     HTMLCommandElement.prototype.getAttribute = function(name) {
//         return this.attribute[name];
//     };
// 
//     /**
//      * hasAttribute
//      * ------------
//      *
//      * Return a boolean for whether the attribute exists.
//      *
//      * An attribute exists if it has a value other than undefined.
//      *
//      *     menu.hasAttribute('data-uuid'); // true
//      */
//     HTMLCommandElement.prototype.hasAttribute = function(name) {
//         return (typeof this.attribute[name] !== 'undefined');
//     };
// 
//     /**
//      * setAttribute
//      * ------------
//      *
//      * Sets the element's attribute and invokes any actions that
//      * are consequences of the attribute.
//      *
//      * ### Type
//      *
//      *     menu.setAttribute('type', 'toolbar'); // create a toolbar
//      *     menu.setAttribute('type', 'context'); // create a context menu
//      *
//      * ### Label
//      *
//      *     menu.setAttribute('label', 'My Title'); // give menu a title
//      */
//     HTMLCommandElement.prototype.setAttribute = function(name, value) {
//         this.attribute[name] = value;
//         this.update[name]();
//     };
//     
//     //
//     //
//     //
//     
//     // backup original `document.createElement`
//     var _createElement = document.createElement;
// 
//     // override `document.createElement` to support menu
//     document.createElement = function() {
//         if (arguments[0] === 'menu')
//             return new HTMLMenuElement();
//         else if (arguments[0] === 'command')
//             return new HTMLCommandElement();
//         else
//             return _createElement.apply(this, arguments);
//     };
// 
// })(window);
// 
// //
// // Android-Specific
// //
// 
// if (navigator.userAgent.match(/android/i) && typeof window.PhoneGap !== 'undefined') {
//     PhoneGap.originalExec = PhoneGap.exec;
// 
//     PhoneGap.exec = function(success, fail, service, action, args) {
//         if (service === 'com.phonegap.menu.toolbar') {
//             window.toolbar[action](success, fail, args);
//         }
//         else if (service === 'com.phonegap.menu.toolbar.command') {
//             try {
//             window.toolbarCommand[action](success, fail, args);
//             } catch(e) { console.log(e); }
//         }
//         else {
//             PhoneGap.originalExec(success, fail, service, action, args);
//         }
//     };
//     
//     PhoneGap.addConstructor(function() {
//         navigator.app.addService('com.phonegap.menu.context',         'com.phonegap.menu.AppMenu');
//         navigator.app.addService('com.phonegap.menu.context.command', 'com.phonegap.menu.AppMenuItem');
//         
//         var version = navigator.device.version.split('.');
//         version.forEach(function(value, index) {
//             version[index] = parseInt(value);
//         });
//         
//         Help.menuPosition = (version[0] > 2 || (version[0] >= 2 && version[1] >= 2)) ? 'fixed' : 'absolute';
//         
//         var toolbar = document.getElementById('phonegap-menu-toolbar');
//         if (toolbar) {
//             toolbar.style.position = Help.menuPosition;
//         }
//     });
// }
// 
// //
// // iOS-Specific
// //
// 
// if (navigator.userAgent.match(/iphone/i) && typeof window.PhoneGap !== 'undefined') {
//     (function() {
//         window.Help._execute = {
//             'com.phonegap.menu.toolbar': {
//                 'create': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "createToolBar", []);
//                 },
//                 'delete': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "removeToolBar", []);
//                 },
//                 'label': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "updateToolBar", [ { 'label': data['label'] } ]);
//                 }
//             },
//             'com.phonegap.menu.context': {
//                 'create': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "createTabBar", []);
//                 },
//                 'delete': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "removeTabBar", []);
//                 },
//                 'label': function(data) {
//                     console.log('Unsupported: com.phonegap.menu.context :: label');
//                 }
//             },
//             'com.phonegap.menu.toolbar.command': {
//                 'create': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "createToolBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'], data['accesskey'] ]);
//                 },
//                 'delete': function(data ) {
//                     PhoneGap.exec(null, null, "NativeControls2", "removeToolBarItem", [ data['data-uuid'] ]);
//                 },
//                 'accesskey': function(data) {
//                     console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
//                 },
//                 'disabled': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "enableToolBarItem", [ data['data-uuid'], !data['disabled'] ]);
//                 },
//                 'icon': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'icon': data['icon'] }]);
//                 },
//                 'label': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "updateToolBarItem", [data['data-uuid'], { 'label': data['label'] }]);
//                 }
//             },
//             'com.phonegap.menu.context.command': {
//                 'create': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "createTabBarItem", [ data['data-uuid'], data['label'], data['icon'], !data['disabled'], data['data-uuid'] ]);
//                 },
//                 'delete': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "removeTabBarItem", [ data['data-uuid'] ]);
//                 },
//                 'accesskey': function(data) {
//                     console.log('Unsupported: com.phonegap.menu.toolbar.command :: accesskey');
//                 },
//                 'disabled': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "enableTabBarItem", [ data['data-uuid'], !data['disabled'] ]);
//                 },
//                 'icon': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'icon': data['icon'] } ]);
//                 },
//                 'label': function(data) {
//                     PhoneGap.exec(null, null, "NativeControls2", "updateTabBarItem", [ data['data-uuid'], { 'title': data['label'] } ]);
//                 }
//             }
//         };
// 
//         window.Help.execute = function(options) {
//             if (typeof options.data === 'undefined') options.data = [];
// 
//             var service = this.generateService(options.element);
//             var action  = options.action;
// 
//             window.Help._execute[service][action](options.element.attribute);
//         };
//     })();
// }

//
// HTML Menu Implementation
//

(function(window) {
    var elements = {};
    var htmlElement;
    var contextElement;
    var touchType = 'click';

    var Help = {
        menuPosition: 'fixed'
    };

    try {
        document.createEvent('TouchEvent');
        touchType = 'touchend';
    }
    catch(e) {
    }
    
    
    window.toolbar = {
        'create': function(success, fail, args) {
            if (document.getElementById('phonegap-menu-toolbar')) {
                success();
                return;
            }

            htmlElement = document.createElement('div');
            htmlElement.setAttribute('id', 'phonegap-menu-toolbar');
            htmlElement.setAttribute('style', 'position:' + Help.menuPosition + ';');
            document.body.appendChild(htmlElement);

            var labelElement = document.createElement('div');
            labelElement.setAttribute('id', 'phonegap-menu-toolbar-label');
            htmlElement.appendChild(labelElement);

            var listElement = document.createElement('ul');
            listElement.setAttribute('id', 'phonegap-menu-toolbar-list');
            htmlElement.appendChild(listElement);

            document.body.style.marginTop = '32px';
            
            success();
        },

        'delete': function(success, fail, args) {
            htmlElement.parentElement.removeChild(htmlElement)
            delete htmlElement;
            document.body.style.marginTop = '';
            success();
        },
        
        'label': function(success, fail, args) {
            try {
                document.getElementById('phonegap-menu-toolbar-label').innerHTML = args[1];
                success();
            }
            catch(e) {
                fail(e);
            }
        }
    };
    
    window.toolbarCommand = {
        'create': function(success, fail, args) {
            var element = document.createElement('li');
            element.setAttribute('class', 'command');
            // element.addEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action, false);
            document.getElementById('phonegap-menu-toolbar-list').appendChild(element);
            elements[args[0]] = element;
            success();
        },
        'delete': function(success, fail, args) {
            contextElement.parentElement.removeChild(contextElement)
            delete contextElement;
            success();
        },
        'accesskey': function(success, fail, args) {
            var element = elements[args[0]];
            var classes = element.getAttribute('class').split(' ');

            switch(args[1]) {
                case 'back':
                    classes.push('accesskey-back');
                    break;
                default:
                    classes.forEach(function(v, i) { if (v === 'accesskey-back') classes.splice(i, 1); });
                    break;
            }

            element.setAttribute('class', classes.join(' '));

            success();
        },
        'disabled': function(success, fail, args) {
            var element = elements[args[0]];
            var classes = element.getAttribute('class').split(' ');
            
            if (args[1]) {
                classes.push('disabled');
                element.removeEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action);
            }
            else {
                classes.forEach(function(v, i) { if (v === 'disabled') classes.splice(i, 1); });
                // element.addEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action, false);
            }

            element.setAttribute('class', classes.join(' '));

            success();
        },
        'icon': function(success, fail, args) {
            if (args[1] !== '')
                elements[args[0]].innerHTML = '<span><img src="' + args[1] + '" />';
            success();
        },
        'label': function(success, fail, args) {
            console.log(elements);
            elements[args[0]].innerHTML = '<span>' + args[1] + '</span>';
            success();
        }
    };

    window.context = {
        'create': function(success, fail, args) {
            if (document.getElementById('phonegap-menu-context')) {
                success();
                return;
            }

            contextElement = document.createElement('div');
            contextElement.setAttribute('id', 'phonegap-menu-context');
            contextElement.setAttribute('style', 'position:' + Help.menuPosition + ';');
            document.body.appendChild(contextElement);
            document.body.style.marginBottom = '42px';
            success();
        },

        'delete': function(success, fail, args) {
            contextElement.parentElement.removeChild(contextElement)
            delete contextElement;
            document.body.style.marginBottom = '';
            success();
        },
        
        'label': function(success, fail, args) {
            success();
        }
    };
    
    window.contextCommand = {
        'create': function(success, fail, args) {
            var element = document.createElement('div');
            element.setAttribute('class', 'command');
            // element.addEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action, false);
            document.getElementById('phonegap-menu-context').appendChild(element);
            elements[args[0]] = element;
            success();
        },
        'delete': function(success, fail, args) {
            contextElement.parentElement.removeChild(contextElement)
            delete contextElement;
            success();
        },
        'disabled': function(success, fail, args) {
            var element = elements[args[0]];
            var classes = element.getAttribute('class').split(' ');
            
            if (args[1]) {
                classes.push('disabled');
                // element.removeEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action);
            }
            else {
                classes.forEach(function(v, i) { if (v === 'disabled') classes.splice(i, 1); });
                // element.addEventListener(touchType, window.HTMLCommandElement.elements[args[0]].attribute.action, false);
            }

            element.setAttribute('class', classes.join(' '));

            success();
        },
        'icon': function(success, fail, args) {
            elements[args[0]].style.backgroundImage = "url('" + args[1] + "')";
            success();
        },
        'label': function(success, fail, args) {
            elements[args[0]].innerHTML = '<span>' + args[1] + '</span>';
            success();
        }
    };
})(window);

(function(window) {
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    if ( !Array.prototype.forEach ) {

      Array.prototype.forEach = function( callbackfn, thisArg ) {

        var T,
          O = Object(this),
          len = O.length >>> 0,
          k = 0;

        // If no callback function or if callback is not a callable function
        if ( !callbackfn || !callbackfn.call ) {
          throw new TypeError();
        }

        // If the optional thisArg context param was provided,
        // Set as this context 
        if ( thisArg ) {
          T = thisArg;
        }

        while( k < len ) {

          // Store property key string object reference
          var Pk = String( k ),
            // Determine if property key is present in this object context
            kPresent = O.hasOwnProperty( Pk ),
            kValue;

          if ( kPresent ) {
            // Dereference and store the value of this Property key
            kValue = O[ Pk ];

            // Invoke the callback function with call, passing arguments:
            // context, property value, property key, thisArg object context
            callbackfn.call( T, kValue, k, O );
          }

          k++;
        }
      };
    }
})(window);
