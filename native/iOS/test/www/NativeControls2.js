/*
//  This code is adapted from the work of:
//  Created by Michael Nachbaur on 13/04/09.
//  Copyright 2009 Decaf Ninja Software. All rights reserved.
//  MIT licensed
*/

/**
 * This class exposes mobile phone interface controls to JavaScript, such as
 * native tab and tool bars, etc.
 * @constructor
 */
function NativeControls2() {
    this.tabBarTag = 0;
    this.toolBarTag = 0;
    this.tabBarCallbacks = {};
    this.toolBarCallbacks = {};
}

NativeControls2.prototype._createCustomEventName = function(type, name) {
	// name is the name of the tool/tab bar item, type is "click" for e.g
	return 'command-' + name + '-' + type;
};


/**
 * Create a native tab bar that can have tab buttons added to it which can respond to events.
 */
NativeControls2.prototype.createTabBar = function() {
    PhoneGap.exec("NativeControls2.createTabBar");
};

/**
 * Remove a native tab bar
 */
NativeControls2.prototype.removeTabBar = function() {
    PhoneGap.exec("NativeControls2.removeTabBar");
};

/**
 * Show a tab bar.  The tab bar has to be created first.
 * @param {Object} [options] Options indicating how the tab bar should be shown:
 * - \c height integer indicating the height of the tab bar (default: \c 49)
 * - \c position specifies whether the tab bar will be placed at the \c top or \c bottom of the screen (default: \c bottom)
 */
NativeControls2.prototype.showTabBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls2.showTabBar", { animate: animate });
};

/**
 * Hide a tab bar.  The tab bar has to be created first.
 */
NativeControls2.prototype.hideTabBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls2.hideTabBar", { animate: animate });
};

/**
 * Create a new tab bar item for use on a previously created tab bar.  Use ::showTabBarItems to show the new item on the tab bar.
 *
 * If the supplied image name is one of the labels listed below, then this method will construct a tab button
 * using the standard system buttons.  Note that if you use one of the system images, that the \c title you supply will be ignored.
 *
 * <b>Tab Buttons</b>
 *   - tabButton:More
 *   - tabButton:Favorites
 *   - tabButton:Featured
 *   - tabButton:TopRated
 *   - tabButton:Recents
 *   - tabButton:Contacts
 *   - tabButton:History
 *   - tabButton:Bookmarks
 *   - tabButton:Search
 *   - tabButton:Downloads
 *   - tabButton:MostRecent
 *   - tabButton:MostViewed
 * @param {String} name internal name to refer to this tab by
 * @param {String} [title] title text to show on the tab, or null if no text should be shown
 * @param {String} [image] image filename or internal identifier to show, or null if now image should be shown
 * @param {Object} [options] Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
 */
NativeControls2.prototype.createTabBarItem = function(name, label, image, enabled, options) {
    
	var tag = this.tabBarTag++;
    if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
        this.tabBarCallbacks[tag] = {'onSelect':options.onSelect,'name':name};
    } else {
        this.tabBarCallbacks[tag] = { 'name':name };
	}
	
	if (enabled == null) {
		enabled = true;
	}
	
    PhoneGap.exec("NativeControls2.createTabBarItem", name, (label || ""), image, enabled, tag, options);
};

/**
 * Update an existing tab bar item to change its badge value.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
 */
NativeControls2.prototype.updateTabBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls2.updateTabBarItem", name, options);
};

/**
 * Remove an existing tab bar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls2.prototype.removeTabBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls2.removeTabBarItem", name, options);
};

/**
 * Enable/disable existing tab bar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls2.prototype.enableTabBarItem = function(name, enabled) {
    PhoneGap.exec("NativeControls2.enableTabBarItem", name, (enabled || false));
};


/**
 * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
 * @param {String} tabName the name of the tab to select, or null if all tabs should be deselected
 * @see createTabBarItem
 * @see showTabBarItems
 */
NativeControls2.prototype.selectTabBarItem = function(tab) {
    PhoneGap.exec("NativeControls2.selectTabBarItem", tab);
};

/**
 * Function called when a tab bar item has been selected.
 * @param {Number} tag the tag number for the item that has been selected
 */
NativeControls2.prototype.tabBarItemSelected = function(tag) 
{
	try {

    if (this.tabBarCallbacks[tag] && typeof(this.tabBarCallbacks[tag].onSelect) == 'function') {
        this.tabBarCallbacks[tag].onSelect(this.tabBarCallbacks[tag].name);
	}
		
	
	var name = this.tabBarCallbacks[tag].name;
	// also fire custom event
	if (name) {
		var eventName = this._createCustomEventName('click', this.tabBarCallbacks[tag].name);
		var e = document.createEvent('Events');
		e.initEvent(eventName);
		console.log("Firing event: " + eventName);
		window.dispatchEvent(e);
	}
		
	} catch (e) {
		alert(e);
	}
};

// /////////////////////////////////////////////////////////////////////////////////

/**
 * Remove a toolbar.
 */
NativeControls2.prototype.removeToolBar = function() 
{
    PhoneGap.exec("NativeControls2.removeToolBar");
};

/**
 * Create a toolbar.
 */
NativeControls2.prototype.createToolBar = function() 
{
    PhoneGap.exec("NativeControls2.createToolBar");
};

/**
 * Create a new toolbar item for use on a previously created toolbar.
 *
 * If the supplied image name is one of the labels listed below, then this method will construct a toolbar button
 * using the standard system buttons.  Note that if you use one of the system images, that the \c title you supply will be ignored.
 *
 * <b>Toolbar Buttons</b>
 *   - toolbarButton:Done      
 *   - toolbarButton:Cancel   
 *   - toolbarButton:Edit
 *   - toolbarButton:Save
 *   - toolbarButton:Add
 *   - toolbarButton:FlexibleSpace 
 *   - toolbarButton:FixedSpace
 *   - toolbarButton:Compose
 *   - toolbarButton:Reply
 *   - toolbarButton:Action
 *   - toolbarButton:Organize
 *   - toolbarButton:Bookmarks
 *   - toolbarButton:Search
 *   - toolbarButton:Refresh
 *   - toolbarButton:Stop
 *   - toolbarButton:Camera
 *   - toolbarButton:Trash
 *   - toolbarButton:Play
 *   - toolbarButton:Pause
 *   - toolbarButton:Rewind
 *   - toolbarButton:FastForward
 *   - toolbarButton:Undo
 *   - toolbarButton:Redo
 *
 * @param {String} name internal name to refer to this toolbar item by
 * @param {String} [title] title text to show on the toolbar item, or null if no text should be shown
 * @param {String} [image] image filename or internal identifier to show, or null if now image should be shown
 * @param {Object} [options] Options for customizing the individual toolbar item
 */
NativeControls2.prototype.createToolBarItem = function(name, label, image, enabled, options) {
    
	var tag = this.toolBarTag++;
    if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
        this.toolBarCallbacks[tag] = {'onSelect':options.onSelect,'name':name };
    } else {
        this.toolBarCallbacks[tag] = { 'name':name };
	}
	
	if (enabled == null) {
		enabled = true;
	}
	
    PhoneGap.exec("NativeControls2.createToolBarItem", name, (label || ""), image, enabled, tag, options);
};

/**
 * Remove an existing toolbar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls2.prototype.removeToolBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls2.removeToolBarItem", name, options);
};

/**
 * Enable/disable existing toolbar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls2.prototype.enableToolBarItem = function(name, enable) {
    PhoneGap.exec("NativeControls2.enableToolBarItem", name, enable || false);
};

/**
 * Function called when a toolbar item has been selected.
 * @param {Number} tag the tag number for the item that has been selected
 */
NativeControls2.prototype.toolBarItemSelected = function(tag) 
{
    if (this.toolBarCallbacks[tag] && typeof(this.toolBarCallbacks[tag].onSelect) == 'function') {
        this.toolBarCallbacks[tag].onSelect(this.toolBarCallbacks[tag].name);
	}
	
	var name = this.toolBarCallbacks[tag].name;
	// also fire custom event
	if (name) {
		var eventName = this._createCustomEventName('click', this.toolBarCallbacks[tag].name);
		var e = document.createEvent('Events');
		e.initEvent(eventName);
		window.dispatchEvent(e);
	}
};

NativeControls2.prototype.showToolBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls2.showToolBar", { animate: animate });
};

NativeControls2.prototype.hideToolBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls2.hideToolBar", { animate: animate });
};

NativeControls2.install = function()
{
	if(!window.plugins)	{
		window.plugins = {};
	}
	
	if (!window.plugins.nativeControls) {
		window.plugins.nativeControls = new NativeControls2();
	}
};

PhoneGap.addConstructor(NativeControls2.install);
