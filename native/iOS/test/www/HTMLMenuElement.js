(function(window) {

	 var nextId = 0;
	 // generate a unique ID
	 var uuid = function() { return ++nextId; };
 
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
			 {
				switch (value) {
					 case 'toolbar':
					 {
						window.plugins.nativeControls.removeToolBar();
						window.plugins.nativeControls.createToolBar();
					 }
					 break;
					 case 'context':
					 {
						 window.plugins.nativeControls.removeTabBar();
						 window.plugins.nativeControls.createTabBar();
					 }
					 break;
				}
			 }
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
		var menutype = this.attribute['type'];
 
		var my_uuid = element.getAttribute('data-uuid');
		var label = element.getAttribute('label');
		var icon = element.getAttribute('icon');
		var disabled = element.getAttribute('disabled');
 
		switch (menutype)
		 {
			 case 'toolbar':
				window.plugins.nativeControls.createToolBarItem(my_uuid, label, icon, !disabled);
			 break;
			 case 'context':
				window.plugins.nativeControls.createTabBarItem(my_uuid, label, icon, !disabled);
			 break;
		 }
	
    };

    HTMLMenuElement.prototype.removeChild = function(element) {
		var menutype = this.attribute['type'];
		var my_uuid = element.getAttribute('data-uuid');
 
		switch (menutype)
		 {
			 case 'toolbar':
				window.plugins.nativeControls.removeToolBarItem(my_uuid);
			 break;
			 case 'context':
				window.plugins.nativeControls.removeTabBarItem(my_uuid);
			 break;
		 }
 
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