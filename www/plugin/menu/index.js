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

    var Help = {
        currentId: 0,
        nextId: function() {
            return ++this.currentId;
        }
    };

    // Interface between DOM Menu Element and PhoneGap Menu

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
                    'pg-created': (element.getAttribute('pg-created') === 'true') || false,
                    'pg-id':      element.getAttribute('pg-id')                   || Help.nextId(),
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
                    'pg-id':      element.getAttribute('pg-id')      || Help.nextId(),
                    'disabled':   element.getAttribute('disabled')   || false,
                    'icon':       element.getAttribute('icon')       || '',
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
