export const validateRequiredFields = (
  objeto: any,
  camposRequeridos: string[]
) => {
  const camposFaltantes: string[] = [];

  camposRequeridos.forEach((campo) => {
    if (!objeto[campo] || objeto[campo].trim() === "") {
      camposFaltantes.push(campo);
    }
  });

  if (camposFaltantes.length > 0) {
    const error = new Error("Campos requeridos faltantes");
    (error as any).status = 400;
    (error as any).missingFields = camposFaltantes;
    throw error;
  }
};
