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
            var fn = function() { PGMenuElement.actions[args[0]](); };
            element.addEventListener(touchType, fn, false);
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
            if (args[1] !== '')
                elements[args[0]].innerHTML = '<span><img src="' + args[1] + '" />';
            success();
        },
        'label': function(success, fail, args) {
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
            var fn = function() { PGMenuElement.actions[args[0]](); };
            element.addEventListener(touchType, fn, false);
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
        },
        'accesskey': function(success, fail, args) {
            success();
        }
    };
})(window);
