import Movement from '../models/Movement';
import { Types } from 'mongoose';

/**
 * Registra automáticamente un movimiento en el Kardex si detecta cambios en el stock.
 */
export const recordKardexMovement = async (
    productId: Types.ObjectId | string,
    supermarketId: Types.ObjectId | string,
    previousStock: number,
    newStock: number,
    customDescription?: string // Opcional: Para darle más contexto
) => {
    try {
        const stockDifference = newStock - previousStock;

        // Si el stock no cambió (ej. solo editaron el nombre del producto), ignoramos
        if (stockDifference === 0) return;

        // Determinamos automáticamente si fue entrada o salida
        let type = 'ADJUST';
        let defaultDescription = '';

        if (stockDifference > 0) {
            type = 'IN';
            defaultDescription = 'Reabastecimiento de inventario';
        } else {
            type = 'OUT';
            defaultDescription = 'Salida/Venta de mercancía';
        }

        // Guardamos en la base de datos
        await Movement.create({
            product: productId,
            supermarket: supermarketId,
            type,
            quantity: Math.abs(stockDifference), // Siempre positivo
            previousStock,
            newStock,
            description: customDescription || defaultDescription
        });

    } catch (error) {
        console.error('Error guardando el historial (Kardex):', error);
    }
};