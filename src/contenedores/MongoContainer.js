import mongoose from 'mongoose';
import config from '../config.js'

mongoose.connect(config.mongo.baseUrl, {useNewUrlParser:true, useUnifiedTopology:true})

export default class MongoContainer{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamps));
    }

    saveCart = async(obj)  => {
        try{
            let result = await this.collection.create(obj);
            return {status:"success", message:"El documento ha sido añadido exitosamente", payload:result}            
        } catch(err){
            return {status: "error", message: `No se pudo añadir el producto a carpeta inexistente: ${err}`}
        }
    }

    saveProduct = async(obj)  => {
        try{
            let document = await this.collection.findOne({nombre:obj.nombre});
            if(document) return {status: "error", message: 'El documento ya existe'}
            let result = await this.collection.create(obj);
            return {status:"success", message:"El documento ha sido añadido exitosamente", payload:result}
        } catch(err){
            return {status: "error", message: `No se pudo añadir el producto a carpeta inexistente: ${err}`}
        }
    }

    getAll = async() =>{
        try{
            let documents = await this.collection.find();
            return {status: "success", payload: documents}
        }catch(err){
            return {status:"error", error: err}
        }
    }

    getById = async(id) => {
        try {
            let document = await this.collection.find({_id:id});
            if(document){
                return {payload: document[0]}
            }else{
                return {status:"error", event:null, message:"Objeto no encontrado"}
            }
        } catch(err) {
            return {status: "error", error:  `No se pudo obtener la informacion: ${err}`};
        }
    }

    getCartById = async(id) => {
        try {
            let document = await this.collection.find({_id:id}).populate('productos');
            if(document){
                return {payload: document[0]}
            }else{
                return {status:"error", event:null, message:"Objeto no encontrado"}
            }
        } catch(err) {
            return {status: "error", error:  `No se pudo obtener la informacion: ${err}`};
        }
    }

    updateElement = async(id,body) => {
        try{
            let document = await this.collection.find({_id:id});
            if(!document) return {status: "error", error: 'El documento no existe en la colleccion'};
            body - JSON.stringify(body);
            await this.collection.updateOne( {_id:id}, {$set:body});
            return {status:"success",  message:"Elemento actualizado"};
        }catch(err){
            return {status:"error",message:`Fallo al actualizar el elemento: ${err}`}
        }
    }

    deleteAll = async() => {
        try {
            await this.collection.deleteMany({});
            return {status: "success", message: "Todos los objetos fueron borrados exitosamente"};
        } catch(err) {
            return {status: "error", message: 'No se pudo borrar los objetos'};
        }
    }

    deleteById = async(id) => {
        try {
            let document = await this.collection.find({_id:id});
            if(!document) return {status: "error", error: 'El documento no existe en la colleccion'};
            await this.collection.deleteOne({_id:id});
            return {status: "success", message:"El documento fue borrado exitosamente"};
        } catch(err) {
            return {status: "error", error: `No se pudo borrar el documento: ${err}`};
        }
    }

    addProductToCart = async(cId,pId) => {
        try{
            let carrito = await this.collection.find({_id:cId})
            if(!carrito) return {status:"error",message:"Carrito no encontrado"};
            let result = await this.collection.updateOne({_id:cId},{$push:{productos:pId}})
            console.log(result);
            return {status:"success", message:"El producto ha sido añadido exitosamente al carrito", payload: result}
        }catch(err){
            return {status:"error", error: `No se pudo añadir el producto al carrito: ${err}`}
        }
    }

    deleteProductFromCart = async(cId,pId) => {
        try{
            let carrito = await this.collection.find({_id:cId})
            if(!carrito) return {status:"error",message:"Carrito no encontrado"};
            await this.collection.updateOne({_id:cId},{$pull:{productos:pId}});
            return {status:"success", message:"El producto ha sido borrado exitosamente"}
    }catch(err) {
        return {status: "error", message: `No se pudo borrar el producto del carrito ${err}`};
    }
    }


}