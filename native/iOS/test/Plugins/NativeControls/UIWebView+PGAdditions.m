//
//  UIWebview+PGAdditions.m

#import "UIWebView+PGAdditions.h"


@implementation UIWebView (PGLayoutAdditions)

/* For dynamically adding properties to an existing class (in this case UIWebView, 
   we need to pass a unique identifier, which is of type void*
   the easiest way for this is to pass the address of a static char, which guaranteed to be unique
 */
static char nameKey; // CGRect

- (void) pg_addSiblingView:(UIView*) siblingView withPosition:(PGLayoutPosition)position withAnimation:(BOOL)animate
{
	NSAssert(siblingView.frame.size.height < self.frame.size.height, @"PhoneGap: Cannot add a sibling view that is larger than the UIWebView");

	CGRect siblingViewFrame = siblingView.frame;
	CGRect webViewFrame = self.frame;
	CGRect screenBounds = [[UIScreen mainScreen] bounds];
	
	NSEnumerator* enumerator = [self.superview.subviews objectEnumerator];
	UIView* subview;
	
	switch (position)
	{
		case PGLayoutPositionTop:
		{
			// shift down y-position of all sibling views by new view's height (only PGLayoutPositionTop items), 
			while ( (subview = [enumerator nextObject]) ) {
				if ([self pg_layoutPosition:subview] == PGLayoutPositionTop) {
					CGRect subviewFrame = subview.frame;
					subviewFrame.origin.y += siblingView.frame.size.height;
					subview.frame = subviewFrame;
				}
			}
			
			// webView is shrunk by new view's height (origin shift down as well)
			webViewFrame.origin.y += siblingView.frame.size.height;
			webViewFrame.size.height -= siblingView.frame.size.height;
			self.frame = webViewFrame;
			
			// make sure the siblingView's frame is to the top
			siblingViewFrame.origin.y = 0;
			siblingView.frame = siblingViewFrame;
		}
			break;
		case PGLayoutPositionBottom:
		{
			// shift up y-position of all sibling views by new view's height (only PGLayoutPositionBottom items), 
			while ( (subview = [enumerator nextObject]) ) {
				if ([self pg_layoutPosition:subview] == PGLayoutPositionBottom) {
					CGRect subviewFrame = subview.frame;
					subviewFrame.origin.y -= siblingView.frame.size.height;
					subview.frame = subviewFrame;
				}
			}
			
			// webView is shrunk by new view's height (no origin shift)
			webViewFrame.size.height -= siblingView.frame.size.height;
			self.frame = webViewFrame;
			
			// make sure the siblingView's frame is to the bottom
			siblingViewFrame.origin.y = screenBounds.size.height - siblingView.frame.size.height;
			siblingView.frame = siblingViewFrame;
		}
			break;
		default: // not specified, or unsupported, so we return
			return;
	}
	
	[self.superview addSubview:siblingView];
}

- (void) pg_moveSiblingView:(UIView*) siblingView toPosition:(PGLayoutPosition)position withAnimation:(BOOL)animate
{
	// this is essentially a remove, then add
	[self pg_removeSiblingView:siblingView withAnimation:animate];
	[self pg_relayout:animate];
	[self pg_addSiblingView:siblingView withPosition:position withAnimation:animate];
}

- (void) pg_removeSiblingView:(UIView*) siblingView withAnimation:(BOOL)animate
{
	// find the view in the superView hierarchy. we could use viewWithTag,
	// but this assumes callers have tagged their views (and we don't really want to tag management)
	
	NSEnumerator* enumerator = [self.superview.subviews objectEnumerator];
	id subview;
	BOOL found = NO;
	
	while (subview = [enumerator nextObject]) {
		if (subview == siblingView) {
			found = YES;
		}
	}
	
	[siblingView removeFromSuperview];
}

- (void) pg_relayout:(BOOL)animate
{
	// TODO: check each sibling view, and re-size if necessary (UIWebview) (top to bottom)
}

- (PGLayoutPosition) pg_layoutPositionOfView:(UIView*)siblingView fromView:(UIView*)fromView
{
	CGRect fromViewFrame = fromView.frame;
	CGRect siblingFrame = siblingView.frame;
	
	if (siblingFrame.origin.y > (fromViewFrame.origin.y + fromViewFrame.size.height)) 
	{
		return PGLayoutPositionBottom;
	} 
	else if (fromViewFrame.origin.y > (siblingFrame.origin.y + siblingFrame.size.height)) 
	{
		return PGLayoutPositionTop;
	} 
	else 
	{
		return PGLayoutPositionUnknown;
	}
}

- (PGLayoutPosition) pg_layoutPosition:(UIView*)siblingView
{
	return [self pg_layoutPositionOfView:siblingView fromView:self];
}

- (BOOL) pg_viewsAreIntersecting
{
	NSArray* subviews = self.superview.subviews; 
	NSInteger count = [subviews count];
	
	// for a low number of subviews, this algorithm is acceptable
	for (NSInteger i=0; i < count; ++i)
	{
		UIView* currentView = [subviews objectAtIndex:i];
		// check the current, with subsequent items
		for(NSInteger j=i+1; j < count; ++j)
		{
			UIView* nextView = [subviews objectAtIndex:j];
			if (CGRectIntersectsRect(currentView.frame, nextView.frame)) {
				return YES;
			}
		}
	}
	
	return NO;
}

@end
