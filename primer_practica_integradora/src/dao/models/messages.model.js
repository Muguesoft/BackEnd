import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
});

const messageModel = model('messages', messageSchema);

export default messageModel;