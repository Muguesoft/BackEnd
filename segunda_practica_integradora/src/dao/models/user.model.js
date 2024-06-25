import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true, require: true },
    age: Number,
    password: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user'},
    cart: { type: Schema.Types.ObjectId, ref: 'carts' },
});

const userModel = mongoose.model('users', userSchema);

export default userModel