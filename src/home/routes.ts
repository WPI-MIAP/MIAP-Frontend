import * as express from 'express';
import HomeController from './HomeController';

/**
 * This is where we register the routes, route middlewares for this feature
 *
 * @param {express.Application} express singleton express app instance
 */
export default function (express: express.Application) {
	const homeController = new HomeController();
	express.get('/', homeController.index);
	express.get('/:name', homeController.helloName);
}