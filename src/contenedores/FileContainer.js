import fs from 'fs';
import config from '../config.js';

export default class FileContainer{
    constructor(file_endpoint){
        this.url = `${config.fileSystem.baseUrl}${file_endpoint}`
    }


    getAll = async() => {
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let objects = JSON.parse(data);
            return {status:"success", payload: objects}
        } catch(err) {
            return {status: "error", message:  "No se pudo obtener la informacion"+err};
        }
    }

    getById = async(id) => {
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                return {status:"success", payload: elemento}
            }else{
                return {status:"error", event:null, message:"Objeto no encontrado"}
            }
        } catch(err) {
            return {status: "error", error:  `No se pudo obtener la informacion: ${err}`};
        }
    }

    updateElement = async(id,body) => {
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let dataObj = JSON.parse(data);
            if(!dataObj.some(pt=>pt.id===id)) return {status:"error", message:"No hay elementos con el id especificado"}
            let result = dataObj.map(el=>{
                if(el.id===id){
                    body = Object.assign({...el,...body});
                    return body;
                }else{
                    return el;
                }
            })
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(result,null,2));
                return {status:"success", message:"Elemento actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el elemento"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el elemento: "+error}
        }
    }

    deleteAll = async() => {
        try {
            const emptyVar = '';
            await fs.promises.writeFile(this.url, emptyVar);
            return {status: "success", message: "Todos los objetos fueron borrados exitosamente"};
        } catch(err) {
            return {status: "error", message: 'No se pudo borrar los objetos'};
        }
    }

    deleteById = async(id) => {
        try {
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let dataObj = JSON.parse(data);
            let elemento = dataObj.find(e=>e.id===id);
            if(elemento){
                try{
                    const isElementId = el => el.id===id;
                    const indexElement = dataObj.findIndex(isElementId);
                    dataObj.splice(indexElement,1);
                    await fs.promises.writeFile(this.url, JSON.stringify(dataObj, null, 2));
                    return {status: "success", message:"El objeto fue borrado exitosamente"};
                } catch(err) {
                    return {status: "error", error: "No se pudo borrar el objeto" + err}
                }
            }else{
                return {status:"error", event:null, error:"Objeto no encontrado"}
            }
        } catch(err) {
            return {status: "error", error: 'No hay objetos en el archivo'};
        }
    }


}