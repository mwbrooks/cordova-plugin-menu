(function(window) {

    //
    // HTMLMenuElement
    //

    window.HTMLMenuElement = function() {
        var self = this;
        var attr = {};

        // Unused at the moment
        ['label', 'type'].forEach(function(property) {
            Object.defineProperty(self, property, {
                get: function()  { return attr[property]; },
                set: function(v) { attr[property] = v; }
            });
        });

        var success = function() { console.log('created toolbar'); };
        var fail    = function() { console.log('failed to create toolbar'); };
        PhoneGap.exec(success, fail, 'ca.michaelbrooks.menu.toolbar', 'new');
    };

    HTMLMenuElement.prototype.setAttribute = function(name, value) {
        this[name] = value;

        var success = function() { console.log('setAttribute success => ' + name + ': ' + value); };
        var fail    = function() { console.log('setAttribute failure => ' + name + ': ' + value); };

        PhoneGap.exec(success, fail, 'ca.michaelbrooks.menu.toolbar', name, [value]);
    };

    HTMLMenuElement.prototype.getAttribute = function(name) {
        return this[name];
    };

    HTMLMenuElement.prototype.appendChild = function(element) {
    };

    HTMLMenuElement.prototype.removeChild = function(element) {
    };

    //
    // Override document.createElement
    //

    var _createElement = document.createElement;
    document.createElement = function() {
        if (arguments[0] === 'menu')
            return new HTMLMenuElement();
        else
            return _createElement.apply(this, arguments);
    };

})(window);
