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
	@echo "  dist .............. Distribute plugin."
	@echo "  desktop-example ... Build example app for desktop."
	@echo
	@echo "USAGE"
	@echo "  make dist .............. Only generate plugin distribution files."
	@echo "  make desktop-example ... Build example application and run on Android."
	@echo

desktop-example: clean dist example desktop

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
	./bin/clean/android
	./bin/install-phonegap-js/android
	./bin/install-example/android
	./bin/install-plugin/android
	./bin/clean/tmp
	./bin/build/android

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
	./bin/clean/ios
	./bin/install-phonegap-js/ios
	./bin/install-example/ios
	./bin/install-plugin/ios
	./bin/clean/tmp
	./bin/build/ios

clean:
	./bin/clean/build

.PHONY: all help example test dist android blackberry desktop ios clean
