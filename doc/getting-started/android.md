Getting Started with Android
============================

For plugin development, you can quickly build and test using a
set of built-in command-line scripts.

For plugin usage, you will need to manually install the plugin.

Prerequisites 
-------------

### Android Setup (OS X and Linux)

> Your Android path may vary.

1. Add the Android SDK to your path.

        $ export PATH=$PATH:/Applications/android-sdk-mac_x86/tools

2. Create a AVD (simulator) using the `android` command-line tool.

        $ android

### Android Setup (Windows)

> Your Android path may vary.

1. Add the Android SDK to your path.

    1. Open the _Environment Variables_ window
    2. Edit _Path_ under _System Variables_
    
            <existing paths>;C:\android-sdk-windows\tools

2. Create a AVD (simulator) using the `android.bat` (double click or run from command-line).

        C:\android-sdk-windows\tools\android.bat

### Unix Terminal (Windows)

On Windows, it is possible to install a Unix terminal environment.
This is a great alternative to the Command Prompt `cmd.exe`.
From the Unix shell, you can interact with your `C:\` as `/c/` and common Unix commands.

1. [Follow the GitHub tutorial on installing GitBash](http://help.github.com/win-set-up-git/)
    - You do not need to setup SSH keys, unless you plan to use Git within Windows.
2. [Download `make.exe`](http://dl.dropbox.com/u/30262219/ie/make.exe)
    - Copy to `C:\Program Files (x86)\Git\bin`
    - _Reference:_ File originally [available on msysgit repository](http://repo.or.cz/w/msysgit.git?a=blob;f=bin/make.exe;h=a971ea1266ff40e89137bba068e2c944a382725f;hb=968336eddac1874c56cd934d10783566af5a3e26)
3. Close and reopen GitBash

Initialize Android Project
--------------------------

### OS X or Linux

1. Change into the Android target

        $ cd phonegap-plugin-menu/target/android

2. Choose what targets the Android application should support

        $ android list target

3. For each target ID, add the target to the project, where `1` is the target ID

        $ android update project -p . -t 1

### Windows

> The commands are shown in by the Command Prompt (C:\>) and Unix Shell Emulator ($).
  I highly recommend that you use the Unix Shell.

1. Change into the Android target

        C:\> cd phonegap-plugin-menu/target/android
        
        $ cd phonegap-plugin-menu/target/android

2. Choose what targets the Android application should support

        C:\> android.bat list target
    
        $ cmd.exe /k android.bat list target

3. For each target ID, add the target to the project, where `1` is the target ID

        C:\> android.bat update project -p . -t 1
        
        $ cmd.exe /k android.bat update project -p . -t 1

> From here on, you should be using OS X, Linux, or GitBash within Windows

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

### Install Java code

1. Copy the following to your project's `src` directory:

        phonegap-plugin-menu/native/android/

### Install JavaScript code

1. Copy the following to your project's `www` directory:

        phonegap-plugin-menu/www/plugin/menu/index.js

2. Include the JavaScript in your HTML page:

        <script type="text/javascript" src="phonegap.0.9.5.1.min.js"></script>
        
        <!-- After phonegap.js and the order is important -->
        <script type="text/javascript" src="plugin/menu/index.js"></script>
