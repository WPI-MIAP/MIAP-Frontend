#!/usr/bin/env node

/**
 * This file contains the command line interface application
 * for the server.
 */

var program = require('commander');
var exec = require('child_process').exec;

program
	.version('0.1.0')

/**
 * Command to execute jar file
 */
program
	.command('exec-jar [inFile] [outDir]')
	.description('Run the java program')
	.action(function(inFile, outDir){
		var command = '/usr/bin/java -jar maras_10_10_17.jar ' + inFile + ' ' + outDir;
		var child = exec(command, {maxBuffer: 1024 * 1000}, (error, stdout, stderr) => {
			if (error) {
				console.log(error);
			}
		});
	});

program.parse(process.argv);
