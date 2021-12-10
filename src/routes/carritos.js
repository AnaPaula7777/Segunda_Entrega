import express from 'express';
import Contenedor from '../classes/Contenedor.js';
const router = express.Router();
const contenedor  = new Contenedor();


router.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Petición hecha a las: '+time.toTimeString().split(" ")[0])
    next()
})
//GETS
router.get('/:id/productos',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.getCartById(id).then(result=>{
        res.send(result.payload);
    })
})
//POSTS
// Crea un carrito y devuelve su id.
router.post('/',(req,res)=>{
    let carrito = req.body;
    contenedor.saveCart(carrito).then(result=>{
        res.send(result);
    })
})

// Para incorporar productos al carrito por su id de producto
router.post('/:id/productos',(req,res)=>{
    let id = req.params.id;
    let productos = req.body;
    let pid = productos.id;
    contenedor.addProductToCart(id,pid).then(result=>{
        res.send(result);
    })
})

//DELETES

//Vacia un carrito y lo elimina
router.delete('/:id',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteCartById(id).then(result=>{
        res.send(result);
    })
})

//Elimina un producto del carrito dada la id del carrito y del producto
router.delete('/:id/productos/:id_prod',(req,res)=>{
    let id= parseInt(req.params.id);
    let id_prod= parseInt(req.params.id_prod);
    contenedor.deleteProductFromCart(id,id_prod).then(result=>{
        res.send(result);
    })
})


export default router;