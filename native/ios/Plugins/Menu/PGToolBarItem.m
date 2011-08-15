//
//  PGToolBarItem.m
//
//  Based on the previous PhoneGap plugins UIControls.h and NativeControls.h
//
//  phonegap-plugin-menu is available under *either* the terms of the modified BSD license *or* the
//  MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
//
//  Copyright (c) 2011 Michael Brooks, Nitobi Software Inc.
//  Copyright (c) 2011 Shazron Abdullah, Nitobi Software Inc.
//  Copyright (c) 2010 Jesse MacFadyen, Nitobi Software Inc.
//  Copyright (c) 2009 Michael Nachaur, Decaf Ninja Software
//

#import "PGToolBarItem.h"
#import "PGToolBar.h"

#define TOOL_BAR_PLUGIN @"com.phonegap.menu.toolbar"

@implementation PGToolBarItem

- (void) create:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGToolBar* pgToolBar  = (PGToolBar*)[[self appDelegate] getCommandInstance:TOOL_BAR_PLUGIN];
    NSString*  callbackId = [arguments objectAtIndex:0];
    NSString*  name       = [arguments objectAtIndex:1];
    NSString*  title      = @" ";
    NSString*  imageName  = @"";
    BOOL       enable     = true;
    int        tag        = [name intValue];
    
    @try {
        title     = [arguments objectAtIndex:2];
        imageName = [arguments objectAtIndex:3];
        enable    = [[arguments objectAtIndex:4] boolValue];
        tag       = [[arguments objectAtIndex:5] intValue];
    } @catch (NSException *exception) {
        // Move on
    }
    
    NSString* accesskey = @"";
    if ([arguments count] > 6) {
        accesskey = [arguments objectAtIndex:6];
    }
	
    UIBarButtonItem* item = nil;    
    if ([imageName length] > 0) 
	{
        UIBarButtonSystemItem systemItem = -1;
        if ([imageName isEqualToString:@"toolbarButton:Done"])       systemItem = UIBarButtonSystemItemDone;
        if ([imageName isEqualToString:@"toolbarButton:Cancel"])       systemItem = UIBarButtonSystemItemCancel;
        if ([imageName isEqualToString:@"toolbarButton:Edit"])       systemItem = UIBarButtonSystemItemEdit;
        if ([imageName isEqualToString:@"toolbarButton:Save"])       systemItem = UIBarButtonSystemItemSave;
        if ([imageName isEqualToString:@"toolbarButton:Add"])       systemItem = UIBarButtonSystemItemAdd;
        if ([imageName isEqualToString:@"toolbarButton:FlexibleSpace"])       systemItem = UIBarButtonSystemItemFlexibleSpace;
        if ([imageName isEqualToString:@"toolbarButton:FixedSpace"])       systemItem = UIBarButtonSystemItemFixedSpace;
        if ([imageName isEqualToString:@"toolbarButton:Compose"])       systemItem = UIBarButtonSystemItemCompose;
        if ([imageName isEqualToString:@"toolbarButton:Reply"])       systemItem = UIBarButtonSystemItemReply;
        if ([imageName isEqualToString:@"toolbarButton:Action"])       systemItem = UIBarButtonSystemItemAction;
        if ([imageName isEqualToString:@"toolbarButton:Organize"])       systemItem = UIBarButtonSystemItemOrganize;
        if ([imageName isEqualToString:@"toolbarButton:Bookmarks"])       systemItem = UIBarButtonSystemItemBookmarks;
        if ([imageName isEqualToString:@"toolbarButton:Search"])       systemItem = UIBarButtonSystemItemSearch;
        if ([imageName isEqualToString:@"toolbarButton:Refresh"])       systemItem = UIBarButtonSystemItemRefresh;
        if ([imageName isEqualToString:@"toolbarButton:Stop"])       systemItem = UIBarButtonSystemItemStop;
        if ([imageName isEqualToString:@"toolbarButton:Camera"])       systemItem = UIBarButtonSystemItemCamera;
        if ([imageName isEqualToString:@"toolbarButton:Trash"])       systemItem = UIBarButtonSystemItemTrash;
        if ([imageName isEqualToString:@"toolbarButton:Play"])       systemItem = UIBarButtonSystemItemPlay;
        if ([imageName isEqualToString:@"toolbarButton:Pause"])       systemItem = UIBarButtonSystemItemPause;
        if ([imageName isEqualToString:@"toolbarButton:Rewind"])       systemItem = UIBarButtonSystemItemRewind;
        if ([imageName isEqualToString:@"toolbarButton:FastForward"])       systemItem = UIBarButtonSystemItemFastForward;
        if ([imageName isEqualToString:@"toolbarButton:Undo"])       systemItem = UIBarButtonSystemItemUndo;
        if ([imageName isEqualToString:@"toolbarButton:Redo"])       systemItem = UIBarButtonSystemItemRedo;
        
        if (systemItem != -1) {
            item = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:systemItem target:self action:@selector(toolBarDidSelectItem:)];
			item.style = UIBarButtonItemStyleBordered;
			item.tag = tag;
		}
    }
    
    if (item == nil) 
	{
		if (title && [title length] > 0) {
			NSLog(@"Creating toolbarItem with title");
			item = [[UIBarButtonItem alloc] initWithTitle:title style:UIBarButtonItemStyleBordered 
												   target:self action:@selector(toolBarDidSelectItem:)];
		} else {
			UIImage* image = [UIImage imageNamed:imageName];
			if (!image) {
				NSString* imagePath = [[PhoneGapDelegate class] pathForResource:imageName];
				image = [UIImage imageWithContentsOfFile:imagePath];
			}
			
			NSLog(@"Creating toolbarItem with custom image");
			item = [[UIBarButtonItem alloc] initWithImage:image style:UIBarButtonItemStyleBordered
												   target:self action:@selector(toolBarDidSelectItem:)];
		}
		item.tag = tag;
    }
	
	item.enabled = enable;
	
    BOOL animateItems = YES;
    if ([options objectForKey:@"animate"]) {
        animateItems = [(NSString*)[options objectForKey:@"animate"] boolValue];
	}
    
    if ([accesskey isEqualToString:@"back"]) {
        if (!pgToolBar.toolBar.topItem.leftBarButtonItem) {
            pgToolBar.toolBar.topItem.leftBarButtonItem = item;
            [pgToolBar.toolBarItems setObject:item forKey:name];
        }
    } else {
        if (!pgToolBar.toolBar.topItem.rightBarButtonItem) {
            pgToolBar.toolBar.topItem.rightBarButtonItem = item;
            [pgToolBar.toolBarItems setObject:item forKey:name];
        }
    }
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) accesskey:(NSArray*)arguments withDict:(NSDictionary*)options {
    NSString*     callbackId   = [arguments objectAtIndex:0];
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Update an existing toolbar item's image.
 */
- (void) icon:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGToolBar* pgToolBar  = (PGToolBar*)[[self appDelegate] getCommandInstance:TOOL_BAR_PLUGIN];
    NSString* callbackId  = [arguments objectAtIndex:0];
    NSString* name        = [arguments objectAtIndex:1];
    //    NSString* imageName  = [arguments objectAtIndex:2];
    
    //    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
    //    [item setTitle: nil];
    //    UIImage* image = [UIImage imageNamed:imageName];
    //    [item setImage:image];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Update an existing toolbar item's title.
 */
- (void) label:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGToolBar* pgToolBar  = (PGToolBar*)[[self appDelegate] getCommandInstance:TOOL_BAR_PLUGIN];
    NSString* callbackId  = [arguments objectAtIndex:0];
    NSString* name        = [arguments objectAtIndex:1];
    NSString* title       = [arguments objectAtIndex:2];
    
    UIBarButtonItem* item = [pgToolBar.toolBarItems objectForKey:name];
    [item setTitle: title];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Remove an existing toolbar item
 * @param arguments Parameters used to identify the toolbar item to update
 *  -# \c name internal name used to represent this item when it was created
 */
- (void) delete:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGToolBar* pgToolBar  = (PGToolBar*)[[self appDelegate] getCommandInstance:TOOL_BAR_PLUGIN];
    NSString*  callbackId = [arguments objectAtIndex:0];
    NSString*  name       = [arguments objectAtIndex:1];
    UIBarButtonItem* item = [pgToolBar.toolBarItems objectForKey:name];
	
	NSMutableArray* items = [pgToolBar.toolBar.items mutableCopy];
	NSUInteger index = [items indexOfObject:item];
	if (index != NSNotFound)
	{
		[items removeObjectAtIndex:index];
		// either it's on the left or right - find it
        if (pgToolBar.toolBar.topItem.leftBarButtonItem == item) {
            pgToolBar.toolBar.topItem.leftBarButtonItem = nil;
        } if (pgToolBar.toolBar.topItem.rightBarButtonItem == item) {
            pgToolBar.toolBar.topItem.rightBarButtonItem = nil;
        }
	}
	
	[items release];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) disabled:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGToolBar* pgToolBar  = (PGToolBar*)[[self appDelegate] getCommandInstance:TOOL_BAR_PLUGIN];
    NSString*  callbackId = [arguments objectAtIndex:0];
    NSString*  name       = [arguments objectAtIndex:1];
    BOOL       enable     = [[arguments objectAtIndex:2] boolValue];
	
    UIBarButtonItem* item = [pgToolBar.toolBarItems objectForKey:name];
	
	NSUInteger index = [pgToolBar.toolBar.items indexOfObject:item];
	if (index != NSNotFound)
	{
		item.enabled = enable;
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}	

- (void) toolBarDidSelectItem:(UIBarButtonItem*)item
{
    NSString* jsCallBack = [NSString stringWithFormat:@"window.HTMLCommandElement.elements[%d].attribute.action();", item.tag];
    [super writeJavascript:jsCallBack];
}

@end
