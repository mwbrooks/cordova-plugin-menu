//
//  PGTabBar.m
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
#import "PGTabBar.h"

@implementation PGTabBar

@synthesize tabBar, tabBarItems;
@synthesize lastTabBarPosition;

-(PGPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (PGTabBar*)[super initWithWebView:theWebView];
    if (self) 
	{
        self.tabBarItems = [[NSMutableDictionary alloc] initWithCapacity:5];
    }
    return self;
}

- (void) dealloc
{
	self.tabBar = nil;
	self.tabBarItems = nil;
	
    [super dealloc];
}

- (void) delete:(NSArray*)arguments withDict:(NSDictionary*)options
{
	if (!self.tabBar) {
		return;
	}
	
	[self.webView pg_removeSiblingView:self.tabBar withAnimation:NO];
	[self.webView pg_relayout:NO];
	
	self.tabBar = nil;
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}


- (void) create:(NSArray*)arguments withDict:(NSDictionary*)options
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
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void) label:(NSArray*)arguments withDict:(NSDictionary*)options {
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString*     callbackId   = [arguments objectAtIndex:0];
    
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

/**
 * Show the tab bar after its been created.
 */
- (void) showTabBar:(NSArray*)arguments withDict:(NSDictionary*)options
{
    if (!self.tabBar) {
        [self create:nil withDict:nil];
	}
    
	if (![self.webView pg_hasSiblingView:self.tabBar]) {
		[self.webView pg_addSiblingView:self.tabBar withPosition:self.lastTabBarPosition withAnimation:NO];
	}
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
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
    
    PluginResult* pluginResult = [PluginResult resultWithStatus: PGCommandStatus_OK];
    NSString* callbackId = [arguments objectAtIndex:0];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

@end
