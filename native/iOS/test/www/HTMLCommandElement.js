(function(window) {
	var nextId = 0;
    // generate a unique ID
    var uuid = function() { return ++nextId; };
    

    /**
     * HTMLCommandElement
     * ===============
     *
     * Creates a new HTML Command Element with a unique ID.
     *
     * The unique ID is stored as the attribute 'data-uuid'
     *
     * Since the type of menu is not yet defined, there is nothing to render.
     */
    window.HTMLCommandElement = function() {
        this.attribute = {
            'data-uuid': uuid()
        };
		this.eventListener = {};
    };

     HTMLCommandElement.prototype._prefix = function(type) {
		var name = window.plugins.nativeControls._createCustomEventName(type, this.attribute['data-uuid']);
		console.log("_prefix: " + name);
		return name;
    };
 
    /**
     * fireEvent
     * ------------
     *
     * fires off an event.
     *
     */
     HTMLCommandElement.prototype.fireEvent = function(type) {
		var prefix = this._prefix(type);
 
		var e = document.createEvent('Events');
		e.initEvent(prefix);

		window.dispatchEvent(e);
     };
 
    /**
     * addEventListenr
     * ------------
     *
     * Adds an event listener.
     *
     */
     HTMLCommandElement.prototype.addEventListener = function(type, listener, useCapture) {
		window.addEventListener(this._prefix(type), listener, useCapture);
     };

     /**
     * removeEventListenr
     * ------------
     *
     * Remove an event listener.
     *
     */
     HTMLCommandElement.prototype.removeEventListener = function(type, listener, useCapture) {
		window.removeEventListener(this._prefix(type), listener);
    };

    /**
     * getAttribute
     * ------------
     *
     * Return an attribute with the given name.
     *
     *     menu.getAttribute('data-uuid');
     */
    HTMLCommandElement.prototype.getAttribute = function(name) {
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
    HTMLCommandElement.prototype.hasAttribute = function(name) {
        return (typeof this.attribute[name] !== 'undefined');
    };

    /**
     * setAttribute
     * ------------
     *
     * Sets the element's attribute and invokes any actions that
     * are consequences of the attribute.
     *
     */
    HTMLCommandElement.prototype.setAttribute = function(name, value) {
        this.attribute[name] = value;
    };

    HTMLCommandElement.prototype.appendChild = function(element) {
    };

    HTMLCommandElement.prototype.removeChild = function(element) {
    };

    // backup original `document.createElement`
    var _createElement = document.createElement;

    // override `document.createElement` to support menu
    document.createElement = function() {
        if (arguments[0] === 'command')
            return new HTMLCommandElement();
        else
            return _createElement.apply(this, arguments);
    };

})(window);