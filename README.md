PhoneGap Plugin for Native Menus
================================

> Add a native ToolBar, TabBar, or Menu to a PhoneGap platform.

Summary
-------

The phonegap-plugin-menu provides an HTML interface to define a
menu types. Each PhoneGap platform will then render the appropriate
native menu from the HTML.

The implementation is loose polyfill of the [W3C HTMLMenuElement / HTMLCommandElement Specification](http://www.w3.org/TR/html5/interactive-elements.html).

Platform Support
----------------

- Android
- BlackBerry WebWorks
- iOS

Example
-------

    <menu type="toolbar" label="Tweets">
        <command label="Back" icon="img/back.png" disabled="false" action="Page.back();" accesskey="back" />
        <command label="New"  icon="img/new.png"  disabled="false" action="Page.new();"  accesskey="" />
    </menu>

    <menu type="context">
        <command label="Tweets"  icon="bubble.png"  disabled="false" action="Page.tweets();"  accesskey="" />
        <command label="Replies" icon="reply.png"   disabled="false" action="Page.replies();" accesskey="" />
        <command label="Search"  icon="search.png"  disabled="false" action="Page.search();"  accesskey="search" />
        <command label="Profile" icon="profile.png" disabled="false" action="Page.profile();" accesskey="" />
    </menu>

Install from Download
---------------------

1. Download the latest release from [phonegap-plugin-menu Downloads Page](https://github.com/nitobi/phonegap-plugin-menu/archives/master).
2. Extract the release
3. For your platform, read `INSTALL`
    - `/android/INSTALL`
    - `/blackberry/INSTALL`
    - `/desktop/INSTALL`
    - `/ios/INSTALL`

Install from Source
-------------------

1. Clone or download the source code
2. Change into the source code directory
3. Run `make` to view the available options
4. Run `make dist`
5. Follow _Install from Download_ instructions

HTML API
--------

Menus and commands are represented purely in HTML. You can customize the menu and commands using changes their HTML attributes.

&#60;menu&#62; API
------------------

__&#60;menu type="toolbar"&#62;__

Create a toolbar menu.

- Android: Treats toolbar as a context menu.
- BlackBerry: Treat toolbar as a context menu.
- iOS: Creates a native ToolBar. The PhoneGap webview is repositioned below the toolbar.

__&#60;menu type="context"&#62;__

Create a context menu. This menu is typically invoked by the device's menu button.

- Android: Creates an Android menu that is invoked by the menu button.
- BlackBerry: Creates a BlackBerry menu that is invoked by the menu button.
- iOS: Creates a native TabBar. The PhoneGap webview is repositioned above the TabBar.

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

    // <menu type="toolbar">
    //     <command label="Home" />
    // </menu>

    var menu = document.createElement('menu');
    menu.setAttribute('type', 'toolbar');
    document.body.appendChild(menu);

    var command = document.createElement('command');
    command.setAttribute('label', 'Home');
    command.setAttribute('action', function() {
        console.log('Home');
    });
    menu.appendChild(command);

    // Refresh all menus

    PGMenuElement.update();

__PGMenuElement.update();__

Call to re-render all menus.

Menus are not automatically updated for performance considerations.
- DOM Mutation Events can affect performance.
- Polling is inefficient for how often a menu is updated.
