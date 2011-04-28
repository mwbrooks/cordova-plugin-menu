(function(window) {

    window.HTMLMenuElement = function() {
        var self = this;
        var attr = {};

        ['label', 'type'].forEach(function(property) {
            Object.defineProperty(self, property, {
                get: function()  { return attr[property]; },
                set: function(v) { attr[property] = v; }
            });
        });
    };

    HTMLMenuElement.prototype.setAttribute = function(name, value) {
        this[name] = value;
    };

    HTMLMenuElement.prototype.getAttribute = function(name) {
        return this[name];
    };

    HTMLMenuElement.prototype.appendChild = function(element) {
    };

    HTMLMenuElement.prototype.removeChild = function(element) {
    };

})(window);
