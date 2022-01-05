let carritos;
let productos;

let persistence = 'fileSystem';

switch(persistence){
    case "fileSystem":
        const {default:ProductoFileSystem} = await import('./productos/productoFileSystem.js')
        const {default:CarritoFileSystem} = await import('./carritos/carritoFileSystem.js')
        carritos = new CarritoFileSystem();
        productos = new ProductoFileSystem();
        break;
    case "mongo":
        const {default:ProductoMongo} = await import ('./productos/productoMongo.js');
        const {default:CarritoMongo} = await import ('./carritos/carritoMongo.js');
        carritos = new CarritoMongo();
        productos = new ProductoMongo();
        break;
    case "firebase":
        const {default:ProductoFB} = await import ('./productos/productoFB.js');
        const {default:CarritoFB} = await import ('./carritos/carritoFB.js');
        carritos = new CarritoFB();
        productos = new ProductoFB();
        break;
    default:

}

export {carritos,productos}