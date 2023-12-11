// Función para validar campos requeridos
export const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    // Separar campos anidados por puntos
    const fieldParts = field.split(".");

    // Verificar campos anidados
    let fieldValue = data;
    for (const part of fieldParts) {
      fieldValue = fieldValue[part];
    }

    // Verificar si el campo existe y es una cadena (string), un array no vacío o un objeto no vacío
    if (
      !fieldValue ||
      (typeof fieldValue.trim !== "function" &&
        (!Array.isArray(fieldValue) || fieldValue.length === 0) &&
        (typeof fieldValue !== "object" ||
          Object.keys(fieldValue).length === 0))
    ) {
      const error = new Error(
        `El campo '${field}' es obligatorio y debe ser una cadena, un array no vacío o un objeto no vacío.`
      );
      (error as any).status = 400;
      throw error;
    }
  }
};

export const validateDateAndAge = (dateString: string): Date | null => {
  if (dateString && dateString.trim() !== "") {
    const userBirthday = new Date(dateString);
    const today = new Date();

    const age = today.getFullYear() - userBirthday.getFullYear();
    if (age < 12) {
      const error = new Error("Debes tener al menos 16 años para registrarte");
      (error as any).status = 400;
      throw error;
    }

    // Si la fecha y la edad son válidas, devolver la fecha
    return userBirthday;
  }

  return null; // Devolver null si no se proporciona una fecha
};