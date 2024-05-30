import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: [
        {
        product: {type:  mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        quantity: {type: Number, required: true}
        } ]
    });

const cartModel = model('carts', cartSchema);

export default cartModel;