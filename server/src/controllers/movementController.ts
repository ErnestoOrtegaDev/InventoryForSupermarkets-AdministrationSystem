import { Request, Response } from 'express';
import Movement from '../models/Movement'; 

// @desc    Obtener historial de movimientos por supermercado
// @route   GET /api/movements/supermarket/:supermarketId
// @access  Private
export const getMovementsBySupermarket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supermarketId } = req.params;

        // Buscamos los movimientos, ordenamos por los más recientes y traemos info del producto
        const movements = await Movement.find({ supermarket: supermarketId })
            .sort({ createdAt: -1 }) 
            .populate('product', 'name sku'); // Solo traemos el nombre y SKU para que la consulta sea ligera

        res.status(200).json(movements);
    } catch (error) {
        console.error("Error en getMovements:", error);
        res.status(500).json({ message: 'Error al obtener el historial de movimientos' });
    }
};