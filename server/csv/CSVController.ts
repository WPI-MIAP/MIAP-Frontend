import { Request, Response, NextFunction} from 'express';

/**
 * Controller class to handle different requests for this feature
 */
 export default class CSVController {
 	public index(req: Request, res: Response, next: NextFunction) {
 		res.render('index');
 	}

 	public async store(req: Request, res: Response, next: NextFunction) {
 		res.json({
 			message: "File was uploaded"
 		}, 201);
 	}
}