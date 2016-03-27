#!/bin/bash

INPUT_FILE = "test-reports.xml"
DUP_FILE="dup-file.xml"
OUTPUT_FILE="test-reports.xml"
IFS=$'\n'

	for i in $INPUT_FILE
	do
	cat test-report.xml | grep -e "<*>" >> $DUP_FILE
	done
	cat $DUP_FILE >> $OUTPUT_FILE
	

