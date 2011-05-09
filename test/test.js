localStorage.clear();
sessionStorage.clear();

var menu = null;

module('HTMLMenuElement', {
    setup: function() {
        menu = document.createElement('menu');
        // menu.setAttribute('type',  'toolbar');
        // menu.setAttribute('label', 'HTMLMenuElement Demo');
    },
    teardown: function() {
        var element = document.getElementById('phonegap-menu-toolbar');
        if (element) document.body.removeChild(element);
    }
});

test('should not render toolbar with no type', 1, function() {
    if (!document.getElementById('phonegap-menu-toolbar'))
        ok(true);
});

test('should not render toolbar with unknown type', 1, function() {
    menu.setAttribute('type', 'michael');

    if (!document.getElementById('phonegap-menu-toolbar'))
        ok(true);
});

test('should render toolbar', 1, function() {
    menu.setAttribute('type', 'toolbar');

    if (document.getElementById('phonegap-menu-toolbar'))
        ok(true);
});

test('toolbar should have no default title', 1, function() {
    menu.setAttribute('type', 'toolbar');

    if (document.getElementById('phonegap-menu-toolbar').innerText === '')
        ok(true);
});

test('toolbar should update the title', 1, function() {
    menu.setAttribute('type', 'toolbar');
    menu.setAttribute('label', 'PhoneGap');

    if (document.getElementById('phonegap-menu-toolbar').innerText === 'PhoneGap')
        ok(true);
});