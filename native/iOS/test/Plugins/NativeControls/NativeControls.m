//
//  NativeControls.h
//  
//
//  Created by Jesse MacFadyen on 10-02-03.
//  MIT Licensed

//  Originally this code was developed my Michael Nachbaur
//  Formerly -> PhoneGap :: UIControls.h
//  Created by Michael Nachbaur on 13/04/09.
//  Copyright 2009 Decaf Ninja Software. All rights reserved.

#import "UIWebView+PGAdditions.h"
#import "NativeControls.h"

#import <QuartzCore/QuartzCore.h>

@implementation NativeControls

@synthesize tabBar, toolBar, tabBarItems, toolBarItems;

-(PhoneGapCommand*) initWithWebView:(UIWebView*)theWebView
{
    self = (NativeControls*)[super initWithWebView:theWebView];
    if (self) {
        self.tabBarItems = [[NSMutableDictionary alloc] initWithCapacity:5];
    }
    return self;
}

- (void)dealloc
{
	self.tabBar = nil;
	self.toolBar = nil;
	self.toolBarItems = nil;
	self.tabBarItems = nil;
	
    [super dealloc];
}

#pragma mark -
#pragma mark TabBar

/**
 * Create a native tab bar at either the top or the bottom of the display.
 * @brief creates a tab bar
 * @param arguments unused
 * @param options unused
 */
- (void)createTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    self.tabBar = [UITabBar new];
    [self.tabBar sizeToFit];
    self.tabBar.delegate = self;
    self.tabBar.multipleTouchEnabled   = NO;
    self.tabBar.autoresizesSubviews    = YES;
    self.tabBar.hidden                 = YES;
    self.tabBar.userInteractionEnabled = YES;
	self.tabBar.opaque = YES;
	
	self.webView.superview.autoresizesSubviews = YES;
}

/**
 * Show the tab bar after its been created.
 * @brief show the tab bar
 * @param arguments unused
 * @param options used to indicate options for where and how the tab bar should be placed
 * - \c height integer indicating the height of the tab bar (default: \c 49)
 * - \c position specifies whether the tab bar will be placed at the \c top or \c bottom of the screen (default: \c bottom)
 */
- (void)showTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}
	
	// if we are calling this again when its shown, reset
	if (!self.tabBar.hidden) {
		return;
	}

    CGFloat height = 0.0f;
    BOOL atBottom = YES;
	
//	CGRect offsetRect = [ [UIApplication sharedApplication] statusBarFrame];
    
    if (options) {
        height   = [[options objectForKey:@"height"] floatValue];
        atBottom = [[options objectForKey:@"position"] isEqualToString:@"bottom"];
    }
	if (height == 0) {
		height = 49.0f;
	}
	
    self.tabBar.hidden = NO;
	[self.webView pg_addSiblingView:self.tabBar withPosition:(atBottom?PGLayoutPositionBottom:PGLayoutPositionTop) withAnimation:NO];
}

/**
 * Hide the tab bar
 * @brief hide the tab bar
 * @param arguments unused
 * @param options unused
 */
- (void)hideTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}
    
	self.tabBar.hidden = YES;

	[self.webView pg_relayout:NO];
}

/**
 * Create a new tab bar item for use on a previously created tab bar.  Use ::showTabBarItems to show the new item on the tab bar.
 *
 * If the supplied image name is one of the labels listed below, then this method will construct a tab button
 * using the standard system buttons.  Note that if you use one of the system images, that the \c title you supply will be ignored.
 * - <b>Tab Buttons</b>
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
 * @brief create a tab bar item
 * @param arguments Parameters used to create the tab bar
 *  -# \c name internal name to refer to this tab by
 *  -# \c title title text to show on the tab, or null if no text should be shown
 *  -# \c image image filename or internal identifier to show, or null if now image should be shown
 *  -# \c tag unique number to be used as an internal reference to this button
 * @param options Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if nil or unspecified, the badge will be hidden
 */
- (void)createTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString  *name      = [arguments objectAtIndex:0];
    NSString  *title     = [arguments objectAtIndex:1];
    NSString  *imageName = [arguments objectAtIndex:2];
    int tag              = [[arguments objectAtIndex:3] intValue];

    UITabBarItem *item = nil;    
    if ([imageName length] > 0) {
        UITabBarSystemItem systemItem = -1;
        if ([imageName isEqualToString:@"tabButton:More"])       systemItem = UITabBarSystemItemMore;
        if ([imageName isEqualToString:@"tabButton:Favorites"])  systemItem = UITabBarSystemItemFavorites;
        if ([imageName isEqualToString:@"tabButton:Featured"])   systemItem = UITabBarSystemItemFeatured;
        if ([imageName isEqualToString:@"tabButton:TopRated"])   systemItem = UITabBarSystemItemTopRated;
        if ([imageName isEqualToString:@"tabButton:Recents"])    systemItem = UITabBarSystemItemRecents;
        if ([imageName isEqualToString:@"tabButton:Contacts"])   systemItem = UITabBarSystemItemContacts;
        if ([imageName isEqualToString:@"tabButton:History"])    systemItem = UITabBarSystemItemHistory;
        if ([imageName isEqualToString:@"tabButton:Bookmarks"])  systemItem = UITabBarSystemItemBookmarks;
        if ([imageName isEqualToString:@"tabButton:Search"])     systemItem = UITabBarSystemItemSearch;
        if ([imageName isEqualToString:@"tabButton:Downloads"])  systemItem = UITabBarSystemItemDownloads;
        if ([imageName isEqualToString:@"tabButton:MostRecent"]) systemItem = UITabBarSystemItemMostRecent;
        if ([imageName isEqualToString:@"tabButton:MostViewed"]) systemItem = UITabBarSystemItemMostViewed;
        if (systemItem != -1) {
            item = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:tag];
		}
    }
    
    if (item == nil) {
        NSLog(@"Creating with custom image and title");
        item = [[UITabBarItem alloc] initWithTitle:title image:[UIImage imageNamed:imageName] tag:tag];
    }

    if ([options objectForKey:@"badge"]) {
        item.badgeValue = [options objectForKey:@"badge"];
	}
    
    [self.tabBarItems setObject:item forKey:name];
	[item release];
}


/**
 * Update an existing tab bar item to change its badge value.
 * @brief update the badge value on an existing tab bar item
 * @param arguments Parameters used to identify the tab bar item to update
 *  -# \c name internal name used to represent this item when it was created
 * @param options Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if nil or unspecified, the badge will be hidden
 */
- (void)updateTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString  *name = [arguments objectAtIndex:0];
    UITabBarItem *item = [self.tabBarItems objectForKey:name];
    if (item) {
        item.badgeValue = [options objectForKey:@"badge"];
	}
}


/**
 * Show previously created items on the tab bar
 * @brief show a list of tab bar items
 * @param arguments the item names to be shown
 * @param options dictionary of options, notable options including:
 *  - \c animate indicates that the items should animate onto the tab bar
 * @see createTabBarItem
 * @see createTabBar
 */
- (void)showTabBarItems:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}
    
    int i, count = [arguments count];
    NSMutableArray *items = [[NSMutableArray alloc] initWithCapacity:count];
    for (i = 0; i < count; i++) {
        NSString *itemName = [arguments objectAtIndex:i];
        UITabBarItem *item = [self.tabBarItems objectForKey:itemName];
        if (item) {
            [items addObject:item];
		}
    }
    
    BOOL animateItems = YES;
    if ([options objectForKey:@"animate"]) {
        animateItems = [(NSString*)[options objectForKey:@"animate"] boolValue];
	}
    [self.tabBar setItems:items animated:animateItems];
	[items release];
}

/**
 * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
 * @brief manually select a tab bar item
 * @param arguments the name of the tab bar item to select
 * @see createTabBarItem
 * @see showTabBarItems
 */
- (void)selectTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString *itemName = [arguments objectAtIndex:0];
    UITabBarItem *item = [self.tabBarItems objectForKey:itemName];
    if (item) {
        self.tabBar.selectedItem = item;
	}
    else {
        self.tabBar.selectedItem = nil;
	}
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
    NSString * jsCallBack = [NSString stringWithFormat:@"window.plugins.nativeControls.tabBarItemSelected(%d);", item.tag];    
    [super writeJavascript:jsCallBack];
}

#pragma mark -
#pragma mark ToolBar


/*********************************************************************************/
- (void)createToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    CGFloat height   = 45.0f;
    BOOL atTop       = YES;
    UIBarStyle style = UIBarStyleBlackOpaque;

    NSDictionary* toolBarSettings = options;//[settings objectForKey:@"ToolBarSettings"];
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

    CGRect toolBarBounds = webView.bounds;
	toolBarBounds.size.height = height;
	
    self.toolBar = [[UIToolbar alloc] initWithFrame:toolBarBounds];
    [self.toolBar sizeToFit];
    self.toolBar.hidden                 = NO;
    self.toolBar.multipleTouchEnabled   = NO;
    self.toolBar.autoresizesSubviews    = YES;
    self.toolBar.userInteractionEnabled = YES;
    self.toolBar.barStyle               = style;
	
	[self.webView pg_addSiblingView:self.toolBar withPosition:atTop?PGLayoutPositionTop:PGLayoutPositionBottom withAnimation:NO];
}

- (void)toolBarDidSelectItem:(UIBarButtonItem*)item
{
	//TODO:
}

- (void)createToolBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}

    NSString* name      = [arguments objectAtIndex:0];
    NSString* title     = [arguments objectAtIndex:1];
    NSString* imageName = [arguments objectAtIndex:2];
    int tag             = [[arguments objectAtIndex:3] intValue];
	
	/*
	 UIBarButtonSystemItemDone,
	 UIBarButtonSystemItemCancel,
	 UIBarButtonSystemItemEdit,  
	 UIBarButtonSystemItemSave,  
	 UIBarButtonSystemItemAdd,
	 UIBarButtonSystemItemFlexibleSpace,
	 UIBarButtonSystemItemFixedSpace,
	 UIBarButtonSystemItemCompose,
	 UIBarButtonSystemItemReply,
	 UIBarButtonSystemItemAction,
	 UIBarButtonSystemItemOrganize,
	 UIBarButtonSystemItemBookmarks,
	 UIBarButtonSystemItemSearch,
	 UIBarButtonSystemItemRefresh,
	 UIBarButtonSystemItemStop,
	 UIBarButtonSystemItemCamera,
	 UIBarButtonSystemItemTrash,
	 UIBarButtonSystemItemPlay,
	 UIBarButtonSystemItemPause,
	 UIBarButtonSystemItemRewind,
	 UIBarButtonSystemItemFastForward,
	 UIBarButtonSystemItemUndo,
	 UIBarButtonSystemItemRedo,
	 
	 */
	
    UITabBarItem *item = nil;    
    if ([imageName length] > 0) {
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
			item.tag = tag;
		}
    }
    
    if (item == nil && [title length] == 0) {
        NSLog(@"Creating with custom image and title");
		item = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:imageName] style:UIBarButtonItemStylePlain 
																				   target:self action:@selector(toolBarDidSelectItem:)];
		item.tag = tag;
    }	
	
    NSMutableArray* items = [[self.toolBar items] mutableCopy];
	[items addObject:item];

    [self.toolBar setItems:items animated:YES];
	[items release];
	
	[self.toolBarItems setObject:item forKey:name];
}


@end
