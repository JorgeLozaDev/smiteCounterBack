import express, { NextFunction, Request, Response } from "express";
import God from "./model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../../core/customInterfaces";
import { validateRequiredFields } from "../../core/helpers/comun";

// Controlador para agregar un nuevo dios
export const addGod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const {
      name,
      pantheon,
      role,
      lore,
      abilities,
      images,
      isActive,
      isNew,
      isFreeToPlay,
    } = req.body;

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
    validateRequiredFields(req.body, camposRequeridos);

    // Crear una nueva instancia de God usando el modelo
    const newGod = new God({
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
    const savedGod = await newGod.save();

    // Responder con el dios recién creado
    res.status(201).json(savedGod);
  } catch (error) {
    // Pasar el error al siguiente middleware
    next(error);
  }
};

export const getAllActiveGods = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener todos los usuarios con rol de tatuador
    const allGodsActive = await God.find({ isActive: "true" })
      .select("name pantheon role images")
      .sort({ name: 1 })
      .exec();

    res.status(200).json({ allGodsActive });
  } catch (error) {
    next(error);
  }
};

export const getAllGods = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.role; // Obtén el rol del usuario autenticado
    // Verificar si el usuario actual es el propietario es un admin
    if (userRole !== "admin") {
      const error = new Error("No tienes permiso para modificar este perfil");
      (error as any).status = 403;
      throw error;
    }
    // Obtener todos los usuarios con rol de tatuador
    const allGods = await God.find({})
      .select("name pantheon role")
      .sort({ name: 1 })
      .exec();

    res.status(200).json({ allGods });
  } catch (error) {
    next(error);
  }
};

export const filterAllActiveGods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener parámetros opcionales de la solicitud
    const { pantheon, role, godName } = req.body;
    // Crear un objeto de filtro basado en los parámetros proporcionados
    const filter: any = { isActive: true };

    if (pantheon) {
      filter.pantheon = pantheon;
    }

    if (role) {
      filter.role = role;
    }

    if (godName) {
      filter.name = { $regex: new RegExp(godName as string, "i") };
    }

    // Realizar la consulta a la base de datos
    const allGodsActive = await God.find(filter)
      .select("name pantheon role images")
      .sort({ name: 1 })
      .exec();

    res.status(200).json({ allGodsActive });
  } catch (error) {
    next(error);
  }
};

export const getGodDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const godId = req.params.id;

    const godDetails = await God.findById(godId);

    if (!godDetails) {
      return res.status(404).json({ message: "Dios no encontrado" });
    }

    res.status(200).json({ godDetails });
  } catch (error) {
    next(error);
  }
};

export const createGod = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.role; // Obtén el rol del usuario autenticado

    // Verificar si el usuario actual es el propietario es un admin
    if (userRole !== "admin") {
      const error = new Error("No tienes permiso para modificar este perfil");
      (error as any).status = 403;
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
    validateRequiredFields(req.body, camposRequeridos);

    const {
      name,
      pantheon,
      role,
      lore,
      abilities,
      images,
      isActive,
      isNewGod,
      isFreeToPlay,
    } = req.body;

    // Verificar si el dios ya existe por el nombre
    const existingGod = await God.findOne({ name });

    if (existingGod) {
      return res
        .status(400)
        .json({ error: "Ya existe un dios con ese nombre" });
    }

    // Crear un nuevo dios
    const newGod = new God({
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

    await newGod.save();

    res.json({ message: "Dios creado exitosamente", god: newGod });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
