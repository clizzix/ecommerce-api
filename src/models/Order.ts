import { Schema, model } from 'mongoose';

export const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'An Order has to be linked to an user'],
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity cannot be less than 1'],
                    default: 1,
                },
            },
        ],
        total: {
            type: Number,
            required: [true, 'Total order amount is required'],
            min: [0, 'Total cannot be negative'],
        },
    },
    {
        timestamps: true,
    },
);

export default model('Order', orderSchema);
