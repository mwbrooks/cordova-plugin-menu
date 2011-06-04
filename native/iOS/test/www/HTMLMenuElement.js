(function(window) {

    // generate a unique ID
    var uuid = function() { return ++this.nextId; };
    uuid.nextId = 0;

    /**
     * HTMLMenuElement
     * ===============
     *
     * Creates a new HTML Menu Element with a unique ID.
     *
     * The unique ID is stored as the attribute 'data-uuid'
     *
     * Since the type of menu is not yet defined, there is nothing to render.
     */
    window.HTMLMenuElement = function() {
        this.attribute = {
            'data-uuid': uuid()
        };
    };

    /**
     * getAttribute
     * ------------
     *
     * Return an attribute with the given name.
     *
     *     menu.getAttribute('data-uuid');
     */
    HTMLMenuElement.prototype.getAttribute = function(name) {
        return this.attribute[name];
    };

    /**
     * hasAttribute
     * ------------
     *
     * Return a boolean for whether the attribute exists.
     *
     * An attribute exists if it has a value other than undefined.
     *
     *     menu.hasAttribute('data-uuid'); // true
     */
    HTMLMenuElement.prototype.hasAttribute = function(name) {
        return (typeof this.attribute[name] !== 'undefined');
    };

    /**
     * setAttribute
     * ------------
     *
     * Sets the element's attribute and invokes any actions that
     * are consequences of the attribute.
     *
     * ### Type
     *
     *     menu.setAttribute('type', 'toolbar'); // create a toolbar
     *     menu.setAttribute('type', 'context'); // create a context menu
     *
     * ### Label
     *
     *     menu.setAttribute('label', 'My Title'); // give menu a title
     */
    HTMLMenuElement.prototype.setAttribute = function(name, value) {
        this.attribute[name] = value;

        var id = this.attribute['data-uuid'];

        switch(name) {
            case 'type':
                // destroy existing menu
                // create new menu
                // apply attributes
                PhoneGap.exec(
                    function(){},
                    function(){},
                    'ca.michaelbrooks.menu.toolbar', 'type', [id, value]
                );
                break;
            case 'label':
                PhoneGap.exec(
                    function(){},
                    function(){},
                    'ca.michaelbrooks.menu.toolbar', 'label', [id, value]
                );
                break;
        };
    };

    HTMLMenuElement.prototype.appendChild = function(element) {
    };

    HTMLMenuElement.prototype.removeChild = function(element) {
    };

    // backup original `document.createElement`
    var _createElement = document.createElement;

    // override `document.createElement` to support menu
    document.createElement = function() {
        if (arguments[0] === 'menu')
            return new HTMLMenuElement();
        else
            return _createElement.apply(this, arguments);
    };

})(window);