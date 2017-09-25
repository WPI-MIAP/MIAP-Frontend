"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
/**
 * Initialize the routes and other config in the future
 * such as database configuration
 *
 * @param {express.Application} express [description]
 */
function init(express) {
    routes_1.default(express);
}
exports.init = init;
//# sourceMappingURL=index.js.map