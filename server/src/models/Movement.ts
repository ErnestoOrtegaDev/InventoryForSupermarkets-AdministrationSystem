import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMovement extends Document {
    product: Types.ObjectId;
    supermarket: Types.ObjectId;
    type: 'IN' | 'OUT' | 'ADJUST'; // ENTRADA (compra), SALIDA (venta), AJUSTE (merma/inventario físico)
    quantity: number;              // Cuánto sumó o restó
    previousStock: number;         // Cuánto había antes
    newStock: number;              // Cuánto quedó después
    description: string;           // Razón del movimiento
    // user: Types.ObjectId;       // (Opcional) Quién hizo el movimiento, si ya tienes Auth
}

const MovementSchema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    supermarket: {
        type: Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },
    type: {
        type: String,
        enum: ['IN', 'OUT', 'ADJUST'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0 // Siempre positivo, el 'type' define si sumó o restó
    },
    previousStock: {
        type: Number,
        required: true,
        min: 0
    },
    newStock: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: 'Actualización de inventario'
    }
}, {
    timestamps: true, // Automáticamente guarda fecha y hora exacta (createdAt)
    versionKey: false
});

export default mongoose.model<IMovement>('Movement', MovementSchema);