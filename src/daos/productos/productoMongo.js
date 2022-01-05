import Schema from 'mongoose';
import MongoContainer from "../../contenedores/MongoContainer.js";

export default class ProductoMongo extends MongoContainer{
    constructor(){
        super(
            'productos',
            {
                nombre: {type:String, required:true},
                descripcion:{type:String, required:true},
                codigo:{type:Number, required:true},
                thumbnail:{type:String, required:true},
                precio:{type:Number, required:true},
                stock:{type:Number, required:true},
                carritoContenedor:{
                    type:Schema.Types.ObjectId,
                    ref:'carritos',
                    default:null
                }
            },{timestamps:true}
        )
    }
}