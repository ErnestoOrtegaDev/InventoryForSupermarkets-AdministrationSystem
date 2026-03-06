import Movement from '../models/Movement';
import { Types } from 'mongoose';

/**
 * Register a stock movement in the Kardex (Movement collection) whenever there's a change in product stock.
 * This function should be called inside the product update logic, after determining the previous and new stock levels.
 * It automatically determines if the movement is an "IN" (restock) or "OUT" (sale/adjustment) based on the stock difference.
 * You can also provide a custom description for more context in the movement record.
 */
export const recordKardexMovement = async (
    productId: Types.ObjectId | string,
    supermarketId: Types.ObjectId | string,
    previousStock: number,
    newStock: number,
    customDescription?: string // Optional: If you want to provide a specific description instead of the default ones based on movement type
) => {
    try {
        const stockDifference = newStock - previousStock;

        // If the stock hasn't changed, we don't need to record anything
        if (stockDifference === 0) return;

        // Determinate movement type and default description based on stock difference
        let type = 'ADJUST';
        let defaultDescription = '';

        if (stockDifference > 0) {
            type = 'IN';
            defaultDescription = 'Reabastecimiento de inventario';
        } else {
            type = 'OUT';
            defaultDescription = 'Salida/Venta de mercancía';
        }

        // Save the movement record in the database
        await Movement.create({
            product: productId,
            supermarket: supermarketId,
            type,
            quantity: Math.abs(stockDifference), // Always positive quantity for clarity in the movement record
            previousStock,
            newStock,
            description: customDescription || defaultDescription
        });

    } catch (error) {
        console.error('Error guardando el historial (Kardex):', error);
    }
};