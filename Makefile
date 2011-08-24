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
	./bin/install/blackberry
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
	@echo "---------------------------"
	@echo "  Plugin Distribution:"
	@echo "    => /build/distribution/"
	@echo "---------------------------"

example:
	./bin/create/example

clean:
	./bin/clean/build

.PHONY: all help example test dist android blackberry desktop ios clean
