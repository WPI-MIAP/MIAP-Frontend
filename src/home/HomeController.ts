import { Request, Response, NextFunction} from 'express';

/**
 * Controller class to handle different requests for this feature
 */
export default class HomeController {
	index(req: Request, res: Response, next: NextFunction) {
		res.json({
			message: 'Hello World!'
		});
	}

	helloName(req: Request, res: Response, next: NextFunction) {
		res.json({
			message: 'Hello World,' + req.params.name + '!'
		});
	}
}