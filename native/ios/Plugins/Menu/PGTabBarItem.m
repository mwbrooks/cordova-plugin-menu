//
//  PGTabBarItem.m
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

#import "PGTabBarItem.h"
#import <PhoneGap/PhoneGapDelegate.h>
#import "PGTabBar.h"

#define TAB_BAR_PLUGIN @"com.phonegap.menu.context"

@implementation PGTabBarItem

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
- (void) create:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGTabBar* pgTabBar   = (PGTabBar*)[[self appDelegate] getCommandInstance:TAB_BAR_PLUGIN];
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    NSString* title      = @"";
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
	
    NSMutableArray* items = [[pgTabBar.tabBar items] mutableCopy];
	if (!items) {
		items = [[NSMutableArray alloc] initWithCapacity:1];
	}
	[items addObject:item];
	
    [pgTabBar.tabBar setItems:items animated:animateItems];
	[items release];
	
	[pgTabBar.tabBarItems setObject:item forKey:name];
	[item release];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}


///**
// * Update an existing tab bar item to change its title/badge value.
// */
//- (void) updateTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options
//{
//    if (!self.tabBar) {
//        [self create:nil withDict:nil];
//	}
//
//    NSString* callbackId  = [arguments objectAtIndex:0];
//    NSString* name = [arguments objectAtIndex:1];
//    
//    UITabBarItem* item = [self.tabBarItems objectForKey:name];
////    if (item) {
////		item.title = [options objectForKey:@"label"];
////        item.badgeValue = [options objectForKey:@"badge"];
////	}
//    
//    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
//    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
//}

/**
 * Update an existing tab bar item's image.
 */
- (void) icon:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGTabBar* pgTabBar   = (PGTabBar*)[[self appDelegate] getCommandInstance:TAB_BAR_PLUGIN];
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    NSString* imageName  = [arguments objectAtIndex:2];
    
    NSString* imagePath = [[PhoneGapDelegate class] pathForResource:imageName];
    UIImage*  image     = [UIImage imageWithContentsOfFile:imagePath];
    
    UITabBarItem* item = [pgTabBar.tabBarItems objectForKey:name];
    [item setImage:image];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Update an existing tab bar item's title.
 */
- (void) label:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGTabBar* pgTabBar   = (PGTabBar*)[[self appDelegate] getCommandInstance:TAB_BAR_PLUGIN];
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    NSString* title      = [arguments objectAtIndex:2];
    
    UITabBarItem* item = [pgTabBar.tabBarItems objectForKey:name];
    [item setTitle: title];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Remove an existing tab bar item
 * @param arguments Parameters used to identify the tab bar item to update
 *  -# \c name internal name used to represent this item when it was created
 */
- (void) delete:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGTabBar* pgTabBar   = (PGTabBar*)[[self appDelegate] getCommandInstance:TAB_BAR_PLUGIN];
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    UITabBarItem* item   = [pgTabBar.tabBarItems objectForKey:name];
	
	NSMutableArray* items = [pgTabBar.tabBar.items mutableCopy];
	NSUInteger index = [items indexOfObject:item];
	if (index != NSNotFound) {
		[items removeObjectAtIndex:index];
		[pgTabBar.tabBar setItems:items animated:YES];
	}
	
	[items release];
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) accesskey:(NSArray*)arguments withDict:(NSDictionary*)options {
    NSString*     callbackId   = [arguments objectAtIndex:0];
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) disabled:(NSArray*)arguments withDict:(NSDictionary*)options
{
    PGTabBar* pgTabBar   = (PGTabBar*)[[self appDelegate] getCommandInstance:TAB_BAR_PLUGIN];
    NSString* callbackId = [arguments objectAtIndex:0];
    NSString* name       = [arguments objectAtIndex:1];
    BOOL disabled        = [[arguments objectAtIndex:2] boolValue];
	
    UITabBarItem* item = [pgTabBar.tabBarItems objectForKey:name];
	
	NSUInteger index = [pgTabBar.tabBar.items indexOfObject:item];
	if (index != NSNotFound) {
		item.enabled = !disabled;
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

@end
