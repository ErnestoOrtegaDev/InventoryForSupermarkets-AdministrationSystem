import { Request, Response } from 'express';
import { recordKardexMovement } from '../utils/kardexLogger';
import Product from '../models/Product';
import Notification from '../models/Notification';

// @desc    Obtener productos de UN supermercado específico
// @route   GET /api/products/supermarket/:supermarketId
export const getProductsBySupermarket = async (req: Request, res: Response) => {
    try {
        const { supermarketId } = req.params;
        const products = await Product.find({ 
            supermarket: supermarketId, 
            active: true 
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// @desc    Crear Producto
// @route   POST /api/products
// @access  Private (Admin/Worker)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, sku, price, stock, minStock, supermarket, category } = req.body;

        const product = await Product.create({
            name,
            sku,
            price,
            stock,
            minStock,
            supermarket,
            category
        });

        await recordKardexMovement(
            product._id,
            product.supermarket,
            0, // El stock previo siempre es 0 al crear
            product.stock,
            'Inventario inicial (Alta de producto)'
        );

        res.status(201).json(product);
    } catch (error: any) {
        // Manejo de error por SKU duplicado
        if (error.code === 11000) {
            res.status(400).json({ message: 'El SKU ya existe en este supermercado' });
            return;
        }
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

// @desc    Actualizar Producto (y verificar Alerta de Stock)
// @route   PUT /api/products/:id
// @access  Private (Worker/Provider)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Buscamos el producto actual para guardar su stock anterior
        const oldProduct = await Product.findById(id);
        if (!oldProduct) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        // Actualizamos en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        // Validación de seguridad por si la actualización falló
        if (!updatedProduct) {
            res.status(404).json({ message: 'Error al obtener el producto actualizado' });
            return;
        }

        // LÓGICA DEL HISTORIAL DE MOVIMIENTOS (KARDEX)
        // Verificamos si se envió el campo stock y si realmente cambió
        await recordKardexMovement(
            updatedProduct._id,
            updatedProduct.supermarket,
            oldProduct.stock,       // Lo que había antes
            updatedProduct.stock,   // Lo que hay ahora
            'Actualización manual de producto'
        );

        // LÓGICA DE ALERTA DE STOCK CRÍTICO
        // Si el stock nuevo es menor o igual al mínimo...
        if (updatedProduct.stock <= updatedProduct.minStock) {
            
            // Crear la notificación en BD
            await Notification.create({
                type: 'STOCK_ALERT',
                message: `El producto ${updatedProduct.name} tiene stock crítico (${updatedProduct.stock} uds).`,
                supermarket: updatedProduct.supermarket,
                product: updatedProduct._id
            });
            
            // Enviamos la respuesta con las banderas para que SweetAlert salte en el Frontend
            res.json({
                ...updatedProduct.toObject(),
                alert: true, 
                alertMessage: `Stock Crítico: Solo quedan ${updatedProduct.stock} unidades`
            });
            return;
        }

        // Si todo sale bien y el stock es normal, respondemos la data limpia
        res.json(updatedProduct);

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

// @desc    Eliminar Producto (Soft Delete)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Encontramos el producto específico (en minúscula)
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        
        // Hacemos el Soft Delete
        await Product.findByIdAndUpdate(id, { active: false });
        
        // Registramos la salida total en el Kardex
        await recordKardexMovement(
            product._id,           
            product.supermarket,  
            product.stock,         
            0,                     // El nuevo stock útil es 0 porque se dio de baja
            'Baja del sistema (Producto inactivo)'
        );
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};