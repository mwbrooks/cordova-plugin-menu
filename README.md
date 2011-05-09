PhoneGap Plugin for Native Menus
================================

> HTMLMenuElement and HTMLCommandElement polyfill

Overview
--------

The implementation is loosely based on the [W3C HTMLMenuElement / HTMLCommandElement Specification](http://www.w3.org/TR/html5/interactive-elements.html).

API
---

### Markup

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

__HTMLMenuElement:__

- appendChild(...)
- removeChild(...)
- setAttribute(...)
- getAttribute(...)
- hasAttribute(...)
- removeAttribute(...)

__HTMLCommandElement:__

- setAttribute(...)
- getAttribute(...)
- hasAttribute(...)
- removeAttribute(...)

