import Schema from "mongoose";
import MongoContainer from "../../contenedores/MongoContainer.js";

export default class CarritoMongo extends MongoContainer{
    constructor(){
        super(
            'carritos',
            {
                productos:{
                    type: [{
                        type: Schema.Types.ObjectId,
                        ref:'productos'
                    }],
                    default:[]
                }
            },{timestamps:true}
        )
    }
}