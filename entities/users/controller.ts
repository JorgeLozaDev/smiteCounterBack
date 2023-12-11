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

export const singUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Obtener datos del cuerpo de la solicitud
      const { name, lastname, email, username, password, role, birthday } =
        req.body;
  
      // Definir campos requeridos
      const camposRequeridos = [
        "name",
        "lastname",
        "email",
        "username",
        "password",
      ];
  
      // Verificar campos requeridos utilizando la función de validación
      validateRequiredFields(req.body, camposRequeridos);
  
      // Verificar fecha y obtener la fecha válida
      const userBirthday = validateDateAndAge(birthday);
  
      // Asignar el rol por defecto si "role" viene vacío
      const userRole = role || "user";
      // const userRole =  "user";
  
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
        name,
        lastname,
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