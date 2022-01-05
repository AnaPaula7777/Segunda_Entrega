import FileContainer from "../../contenedores/FileContainer.js";
import __dirname from "../../utils.js";
import fs from 'fs';

export default class ProductoFileSystem extends FileContainer{
    constructor(){
        super('productos.txt');
    }

    saveProduct = async(obj)  => {
        try{
            let data = await fs.promises.readFile(__dirname+'/files/productos.txt', 'utf-8');
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
                    await fs.promises.writeFile(__dirname+'/files/productos.txt', JSON.stringify(dataObj, null, 2));
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
                await fs.promises.writeFile(__dirname+'/files/productos.txt', JSON.stringify([objNew], null, 2));
                return {status:"success", message: "El producto se añadió con éxito", id: objNew.id};
            } catch(err) {
                return {status: "error", message: `No se pudo añadir el producto a carpeta inexistente: ${err}`}
            }
    }
    }
}