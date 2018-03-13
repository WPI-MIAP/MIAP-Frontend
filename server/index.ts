import * as http from 'http';
import * as debug from 'debug';

import App from './App';

debug('ts-express:server');

/**
 * Set default port to 3000.
 */
const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

/**
 * Configure server.
 */
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Make sure port number is valid.
 * 
 * @param val port number
 */
function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port >= 0) {
        return port;
    } else {
        return false;
    }
}

/**
 * Log error output.
 * 
 * @param error 
 */
function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') { throw error; }
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Print the port that the server is listening on.
 */
function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}