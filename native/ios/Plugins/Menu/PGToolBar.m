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
