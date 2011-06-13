PhoneGap Plugin for Native Menus
================================

> HTMLMenuElement and HTMLCommandElement polyfill

Overview
--------

The implementation is loosely based on the [W3C HTMLMenuElement / HTMLCommandElement Specification](http://www.w3.org/TR/html5/interactive-elements.html).

API
---

### Markup (Unsupported at the moment)

__Toolbar:__

    <menu type="toolbar" label="Tweets">
      <command type="command" label="Back"    icon="back-arrow.png" disabled="false" accesskey="back" />
      <command type="command" label="Options" icon="gear.png"       disabled="false" />
    </menu>

__Context Menu:__

    <menu type="context">
      <command label="Tweets"  icon="bubble.png"  disabled="false" />
      <command label="Replies" icon="reply.png"   disabled="false" />
      <command label="Search"  icon="search.png"  disabled="false" accesskey="search" />
      <command label="Profile" icon="profile.png" disabled="false" />
    </menu>

### JavaScript

    // Create a toolbar menu
    //
    var toolbar = document.createElement('menu');
    toolbar.setAttribute('type', 'toolbar');
    toolbar.setAttribute('label', 'Tweets');  // optional
    
    // Add a Back button
    //
    var backButton = document.createElement('command');
    backButton.setAttribute('label',     'Back');            // Default: ""
    backButton.setAttribute('icon',      'back-arrow.png');  // Default: ""
    backButton.setAttribute('disabled',  'false');           // Default: false
    backButton.setAttribute('accesskey', 'back');            // Default: ""
    toolbar.appendChild(backButton);
    
    // Add a Options button
    //
    var optionsButton = document.createElement('command');
    optionsButton.setAttribute('label', 'Options');
    optionsButton.setAttribute('icon',  'gear.png');
    toolbar.appendChild(optionsButton);
    
    // To remove a button
    //
    toolbar.removeChild(backButtton);

    // getAttribute
    //
    toolbar.getAttribute('label');    // Returns 'Tweets'
    backButton.getAttribute('icon');  // Returns 'back-arrow.png'
    
    // hasAttribute
    //
    toolbar.hasAttribute('label');  // true
    
    // removeAttribute
    //
    toolbar.removeAttribute('label');