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
	 		if (req.query.status == 'known') {
	 			rules = rules.filter(rule => rule.status == 'known');
	 		} else if (req.query.status == 'unknown') {
	 			rules = rules.filter(rule => rule.status == 'unknown');
	 		} 

	 		if (req.query.drug) {
	 			rules = rules.filter(
	 				rule => rule.Drug1.name === req.query.drug || 
	 				rule.Drug2.name === req.query.drug
	 			);
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
}

function getDrugsFromRules(rules) {
 		const drugsList = rules.map((rule) => {
 			return [rule.Drug1.name, rule.Drug2.name]
 		});

 		return _.uniq(_.flattenDeep(drugsList));
}