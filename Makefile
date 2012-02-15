all: help

help:
	@echo
	@echo "NAME"
	@echo "  Build & Run Plugin"
	@echo
	@echo "DESCRIPTION"
	@echo "  Easily build and run the plugin."
	@echo
	@echo "SYNOPSIS"
	@echo "  make COMMAND"
	@echo
	@echo "COMMANDS"
	@echo "  dist ......... Generate plugin distribution for all platforms."
	@echo "  release ...... Generate an archive (zip) using the latest tag."
	@echo "  android ...... Build & run example app for Android."
	@echo "  blackberry ... Build & run example app for BlackBerry 5/6."
	@echo "  desktop ...... Build & run example app for Desktop."
	@echo "  ios .......... Build & run example app for iOS."
	@echo
	@echo "USAGE"
	@echo "  make dist ...... Only generate plugin distribution files."
	@echo "  make desktop ... Build example application and run on Desktop."
	@echo

android: clean dist example
	./bin/install/android
	./bin/run/android

blackberry: clean dist example
	./bin/install/blackberry/Users/timkim/repo/phonegap-plugin-menu/bin/install/desktop
	./bin/run/blackberry

desktop: clean dist example
	./bin/install/desktop
	./bin/run/desktop

ios: clean dist example
	./bin/install/ios
	./bin/run/ios

dist:
	./bin/clean/dist
	./bin/dist/android
	./bin/dist/blackberry
	./bin/dist/desktop
	./bin/dist/ios
	@echo "--------------"
	@echo " Distribution"
	@echo "--------------"
	@echo "  => /build/distribution/"
	@echo

release: dist
	cd ./build/distribution; zip -rq phonegap-plugin-menu-v`git describe --tags master`.zip .
	mkdir -p ./build/release
	mv ./build/distribution/*.zip ./build/release
	@echo "---------"
	@echo " Release"
	@echo "---------"
	@echo "  => /build/release/phonegap-plugin-menu-v`git describe --tags master`.zip"
	@echo

example:
	./bin/create/example

clean:
	./bin/clean/build

.SILENT: all help example test dist release android blackberry desktop ios clean
