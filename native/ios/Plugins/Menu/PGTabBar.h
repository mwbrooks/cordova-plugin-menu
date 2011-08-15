//
//  PGTabBar.h
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
#import <UIKit/UIKit.h>
#import <UIKit/UITabBar.h>
#import <PhoneGap/PGPlugin.h>
#import "UIWebView+PGAdditions.h"

@interface PGTabBar : PGPlugin <UITabBarDelegate, UIActionSheetDelegate> {
    
}

@property (nonatomic, assign) PGLayoutPosition lastTabBarPosition;
@property (nonatomic, retain) UITabBar* tabBar;
@property (nonatomic, retain) NSMutableDictionary* tabBarItems;

- (void) create:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) delete:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) label:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) showTabBar:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) hideTabBar:(NSArray*)arguments withDict:(NSDictionary*)options;

@end
