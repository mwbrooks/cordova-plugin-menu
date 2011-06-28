package com.phonegap.menu;

import java.util.ArrayList;
import java.util.ListIterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.view.Menu;
import android.view.MenuItem;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

public class AppMenu extends Plugin {
	public static AppMenu singleton;
	private ArrayList <MenuInfo> menuItems;
	private boolean menuChanged;
	
	/**
	 * PhoneGap Exec
	 *
	 * Handle a incoming call from JavaScript.
	 */
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if(action.equals("create")) {
			this.createMenu(args);
		}
		else if (action.equals("delete")) {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		else if (action.equals("label")) {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		
		PluginResult r = new PluginResult(PluginResult.Status.OK);
		return r;
	}
	
	/**
	 * Plugin onDestroy
	 *
	 * Detach static singleton when application is destroyed.
	 */
	@Override
	public void onDestroy() {
		AppMenu.singleton = null;
	}
	
	/**
	 * Menu Changed Check
	 *
	 * DroidGap checks if the menu must be re-rendered
	 */
	@Override
	public boolean isMenuChanged() {
		return menuChanged;
	}
	
	/**
	 * Render the menu.
	 *
	 * This is called when the menu is first created
	 * and when the menu needs to be updated. Unfortunately,
	 * DroidGap clears the menu before calling this function,
	 * so the menu must be rendered from scratch.
	 */
	@Override
	public boolean buildMenu(Menu menu) {
		ListIterator<MenuInfo> iter = menuItems.listIterator();
		
		while (iter.hasNext()) {
			MenuInfo item = iter.next();
			
			menu.add(Menu.NONE, item.id, Menu.NONE, item.label);
			
			MenuItem currentItem = menu.getItem(menu.size() - 1);
			item.menuItem = currentItem;
			item.menuItem.setIcon(item.icon);
			item.menuItem.setEnabled(!item.disabled);
		}
		
		return true;
	}
	
	/**
	 * Menu Item Selected
	 *
	 * Called when a given menu item has been selected.
	 */
	public boolean onMenuItemSelected(MenuItem item) {
		webView.loadUrl("javascript:window.HTMLCommandElement.elements['" + item.getItemId() + "'].attribute.action();");
		return true;
	}
	
	/**
	 * Create the Android Menu.
	 */
	private void createMenu(JSONArray args) {
		if (AppMenu.singleton == null) {
			AppMenu.singleton = this;
		}
		
		if (menuItems == null) {
			menuItems = new ArrayList<MenuInfo>();
		}
	}
	
	/**
	 * Add Item to Menu
	 *
	 * Inserts a menu item into the menu. It does not alter
	 * the menu item.
	 */
	public void addMenuItem(MenuInfo info) {
		if (menuItems == null) {
			menuItems = new ArrayList<MenuInfo>();
		}
		
		menuItems.add(info);
		this.updateMenu();
		
		if (android.os.Build.VERSION.RELEASE.startsWith("3.")) {
			buildHoneycombMenu(ctx.dMenu);
		}
	}
	
	/**
	 * Remove Item from Menu
	 *
	 * Removes a referenced item from the menu.
	 */
	public void removeMenuItem(MenuInfo menuItem) {
		int index = menuItems.indexOf(menuItem);
		menuItems.remove(index);
		this.updateMenu();
	}
	
	/**
	 * Get Menu Item
	 *
	 * Retrieves a menu item based on the ID.
	 */
	public MenuInfo getMenuItem(int id) {
		MenuInfo menuItem = null;
		ListIterator<MenuInfo> iter = menuItems.listIterator();
		
		while (iter.hasNext()) {
			MenuInfo tmpMenuItem = iter.next();
			
			if (tmpMenuItem.id == id) {
				menuItem = tmpMenuItem;
				break;
			}
		}
		
		return menuItem;
	}
	
	/**
	 * Flag the menu to be updated.
	 */
	public void updateMenu() {
		menuChanged = true;
	}
	
	/**
	 * Honeycomb Menu Support
	 */
	public boolean buildHoneycombMenu(final Menu menu) {
		final AppMenu that = this;
		
		ctx.runOnUiThread(new Runnable() {
			public void run() {
				menu.clear();
				that.buildMenu(menu);
			}
		});
		
		menuChanged = false;
		
		return true;
	}
}