"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../helper/index");
const checkFormatOfId = async (req, res, next) => {
    const query = req.params.id;
    const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
    if (!isValidId) {
        const response = {
            "data": [],
            "status": false,
            "message": "please check the id",
            "code": 403
        };
        return res.status(403).json(response);
    }
    else {
        return next();
    }
};
exports.default = checkFormatOfId;
//# sourceMappingURL=checkId.js.map