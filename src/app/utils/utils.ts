// Función para formatear un entero a pesos COP
export const formatPrice = (price: number): string => {
  return price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });
}
