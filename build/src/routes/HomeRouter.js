"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class HomeRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/', this.hello);
        this.router.get('/:name', this.helloName);
    }
    hello(req, res, next) {
        res.json({
            message: 'Hello World!'
        });
    }
    helloName(req, res, next) {
        res.json({
            message: 'Hello world, ' + req.params.name + '!'
        });
    }
}
exports.HomeRouter = HomeRouter;
exports.default = new HomeRouter().router;
//# sourceMappingURL=HomeRouter.js.map