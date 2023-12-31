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
exports.userDetails = exports.updateUserStatusActive = exports.getAllUsers = exports.getAdminMainList = exports.deleteCounterGod = exports.getListById = exports.deleteListCounter = exports.saveListCounter = exports.getAllCreatedListsCounters = exports.updateProfile = exports.getProfile = exports.loginUser = exports.singIn = void 0;
const model_1 = __importDefault(require("./model"));
const config_1 = __importDefault(require("../../core/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comun_1 = require("../../core/helpers/comun");
const model_2 = __importDefault(require("../gods/model"));
const singIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener datos del cuerpo de la solicitud
        const { email, username, password, birthday } = req.body;
        // Definir campos requeridos
        const camposRequeridos = ["email", "username", "password"];
        // Verificar campos requeridos utilizando la función de validación
        (0, comun_1.validateRequiredFields)(req.body, camposRequeridos);
        // Verificar fecha y obtener la fecha válida
        const userBirthday = (0, comun_1.validateDateAndAge)(birthday);
        // Asignar el rol por defecto si "role" viene vacío
        const userRole = "user";
        // Encriptar la contraseña antes de almacenarla en la base de datos
        const hashedPassword = yield bcrypt_1.default.hash(password, config_1.default.BCRYTP_LOOP);
        // Verificar si el usuario ya existe
        const existingUser = yield model_1.default.findOne({ email });
        if (existingUser) {
            // Lanza un error con un código de estado HTTP personalizado
            const error = new Error("El usuario ya existe");
            error.status = 409;
            throw error;
        }
        // Crear un nuevo usuario con el rol asignado
        const newUser = new model_1.default({
            email,
            username,
            password: hashedPassword,
            role: userRole,
            birthday: userBirthday,
        });
        yield newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito" });
    }
    catch (error) {
        next(error);
    }
});
exports.singIn = singIn;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Buscar al usuario por nombre de usuario
        const user = yield model_1.default.findOne({ email }).select("+password");
        if (!user) {
            // Lanza un error con un código de estado HTTP personalizado
            const error = new Error("El usuario no existe");
            error.status = 404;
            throw error;
        }
        // Verificar la contraseña
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Lanza un error con un código de estado HTTP personalizado
            const error = new Error("Usuario o contraseña incorrectas");
            error.status = 409;
            throw error;
        }
        // Generar y firmar un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, role: user.role }, config_1.default.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// Controlador para obtener el perfil del usuario
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // Obtén el ID del usuario autenticado desde el middleware
        // Busca al usuario por ID
        const user = yield model_1.default.findById(userId);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getProfile = getProfile;
// Controlador para actualizar datos personales del usuario
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password, birthday } = req.body;
        const userIdFromToken = req.user.id; // Obtén el ID del usuario autenticado desde el middleware
        const userRole = req.user.role; // Obtén el rol del usuario autenticado
        // Buscar al usuario por los campos proporcionados (name, lastname, email, username)
        const userFound = yield model_1.default.findOne({ email });
        if (!userFound) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        // Verificar si el usuario actual es el propietario del perfil o es un superadmin
        if (userRole !== "superadmin" &&
            userFound._id.toString() !== userIdFromToken) {
            const error = new Error("No tienes permiso para modificar este perfil");
            error.status = 403;
            throw error;
        }
        // Definir campos requeridos
        const camposRequeridos = ["username", "birthday"];
        // Verificar campos requeridos utilizando la función de validación
        (0, comun_1.validateRequiredFields)(req.body, camposRequeridos);
        const userBirthday = (0, comun_1.validateDateAndAge)(birthday);
        // userFound.birthday = userBirthday;
        // Actualiza los datos personales del usuario
        if (userBirthday !== null) {
            userFound.birthday = userBirthday;
            // Resto del código...
        }
        else {
            // Manejar el caso en que la fecha no es válida
            const error = new Error("Fecha de cumpleaños no válida");
            error.status = 400; // Código de estado 400 Bad Request
            throw error;
        }
        userFound.username = username;
        // Si la contraseña cambia, puedes volver a generar el token
        if (password && password.trim() != "") {
            // Encripta la nueva contraseña antes de almacenarla en la base de datos
            const hashedPassword = yield bcrypt_1.default.hash(password, config_1.default.BCRYTP_LOOP);
            userFound.password = hashedPassword;
            // Genera y firma un nuevo token JWT
            const token = jsonwebtoken_1.default.sign({
                id: userFound._id,
                username: userFound.username,
                role: userFound.role,
            }, config_1.default.JWT_SECRET, { expiresIn: "24h" });
            res
                .status(200)
                .json({ message: "Datos personales actualizados con éxito", token });
        }
        else {
            yield userFound.save();
            res
                .status(200)
                .json({ message: "Datos personales actualizados con éxito" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
// LISTA COUNTER DIOSES
const getAllCreatedListsCounters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const createdLists = user.createdLists;
        const simplifiedLists = createdLists.map((list) => ({
            listName: list.listName,
            listId: list._id,
        }));
        res.status(200).json(simplifiedLists);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});
exports.getAllCreatedListsCounters = getAllCreatedListsCounters;
const saveListCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdFromToken = req.user.id;
        const { listName, mainGod, counterpicks } = req.body;
        const user = yield model_1.default.findById(userIdFromToken);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        // Buscar si ya existe una lista con el mismo nombre
        const existingListIndex = user.createdLists.findIndex((list) => list.listName === listName);
        if (existingListIndex !== -1) {
            // Si la lista ya existe, actualiza la información
            const existingList = user.createdLists[existingListIndex];
            // Encuentra el elemento en mainGods con el mismo godId
            const existingGodIndex = existingList.mainGods.findIndex((god) => god.godId.toString() === mainGod.toString());
            if (existingGodIndex !== -1) {
                // Si el godId ya existe, actualiza los counterpicks
                existingList.mainGods[existingGodIndex].counterpicks = counterpicks;
            }
            else {
                // Si el godId no existe, agrega un nuevo elemento a mainGods
                existingList.mainGods.push({
                    godId: mainGod,
                    counterpicks,
                });
            }
        }
        else {
            // Si la lista no existe, crea una nueva lista y agrégala al usuario
            const newList = {
                listName,
                mainGods: [
                    {
                        godId: mainGod,
                        counterpicks,
                    },
                ],
            };
            user.createdLists.push(newList);
        }
        // Guardar los cambios en la base de datos
        yield user.save();
        res.json({ success: true, message: "Lista guardada exitosamente." });
    }
    catch (error) {
        console.error("Error al guardar la lista:", error);
        res
            .status(500)
            .json({ success: false, message: "Error al guardar la lista." });
    }
});
exports.saveListCounter = saveListCounter;
const deleteListCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdFromToken = req.user.id;
        const listId = req.params.id;
        // Busca al usuario y actualiza la lista eliminándola
        const user = yield model_1.default.findByIdAndUpdate(userIdFromToken, { $pull: { createdLists: { _id: listId } } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ success: true, message: "Lista eliminada exitosamente." });
    }
    catch (error) {
        console.error("Error al eliminar la lista:", error);
        res
            .status(500)
            .json({ success: false, message: "Error al eliminar la lista." });
    }
});
exports.deleteListCounter = deleteListCounter;
const getListById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdFromToken = req.user.id;
        const listId = req.params.id;
        // Busca al usuario
        const user = yield model_1.default.findById(userIdFromToken);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Busca la lista en las listas creadas por el usuario
        const list = user.createdLists.id(listId);
        if (!list) {
            return res.status(404).json({ message: "Lista no encontrada" });
        }
        // Extrae información relevante de la lista, incluyendo los counterpicks
        const { listName, mainGods } = list.toObject();
        // Mapea los counterpicks para incluir información adicional si es necesario
        const mainGodsWithCounterpicks = mainGods.map((mainGod) => ({
            godId: mainGod.godId,
            counterpicks: mainGod.counterpicks.map((counterpick) => ({
                godId: counterpick.godId,
                description: counterpick.description,
            })),
        }));
        res.json({
            success: true,
            list: { listName, mainGods: mainGodsWithCounterpicks },
        });
    }
    catch (error) {
        console.error("Error al obtener la lista:", error);
        res
            .status(500)
            .json({ success: false, message: "Error al obtener la lista." });
    }
});
exports.getListById = getListById;
// Eliminar una fila de la lista por godId
const deleteCounterGod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { godId } = req.body;
        // Verificar si el godId es válido (puedes agregar más validaciones según tus necesidades)
        if (!godId) {
            return res.status(400).json({ message: "El godId es obligatorio." });
        }
        // Eliminar el subdocumento de la lista
        const result = yield model_1.default.updateOne({ "createdLists.mainGods.godId": godId }, { $pull: { "createdLists.$.mainGods": { godId } } });
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Fila eliminada exitosamente." });
        }
        else {
            res
                .status(404)
                .json({ message: "No se encontró la fila con el godId especificado." });
        }
    }
    catch (error) {
        console.error("Error al eliminar la fila:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
exports.deleteCounterGod = deleteCounterGod;
const getAdminMainList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtén al usuario administrador
        const adminUser = yield model_1.default.findOne({ role: "admin" });
        // Verifica si se encontró al usuario administrador
        if (!adminUser) {
            return res
                .status(404)
                .json({ message: "No se encontró al usuario administrador." });
        }
        // Busca la lista llamada "principal" en las listas creadas por el administrador
        const mainList = adminUser.createdLists.find((list) => list.listName.toLowerCase() === "principal");
        if (!mainList) {
            return res.status(404).json({
                message: "No se encontró la lista principal para el administrador.",
            });
        }
        // Obtener detalles del dios para cada elemento en la lista
        const detailedList = yield Promise.all(mainList.mainGods.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const godDetails = yield model_2.default.findById(item.godId).select("name images.card pantheon role");
            const counterpicksDetails = yield Promise.all(item.counterpicks.map((counterpick) => __awaiter(void 0, void 0, void 0, function* () {
                const counterpickDetails = yield model_2.default.findById(counterpick.godId).select("name images.card pantheon ");
                return Object.assign(Object.assign({}, counterpick.toObject()), { godDetails: counterpickDetails });
            })));
            return Object.assign(Object.assign({}, item.toObject()), { godDetails, counterpicks: counterpicksDetails });
        })));
        res.status(200).json(detailedList);
    }
    catch (error) {
        console.error("Error al obtener la lista principal del administrador:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
exports.getAdminMainList = getAdminMainList;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica si el usuario es administrador
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }
        // Si es administrador, obtén la información de todos los usuarios
        const users = yield model_1.default.find({}, "email"); // Solo obtén el campo 'email'
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.getAllUsers = getAllUsers;
const updateUserStatusActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role; // Obtén el rol del usuario autenticado
    // Verificar si el usuario actual es el propietario es un admin
    if (userRole !== "admin") {
        const error = new Error("No tienes permiso para ver esta información");
        error.status = 403;
        throw error;
    }
    const userId = req.params.id;
    const newStatus = req.body.isActive; // Nuevo valor para el campo isActive
    try {
        // Actualizar el campo isDeleted a true en lugar de eliminar
        const updatedGod = yield model_1.default.findByIdAndUpdate(userId, {
            isActive: newStatus,
        });
        if (!updatedGod) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json({ message: "Usuario borrado exitosamente" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error interno del servidor", error });
    }
});
exports.updateUserStatusActive = updateUserStatusActive;
const userDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica si el usuario es administrador
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }
        const userId = req.params.id;
        // Busca el usuario por ID y selecciona los campos deseados
        const user = yield model_1.default.findById(userId, "username email role isActive birthday");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.userDetails = userDetails;
//# sourceMappingURL=controller.js.map