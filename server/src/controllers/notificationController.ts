import { Request, Response } from 'express';
import Notification from '../models/Notification';

// @desc    Get notifications for a supermarket
// @route   GET /api/notifications/:supermarketId
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { supermarketId } = req.params;
        // Obtain notifications for the supermarket, sorted by newest first
        const notifications = await Notification.find({ supermarket: supermarketId })
            .sort({ createdAt: -1 }) // The most recent notifications will appear first
            .populate('product', 'name sku'); // Come back with basic product info

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};

// @desc    Check if there are unread notifications for a supermarket
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        
        if (!notification) {
            res.status(404).json({ message: 'Notificación no encontrada' });
            return;
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar notificación' });
    }
};

// @desc    Notification Delete
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.json({ message: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};