import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
    code: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    stock: {type: Number, required: true},
    price: {type: Number, required: true},
    status: {type:Boolean, required: true},
    thumbnails: [{type: String}]
});

const productModel = model('products', productSchema);

export default productModel;