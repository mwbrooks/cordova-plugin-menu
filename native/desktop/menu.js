(function(window) {
    var elements = {};
    var htmlElement;
    var contextElement;
    
    var toolbar = {
        'create': function(success, fail, args) {
            if (args[1] === 'toolbar') {
                if (document.getElementById('phonegap-menu-toolbar')) {
                    success();
                    return;
                }

                htmlElement = document.createElement('div');
                htmlElement.setAttribute('id', 'phonegap-menu-toolbar');
                document.body.appendChild(htmlElement);
                success();
            }
            else {
                fail();
            }
        },

        'delete': function(success, fail, args) {
            htmlElement.parentElement.removeChild(htmlElement)
            delete htmlElement;
            success();
        },
        
        'label': function(success, fail, args) {
            try {
                htmlElement.innerText = args[1];
                success();
            }
            catch(e) {
                fail(e);
            }
        }
    };
    
    var toolbarCommand = {
        'create': function(success, fail, args) {
            var element = document.createElement('div');
            element.setAttribute('class', 'command');
            element.addEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action, false);
            document.getElementById('phonegap-menu-toolbar').appendChild(element);
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
                element.removeEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action);
            }
            else {
                classes.forEach(function(v, i) { if (v === 'disabled') classes.splice(i, 1); });
                element.addEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action, false);
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

    var context = {
        'create': function(success, fail, args) {
            if (args[1] === 'context') {
                if (document.getElementById('phonegap-menu-context')) {
                    success();
                    return;
                }

                contextElement = document.createElement('div');
                contextElement.setAttribute('id', 'phonegap-menu-context');
                document.body.appendChild(contextElement);
                success();
            }
            else {
                fail();
            }
        },

        'delete': function(success, fail, args) {
            contextElement.parentElement.removeChild(contextElement)
            delete contextElement;
            success();
        },
        
        'label': function(success, fail, args) {
            success();
        }
    };
    
    var contextCommand = {
        'create': function(success, fail, args) {
            var element = document.createElement('div');
            element.setAttribute('class', 'command');
            element.addEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action, false);
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
                element.removeEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action);
            }
            else {
                classes.forEach(function(v, i) { if (v === 'disabled') classes.splice(i, 1); });
                element.addEventListener('click', window.HTMLCommandElement.elements[args[0]].attribute.action, false);
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

    //
    // Stub PhoneGap or backup PhoneGap.exec
    //

    if (typeof window.PhoneGap === 'undefined')
        window.PhoneGap = {};

    var phonegapExec = window.PhoneGap.exec || function() {};

    //
    // Define PhoneGap.exec for HTMLMenuElement
    //

    window.PhoneGap.exec = function(success, fail, service, action, args) {
        try {
            switch(service) {
                case 'com.phonegap.menu.toolbar':
                    toolbar[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.toolbar.command':
                    toolbarCommand[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.context':
                    context[action](success, fail, args);
                    break;
                case 'com.phonegap.menu.context.command':
                    contextCommand[action](success, fail, args);
                    break;
                default:
                    console.log('service consumed: ' + service + '::' + action);
                    phonegapExec(success, fail, service, action, args);
                    break;
            }
        }
        catch(e) {
            console.log('Unknown action for ' + service + ':');
            console.log('  => uri:    ' + service);
            console.log('  => action: ' + action);
            console.log('  => args:   ' + args);            
        }
    };

    window.addEventListener('load', function() {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('deviceready', true, false);

        setTimeout(function() {
            document.dispatchEvent(event);
        }, 150);
    }, false);

})(window);
