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
	public String label = "";
	public Drawable icon;
	public String callback;
	public boolean disabled;
}

public class AppMenuItem extends Plugin {
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if (action.equals("create")) {
			this.addItem(args);
		}
		else if (action.equals("delete")) {
			this.removeItem(args);
		}
		else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}

		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		return r;
	}
	
	private void addItem(JSONArray args) {
		try {
			String item = args.getString(0);
			JSONObject mObject = new JSONObject(item);
			MenuInfo info = parseInfo(mObject);
			AppMenu.instance.addMenuItem(info);
		} catch (JSONException e) {
			e.printStackTrace();
		}				
	}
	
	private void removeItem(JSONArray args) {
		try {
			int recordId = args.getInt(0);
			// items.remove(recordId);
			// menuChanged = true;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
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
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	
	private MenuInfo parseInfo(JSONObject mObject) throws JSONException {
		MenuInfo info = new MenuInfo();
		info.label = mObject.getString("label");
		info.callback = mObject.getString("callback");
		String tmp_uri = mObject.getString("icon");
		//I don't expect this to work at all
		info.icon = getIcon(tmp_uri);
		try {
			info.disabled = mObject.getBoolean("enabled");
		}
		//Catch the case when "enabled" is not defined
		catch(JSONException e) {
			info.disabled = false;
		}
		return info;
	}
}