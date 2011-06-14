package com.phonegap.menu;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.ListIterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.res.AssetManager;
import android.graphics.drawable.Drawable;
import android.view.Menu;
import android.view.MenuItem;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

class MenuInfo
{
	public String label = "";
	public Drawable icon;
	public String callback;
	public boolean disabled;
}

public class AppMenu extends Plugin {

	private Menu appMenu;
	private ArrayList <MenuInfo> items;
	private String callback;
	private boolean menuChanged;
		
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		// TODO Auto-generated method stub
		this.callback = callbackId;
		if(action.equals("create"))
		{
			this.createMenu(args);
		}
		else if(action.equals("addItem"))
		{
			this.addItem(args);
		}
		else if(action.equals("removeItem"))
		{
			this.removeItem(args);
		}
		else
		{
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		return r;
	}
	
	private void createMenu(JSONArray args)	
	{
		if(items == null)
		{
			items = new ArrayList<MenuInfo>();
		}
		try {
			String menu = args.getString(0);
			JSONArray menuArr = new JSONArray(menu);
			for(int i = 0; i < menuArr.length(); ++i)
			{
				JSONObject mObject = menuArr.getJSONObject(i);
				MenuInfo info = parseInfo(mObject);
				items.add(info);
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(android.os.Build.VERSION.RELEASE.startsWith("3."))
    	{
    		appMenu = ctx.dMenu;
    		buildHoneycombMenu(appMenu);
    	}
	}
	
	private MenuInfo parseInfo(JSONObject mObject) throws JSONException
	{
		MenuInfo info = new MenuInfo();
		info.label = mObject.getString("label");
		info.callback = mObject.getString("callback");
		String tmp_uri = mObject.getString("icon");
		//I don't expect this to work at all
		info.icon = getIcon(tmp_uri);
		try
		{
			info.disabled = mObject.getBoolean("enabled");
		}
		//Catch the case when "enabled" is not defined
		catch(JSONException e)
		{
			info.disabled = false;
		}
		return info;		
	}
	
	private Drawable getIcon(String tmp_uri) {
		AssetManager mgr = this.ctx.getAssets();
		String fileName = "www/" + tmp_uri;
		try {
			InputStream image = mgr.open(fileName);
			Drawable icon = Drawable.createFromStream(image, tmp_uri);
			return icon;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	private void addItem(JSONArray args)
	{
		if(items == null)
		{
			items = new ArrayList<MenuInfo>();
		}
		try {
			String item = args.getString(0);
			JSONObject mObject = new JSONObject(item);
			MenuInfo info = parseInfo(mObject);
			items.add(info);
			menuChanged = true;
	    	if(android.os.Build.VERSION.RELEASE.startsWith("3."))
	    	{
	    		appMenu = ctx.dMenu;
	    		buildHoneycombMenu(appMenu);
	    	}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}				
	}
	
	private void removeItem(JSONArray args)
	{
		try {
			int recordId = args.getInt(0);
			items.remove(recordId);
			menuChanged = true;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
