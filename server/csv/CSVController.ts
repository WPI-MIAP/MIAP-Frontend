import { Request, Response, NextFunction} from 'express';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as _ from 'lodash';

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
 		let rules = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/rules.csv', 'utf8'));
 		if (req.query.status == 'known') {
 			rules = rules.filter(rule => rule.status == 'known');
 		} else if (req.query.status == 'unknown') {
 			rules = rules.filter(rule => rule.status == 'unknown');
 		}
 		res.json(rules);
 	}

 	/**
 	 * Get DME in json
 	 * @param {Request}      req  
 	 * @param {Response}     res  
 	 * @param {NextFunction} next 
 	 */
 	public async getDME(req: Request, res: Response, next: NextFunction) {
 		let csvFilePath = __dirname + '/../../../storage/DME.csv';
 		let data = [];
		csv()
			.fromFile(csvFilePath)
			.on('json',(jsonObj) => {
				data.push(jsonObj);
			})
			.on('done',(error) => {
				res.send(data);
			});
 	}

 	/**
 	 * Get drugs in json
 	 * @param {Request}      req  
 	 * @param {Response}     res  
 	 * @param {NextFunction} next 
 	 */
 	public async getDrugs(req: Request, res: Response, next: NextFunction) {
 		let rules = JSON.parse(fs.readFileSync(__dirname + '/../../../storage/rules.csv', 'utf8'));
 		if (req.query.status == 'known') {
 			rules = rules.filter(rule => rule.status == 'known');
 		} else if (req.query.status == 'unknown') {
 			rules = rules.filter(rule => rule.status == 'unknown');
 		}
 		let drug1Links = _.groupBy(rules, 'Drug1.name');
 		let drug2Links = _.groupBy(rules, 'Drug2.name');
 		let drugLinks = _.merge(drug1Links, drug2Links);
 		res.send(drugLinks);
 	}	
}