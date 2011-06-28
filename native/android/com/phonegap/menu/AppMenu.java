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
	private Menu appMenu;
	private ArrayList <MenuInfo> items;
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
		if (items == null) {
			items = new ArrayList<MenuInfo>();
		}
		
		items.add(info);
		menuChanged = true;
		
		if(android.os.Build.VERSION.RELEASE.startsWith("3."))
		{
			appMenu = ctx.dMenu;
			buildHoneycombMenu(appMenu);
    	}
	}
	
	public MenuInfo getMenuItem(String id) {
		MenuInfo info = null;
		
		ListIterator<MenuInfo> iter = items.listIterator();
		
		while(iter.hasNext()) {
			int itemId = iter.nextIndex();
			MenuInfo item = iter.next();
			
			if (item.id == id) {
				info = item;
				break;
			}
		}
		
		return info;
	}
	
	public void updateMenu() {
		menuChanged = true;
	}
	
	private void createMenu(JSONArray args)	
	{
		if (AppMenu.singleton == null) {
			AppMenu.singleton = this;
		}
			
		if (items == null) {
			items = new ArrayList<MenuInfo>();
		}
	}
	
	public boolean isMenuChanged()
	{
		return menuChanged;
	}
	
    /**
     * Call to build the menu
     * 
     * @param menu
     * @return
     */
    public boolean buildMenu(Menu menu)
    {
    	appMenu = menu;
    	ListIterator<MenuInfo> iter = items.listIterator();    	
    	while(iter.hasNext())
    	{
    		int itemId = iter.nextIndex();
    		MenuInfo item = iter.next();
    		menu.add(Menu.NONE, itemId, Menu.NONE, item.label);
    		MenuItem currentItem = menu.getItem(itemId);
    		currentItem.setIcon(item.icon);
    	}
    	menuChanged = false;    	
    	return true;
    }
    
    public boolean buildHoneycombMenu(final Menu menu)
    {
    	final AppMenu that = this;
    	ctx.runOnUiThread(new Runnable()
    	{

			public void run() {
				menu.clear();
				that.buildMenu(menu);
			}
    		
    	});
    	menuChanged = false;
    	return true;
    }
    
    /**
     * Call your receive when menuItem is selected.
     * 
     * @param item
     * @return
     */
    public boolean onMenuItemSelected(MenuItem item)
    {    	
    	webView.loadUrl("javascript:PhoneGap.fireEvent('itemPressed');");
    	return true;
    }

}