//
//  NativeControls.h
//  
//
//  Created by Jesse MacFadyen on 10-02-03.
//  Improved by Shazron Abdullah 11-06-03
//  MIT Licensed

//  Originally this code was developed my Michael Nachbaur
//  Formerly -> PhoneGap :: UIControls.h
//  Created by Michael Nachbaur on 13/04/09.
//  Copyright 2009 Decaf Ninja Software. All rights reserved.

#import <PhoneGap/PhoneGapDelegate.h>
#import "NativeControls2.h"

#import <QuartzCore/QuartzCore.h>

@implementation NativeControls2

@synthesize tabBar, toolBar, tabBarItems, toolBarItems;
@synthesize lastTabBarPosition, lastToolBarPosition;

-(PGPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (NativeControls2*)[super initWithWebView:theWebView];
    if (self) 
	{
        self.tabBarItems = [[NSMutableDictionary alloc] initWithCapacity:5];
        self.toolBarItems = [[NSMutableDictionary alloc] initWithCapacity:5];
    }
    return self;
}

- (void) dealloc
{
	self.tabBar = nil;
	self.toolBar = nil;
	self.toolBarItems = nil;
	self.tabBarItems = nil;
	
    [super dealloc];
}

#pragma mark -
#pragma mark TabBar

- (void) removeTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (!self.tabBar) {
		return;
	}
	
	[self.webView pg_removeSiblingView:self.tabBar withAnimation:NO];
	[self.webView pg_relayout:NO];
	
	self.tabBar = nil;
}


- (void) createTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (self.tabBar) {
		return;
	}
	
    self.tabBar = [UITabBar new];
    self.tabBar.delegate = self;
    self.tabBar.multipleTouchEnabled   = NO;
    self.tabBar.autoresizesSubviews    = YES;
    self.tabBar.hidden                 = NO;
    self.tabBar.userInteractionEnabled = YES;
	self.tabBar.opaque = YES;
    [self.tabBar sizeToFit];
	
	self.webView.superview.autoresizesSubviews = YES;
	
	BOOL atBottom = YES;
	
    if (options) {
        atBottom = [[options objectForKey:@"position"] isEqualToString:@"bottom"];
    }
	
	self.lastTabBarPosition = atBottom?PGLayoutPositionBottom:PGLayoutPositionTop;
	[self.webView pg_addSiblingView:self.tabBar withPosition:self.lastTabBarPosition withAnimation:NO];
}

/**
 * Show the tab bar after its been created.
 */
- (void) showTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}
    
	if (![self.webView pg_hasSiblingView:self.tabBar]) {
		[self.webView pg_addSiblingView:self.tabBar withPosition:self.lastTabBarPosition withAnimation:NO];
	}
}

/**
 * Hide the tab bar
 */
- (void) hideTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        return;
	}
	
	if ([self.webView pg_hasSiblingView:self.tabBar]) {
		[self.webView pg_removeSiblingView:self.tabBar withAnimation:NO];
		[self.webView pg_relayout:NO];
	}
}

/**
 * Create a new tab bar item for use on a previously created tab bar.
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
- (void) createTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString* name      = [arguments objectAtIndex:0];
    NSString* title     = [arguments objectAtIndex:1];
    NSString* imageName = [arguments objectAtIndex:2];
    BOOL enable         = [[arguments objectAtIndex:3] boolValue];
    int tag             = [[arguments objectAtIndex:4] intValue];

    UITabBarItem *item = nil;    
    if ([imageName length] > 0) 
	{
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
		UIImage* image = [UIImage imageNamed:imageName];
		if (!image) {
			NSString* imagePath = [[PhoneGapDelegate class] pathForResource:imageName];
			image = [UIImage imageWithContentsOfFile:imagePath];
		}
		
        item = [[UITabBarItem alloc] initWithTitle:title image:image tag:tag];
    }

    if ([options objectForKey:@"badge"]) {
        item.badgeValue = [options objectForKey:@"badge"];
	}
    
	item.enabled = enable;
	
    BOOL animateItems = YES;
    if ([options objectForKey:@"animate"]) {
        animateItems = [(NSString*)[options objectForKey:@"animate"] boolValue];
	}
	
    NSMutableArray* items = [[self.tabBar items] mutableCopy];
	if (!items) {
		items = [[NSMutableArray alloc] initWithCapacity:1];
	}
	[items addObject:item];
	
    [self.tabBar setItems:items animated:animateItems];
	[items release];
	
	[self.tabBarItems setObject:item forKey:name];
	[item release];
}


/**
 * Update an existing tab bar item to change its title/badge value.
 */
- (void) updateTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString* name = [arguments objectAtIndex:0];
    UITabBarItem* item = [self.tabBarItems objectForKey:name];
    if (item) {
		item.title = [options objectForKey:@"title"];
        item.badgeValue = [options objectForKey:@"badge"];
	}
}

/**
 * Remove an existing tab bar item
 * @param arguments Parameters used to identify the tab bar item to update
 *  -# \c name internal name used to represent this item when it was created
 */
- (void) removeTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}
	
    NSString* name = [arguments objectAtIndex:0];
    UITabBarItem* item = [self.tabBarItems objectForKey:name];
	
	NSMutableArray* items = [self.tabBar.items mutableCopy];
	NSUInteger index = [items indexOfObject:item];
	if (index != NSNotFound) {
		[items removeObjectAtIndex:index];
		[self.tabBar setItems:items animated:YES];
	}
	
	[items release];
}

- (void) enableTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    NSString* name      = [arguments objectAtIndex:0];
    BOOL enable         = [[arguments objectAtIndex:1] boolValue];
	
    UITabBarItem* item = [self.tabBarItems objectForKey:name];
	
	NSUInteger index = [self.tabBar.items indexOfObject:item];
	if (index != NSNotFound) {
		item.enabled = enable;
	}
}

/**
 * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
 * @brief manually select a tab bar item
 * @param arguments the name of the tab bar item to select
 * @see createTabBarItem
 * @see showTabBarItems
 */
- (void) selectTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self createTabBar:nil withDict:nil];
	}

    NSString* itemName = [arguments objectAtIndex:0];
    UITabBarItem* item = [self.tabBarItems objectForKey:itemName];
    self.tabBar.selectedItem = item;
}

- (void)tabBar:(UITabBar*)tabBar didSelectItem:(UITabBarItem *)item
{
    NSString* jsCallBack = [NSString stringWithFormat:@"window.HTMLCommandElement.elements[%d].attribute.action();", item.tag];    
    [super writeJavascript:jsCallBack];
}

#pragma mark -
#pragma mark ToolBar

- (void) removeToolBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (!self.toolBar) {
		return;
	}
	
	[self.webView pg_removeSiblingView:self.toolBar withAnimation:NO];
	[self.webView pg_relayout:NO];
	
	self.toolBar = nil;
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
	
    self.toolBar = [[UIToolbar alloc] initWithFrame:toolBarBounds];
    [self.toolBar sizeToFit];
    self.toolBar.hidden                 = NO;
    self.toolBar.multipleTouchEnabled   = NO;
    self.toolBar.autoresizesSubviews    = YES;
    self.toolBar.userInteractionEnabled = YES;
    self.toolBar.barStyle               = style;
	
	self.lastToolBarPosition = atTop?PGLayoutPositionTop:PGLayoutPositionBottom;
	[self.webView pg_addSiblingView:self.toolBar withPosition:self.lastToolBarPosition withAnimation:NO];
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

    NSString* name      = [arguments objectAtIndex:0];
    NSString* title     = [arguments objectAtIndex:1];
    NSString* imageName = [arguments objectAtIndex:2];
    BOOL enable         = [[arguments objectAtIndex:3] boolValue];
    int tag             = [[arguments objectAtIndex:4] intValue];
	
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
	
    NSMutableArray* items = [[self.toolBar items] mutableCopy];
	if (!items) {
		items = [[NSMutableArray alloc] initWithCapacity:1];
	}
	[items addObject:item];

    [self.toolBar setItems:items animated:YES];
	[items release];
	
	[self.toolBarItems setObject:item forKey:name];
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
	
    NSString* name = [arguments objectAtIndex:0];
    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
	
	NSMutableArray* items = [self.toolBar.items mutableCopy];
	NSUInteger index = [items indexOfObject:item];
	if (index != NSNotFound)
	{
		[items removeObjectAtIndex:index];
		[self.toolBar setItems:items animated:YES];
	}
	
	[items release];
}

- (void) enableToolBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.toolBar) {
        [self createToolBar:nil withDict:nil];
	}
	
    NSString* name      = [arguments objectAtIndex:0];
    BOOL enable         = [[arguments objectAtIndex:1] boolValue];
	
    UIBarButtonItem* item = [self.toolBarItems objectForKey:name];
	
	NSUInteger index = [self.toolBar.items indexOfObject:item];
	if (index != NSNotFound)
	{
		item.enabled = enable;
	}
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
}

@end
