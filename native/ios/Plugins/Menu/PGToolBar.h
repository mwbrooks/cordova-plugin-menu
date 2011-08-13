//
//  PGToolBar.h
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
#import <UIKit/UIToolbar.h>
#import <PhoneGap/PGPlugin.h>
#import "UIWebView+PGAdditions.h"

@interface PGToolBar : PGPlugin <UIActionSheetDelegate> {
    
}

@property (nonatomic, assign) PGLayoutPosition lastToolBarPosition;
@property (nonatomic, retain) UINavigationBar* toolBar;
@property (nonatomic, retain) NSMutableDictionary* toolBarItems;

- (void) create:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) delete:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) label:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) showToolBar:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void) hideToolBar:(NSArray*)arguments withDict:(NSDictionary*)options;

@end
