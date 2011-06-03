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
function NativeControls() {
    this.tabBarTag = 0;
    this.toolBarTag = 0;
    this.tabBarCallbacks = {};
    this.toolBarCallbacks = {};
}

/**
 * Create a native tab bar that can have tab buttons added to it which can respond to events.
 */
NativeControls.prototype.createTabBar = function() {
    PhoneGap.exec("NativeControls.createTabBar");
};

/**
 * Remove a native tab bar
 */
NativeControls.prototype.removeTabBar = function() {
    PhoneGap.exec("NativeControls.removeTabBar");
};

/**
 * Show a tab bar.  The tab bar has to be created first.
 * @param {Object} [options] Options indicating how the tab bar should be shown:
 * - \c height integer indicating the height of the tab bar (default: \c 49)
 * - \c position specifies whether the tab bar will be placed at the \c top or \c bottom of the screen (default: \c bottom)
 */
NativeControls.prototype.showTabBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls.showTabBar", { animate: animate });
};

/**
 * Hide a tab bar.  The tab bar has to be created first.
 */
NativeControls.prototype.hideTabBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls.hideTabBar", { animate: animate });
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
NativeControls.prototype.createTabBarItem = function(name, label, image, options) {
    
	var tag = this.tabBarTag++;
    if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
        this.tabBarCallbacks[tag] = {'onSelect':options.onSelect,'name':name};
    }
	
    PhoneGap.exec("NativeControls.createTabBarItem", name, (label || ""), image, tag, options);
};

/**
 * Update an existing tab bar item to change its badge value.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
 */
NativeControls.prototype.updateTabBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls.updateTabBarItem", name, options);
};

/**
 * Remove an existing tab bar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls.prototype.removeTabBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls.removeTabBarItem", name, options);
};

/**
 * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
 * @param {String} tabName the name of the tab to select, or null if all tabs should be deselected
 * @see createTabBarItem
 * @see showTabBarItems
 */
NativeControls.prototype.selectTabBarItem = function(tab) {
    PhoneGap.exec("NativeControls.selectTabBarItem", tab);
};

/**
 * Function called when a tab bar item has been selected.
 * @param {Number} tag the tag number for the item that has been selected
 */
NativeControls.prototype.tabBarItemSelected = function(tag) 
{
    if (typeof(this.tabBarCallbacks[tag].onSelect) == 'function') {
        this.tabBarCallbacks[tag].onSelect(this.tabBarCallbacks[tag].name);
	}
};

// /////////////////////////////////////////////////////////////////////////////////

/**
 * Remove a toolbar.
 */
NativeControls.prototype.removeToolBar = function() 
{
    PhoneGap.exec("NativeControls.removeToolBar");
};

/**
 * Create a toolbar.
 */
NativeControls.prototype.createToolBar = function() 
{
    PhoneGap.exec("NativeControls.createToolBar");
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
NativeControls.prototype.createToolBarItem = function(name, label, image, options) {
    
	var tag = this.toolBarTag++;
    if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
        this.toolBarCallbacks[tag] = {'onSelect':options.onSelect,'name':name };
    }
	
    PhoneGap.exec("NativeControls.createToolBarItem", name, (label || ""), image, tag, options);
};

/**
 * Remove an existing tab bar item.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 */
NativeControls.prototype.removeToolBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("NativeControls.removeToolBarItem", name, options);
};

/**
 * Function called when a toolbar item has been selected.
 * @param {Number} tag the tag number for the item that has been selected
 */
NativeControls.prototype.toolBarItemSelected = function(tag) 
{
    if (typeof(this.toolBarCallbacks[tag].onSelect) == 'function') {
        this.toolBarCallbacks[tag].onSelect(this.toolBarCallbacks[tag].name);
	}
};


NativeControls.prototype.showToolBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls.showToolBar", { animate: animate });
};

NativeControls.prototype.hideToolBar = function(animate) {
    if (animate == undefined || animate == null) {
        animate = true;
	}
    PhoneGap.exec("NativeControls.hideToolBar", { animate: animate });
};


NativeControls.install = function()
{
	if(!window.plugins)	{
		window.plugins = {};
	}
	
	if (!window.plugins.nativeControls) {
		window.plugins.nativeControls = new NativeControls();
	}
};

PhoneGap.addConstructor(NativeControls.install);
