Getting Started with iOS
========================

For plugin development, you can quickly build and test using a
set of built-in command-line scripts.

For plugin usage, you will need to manually install the plugin.

Prerequisites 
-------------

### Xcode Setup

1. Install the latest Xcode SDK

### PhoneGap-iOS Setup

1. [Download the PhoneGap 0.9.5.1 release](http://www.phonegap.com/download-thankyou)
2. Unzip
3. Run `iOS/PhoneGapInstaller.pkg`

Plugin Development
------------------

### Build Plugin

1. Change directory to `phonegap-plugin-menu`

        $ cd phonegap-plugin-menu

2. View command-line script Help Menu

        $ make help

3. Build example application to iOS target

        $ make example ios

4. Clean & Run the open Xcode project

Plugin Usage in Existing Project
--------------------------------

### Install Native code

1. Copy the following to your project's `MyProject/MyProject/Plugins` directory:

        phonegap-plugin-menu/native/ios/NativeControls

### Install JavaScript code

1. Copy the following to your project's `www` directory:

        phonegap-plugin-menu/www/plugin/menu/index.js

2. Include the JavaScript in your HTML page:

        <script type="text/javascript" src="phonegap.0.9.5.1.min.js"></script>
        
        <!-- After phonegap.js and the order is important -->
        <script type="text/javascript" src="plugin/menu/index.js"></script>