"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HomeController_1 = require("./HomeController");
/**
 * This is where we register the routes, route middlewares for this feature
 *
 * @param {express.Application} express singleton express app instance
 */
function default_1(express) {
    const homeController = new HomeController_1.default();
    express.get('/', homeController.index);
    express.get('/:name', homeController.helloName);
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map