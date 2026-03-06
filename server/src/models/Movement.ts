import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMovement extends Document {
    product: Types.ObjectId;
    supermarket: Types.ObjectId;
    type: 'IN' | 'OUT' | 'ADJUST'; // IN = entrada, OUT = salida, ADJUST = ajuste manual
    quantity: number;              // how much was added or removed
    previousStock: number;         // How much was there before
    newStock: number;              // How much is there after
    description: string;           // Reason for the movement, e.g., "Venta", "Devolución", "Ajuste por inventario"
    // user: Types.ObjectId;       // (Optional) Who made the change 
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
        min: 0 // Always non-negative, since it represents how much was added or removed
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
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false
});

export default mongoose.model<IMovement>('Movement', MovementSchema);