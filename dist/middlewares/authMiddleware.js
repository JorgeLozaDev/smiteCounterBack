"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../core/config"));
const authMiddleware = (req, res, next) => {
    try {
        // Verificar el token JWT en la cabecera de la solicitud
        const token = req.header("Authorization");
        if (!token) {
            throw new Error("Token no proporcionado");
        }
        // el token nos viene un string, un espacio y el token, con esto solamente recogemos el token y lo comprobamos
        const t = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(t, config_1.default.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            // Error relacionado con el token JWT
            const error = new Error("JsonWebTokenError");
            error.status = 401;
            throw error;
        }
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map