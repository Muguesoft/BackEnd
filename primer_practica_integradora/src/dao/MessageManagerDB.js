// ESTA CLASE FUNCIONARA CON MONGO ATLAS.
import messageModel from './models/messages.model.js';
import mongoose from 'mongoose';


// CLASE MESSAGEMANAGER.
class messageManagerDB{
    constructor() {
    }

    
    // INICIO METODO PARA AGREGAR MESSAGE.
    async addMessage(message) {
        try {

           // Las validaciones las hace Mongoose.
            const newMessage = await messageModel.create(message)
            
            // Retorna respuesta de funcion de escritura.
            return newMessage

        } catch (error) {
            if (error.name === 'ValidationError') {
                return { error: true, message: error.message };
            }
            return { error: true, message: 'Error desconocido' };
        }
    }
    // FIN METODO PARA AGREGAR MESSAGE.

    // INICIO METODO PARA DEVOLVER MENSAJES.
    async getMessages() {
        try {

            const messages = await messageModel.find()
            
            return messages;
        }

        catch (error) {
            return error
        }
    }
    // FIN METODO PARA DEVOLVER MENSAJES.


    // INICIO METODO PARA BORRAR MENSAJE POR ID.
    async deleteMessageById(id){
        try {
            
            // Validar si el ID es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return `El ID ingresado ${id} no es un ObjectId válido`
            }

            const message = await messageModel.deleteOne({ _id: id })
                
            if (message.deletedCount > 0) {
                return `Mensaje con ID ${id} borrado correctamente`
            } else {
                return `El ID ingresado ${id} no existe; por lo tanto es imposible borrar`
            }
        }
        
        catch (error) {
            return error;
        } 
    }
    // FIN METODO PARA BORRAR MENSAJE POR ID.

}


export default messageManagerDB;