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

export const saveListCounter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => { 
  try { 
    const userIdFromToken = req.user.id; // Obtén el ID del usuario autenticado desde el middleware
    // Extraer los datos del cuerpo de la solicitud
    const { listName, mainGod, counterpicks } = req.body;

    // Obtener el usuario actual (puedes usar la autenticación del usuario)
    const user = await User.findById(userIdFromToken);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      (error as any).status = 404;
      throw error;
    }

    // Crear un nuevo objeto de lista
    const newList = {
      listName,
      mainGod,
      counterpicks,
    };

    // Agregar la nueva lista a las listas creadas por el usuario
    user.createdLists.push(newList);

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
