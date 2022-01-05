import admin from 'firebase-admin'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const serviceAccount = require('../ecommerce-78ecc-firebase-adminsdk-n7mr2-ca594edca2.json')
import config from '../config.js'

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL: `${config.fb.baseUrl}`
})


export default class FBContainer{
    constructor(collection){
        const db = admin.firestore(); 
        this.currentCollection = db.collection(collection);
    }

    saveProduct = async(obj)  => {
        try{
            let isRepeated;
            await this.currentCollection.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().nombre===obj.nombre){
                        return isRepeated=true;
                    }
                })
            })
            if(isRepeated) return {status:"error", message:"El documento ya existe"}
            const doc = this.currentCollection.doc();
            await doc.set({
                    nombre: obj.nombre,
                    timestamp: Date.now(),
                    descripcion: obj.descripcion,
                    codigo: obj.codigo,
                    thumbnail: obj.thumbnail,
                    precio: obj.precio,
                    stock: obj.stock
            })
            return {status: "success", message: "El producto se añadió con éxito"}            
        } catch(err){
                return {status: "error", message: `No se pudo añadir el producto: ${err}`}
            }
    }

    saveCart = async(obj)  => {
        try{
            const doc = this.currentCollection.doc();
            await doc.set({
                    timestamp: Date.now(),
                    productos: obj.productos || []
            })        
            return {status:"success", message:"El carrito ha sido añadido exitosamente"}            
        } catch(err){
            return {status: "error", message: `No se pudo añadir el carrito: ${err}`}
        }
    }


    getAll = async() => {
        try {
        const data = await this.currentCollection.get();
        const dataDoc = data.docs;
        const dataMapped = dataDoc.map(documents => documents.data());
        return {status:"success", payload: dataMapped}
        } catch(err) {
            return {status: "error", message:  "No se pudo obtener la informacion"+err};
        }
    }

    getById = async(id) => {
        try {
            const doc = this.currentCollection.doc(id);
            const document = await doc.get();
            return {status:"success", payload: document.data()}
        } catch(err) {
            return {status: "error", error:  `No se pudo obtener la informacion: ${err}`};
        }
    }

    getCartById = async(id) => {
        try {
            const doc = this.currentCollection.doc(id);
            const document = await doc.get();
            return {status:"success", payload: document.data().productos}
        } catch(err) {
            return {status: "error", error:  `No se pudo obtener la informacion: ${err}`};
        }
    }

    updateElement = async(id,body) => {
        try{
            const doc = this.currentCollection.doc(id);
            const document = await doc.update(body);
            console.log(document);
            return {status:"success", message: "El objeto se ha actualizado exitosamente"}
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el elemento: "+error}
        }
    }

    deleteAll = async() => {
        try {
            const doc = await this.currentCollection.get().then(res => {
                res.forEach(element => {
                  element.ref.delete();
                });
              });
            return {status:"success", message: "Todos los objetos fueron borrados exitosamente"}
        } catch(err) {
            return {status: "error", message: 'No se pudo borrar los objetos'};
        }
    }

    deleteById = async(id) => {
        try {
            const doc = await this.currentCollection.doc(id);
            const document = await doc.delete();
            console.log(document.data())
            return {status: "success", message:"El objeto fue borrado exitosamente"};
     
        } catch(err) {
            return {status: "error", error: 'No hay objetos en el archivo'};
        }
    }

    addProductToCart = async(cId,pId) => {
        try{
            const doc = this.currentCollection.doc(cId);
            const document = await doc.update({
                productos: admin.firestore.FieldValue.arrayUnion(pId)
            });
            return {status:"success", message:"El producto ha sido añadido exitosamente al carrito"}
        }catch(err){
            return {status:"error", error: `No se pudo añadir el producto al carrito: ${err}`}
        }
    }

    deleteProductFromCart = async(cId,pId) => {
        try{
            const doc = this.currentCollection.doc(cId);
            const document = await doc.update({
                productos: admin.firestore.FieldValue.arrayRemove(pId)
            });
            return {status:"success", message:"El producto ha sido borrado exitosamente"}
    }catch(err) {
        return {status: "error", message: `No se pudo borrar el producto del carrito ${err}`};
    }
    }
}