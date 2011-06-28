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
	
	public void removeMenuItem(MenuInfo menuItem) {
		int index = menuItems.indexOf(menuItem);
		menuItems.remove(index);
		this.updateMenu();
	}
	
	public MenuInfo getMenuItem(String id) {
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
	
	public void updateMenu() {
		menuChanged = true;
	}
	
	private void createMenu(JSONArray args) {
		if (AppMenu.singleton == null) {
			AppMenu.singleton = this;
		}
		
		if (menuItems == null) {
			menuItems = new ArrayList<MenuInfo>();
		}
	}
	
	public boolean isMenuChanged() {
		return menuChanged;
	}
	
	public boolean buildMenu(Menu menu) {
		ListIterator<MenuInfo> iter = menuItems.listIterator();
		
		while (iter.hasNext()) {
			int itemId = iter.nextIndex();
			MenuInfo item = iter.next();
			
			menu.add(Menu.NONE, itemId, Menu.NONE, item.label);
			
			MenuItem currentItem = menu.getItem(itemId);
			currentItem.setIcon(item.icon);
		}
		
		return true;
	}
	
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
	
	public boolean onMenuItemSelected(MenuItem item) {
		webView.loadUrl("javascript:PhoneGap.fireEvent('itemPressed');");
		return true;
	}
}