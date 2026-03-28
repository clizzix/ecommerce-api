import { Schema, model } from 'mongoose';
import { ref } from 'process';

export const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Prodcut name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'A product must belong to a category'],
        },
    },
    {
        timestamps: true,
    },
);

export default model('Product', productSchema);
