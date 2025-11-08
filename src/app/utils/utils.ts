// Función para formatear un entero a pesos COP
export const formatPrice = (price: number): string => {
  return price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });
}

// Función para formatear un valor de precio a entero
export function parsePriceToInteger(formattedPrice: string): number | null {
  if (!formattedPrice) {
    return null;
  }

  let cleanString = formattedPrice.replace(/[^0-9.]/g, '');

  cleanString = cleanString.replace(/\./g, '');

  const integerValue = parseInt(cleanString, 10);

  return isNaN(integerValue) ? 0 : integerValue;
}
