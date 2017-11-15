import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as CSV from './csv';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.express.set('view engine', 'pug');
        this.express.set('views', __dirname + '/../../resources/views');
        this.express.get('/', (req, res) => {
            return res.render('index');
        });
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(express.static('public'));
        this.express.use(cors());
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    // Configure API endpoints.
    private routes(): void {
        CSV.init(this.express);
    }
}

export default new App().express;