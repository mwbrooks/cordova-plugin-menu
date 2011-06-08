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
            document.getElementById('phonegap-menu-context').appendChild(element);
            elements[args[0]] = element;
            success();
        },

        'delete': function(success, fail, args) {
            contextElement.parentElement.removeChild(contextElement)
            delete contextElement;
            success();
        },
        
        'icon': function(success, fail, args) {
            elements[args[0]].style.backgroundImage = "url('" + args[1] + "')";
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
})(window);
