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
