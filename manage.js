#!/usr/bin/env node

/**
 * This file contains the command line interface application
 * for the server.
 */

var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;
var csv = require('csvtojson');
var csvWriter = require('csv-write-stream');

program
	.version('0.1.0')

/**
 * Command to execute jar file
 */
program
	.command('exec-jar [inFile] [outDir]')
	.description('Run the java program')
	.action(function (inFile, outDir) {
		var command = '/usr/bin/java -jar maras_10_10_17.jar ' + inFile + ' ' + outDir;
		var child = exec(command, {maxBuffer: 1024 * 1000}, (error, stdout, stderr) => {
			if (error) {
				console.log(error);
			}
		});
	});

program
	.command('generate-drugs-file [inFile] [outFile]')
	.description('Generate CSV file with drugnames and drugID')
	.action(function (inFile, outFile) {
 		let drugNames = [];
		csv()
			.fromFile(inFile)
			.on('json',(jsonObj) => {
				drugNames.push(jsonObj.Drug1);
				drugNames.push(jsonObj.Drug2);
			})
			.on('done',(error) => {
				drugNames = drugNames
					.filter((value, index, self) => self.indexOf(value) === index)
					.map((value, index) => ({id: index, name: value}));

				let writer = csvWriter();
				writer.pipe(fs.createWriteStream(outFile));
				drugNames.forEach(drug => {
					writer.write(drug);
				});

				writer.end()

				if (error) {
					console.log(error);
				}
			});
	});

program
	.command('generate-drugs-rules [inFile] [outFile1] [outFile2')
	.description('Generate CSV file with drugnames and drugID and file with drugrules and drugID')
	.action(function (inFile, outFile1, outFile2) {
 		let drugNames = [];
 		let rules = [];
 		
		csv()
			.fromFile(inFile)
			.on('json',(jsonObj) => {
				drugNames.push(jsonObj.Drug1);
				drugNames.push(jsonObj.Drug2);
			})
			.on('done',(error) => {
				drugNames = drugNames
					.filter((value, index, self) => self.indexOf(value) === index)
					.map((value, index) => ({id: index, name: value}));

				let writer = csvWriter();
				writer.pipe(fs.createWriteStream(outFile1));
				drugNames.forEach(drug => {
					writer.write(drug);
				});
				
				writer.end()

				if (error) {
					console.log(error);
				}
			});
	});
program.parse(process.argv);
