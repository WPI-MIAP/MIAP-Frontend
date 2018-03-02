import * as express from 'express';
import * as multer from 'multer';
import CSVController from './CSVController';
const crypto = require('crypto'); 

/**
 * This is where we register the routes, route middlewares for this resource
 *
 * @param {express.Application} express singleton express app instance
 */
export default function (app: express.Application) {
	const csvController = new CSVController();

	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, './storage')
		},
		filename: function (req, file, cb) {
		  crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.zip');
		  });
		}
	});
	var upload = multer({ storage: storage });
	let router = express.Router();

	router.get('/rules', csvController.getRules);
	router.get('/reports', csvController.getReports);
	router.get('/status', csvController.getStatus);
	router.get('/DMEs', csvController.getDMEs);
	router.post('/reports', upload.array('file'), csvController.uploadReports);

	app.use('/csv', router);
}
