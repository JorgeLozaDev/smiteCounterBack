import express, { NextFunction, Request, Response } from "express";
import User from "./model";
import CONF from "../../core/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../../core/customInterfaces";
import {
  validateRequiredFields,
  validateDateAndAge,
} from "../../core/helpers/comun";
import God from "../gods/model";

export const singIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { email, username, password, birthday } = req.body;

    // Definir campos requeridos
    const camposRequeridos = ["email", "username", "password"];

    // Verificar campos requeridos utilizando la función de validación
    validateRequiredFields(req.body, camposRequeridos);

    // Verificar fecha y obtener la fecha válida
    const userBirthday = validateDateAndAge(birthday);

    // Asignar el rol por defecto si "role" viene vacío
    const userRole = "user";

    // Encriptar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, CONF.BCRYTP_LOOP);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Lanza un error con un código de estado HTTP personalizado
      const error = new Error("El usuario ya existe");
      (error as any).status = 409;
      throw error;
    }

    // Crear un nuevo usuario con el rol asignado
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role: userRole,
      birthday: userBirthday,
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por nombre de usuario
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Lanza un error con un código de estado HTTP personalizado
      const error = new Error("El usuario no existe");
      (error as any).status = 404;
      throw error;
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Lanza un error con un código de estado HTTP personalizado
      const error = new Error("Usuario o contraseña incorrectas");
      (error as any).status = 409;
      throw error;
    }

    // Generar y firmar un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      CONF.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener el perfil del usuario
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id; // Obtén el ID del usuario autenticado desde el middleware

    // Busca al usuario por ID
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      (error as any).status = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar datos personales del usuario
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password, birthday } = req.body;
    const userIdFromToken = req.user.id; // Obtén el ID del usuario autenticado desde el middleware
    const userRole = req.user.role; // Obtén el rol del usuario autenticado

    // Buscar al usuario por los campos proporcionados (name, lastname, email, username)
    const userFound = await User.findOne({ email });

    if (!userFound) {
      const error = new Error("Usuario no encontrado");
      (error as any).status = 404;
      throw error;
    }

    // Verificar si el usuario actual es el propietario del perfil o es un superadmin
    if (
      userRole !== "superadmin" &&
      userFound._id.toString() !== userIdFromToken
    ) {
      const error = new Error("No tienes permiso para modificar este perfil");
      (error as any).status = 403;
      throw error;
    }

    // Definir campos requeridos
    const camposRequeridos = ["username", "birthday"];

    // Verificar campos requeridos utilizando la función de validación
    validateRequiredFields(req.body, camposRequeridos);

    const userBirthday = validateDateAndAge(birthday);

    // userFound.birthday = userBirthday;
    // Actualiza los datos personales del usuario
    if (userBirthday !== null) {
      userFound.birthday = userBirthday;

      // Resto del código...
    } else {
      // Manejar el caso en que la fecha no es válida
      const error = new Error("Fecha de cumpleaños no válida");
      (error as any).status = 400; // Código de estado 400 Bad Request
      throw error;
    }

    userFound.username = username;
    // Si la contraseña cambia, puedes volver a generar el token
    if (password && password.trim() != "") {
      // Encripta la nueva contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, CONF.BCRYTP_LOOP);
      userFound.password = hashedPassword;

      // Genera y firma un nuevo token JWT
      const token = jwt.sign(
        {
          id: userFound._id,
          username: userFound.username,
          role: userFound.role,
        },
        CONF.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res
        .status(200)
        .json({ message: "Datos personales actualizados con éxito", token });
    } else {
      await userFound.save();
      res
        .status(200)
        .json({ message: "Datos personales actualizados con éxito" });
    }
  } catch (error) {
    next(error);
  }
};

// LISTA COUNTER DIOSES

export const getAllCreatedListsCounters = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const createdLists = user.createdLists;

    const simplifiedLists = createdLists.map((list) => ({
      listName: list.listName,
      listId: list._id,
    }));

    res.status(200).json(simplifiedLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const saveListCounter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdFromToken = req.user.id;
    const { listName, mainGod, counterpicks } = req.body;

    const user = await User.findById(userIdFromToken);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      (error as any).status = 404;
      throw error;
    }

    // Buscar si ya existe una lista con el mismo nombre
    const existingListIndex = user.createdLists.findIndex(
      (list) => list.listName === listName
    );

    if (existingListIndex !== -1) {
      // Si la lista ya existe, actualiza la información
      const existingList = user.createdLists[existingListIndex];

      // Encuentra el elemento en mainGods con el mismo godId
      const existingGodIndex = existingList.mainGods.findIndex(
        (god) => god.godId.toString() === mainGod.toString()
      );

      if (existingGodIndex !== -1) {
        // Si el godId ya existe, actualiza los counterpicks
        existingList.mainGods[existingGodIndex].counterpicks = counterpicks;
      } else {
        // Si el godId no existe, agrega un nuevo elemento a mainGods
        existingList.mainGods.push({
          godId: mainGod,
          counterpicks,
        });
      }
    } else {
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
    await user.save();

    res.json({ success: true, message: "Lista guardada exitosamente." });
  } catch (error) {
    console.error("Error al guardar la lista:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al guardar la lista." });
  }
};

export const deleteListCounter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdFromToken = req.user.id;
    const listId = req.params.id;

    // Busca al usuario y actualiza la lista eliminándola
    const user = await User.findByIdAndUpdate(
      userIdFromToken,
      { $pull: { createdLists: { _id: listId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Lista eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la lista:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la lista." });
  }
};

export const getListById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdFromToken = req.user.id;
    const listId = req.params.id;

    // Busca al usuario
    const user = await User.findById(userIdFromToken);

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
  } catch (error) {
    console.error("Error al obtener la lista:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener la lista." });
  }
};

// Eliminar una fila de la lista por godId
export const deleteCounterGod = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { godId } = req.body;

    // Verificar si el godId es válido (puedes agregar más validaciones según tus necesidades)
    if (!godId) {
      return res.status(400).json({ message: "El godId es obligatorio." });
    }

    // Eliminar el subdocumento de la lista
    const result = await User.updateOne(
      { "createdLists.mainGods.godId": godId },
      { $pull: { "createdLists.$.mainGods": { godId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Fila eliminada exitosamente." });
    } else {
      res
        .status(404)
        .json({ message: "No se encontró la fila con el godId especificado." });
    }
  } catch (error) {
    console.error("Error al eliminar la fila:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getAdminMainList = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtén al usuario administrador
    const adminUser = await User.findOne({ role: "admin" });

    // Verifica si se encontró al usuario administrador
    if (!adminUser) {
      return res
        .status(404)
        .json({ message: "No se encontró al usuario administrador." });
    }

    // Busca la lista llamada "principal" en las listas creadas por el administrador
    const mainList = adminUser.createdLists.find(
      (list) => list.listName.toLowerCase() === "principal"
    );

    if (!mainList) {
      return res
        .status(404)
        .json({
          message: "No se encontró la lista principal para el administrador.",
        });
    }

    // Obtener detalles del dios para cada elemento en la lista
    const detailedList = await Promise.all(
      mainList.mainGods.map(async (item) => {
        const godDetails = await God.findById(item.godId).select(
          "name images.card pantheon"
        );
        const counterpicksDetails = await Promise.all(
          item.counterpicks.map(async (counterpick) => {
            const counterpickDetails = await God.findById(
              counterpick.godId
            ).select("name images.card pantheon");
            return {
              ...counterpick.toObject(),
              godDetails: counterpickDetails,
            };
          })
        );
        return {
          ...item.toObject(),
          godDetails,
          counterpicks: counterpicksDetails,
        };
      })
    );

    res.status(200).json(detailedList);
  } catch (error) {
    console.error(
      "Error al obtener la lista principal del administrador:",
      error
    );
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
