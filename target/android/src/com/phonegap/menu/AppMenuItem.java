package com.phonegap.menu;

import java.io.IOException;
import java.io.InputStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.view.MenuItem;

import android.content.res.AssetManager;
import android.graphics.drawable.Drawable;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

class MenuInfo {
	private int          id;
	private String       label    = "";
	private Drawable     icon     = null;
	private boolean      disabled = false;
	private MenuItem     menuItem = null;
	private AssetManager assets   = null;
	
	public MenuInfo(final int id, AssetManager assets) {
		this.id = id;
		this.assets = assets;
	}
	
	public int getId() {
		return this.id;
	}
	
	public String getLabel() {
		return this.label;
	}
	
	public void setLabel(final String label) {
		this.label = label;
		this.updateLabel();
	}
	
	public void updateLabel() {
		if (menuItem != null) {
			menuItem.setTitle(this.label);
		}
	}
	
	public void setIcon(final String icon) {
		this.icon = this.getIcon(icon);
		this.updateIcon();
	}
	
	public void updateIcon() {
		if (menuItem != null) {
			menuItem.setIcon(this.icon);
		}
	}
	
	public void setDisabled(final Boolean disabled) {
		this.disabled = disabled;
		this.updateDisabled();
	}
	
	public void updateDisabled() {
		if (menuItem != null) {
			menuItem.setEnabled(!this.disabled);
		}
	}

	public void setMenuItem(MenuItem menuItem) {
		this.menuItem = menuItem;
	}
	
	public void updateAll() {
		this.updateLabel();
		this.updateIcon();
		this.updateDisabled();
	}
	
	private Drawable getIcon(String tmp_uri) {
		String fileName = "www/" + tmp_uri;

		try {
			InputStream image = this.assets.open(fileName);
			Drawable icon = Drawable.createFromStream(image, tmp_uri);
			return icon;
		}
		catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
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
			this.disabled(args);
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
			MenuInfo info = new MenuInfo(args.getInt(0), this.ctx.getAssets());
			AppMenu.singleton.addMenuItem(info);
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void delete(JSONArray args) {
		try {
			MenuInfo info = AppMenu.singleton.getMenuItem(args.getInt(0));
			AppMenu.singleton.removeMenuItem(info);
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void disabled(JSONArray args) {
		try {
			MenuInfo info = AppMenu.singleton.getMenuItem(args.getInt(0));
			info.setDisabled(args.getBoolean(1));
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void label(JSONArray args) {
		try {
			MenuInfo info = AppMenu.singleton.getMenuItem(args.getInt(0));
			info.setLabel(args.getString(1));
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void icon(JSONArray args) {
		try {
			MenuInfo info = AppMenu.singleton.getMenuItem(args.getInt(0));
			info.setIcon(args.getString(1));
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
}