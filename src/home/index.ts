import * as express from 'express';
import Routes from './routes';

/**
 * Initialize the routes and other config in the future
 * such as database configuration
 *
 * @param {express.Application} express [description]
 */
export function init(express: express.Application) {
	Routes(express);
}