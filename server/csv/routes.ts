import * as express from 'express';
import * as multer from 'multer';
import CSVController from './CSVController';

/**
 * This is where we register the routes, route middlewares for this feature
 *
 * @param {express.Application} express singleton express app instance
 */
export default function (app: express.Application) {
	const csvController = new CSVController();

	let upload = multer({ dest: 'storage/' });
	let router = express.Router();

	router.get('/', csvController.index);
	router.post('/', upload.single('csv'), csvController.store);

	app.use('/csv', router);
}
