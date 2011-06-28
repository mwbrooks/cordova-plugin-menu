package com.phonegap.menu;

import java.io.IOException;
import java.io.InputStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.res.AssetManager;
import android.graphics.drawable.Drawable;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

class MenuInfo {
	public String id;
	public String label = "";
	public Drawable icon;
	public String callback;
	public boolean disabled;
}

public class AppMenuItem extends Plugin {
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if (action.equals("create")) {
			this.create(args);
		}
		else if (action.equals("delete")) {
			this.delete(args);
		}
		else if (action.equals("accesskey")) {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		else if (action.equals("disabled")) {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
		else if (action.equals("icon")) {
			this.icon(args);
		}
		else if (action.equals("label")) {
			this.label(args);
		}
		else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}

		PluginResult r = new PluginResult(PluginResult.Status.OK);
		return r;
	}
	
	private void create(JSONArray args) {
		try {
			MenuInfo info = new MenuInfo();
			info.id = args.getString(0);
			AppMenu.singleton.addMenuItem(info);
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void delete(JSONArray args) {
		try {
			MenuInfo info = AppMenu.singleton.getMenuItem(args.getString(0));
			AppMenu.singleton.removeMenuItem(info);
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void label(JSONArray args) {
		try {
			String id = args.getString(0);
			
			try {
				MenuInfo info = AppMenu.singleton.getMenuItem(id);
				info.label = args.getString(1);
				AppMenu.singleton.updateMenu();
			}
			catch (NullPointerException e) {
				e.printStackTrace();
			}
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void icon(JSONArray args) {
		try {
			String id = args.getString(0);
			
			try {
				MenuInfo info = AppMenu.singleton.getMenuItem(id);
				info.icon = getIcon(args.getString(1));
				AppMenu.singleton.updateMenu();
			}
			catch (NullPointerException e) {
				e.printStackTrace();
			}
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private Drawable getIcon(String tmp_uri) {
		AssetManager mgr = this.ctx.getAssets();
		String fileName = "www/" + tmp_uri;
		
		try {
			InputStream image = mgr.open(fileName);
			Drawable icon = Drawable.createFromStream(image, tmp_uri);
			return icon;
		}
		catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	private MenuInfo parseInfo(JSONObject mObject) throws JSONException {
		MenuInfo info = new MenuInfo();
		info.label = mObject.getString("label");
		info.callback = mObject.getString("callback");
		
		String tmp_uri = mObject.getString("icon");
		info.icon = getIcon(tmp_uri);
		
		try {
			info.disabled = mObject.getBoolean("enabled");
		}
		catch(JSONException e) {
			info.disabled = false;
		}
		
		return info;
	}
}