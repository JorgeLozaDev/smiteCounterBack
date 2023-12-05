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
