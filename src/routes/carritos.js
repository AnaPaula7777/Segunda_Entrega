import express from 'express';
const router = express.Router();
import {carritos} from '../daos/index.js'


router.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Petición hecha a las: '+time.toTimeString().split(" ")[0])
    next()
})


//GETS
router.get('/:id/productos',(req,res)=>{
    let id = req.params.id;
    let isNumber = typeof id === "number" ? true:false;
    if(isNumber) {
        id = parseInt(id)
    }
    carritos.getCartById(id).then(result=>{
        res.send(result.payload);
    })
})

//POSTS
// Crea un carrito y devuelve su id.
router.post('/',(req,res)=>{
    let carrito = req.body;
    carritos.saveCart(carrito).then(result=>{
        res.send(result);
    })
})

// Para incorporar productos al carrito por su id de producto
router.post('/:id/productos',(req,res)=>{
    let id = req.params.id;
    let productos = req.body;
    let pid = productos.id;
    carritos.addProductToCart(id,pid).then(result=>{
        res.send(result);
    })
})

//DELETES

//Vacia un carrito y lo elimina
router.delete('/:id',(req,res)=>{
    let id = req.params.id;
    let isNumber = typeof id === "number" ? true:false;
    if(isNumber) {
        id = parseInt(id)
    }
    carritos.deleteById(id).then(result=>{
        res.send(result);
    })
})

//Elimina un producto del carrito dada la id del carrito y del producto
router.delete('/:id/productos/:id_prod',(req,res)=>{
    let id=req.params.id;
    let id_prod=req.params.id_prod;

    let idIsNumber = typeof id === "number" ? true:false;
    if(idIsNumber){
        id=parseInt(id);
    }
    let idProdIsNumber = typeof id === "number" ? true:false;
    if(idProdIsNumber){
        id_prod=parseInt(id_prod)
    }

    carritos.deleteProductFromCart(id,id_prod).then(result=>{
        res.send(result);
    })
})


export default router;