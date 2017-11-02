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
 		rules.push(jsonObj);
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
 		rules.map((rule, index) => {
 			let temp = rule;
 			temp.Drug1 = drugNames.filter(obj => obj.name == temp.Drug1)[0];
 			temp.Drug2 = drugNames.filter(obj => obj.name == temp.Drug2)[0];
 			return temp;
 		});

 		const content = JSON.stringify(rules);

 		fs.writeFile(outFile2, content, 'utf8', function (err) {
 			if (err) {
 				return console.log(err);
 			}

 			console.log("The file was saved!");
 		}); 
 		if (error) {
 			console.log(error);
 		}
 	});
 });
 program.parse(process.argv);
