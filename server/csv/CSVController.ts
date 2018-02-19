import { Request, Response, NextFunction} from 'express';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as _ from 'lodash';
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
 	public async store(req: Request, res: Response, next: NextFunction) {
 		res.json({
 			message: "File was uploaded"
 		}, 201);
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


				let DMEFile = fs.readFileSync(__dirname + '/../../../storage/DME.csv', 'utf8');
				let lines = DMEFile.split("\n");
				let DMEs = [];
				for (let i = 1; i < lines.length; i++) {
					DMEs.push({'name': lines[i].trim(), 'formattedName': lines[i].toLowerCase().replace(/\W/g, '')});
				}
				let drugDMEs = [];
				rules.forEach(rule => {
					let formattedADRName = rule['ADR'].toLowerCase().replace(/\W/g, '');
					DMEs.forEach(dme => {
						if (formattedADRName === dme['formattedName'] && drugDMEs.indexOf(dme['name']) === -1) {
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

	 		const drugs = getDrugsFromRules(rules);
	 		res.json({
	 			drugs,
	 			rules
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
					let drugnames = report.drugname_updated.split(', ');
					drugnames = drugnames.map(name => _.lowerCase(name));
					return _.includes(drugnames, _.lowerCase(req.query.drug));
				});
			}

			if (req.query.drug1 && req.query.drug2) {
				let rules = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/rules.csv', 'utf8'));
				rules = rules.filter(rule => _.lowerCase(rule.r_Drugname) === `${_.lowerCase(req.query.drug1)} ${_.lowerCase(req.query.drug2)}` || 
				_.lowerCase(rule.r_Drugname) === `${_.lowerCase(req.query.drug2)} ${_.lowerCase(req.query.drug1)}`);
				const reportIds = _.uniq(_.flattenDeep(rules.map(rule => rule.id.split(','))));
				reports = _.at(_.keyBy(reports, 'primaryId'), reportIds);
				res.send(reports);
			}

			res.json(reports);
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