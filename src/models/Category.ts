import { Schema, model } from 'mongoose';

export const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category is required'],
    },
});

export default model('Category', categorySchema);
