(function(window) {

    var Help = {
        nextUUID: 0,
        generateUUID: function() {
            return ++this.nextUUID;
        },
        execute: function(options) {
            if (typeof options.data === 'undefined') options.data = [];
            
            var service = 'com.phonegap.menu.' + options.element.attribute['type'];
            var id      = options.element.attribute['data-uuid'];
            
            options.data.unshift(id);
            
            PhoneGap.exec(
                options.callback,
                options.callback,
                service,
                options.action,
                options.data
            );
        },
        process: function(queue) {
            (function next() {
                if (queue.length <= 0) return;
                queue.shift()(next);
            })();
        }
    };
    
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
        var self = this;
        
        self.attribute = {
            'data-uuid': undefined,
            'label':     '',
            'type':      ''
        };
        
        self.fn = {
            'commands': function(callback) {
                // for each child commmand
                //   execute update
                // then
                //   fire callback
            },
            'create': function(callback) {
                self.attribute['data-uuid'] = Help.generateUUID();
                
                Help.execute({
                    action:   'create',
                    data:     [ self.attribute.type ],
                    element:  self,
                    callback: callback
                });
            },
            'delete': function(callback) {
                if (typeof self.attribute['data-uuid'] === 'undefined') {
                    callback();
                    return;
                }
                
                Help.execute({
                    action:   'delete',
                    element:  self,
                    callback: function() {
                        self.attribute['data-uuid'] = undefined;
                        callback();
                    }
                });
            },
            'label': function(callback) {
                Help.execute({
                    action:   'label',
                    element:  self,
                    data:     [ self.attribute.label ],
                    callback: callback
                });
            }
        };
        
        self.update = {
            'type': function() {
                Help.process([
                    self.fn['delete'],
                    self.fn['create'],
                    self.fn['label'],
                    self.fn['commands']
                ]);
            },
            'label': function() {
                Help.process([
                    self.fn['label']
                ]);
            }
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
        this.update[name]();
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
