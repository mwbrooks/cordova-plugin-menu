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
	@echo "  make COMMAND TARGET"
	@echo
	@echo "COMMANDS"
	@echo "  example ...... Build example application."
	@echo "  test ......... Build test suite."
	@echo
	@echo "TARGETS"
	@echo "  android ...... Run on Android."
	@echo "  blackberry ... Run on BlackBerry."
	@echo "  ios .......... Run on iOS."
	@echo
	@echo "USAGE"
	@echo "  make android example ... Build example application and run on Android."
	@echo "  make android test ...... Build test suite and run on Android."
	@echo

example:
	./bin/tmp/example

test:
	./bin/tmp/test

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
	./bin/clean/desktop
	./bin/install-phonegap-js/desktop
	./bin/install-example/desktop
	./bin/install-plugin/desktop
	./bin/clean/tmp
	./bin/build/desktop

ios:
	./bin/clean/ios
	./bin/install-phonegap-js/ios
	./bin/install-example/ios
	./bin/install-plugin/ios
	./bin/clean/tmp
	./bin/build/ios

.PHONY: all help example test android blackberry desktop ios
