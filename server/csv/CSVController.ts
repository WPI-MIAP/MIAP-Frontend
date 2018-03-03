import { Request, Response, NextFunction} from 'express';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as _ from 'lodash';
var exec = require('child_process').exec;
/**
 * {
 * 	drugs: [...],
 * 	rules: rules
 * }
 */

/**
 * Controller class to handle different requests for this feature
 */
 export default class CSVController {
	 public async uploadReports(req: Request, res: Response, next: NextFunction) {
		if (!req.files) {
			console.log("No file received");
			return res.send({
			  success: false
			});
		
		} else {
			console.log('file received');
			var fileNames = req.files.map((file) => ('/maras/diva-node-web/storage/' + file.filename));
			fileNames = _.join(fileNames, ' ');
			console.log(fileNames);
			var command = '/maras/maras.sh -m=/maras/public-mm -f=' + fileNames + ' -d=/maras/data/knownRules_standardized.csv -j=/maras/maras.jar -o=/maras/diva-node-web/storage/ -t=/maras/diva-node-web/storage/status.json > log.txt';
			var child = exec(command, {maxBuffer: 1024 * 1000}, (error, stdout, stderr) => {
				if (error) {
					console.log(error);
				}
			});
			return res.send({
			  success: true
			})
		}
	 }

 	/**
 	 * Get rules in json
 	 * @param {Request}      req
 	 * @param {Response}     res
 	 * @param {NextFunction} next
 	 */
 	public async getRules(req: Request, res: Response, next: NextFunction) {
 		try {
			let rules = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/rules.csv', 'utf8'));
			const drugs = getDrugsFromRules(rules);
			let DMEFile = fs.readFileSync(__dirname + '/../../../storage/DME.csv', 'utf8');
			let lines = DMEFile.split("\n");
			let DMEs = [];
			for (let i = 1; i < lines.length; i++) {
				DMEs.push({'name': lines[i].trim(), 'formattedName': lines[i].toLowerCase().replace(/\W/g, '')});
			}

			let dmeRange = [], scoreRange = [];
			if(!req.query.drug){
				let maxScore = _.max(rules.map((rule) => (parseFloat(rule.Score))));
				let minScore = _.min(rules.map((rule) => (parseFloat(rule.Score))));

				let range = maxScore - minScore;
				let numColors = 4;
				for(var i=1; i <= numColors; i++) {
					scoreRange.push(minScore + (i * range)/numColors);
				}

				
				let numDMEColors = 5;
				//find max number of Severe ADRs associated with any one drug
				let maxNumDMEs = 0;
				drugs.forEach(drug => {
					let rulesCopy = rules.filter(
						rule => _.lowerCase(rule.Drug1.name) === _.lowerCase(drug) ||
						_.lowerCase(rule.Drug2.name) === _.lowerCase(drug)
					);

					let drugDMEs = [];
					rulesCopy.forEach(rule => {
						let formattedADRName = rule['ADR'].toLowerCase().replace(/\W/g, '');
						DMEs.forEach(dme => {
							if (formattedADRName === dme['formattedName']){
								drugDMEs.push(dme['name']);
							}
						});
					});

					if(drugDMEs.length > maxNumDMEs) {
						maxNumDMEs = drugDMEs.length;
					}
				});

				if(maxNumDMEs < numDMEColors - 1) {
					maxNumDMEs = numDMEColors - 1;
				}
				for(var i=1; i <= numDMEColors - 1; i++) {
					dmeRange.push((i * maxNumDMEs)/(numDMEColors - 1));
				}
			}

			if (req.query.status === 'known') {
	 			rules = rules.filter(rule => rule.status === 'known');
	 		} else if (req.query.status === 'unknown') {
	 			rules = rules.filter(rule => rule.status === 'unknown');
			}

	 		if (req.query.drug) {
				if (Array.isArray(req.query.drug)) {
					rules = rules.filter(
						rule => {
							return (_.lowerCase(rule.Drug1.name) === _.lowerCase(req.query.drug[0]) &&
							_.lowerCase(rule.Drug2.name) === _.lowerCase(req.query.drug[1])) ||
							(_.lowerCase(rule.Drug1.name) === _.lowerCase(req.query.drug[1]) &&
							_.lowerCase(rule.Drug2.name) === _.lowerCase(req.query.drug[0]));
						});
				} else {
					rules = rules.filter(
						rule => _.lowerCase(rule.Drug1.name) === _.lowerCase(req.query.drug) ||
						_.lowerCase(rule.Drug2.name) === _.lowerCase(req.query.drug)
					);
				}

				let drugDMEs = [];
				rules.forEach(rule => {
					let formattedADRName = rule['ADR'].toLowerCase().replace(/\W/g, '');
					DMEs.forEach(dme => {
						if (formattedADRName === dme['formattedName']){
							drugDMEs.push(dme['name']);
						}
					});
				});
				const drugs = getDrugsFromRules(rules);
				res.json({
					drugs,
					drugDMEs,
					rules
				});
			}

	 		res.json({
	 			drugs,
	 			rules,
				scoreRange,
				dmeRange
	 		});
 		} catch (err) {
 			console.log(err);
 		}
	 }

	 public async getReports(req: Request, res: Response, next: NextFunction) {
		try {
			let reports = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/reports.csv', 'utf8'));

			if (req.query.drug) {
				reports = reports.filter(report => {
					let drugnames = report.drugname_matched.split(', ');
					// let drugnames = report.drugname_updated.split(', ');
					drugnames = drugnames.map(name => _.toLower(_.trim(name)));
					return _.includes(drugnames, _.toLower(_.trim(req.query.drug)));
				});
			}

			if (req.query.drug1 && req.query.drug2) {
				let rules = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/rules.csv', 'utf8'));
				rules = rules.filter(rule => _.toLower(_.trim(rule.r_Drugname)) === `[${_.toLower(_.trim(req.query.drug1))}] [${_.toLower(_.trim(req.query.drug2))}]` || 
				_.toLower(_.trim(rule.r_Drugname)) === `[${_.toLower(_.trim(req.query.drug2))}] [${_.toLower(_.trim(req.query.drug1))}]`);
				const reportIds = _.uniq(_.flattenDeep(rules.map(rule => _.map(rule.id.split(','), r => (_.trim(r))))));
				reports = _.at(_.keyBy(reports, 'primaryId'), reportIds);
				res.send(reports);
			}

			res.json(reports);
		} catch (err) {
			console.log(err);
		}
	}

	public async getStatus(req: Request, res: Response, next: NextFunction) {
		try {
			let status = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/status.json', 'utf8'));
			res.json(status);
		} catch (err) {
			console.log(err);
		}
	}

	public async getDMEs(req: Request, res: Response, next: NextFunction) {
		try {
			let DMEs = fs.readFileSync(__dirname + '/../../../storage/DME.csv', 'utf8');

			res.json(csvToJson(DMEs));
		} catch (err) {
			console.log(err);
		}
	}
}

function csvToJson(csv) {
	let lines = csv.split("\n");
	let result = [];
	let headers = lines[0].split(",");

	for(let x=0 ; x < headers.length; x++) {
		headers[x] = headers[x].trim();
	}

	for(let i=1 ; i < lines.length; i++) {
		let obj = {};

		if(lines[i].length > 0) {
			let currentline=lines[i].split(",");
			
			for(let j=0;j<headers.length;j++){
				obj[headers[j]] = currentline[j].trim();
			}
	
			result.push(obj);
		}
	}

	return result;
}

function getDrugsFromRules(rules) {
 		const drugsList = rules.map((rule) => {
 			return [rule.Drug1.name, rule.Drug2.name];
 		});

 		return _.uniq(_.flattenDeep(drugsList));
}