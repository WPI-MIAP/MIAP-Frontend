"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Controller class to handle different requests for this feature
 */
class HomeController {
    index(req, res, next) {
        res.json({
            message: 'Hello World!'
        });
    }
    helloName(req, res, next) {
        res.json({
            message: 'Hello World,' + req.params.name + '!'
        });
    }
}
exports.default = HomeController;
//# sourceMappingURL=HomeController.js.map