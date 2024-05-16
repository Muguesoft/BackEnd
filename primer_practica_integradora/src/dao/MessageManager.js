// ESTA CLASE FUNCIONARA CON MONGO ATLAS.
import messageModel from './models/messages.model.js';

// CLASE MESSAGEMANAGER.
class messageManager{
    constructor() {
    }

    
    // INICIO METODO PARA AGREGAR MESSAGE.
    async addMessage(message) {
        try {

           // Las validaciones las hace Mongoose.
            const newMessage = await messageModel.create(message)
            
            // Retorna respuesta de funcion de escritura.
            return 'ok'

        } catch (error) {
            return error
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


export default messageManager;