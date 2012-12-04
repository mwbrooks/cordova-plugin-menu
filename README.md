# Native Menu Plugin for Apache Cordova

## Overview

The cordova-plugin-menu provides an HTML interface to define a
menu types. Each Cordova platform will then render the appropriate
native menu from the HTML.

The implementation is loose polyfill of the [W3C HTMLMenuElement](http://dev.w3.org/html5/spec/single-page.html#the-menu-element).

## Platform Support

- Android
- BlackBerry 10
- iOS

## Example

    <menu type="toolbar" label="Tweets">
        <command label="Back" icon="img/back.png" disabled="false" action="Page.back();" accesskey="back" />
        <command label="New"  icon="img/new.png"  disabled="false" action="Page.new();"  accesskey=""     />
    </menu>

    <menu type="context">
        <command label="Tweets"  icon="bubble.png"  disabled="false" action="Page.tweets();"  accesskey=""       />
        <command label="Replies" icon="reply.png"   disabled="false" action="Page.replies();" accesskey=""       />
        <command label="Search"  icon="search.png"  disabled="false" action="Page.search();"  accesskey="search" />
        <command label="Profile" icon="profile.png" disabled="false" action="Page.profile();" accesskey=""       />
    </menu>

## HTML API

Menus and commands are defined in the DOM and represented as HTML.
Similar to other HTML elments, you can define the role of the menu and commands
with HTML attributes. During runtime, you can interact with the menu and commands
using JavaScript.

&#60;menu&#62; API
------------------

__&#60;menu type="toolbar"&#62;__

Create a toolbar menu.

- Android: Creates a title bar.
- BlackBerry: @DISCUSS
- iOS: Creates a native ToolBar. The Cordova webview is repositioned below the toolbar.

__&#60;menu type="context"&#62;__

Create a context menu. This menu is typically invoked by the device's menu button.

- Android: Creates an Android menu that is invoked by the menu button.
- BlackBerry: Creates a BlackBerry menu that is invoked by the menu button.
- iOS: Creates a native TabBar. The Cordova webview is repositioned above the TabBar.

__&#60;menu label="Home"&#62;__

Add a title to the menu. The title will behave differently for a `type="toolbar"` and `type="context"` menu.

- Android: Ignored because context menus do not have titles.
- BlackBerry: Ignored because context menus do not have titles.
- iOS: A title is added to the ToolBar but ignored for the TabBar.

&#60;command&#62; API
----------------------

__&#60;command label="toolbar"&#62;__

Add a title to a command button.

__&#60;command icon="context"&#62;__

Add an icon image to a command button.

__&#60;command disabled="true"&#62;__

Enable or disabled a command button.

- Android: Disabled commands are hidden.
- BlackBerry: Disabled commands are hidden.
- iOS: Disabled commands are faded.

__&#60;command action="Home"&#62;__

Attach callback function or JavaScript expression to a command.

Inline HTML can use a JavaScript expression such as:

    <command action="someGlobalFunction();">
    <command action="console.log('hello'); console.log('world');">

JavaScript can attach callback functions as such:

    // get a handle to a command element
    var cmd = document.getElementById('someCommandId');

    // anonymous function
    cmd.setAttribute('action', function() {
        console.log('hello from an anonymous function!');
    });

    // function handle
    var callback = function() {
        console.log('hello from a callback function!');
    });

    cmd.setAttribute('action', callback);

JavaScript API
--------------

Similar to other HTML elements, you can create and manipulate `<menu>` and `<command>` using JavaScript.

HTML:

    <menu type="toolbar">
        <command label="Home" />
    </menu>

JavaScript:

    var menu = document.createElement('menu');
    menu.setAttribute('type', 'toolbar');
    document.body.appendChild(menu);

    var command = document.createElement('command');
    command.setAttribute('label', 'Home');
    command.setAttribute('action', function() {
        console.log('Home');
    });
    menu.appendChild(command);

Want to contribute?
-------------------

### Report or fix an issue

We use [GitHub Issues](https://github.com/mwbrooks/cordova-plugin-menu/issues)

By the way, you rock! Thanks for helping us improve cordova-plugin-menu!

### Pull Requests

Pull requests are welcome!

We appreciate the use of topic branches.

    git checkout -b issue_23

    # code

    git commit -m "Issue 23: Fix a bad bug."

    git push origin issue_23

    # send pull request from branch issue_23 to mwbrooks:master
