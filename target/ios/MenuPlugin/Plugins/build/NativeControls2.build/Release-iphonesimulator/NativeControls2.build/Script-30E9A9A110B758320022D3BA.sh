#!/bin/sh
# get the PhoneGapLib version
PGVER=`head -1 "${PHONEGAPLIB}/VERSION"`
TARGET="${PROJECT_DIR}/www"

# look for a reference in all files for "phonegap.{PGVER}.*.js" in www, warn if missing
find "${TARGET}" | xargs grep "phonegap.${PGVER}.*.js" -sl
rc=$?
if [ $rc != 0 ] ; then
	echo -e "${PROJECT_DIR}/www:0: warning: Missing - A reference to 'phonegap.${PGVER}.js' or 'phonegap.${PGVER}.min.js' was not found in your HTML file(s)." 1>&2
fi
