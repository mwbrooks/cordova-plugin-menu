//
//  PGToolBar.m
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

#import <QuartzCore/QuartzCore.h>
#import <PhoneGap/PhoneGapDelegate.h>
#import "PGToolBar.h"

@implementation PGToolBar

@synthesize toolBar, toolBarItems;
@synthesize lastToolBarPosition;

-(PGPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (PGToolBar*)[super initWithWebView:theWebView];
    if (self) 
	{
        self.toolBarItems = [[NSMutableDictionary alloc] initWithCapacity:5];
    }
    return self;
}

- (void) dealloc
{
	self.toolBar = nil;
	self.toolBarItems = nil;
	
    [super dealloc];
}

- (void) updateToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (!self.toolBar) {
		return;
	}
    
    //    if ([options objectForKey:@"label"]) {
    //        self.toolBar.topItem.title  = [options objectForKey:@"label"];
    //	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) removeToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (!self.toolBar) {
		return;
	}
	
	[self.webView pg_removeSiblingView:self.toolBar withAnimation:NO];
	[self.webView pg_relayout:NO];
	
	self.toolBar = nil;
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) createToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (self.toolBar) {
		return;
	}
	
    CGFloat height   = 45.0f;
    BOOL atTop       = YES;
    UIBarStyle style = UIBarStyleBlackOpaque;
    
    NSDictionary* toolBarSettings = options;
    if (toolBarSettings) 
	{
        if ([toolBarSettings objectForKey:@"height"])
            height = [[toolBarSettings objectForKey:@"height"] floatValue];
		
        if ([toolBarSettings objectForKey:@"position"]) {
            atTop  = [[toolBarSettings objectForKey:@"position"] isEqualToString:@"top"];
		}
        
        NSString *styleStr = [toolBarSettings objectForKey:@"style"];
        if ([styleStr isEqualToString:@"Default"])
            style = UIBarStyleDefault;
        else if ([styleStr isEqualToString:@"BlackOpaque"])
            style = UIBarStyleBlackOpaque;
        else if ([styleStr isEqualToString:@"BlackTranslucent"])
            style = UIBarStyleBlackTranslucent;
    }
    
    CGRect toolBarBounds = self.webView.bounds;
	toolBarBounds.size.height = height;
	
    self.toolBar = [[UINavigationBar alloc] init];
    [self.toolBar sizeToFit];
    [self.toolBar pushNavigationItem:[[UINavigationItem alloc] initWithTitle:@""] animated:NO];
    self.toolBar.autoresizesSubviews    = YES;
    self.toolBar.userInteractionEnabled = YES;
    self.toolBar.barStyle               = style;
	
	self.lastToolBarPosition = atTop?PGLayoutPositionTop:PGLayoutPositionBottom;
	[self.webView pg_addSiblingView:self.toolBar withPosition:self.lastToolBarPosition withAnimation:NO];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) toolBarDidSelectItem:(UIBarButtonItem*)item
{
    NSString* jsCallBack = [NSString stringWithFormat:@"window.HTMLCommandElement.elements[%d].attribute.action();", item.tag];
    [super writeJavascript:jsCallBack];
}

- (void) createToolBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
    
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    NSString* title      = @" ";
    NSString* imageName  = @"";
    BOOL enable          = true;
    int tag              = [name intValue];
    
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
        if (!self.toolBar.topItem.leftBarButtonItem) {
            self.toolBar.topItem.leftBarButtonItem = item;
            [self.toolBarItems setObject:item forKey:name];
        }
    } else {
        if (!self.toolBar.topItem.rightBarButtonItem) {
            self.toolBar.topItem.rightBarButtonItem = item;
            [self.toolBarItems setObject:item forKey:name];
        }
    }
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Update an existing toolbar item's image.
 */
- (void) updateToolBarItemImage:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
    
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
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
- (void) updateToolBarItemTitle:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
    
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    NSString* title      = [arguments objectAtIndex:2];
    
    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
    [item setTitle: title];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Remove an existing toolbar item
 * @param arguments Parameters used to identify the toolbar item to update
 *  -# \c name internal name used to represent this item when it was created
 */
- (void) removeToolBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
	
    NSString* callbackId  = [arguments objectAtIndex:0];
    NSString* name = [arguments objectAtIndex:1];
    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
	
	NSMutableArray* items = [self.toolBar.items mutableCopy];
	NSUInteger index = [items indexOfObject:item];
	if (index != NSNotFound)
	{
		[items removeObjectAtIndex:index];
		// either it's on the left or right - find it
        if (self.toolBar.topItem.leftBarButtonItem == item) {
            self.toolBar.topItem.leftBarButtonItem = nil;
        } if (self.toolBar.topItem.rightBarButtonItem == item) {
            self.toolBar.topItem.rightBarButtonItem = nil;
        }
	}
	
	[items release];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) enableToolBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
	
    NSString* callbackId  = [arguments objectAtIndex:0];
    NSString* name      = [arguments objectAtIndex:1];
    BOOL enable         = [[arguments objectAtIndex:2] boolValue];
	
    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
	
	NSUInteger index = [self.toolBar.items indexOfObject:item];
	if (index != NSNotFound)
	{
		item.enabled = enable;
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}	

/**
 * Show the toolbar after its been created.
 */
- (void) showToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
    
	if (![self.webView pg_hasSiblingView:self.toolBar]) {
		[self.webView pg_addSiblingView:self.toolBar withPosition:self.lastToolBarPosition withAnimation:NO];
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Hide the toolbar
 */
- (void) hideToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        return;
	}
    
	if ([self.webView pg_hasSiblingView:self.toolBar]) {
		[self.webView pg_removeSiblingView:self.toolBar withAnimation:NO];
		[self.webView pg_relayout:NO];
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

@end
