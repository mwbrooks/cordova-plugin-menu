all: help

help:
	@echo
	@echo "NAME"
	@echo "  Build & Run Plugin"
	@echo
	@echo "DESCRIPTION"
	@echo "  This tool helps you development your PhoneGap plugin."
	@echo "    - Build & run example application"
	@echo "    - Build & run tests suite"
	@echo
	@echo "SYNOPSIS"
	@echo "  make COMMAND"
	@echo
	@echo "COMMANDS"
	@echo "  dist .............. Generate plugin distribute in /build/dist/"
	@echo "  desktop-example ... Build & run example app for desktop."
	@echo "  ios-example ....... Build & run example app for iOS."
	@echo
	@echo "USAGE"
	@echo "  make dist .............. Only generate plugin distribution files."
	@echo "  make desktop-example ... Build example application and run on Android."
	@echo

android-example: clean dist example android

desktop-example: clean dist example desktop

ios-example: clean dist example ios

dist:
	./bin/clean/dist
	./bin/dist/android
	./bin/dist/blackberry
	./bin/dist/desktop
	./bin/dist/ios

example:
	./bin/create/example

# test:
#     ./bin/tmp/test

android:
	./bin/install/android
	./bin/run/android

blackberry:
	./bin/clean/blackberry
	./bin/install-example/blackberry
	./bin/install-phonegap-js/blackberry
	./bin/install-plugin/blackberry
	./bin/clean/tmp
	./bin/build/blackberry

desktop:
	./bin/install/desktop
	./bin/run/desktop

ios:
	./bin/install/ios
	./bin/run/ios

clean:
	./bin/clean/build

.PHONY: all help example test dist android blackberry desktop ios clean
