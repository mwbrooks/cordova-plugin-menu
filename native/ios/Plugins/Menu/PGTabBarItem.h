//
//  PGTabBarItem.h
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

#import <Foundation/Foundation.h>
#import <PhoneGap/PGPlugin.h>

@interface PGTabBarItem : PGPlugin {
    
}

- (void) createTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) removeTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) enableTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options;
//- (void) updateTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) updateTabBarItemImage:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) updateTabBarItemTitle:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) selectTabBarItem:(NSArray*)arguments withDict:(NSDictionary*)options;

@end
