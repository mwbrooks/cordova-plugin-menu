localStorage.clear();
sessionStorage.clear();

var menu = null;

module('HTMLMenuElement', {
    setup: function() {
        menu = document.createElement('menu');
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

test('should support setAttribute', 1, function() {
    menu.setAttribute('label', 'PhoneGap');
    ok(true);
});

test('should support getAttribute', 1, function() {
    menu.setAttribute('label', 'PhoneGap');

    if (menu.getAttribute('label') === 'PhoneGap')
        ok(true);
});

test('should support hasAttribute', 5, function() {
    if (!menu.hasAttribute('label'))
        ok(true, 'supports no attribute');
    
    menu.setAttribute('label', 'PhoneGap');
    if (menu.hasAttribute('label'))
        ok(true, 'suports String');

    menu.setAttribute('label', false);
    if (menu.hasAttribute('label'))
        ok(true, 'supports falsey boolean');

    menu.setAttribute('label', null);
    if (menu.hasAttribute('label'))
        ok(true, 'supports null');

    menu.setAttribute('label', undefined);
    if (!menu.hasAttribute('label'))
        ok(true, 'supports undefined as no attribute');
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

test('should not render multiple toolbars', 2, function() {
    // first toolbar
    menu.setAttribute('type',  'toolbar');
    menu.setAttribute('label', 'Toolbar #1');

    // second toolbar
    var menu2 = document.createElement('menu');
    menu2.setAttribute('type',  'toolbar');
    menu2.setAttribute('label', 'Toolbar #2');

    if (document.querySelectorAll('#phonegap-menu-toolbar').length === 1)
        ok(true, 'only one');

    if (document.getElementById('phonegap-menu-toolbar').innerText === 'Toolbar #2')
        ok(true, 'correct title');
})