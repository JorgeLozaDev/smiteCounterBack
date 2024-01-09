"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../core/config"));
mongoose_1.default
    .connect(config_1.default.DDBB_URL + config_1.default.DDBB_NAME, {})
    .then(() => console.log("Conectado correctamente a la BBDD"))
    .catch((e) => console.log(e));
module.exports = mongoose_1.default;
//# sourceMappingURL=mongoose.js.map