import FileContainer from "../../contenedores/FileContainer.js";
import config from '../../config.js';
import fs from 'fs';

export default class CarritoFileSystem extends FileContainer{
    constructor(){
        super('carritos.txt');
    }

    saveCart = async(obj) => {
        try{
            let data = await fs.promises.readFile(`${config.fileSystem.baseUrl}carritos.txt`, 'utf-8');
            let dataObj = JSON.parse(data);


            let objNew = {
                timestamp: Date.now(),
                productos: obj.productos ? obj.productos : [],
                id: dataObj.length + 1
            };
            dataObj.push(objNew);
            try{
                await fs.promises.writeFile(`${config.fileSystem.baseUrl}carritos.txt`, JSON.stringify(dataObj, null, 2));
                return {status: "success", message: "El carrito se añadió con éxito", id: objNew.id}
            } catch(err) {
                return {status: "error", message: "No se pudo añadir el carrito: ", err};
            }
            
            
        } catch(err){
            let objNew = {
                timestamp: Date.now(),
                productos: obj.productos,
                id: 1
            };
            try {
                await fs.promises.writeFile(`${config.fileSystem.baseUrl}carritos.txt`, JSON.stringify([objNew], null, 2));
                return {status:"success", message: "El carrito se añadió con éxito", id: objNew.id};
            } catch(err) {
                return {status: "error", message: "No se pudo añadir el carrito a carpeta inexistente: ", err}
            }
        }
    }

    addProductToCart = async(cid,pid) => {
        try{
            let productData = await fs.promises.readFile(`${config.fileSystem.baseUrl}productos.txt`,'utf-8');
            let carritoData = await fs.promises.readFile(`${config.fileSystem.baseUrl}carritos.txt`,'utf-8');
            let productos = JSON.parse(productData);
            let carritos = JSON.parse(carritoData);
            let producto = productos.find(v=>v.id===pid);
            let carrito = carritos.find(v=>v.id==cid);
            if(!producto) return {status:"error", message:"No se encontró el producto"};
            if(!carrito) return {status:"error",message:"Carrito no encontrado"};
            let isInCart = carrito.productos.find(p=>p.id===producto.id);
            if(!isInCart){
                carrito.productos.push(producto);
            } else{
                return {status:"error",message:"El producto ya existe en el carrito y no puede agregarse nuevamente"};
            }
        
            let carritoAux = carritos.map(carr=>{
                if(carr.id===carrito.id){
                    return carrito;
                }else{
                    return carr
                }
            })
            await fs.promises.writeFile(`${config.fileSystem.baseUrl}carritos.txt`,JSON.stringify(carritoAux,null,2));
            return {status:"success",message:"El producto ha sido añadido exitosamente al carrito"}
        }catch(error){
            return {status:"error", message:"No se pudo añadir el producto al carrito: "+error}
        }
    }

    async deleteProductFromCart(cid,pid){
        try{            
            let carritoData = await fs.promises.readFile(`${config.fileSystem.baseUrl}carritos.txt`,'utf-8');
            let carritos = JSON.parse(carritoData);
            let carrito = carritos.find(v=>v.id===cid);
            if(carrito){
            let elemento = carrito.productos.find(e=>e.id===pid);
            if(elemento){
                try{
                    const isElementId = el => el.id===pid;
                    const indexElement = carrito.productos.findIndex(isElementId);
                    carrito.productos.splice(indexElement,1);
                    carritos[carrito.id] = carrito;
                    await fs.promises.writeFile(`${config.fileSystem.baseUrl}carritos.txt`, JSON.stringify(carritos, null, 2));
                    return {status: "success", message:"El producto fue borrado exitosamente del carrito"};
                } catch(err) {
                    return {status: "error", message: "No se pudo borrar el producto del carrito " + err}
                }
            }else{
                return {status:"error", message:"No se encontró el producto"};
            }
        } else {
            return {status:"error",message:"Carrito no encontrado"};
        }
    }catch(err) {
        return {status: "error", message: 'No se pudo borrar el producto del carrito '+err};
    }
    }
}