import fs from 'fs';
import __dirname from '../utils.js';

const productoURL = __dirname+'/files/productos.txt';
const carritoURL = __dirname+'/files/carritos.txt';

class Contenedor{

    async saveProduct(obj) {
        try{
            let data = await fs.promises.readFile(productoURL, 'utf-8');
            let dataObj = JSON.parse(data);

            if(dataObj.some(data=>data.nombre===obj.nombre)){//Si existe un objeto con el mismo nombre
                return {status:"error",message:"El producto ya existe"}
            }else{
                let objNew = {
                    nombre: obj.nombre,
                    timestamp: Date.now(),
                    descripcion: obj.descripcion,
                    codigo: obj.codigo,
                    thumbnail: obj.thumbnail,
                    precio: obj.precio,
                    stock: obj.stock,
                    id: dataObj.length + 1
                };
                dataObj.push(objNew);
                try{
                    await fs.promises.writeFile(productoURL, JSON.stringify(dataObj, null, 2));
                    return {status: "success", message: "El producto se añadió con éxito", id: objNew.id}
                } catch(err) {
                    return {status: "error", message: "No se pudo añadir el producto: ", err};
                }
            }
            
        } catch(err){
            let objNew = {
                nombre: obj.nombre,
                timestamp: Date.now(),
                descripcion: obj.descripcion,
                codigo: obj.codigo,
                thumbnail: obj.thumbnail,
                precio: obj.precio,
                stock: obj.stock,
                id: 1
            };
            try {
                await fs.promises.writeFile(productoURL, JSON.stringify([objNew], null, 2));
                return {status:"success", message: "El producto se añadió con éxito", id: objNew.id};
            } catch(err) {
                return {status: "error", message: "No se pudo añadir el producto a carpeta inexistente: ", err}
            }
    }
    }

    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(productoURL,'utf-8');
            let dataObj = JSON.parse(data);
            if(!dataObj.some(pt=>pt.id===id)) return {status:"error", message:"No hay productos con el id especificado"}
            let result = dataObj.map(product=>{
                if(product.id===id){
                    body = Object.assign({...product,...body});
                    return body;
                }else{
                    return product;
                }
            })
            try{
                await fs.promises.writeFile(productoURL,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el producto: "+error}
        }
    }

    async getProductById(id) {
        try {
            let data = await fs.promises.readFile(productoURL, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                return {status:"success", payload: elemento}
            }else{
                return {status:"error", event:null, message:"Producto no encontrado"}
            }
        } catch(err) {
            return {status: "error", message: 'Producto no encontrado'};
        }
    }

    async getAllProducts() {
        try {
            let data = await fs.promises.readFile(productoURL, 'utf-8');
            let productos = JSON.parse(data);
            return {status:"success", payload: productos}
        } catch(err) {
            return {status: "error", message: 'La carpeta esta vacia'};
        }
    }

    async deleteProductById(id) {
        try {
            let data = await fs.promises.readFile(productoURL, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                try{
                    const isElementId = el => el.id===id;
                    const indexElement = dataObj.findIndex(isElementId);
                    dataObj.splice(indexElement,1);
                    await fs.promises.writeFile(productoURL, JSON.stringify(dataObj, null, 2));
                    return {status: "success", message:"El producto fue borrado exitosamente"};
                } catch(err) {
                    return {status: "error", message: "No se pudo borrar el producto" + err}
                }
            }else{
                return {status:"error", event:null, message:"Producto no encontrado"}
            }
        } catch(err) {
            return {status: "error", message: 'No hay productos en el archivo'};
        }
    }

    async deleteAllProducts() {
        try {
            const emptyVar = '';
            await fs.promises.writeFile(productoURL, emptyVar);
            return {status: "success", message: "Todos los productos fueron borrados exitosamente"};
        } catch(err) {
            return {status: "error", message: 'No se pudo borrar los productos'};
        }
    }

    async saveCart(obj) {
        try{
            let data = await fs.promises.readFile(carritoURL, 'utf-8');
            let dataObj = JSON.parse(data);


            let objNew = {
                timestamp: Date.now(),
                productos: obj.productos ? obj.productos : [],
                id: dataObj.length + 1
            };
            dataObj.push(objNew);
            try{
                await fs.promises.writeFile(carritoURL, JSON.stringify(dataObj, null, 2));
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
                await fs.promises.writeFile(carritoURL, JSON.stringify([objNew], null, 2));
                return {status:"success", message: "El carrito se añadió con éxito", id: objNew.id};
            } catch(err) {
                return {status: "error", message: "No se pudo añadir el carrito a carpeta inexistente: ", err}
            }
        }
    }

    async deleteCartById(id) {
        try {
            let data = await fs.promises.readFile(carritoURL, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                try{
                    const isElementId = el => el.id===id;
                    const indexElement = dataObj.findIndex(isElementId);
                    dataObj.splice(indexElement,1);
                    await fs.promises.writeFile(carritoURL, JSON.stringify(dataObj, null, 2));
                    return {status: "success", message:"El carrito fue borrado exitosamente"};
                } catch(err) {
                    return {status: "error", message: "No se pudo borrar el carrito" + err}
                }
            }else{
                return {status:"error", event:null, message:"Carrito no encontrado"}
            }
        } catch(err) {
            return {status: "error", message: 'No hay carritos en el archivo'};
        }
    }

    async getCartById(id) {
        try {
            let data = await fs.promises.readFile(carritoURL, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                if(elemento.productos){
                    return {status:"success", payload: elemento.productos}
                }
                return {status:"error", event:null, message:"El carrito esta vacio"}
            }
            return {status:"error", event:null, message:"Carrito no encontrado"}
            
        } catch(err) {
            return {status: "error", message: 'Carrito no encontrado'};
        }
    }

    async addProductToCart(cid,pid){
        try{
            let productData = await fs.promises.readFile(productoURL,'utf-8');
            let carritoData = await fs.promises.readFile(carritoURL,'utf-8');
            let productos = JSON.parse(productData);
            let carritos = JSON.parse(carritoData);
            let producto = productos.find(v=>v.id===pid);
            let carrito = carritos.find(v=>v.id==cid);
            if(!producto) return {status:"error", message:"No se encontró el producto"};
            if(!carrito) return {status:"error",message:"Carrito no encontrado"};
            let isInCarr = carrito.productos.find(p=>p.id===producto.id);
            if(!isInCarr){
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
            await fs.promises.writeFile(carritoURL,JSON.stringify(carritoAux,null,2));
            return {status:"success",message:"El producto ha sido añadido exitosamente al carrito"}
        }catch(error){
            return {status:"error", message:"No se pudo añadir el producto al carrito: "+error}
        }
    }

    async deleteProductFromCart(cid,pid){
        try{
            let carritoData = await fs.promises.readFile(carritoURL,'utf-8');
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
                    await fs.promises.writeFile(carritoURL, JSON.stringify(carritos, null, 2));
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

export default Contenedor;