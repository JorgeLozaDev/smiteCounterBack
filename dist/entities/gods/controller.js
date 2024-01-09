"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGod = exports.updateGodActive = exports.createGod = exports.getGodDetails = exports.filterAllActiveGods = exports.getAllGods = exports.getAllActiveGods = exports.addGod = void 0;
const model_1 = __importDefault(require("./model"));
const comun_1 = require("../../core/helpers/comun");
// Controlador para agregar un nuevo dios
const addGod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener datos del cuerpo de la solicitud
        const { name, pantheon, role, lore, abilities, images, isActive, isNew, isFreeToPlay, } = req.body;
        // Definir campos requeridos
        const camposRequeridos = [
            "name",
            "pantheon",
            "role",
            "lore",
            "abilities",
            "images",
        ];
        // Verificar campos requeridos utilizando la función de validación
        (0, comun_1.validateRequiredFields)(req.body, camposRequeridos);
        // Crear una nueva instancia de God usando el modelo
        const newGod = new model_1.default({
            name,
            pantheon,
            role,
            lore,
            abilities,
            images,
            isActive,
            isNew,
            isFreeToPlay,
        });
        // Guardar el nuevo dios en la base de datos
        const savedGod = yield newGod.save();
        // Responder con el dios recién creado
        res.status(201).json(savedGod);
    }
    catch (error) {
        // Pasar el error al siguiente middleware
        next(error);
    }
});
exports.addGod = addGod;
const getAllActiveGods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todos los usuarios con rol de tatuador
        const allGodsActive = yield model_1.default.find({ isActive: "true" })
            .select("name pantheon role images")
            .sort({ name: 1 })
            .exec();
        res.status(200).json({ allGodsActive });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllActiveGods = getAllActiveGods;
const getAllGods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role; // Obtén el rol del usuario autenticado
        // Verificar si el usuario actual es el propietario es un admin
        if (userRole !== "admin") {
            const error = new Error("No tienes permiso para ver esta información");
            error.status = 403;
            throw error;
        }
        // Obtener todos los usuarios con rol de tatuador
        const allGods = yield model_1.default.find({})
            .select("name pantheon role isActive")
            .sort({ name: 1 })
            .exec();
        res.status(200).json({ allGods });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllGods = getAllGods;
const filterAllActiveGods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener parámetros opcionales de la solicitud
        const { pantheon, role, godName } = req.body;
        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filter = { isActive: true };
        if (pantheon) {
            filter.pantheon = pantheon;
        }
        if (role) {
            filter.role = role;
        }
        if (godName) {
            filter.name = { $regex: new RegExp(godName, "i") };
        }
        // Realizar la consulta a la base de datos
        const allGodsActive = yield model_1.default.find(filter)
            .select("name pantheon role images")
            .sort({ name: 1 })
            .exec();
        res.status(200).json({ allGodsActive });
    }
    catch (error) {
        next(error);
    }
});
exports.filterAllActiveGods = filterAllActiveGods;
const getGodDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const godId = req.params.id;
        const godDetails = yield model_1.default.findById(godId);
        if (!godDetails) {
            return res.status(404).json({ message: "Dios no encontrado" });
        }
        res.status(200).json({ godDetails });
    }
    catch (error) {
        next(error);
    }
});
exports.getGodDetails = getGodDetails;
const createGod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role; // Obtén el rol del usuario autenticado
        // Verificar si el usuario actual es el propietario es un admin
        if (userRole !== "admin") {
            const error = new Error("No tienes permiso para modificar este perfil");
            error.status = 403;
            throw error;
        }
        // Define los campos requeridos
        const camposRequeridos = [
            "name",
            "pantheon",
            "role",
            "lore",
            "abilities",
            "images",
        ];
        // Verificar campos requeridos utilizando la función de validación
        (0, comun_1.validateRequiredFields)(req.body, camposRequeridos);
        const { name, pantheon, role, lore, abilities, images, isActive, isNewGod, isFreeToPlay, } = req.body;
        // Verificar si el dios ya existe por el nombre
        const existingGod = yield model_1.default.findOne({ name });
        if (existingGod) {
            return res
                .status(400)
                .json({ error: "Ya existe un dios con ese nombre" });
        }
        // Crear un nuevo dios
        const newGod = new model_1.default({
            name,
            pantheon,
            role,
            lore,
            abilities,
            images,
            isActive: isActive || true,
            isNewGod: isNewGod || false,
            isFreeToPlay: isFreeToPlay || false,
        });
        yield newGod.save();
        res.json({ message: "Dios creado exitosamente", god: newGod });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }
});
exports.createGod = createGod;
const updateGodActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role; // Obtén el rol del usuario autenticado
    // Verificar si el usuario actual es el propietario es un admin
    if (userRole !== "admin") {
        const error = new Error("No tienes permiso para ver esta información");
        error.status = 403;
        throw error;
    }
    const godId = req.params.id;
    const newStatus = req.body.isActive; // Nuevo valor para el campo isActive
    try {
        // Actualizar el campo isDeleted a true en lugar de eliminar
        const updatedGod = yield model_1.default.findByIdAndUpdate(godId, {
            isActive: newStatus,
        });
        if (!updatedGod) {
            return res.status(404).json({ message: "Dios no encontrado" });
        }
        return res.status(200).json({ message: "Dios borrado exitosamente" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error interno del servidor", error });
    }
});
exports.updateGodActive = updateGodActive;
const updateGod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const godId = req.params.id;
    const userRole = req.user.role;
    // Verificar si el usuario actual es el propietario o es un admin
    if (userRole !== "admin") {
        return res
            .status(403)
            .json({ message: "No tienes permiso para actualizar esta información" });
    }
    try {
        // Encuentra el dios por ID
        const godToUpdate = yield model_1.default.findById(godId);
        if (!godToUpdate) {
            return res.status(404).json({ message: "Dios no encontrado" });
        }
        // Actualiza la información del dios con los nuevos datos
        godToUpdate.name = req.body.name;
        godToUpdate.pantheon = req.body.pantheon;
        godToUpdate.role = req.body.role;
        godToUpdate.lore = req.body.lore;
        godToUpdate.abilities = req.body.abilities;
        godToUpdate.images = req.body.images;
        godToUpdate.isActive = req.body.isActive;
        godToUpdate.isNewGod = req.body.isNewGod;
        godToUpdate.isFreeToPlay = req.body.isFreeToPlay;
        // Guarda los cambios en la base de datos
        const updatedGod = yield godToUpdate.save();
        // Responde con el dios actualizado
        return res
            .status(200)
            .json({ message: "Dios actualizado exitosamente", god: updatedGod });
    }
    catch (error) {
        // Maneja los errores
        return res
            .status(500)
            .json({ message: "Error interno del servidor", error });
    }
});
exports.updateGod = updateGod;
//# sourceMappingURL=controller.js.map