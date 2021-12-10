import express from 'express';
import cors from 'cors';
import Contenedor from '../classes/Contenedor.js';
import upload from '../services/uploader.js';
const router = express.Router();
const productos = new Contenedor();
import { authMiddleware } from '../utils.js';


const admin = true;
router.use(express.json()); 
router.use(express.urlencoded({extended: true}));
router.use(cors());
router.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})


//GETS
router.get('/', authMiddleware, (req,res) => {+
    productos.getAllProducts().then(result => {
        res.send(result.payload);
    })
})

router.get('/:id', authMiddleware, (req, res) => {
    let pId = req.params.id; 
    pId = parseInt(pId);
    productos.getProductById(pId).then(result => {
        res.send(result);
    })
})

//POSTS
router.post('/',upload.single('thumbnail'), authMiddleware,(req,res)=>{
    let file = req.file;
    let cuerpo = req.body;
    cuerpo.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename; // protocol es https, luego ://, req.hostname es localhost, :8080 es el puerto que estamos usando
    productos.saveProduct(cuerpo).then(result => {
        res.send(result);
    })
})

//PUTS
router.put('/:id', authMiddleware,(req,res) => {
    let pId = parseInt(req.params.id);
    let body = req.body;
    productos.updateProduct(pId,body).then(result => {
        res.send(result);
    })
})

// DELETES
router.delete('/:id', authMiddleware,(req,res) => {
    let pId = parseInt(req.params.id);
    productos.deleteProductById(pId).then(result => {
        res.send(result);
    })
})

export default router;