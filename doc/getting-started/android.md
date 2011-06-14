Getting Started with Android
============================

For plugin development, you can quickly build and test using a
set of built-in command-line scripts.

For plugin usage, you will need to manually install the plugin.

Prerequisites 
-------------

### Android Setup

1. Add the Android SDK to your path.

        $ export PATH=$PATH:/Applications/android-sdk-mac_x86/tools

2. Create a AVD (simulator) using the `android` command-line tool.

        $ android

Plugin Development
------------------

### Build Plugin

1. Open your AVD simulator

        $ android

2. Change directory to `phonegap-plugin-menu`

        $ cd phonegap-plugin-menu

3. View command-line script Help Menu

        $ make help

4. Build example application to Android target

        $ make example android


Plugin Usage in Existing Project
--------------------------------

### Upgrade PhoneGap-Android (Java)

The upgrade is based on PhoneGap-Android 0.9.5.1 and adds hooks for an dynamic Android menu.

In your Android project, replace `libs/phonegap.0.9.5.1.jar` with
`phonegap-plugin-menu/target/android/libs/phonegap.0.9.5.1.jar`.

    $ cp /phonegap-plugin-menu/target/android/libs/phonegap.0.9.5.1.jar /project/libs/phonegap.0.9.5.1.jar

_Note:_ Your project should also be using the JavaScript for 0.9.5.1. You can find the JavaScript at
`phonegap-plugin-menu/target/android/lib/phonegap.0.9.5.1.js`.

### Install JavaScript code

1. Copy the following to your project's `www` directory:

        phonegap-plugin-menu/www/plugin/menu/index.js ....... Common menu interface
        phonegap-plugin-menu/www/plugin/menu/android.js ..... Temporary Android mediator

2. Include the JavaScript in your HTML page:

        <script type="text/javascript" src="phonegap.0.9.5.1.min.js"></script>
        
        <!-- After phonegap.js and the order is important -->
        <script type="text/javascript" src="plugin/menu/index.js"></script>
        <script type="text/javascript" src="plugin/menu/android.js"></script>
