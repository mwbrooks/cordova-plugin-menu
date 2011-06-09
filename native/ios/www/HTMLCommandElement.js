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
window.HTMLCommandElement = function(uuid) {
	this.attribute = {
		'data-uuid': uuid
	};
};

window.HTMLCommandElement.EventName = 'htmlcommandevent';

window.HTMLCommandElement.getUniqueEventName = function(type, id) {
	return 'command-' + type + '-' + id;
};

/**
 * addEventListenr
 * ------------
 *
 * Adds an event listener.
 *
 */
 HTMLCommandElement.prototype.addEventListener = function(type, listener, useCapture) {
	var eventName = HTMLCommandElement.getUniqueEventName(type, this.attribute['data-uuid']);
	window.addEventListener(eventName, listener, useCapture);
 };

 /**
 * removeEventListenr
 * ------------
 *
 * Remove an event listener.
 *
 */
 HTMLCommandElement.prototype.removeEventListener = function(type, listener, useCapture) {
	var eventName = HTMLCommandElement.getUniqueEventName(type, this.attribute['data-uuid']);
	window.removeEventListener(eventName, listener, useCapture);
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



HTMLCommandElement.install = function()
{
	var commandEventListener = function(e) {
		var eventData = e.data || {};
		var eventName = HTMLCommandElement.getUniqueEventName(eventData.type, eventData.id);
		
		var evt = document.createEvent('Events');
		evt.initEvent(eventName);
		window.dispatchEvent(evt);
	};
	window.addEventListener(HTMLCommandElement.EventName, commandEventListener, false);
	
	var nextId = 1000;
	// generate a unique ID
	var uuid = function() { return ++nextId; };

	// backup original `document.createElement`
	var _createElement = document.createElement;

	// override `document.createElement` to support menu
	document.createElement = function() {
		 if (arguments[0] === 'command') {
			return new HTMLCommandElement(uuid());
		 } else {
			return _createElement.apply(this, arguments);
		 }
	};
}

PhoneGap.addConstructor(HTMLCommandElement.install);